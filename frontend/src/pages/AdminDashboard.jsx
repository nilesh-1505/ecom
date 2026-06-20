import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'orders', 'products'
    const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalProducts: 0 });
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Product Form State
    const [newProductName, setNewProductName] = useState('');
    const [newProductDesc, setNewProductDesc] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductStock, setNewProductStock] = useState('');
    const [newProductImageUrl, setNewProductImageUrl] = useState('');
    const [newProductCatId, setNewProductCatId] = useState('');

    useEffect(() => {
        // Auth gate
        if (!token || !user) {
            navigate('/auth');
            return;
        }
        if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
            alert('Access Denied: Administrative rights required.');
            navigate('/');
            return;
        }

        const fetchAdminData = async () => {
            setLoading(true);
            try {
                const [statsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (ordersRes.ok) setOrders(await ordersRes.json());
                if (productsRes.ok) setProducts(await productsRes.json());
                if (categoriesRes.ok) {
                    const catData = await categoriesRes.json();
                    setCategories(catData);
                    if (catData.length > 0) {
                        setNewProductCatId(catData[0].id.toString());
                    }
                }
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [token, user, navigate]);

    // Handle Order Status Update
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
                
                // Refresh statistics
                const statsRes = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
                if (statsRes.ok) setStats(await statsRes.json());
                
                alert(`Order #${orderId} status updated to ${newStatus}`);
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Handle Add Product Submit
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProductName || !newProductDesc || !newProductPrice || !newProductStock || !newProductCatId) {
            alert('Please fill out all product details.');
            return;
        }

        const productPayload = {
            name: newProductName,
            description: newProductDesc,
            price: Number(newProductPrice),
            stock: Number(newProductStock),
            imageUrl: newProductImageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500',
            category: { id: Number(newProductCatId) }
        };

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });

            if (response.ok) {
                const createdProduct = await response.json();
                setProducts([...products, createdProduct]);
                
                // Clear Form
                setNewProductName('');
                setNewProductDesc('');
                setNewProductPrice('');
                setNewProductStock('');
                setNewProductImageUrl('');
                
                // Refresh stats
                const statsRes = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
                if (statsRes.ok) setStats(await statsRes.json());

                alert('Product created successfully');
            } else {
                alert('Failed to add product');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Handle Delete Product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product? This action is permanent.')) return;
        
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
                
                // Refresh stats
                const statsRes = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
                if (statsRes.ok) setStats(await statsRes.json());

                alert('Product deleted successfully');
            } else {
                alert('Failed to delete product');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Loading administration dashboard panels...</p>
            </div>
        );
    }

    return (
        <div className="admin-page animate-fade-in">
            <h1 className="page-title">Administrative Dashboard</h1>
            
            {/* Inner navigation tabs */}
            <div className="admin-tabs glass">
                <button onClick={() => setActiveTab('stats')} className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}>Stats Summary</button>
                <button onClick={() => setActiveTab('orders')} className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}>Manage Orders</button>
                <button onClick={() => setActiveTab('products')} className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}>Manage Catalog</button>
            </div>

            {/* STATS PANEL */}
            {activeTab === 'stats' && (
                <div className="admin-panel-stats animate-fade-in">
                    <div className="stats-kpi-grid">
                        <div className="kpi-card glass">
                            <span className="kpi-icon">💰</span>
                            <div className="kpi-values">
                                <span className="kpi-label">TOTAL SALES</span>
                                <span className="kpi-num">₹{stats.totalSales.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="kpi-card glass">
                            <span className="kpi-icon">📦</span>
                            <div className="kpi-values">
                                <span className="kpi-label">TOTAL ORDERS</span>
                                <span className="kpi-num">{stats.totalOrders}</span>
                            </div>
                        </div>
                        <div className="kpi-card glass">
                            <span className="kpi-icon">🧩</span>
                            <div className="kpi-values">
                                <span className="kpi-label">PRODUCTS IN CATALOG</span>
                                <span className="kpi-num">{stats.totalProducts}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ORDERS PANEL */}
            {activeTab === 'orders' && (
                <div className="admin-panel-orders glass animate-fade-in">
                    <h2>Customer Orders</h2>
                    {orders.length === 0 ? (
                        <p>No orders registered in system.</p>
                    ) : (
                        <div className="admin-table-responsive">
                            <table className="admin-data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Current Status</th>
                                        <th>Change Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td>{order.shippingAddress.street.split(',')[0]}...</td>
                                            <td>₹{order.totalAmount.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                                            </td>
                                            <td>
                                                <select 
                                                    value={order.status} 
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    className="admin-status-select"
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="CONFIRMED">CONFIRMED</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* PRODUCTS CATALOG PANEL */}
            {activeTab === 'products' && (
                <div className="admin-panel-products animate-fade-in">
                    <div className="admin-products-split-grid">
                        
                        {/* Add Product Form */}
                        <div className="admin-add-product-card glass">
                            <h2>Add New Product</h2>
                            <form onSubmit={handleAddProduct}>
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input 
                                        type="text" 
                                        value={newProductName} 
                                        onChange={(e) => setNewProductName(e.target.value)} 
                                        className="form-input" 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select 
                                        value={newProductCatId} 
                                        onChange={(e) => setNewProductCatId(e.target.value)} 
                                        className="form-input"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-half">
                                        <label className="form-label">Price (₹)</label>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            value={newProductPrice} 
                                            onChange={(e) => setNewProductPrice(e.target.value)} 
                                            className="form-input" 
                                            min="0"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group col-half">
                                        <label className="form-label">Stock Quantity</label>
                                        <input 
                                            type="number" 
                                            value={newProductStock} 
                                            onChange={(e) => setNewProductStock(e.target.value)} 
                                            className="form-input" 
                                            min="0"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input 
                                        type="url" 
                                        value={newProductImageUrl} 
                                        onChange={(e) => setNewProductImageUrl(e.target.value)} 
                                        className="form-input" 
                                        placeholder="Unsplash / external image link" 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        value={newProductDesc} 
                                        onChange={(e) => setNewProductDesc(e.target.value)} 
                                        className="form-input" 
                                        rows="4" 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-full">Publish Product</button>
                            </form>
                        </div>

                        {/* List of Products (for Delete / Manage) */}
                        <div className="admin-product-list-card glass">
                            <h2>Current Inventory</h2>
                            <div className="admin-products-scroller">
                                {products.map(prod => (
                                    <div key={prod.id} className="admin-product-row glass">
                                        <img src={prod.imageUrl} alt={prod.name} className="admin-prod-thumb" />
                                        <div className="admin-prod-meta">
                                            <h4>{prod.name}</h4>
                                            <p className="category">{prod.category.name}</p>
                                            <p className="price-stock">₹{prod.price.toFixed(2)} | Stock: {prod.stock}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteProduct(prod.id)} 
                                            className="btn btn-danger delete-btn"
                                            aria-label="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
