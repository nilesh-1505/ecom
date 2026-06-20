import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("Error loading order history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, navigate]);

    const toggleExpandOrder = (id) => {
        if (expandedOrderId === id) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(id);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Retrieving order history...</p>
            </div>
        );
    }

    return (
        <div className="orders-page animate-fade-in">
            <h1 className="page-title">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="empty-orders-container glass">
                    <div className="empty-orders-icon">📦</div>
                    <h2>No Orders Found</h2>
                    <p>You haven't placed any orders yet. Once you complete checkout, your order receipt will appear here.</p>
                    <Link to="/shop" className="btn btn-primary btn-lg">Browse Store</Link>
                </div>
            ) : (
                <div className="orders-list-wrapper">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card-row glass">
                            {/* Card Header Info */}
                            <div className="order-row-summary-header">
                                <div className="header-meta-group">
                                    <span className="meta-label">ORDER ID</span>
                                    <span className="meta-val">#{order.id}</span>
                                </div>
                                <div className="header-meta-group">
                                    <span className="meta-label">DATE PLACED</span>
                                    <span className="meta-val">{new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="header-meta-group">
                                    <span className="meta-label">TOTAL AMOUNT</span>
                                    <span className="meta-val total-amt">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="header-meta-group">
                                    <span className="meta-label">STATUS</span>
                                    <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                                </div>
                                <button 
                                    onClick={() => toggleExpandOrder(order.id)} 
                                    className="btn btn-outline details-toggle-btn"
                                >
                                    {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>

                            {/* Collapsible Receipt Details */}
                            {expandedOrderId === order.id && (
                                <div className="order-row-expanded-details animate-fade-in">
                                    <div className="details-divider"></div>
                                    
                                    <div className="expanded-details-grid">
                                        {/* Products list */}
                                        <div className="details-receipt-list">
                                            <h4>Items Purchased</h4>
                                            {order.orderItems.map((item) => (
                                                <div key={item.id} className="receipt-item-row">
                                                    <img src={item.productImageUrl} alt={item.productName} className="receipt-item-img" />
                                                    <div className="receipt-item-info">
                                                        <h5>{item.productName}</h5>
                                                        <p>₹{item.price.toFixed(2)} x {item.quantity}</p>
                                                    </div>
                                                    <span className="receipt-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Address Details */}
                                        <div className="details-shipping-address">
                                            <h4>Shipping Address</h4>
                                            <div className="address-display-box glass">
                                                <p className="street-line">{order.shippingAddress.street}</p>
                                                <p className="city-state-line">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                                <p className="country-line">{order.shippingAddress.country}</p>
                                            </div>
                                            
                                            <div className="shipping-estimate-box glass">
                                                <h5>Estimated Delivery</h5>
                                                {order.status === 'DELIVERED' ? (
                                                    <p className="delivery-status-txt green">Delivered successfully.</p>
                                                ) : order.status === 'CANCELLED' ? (
                                                    <p className="delivery-status-txt red">Order Cancelled.</p>
                                                ) : (
                                                    <p className="delivery-status-txt">Arriving in 3-5 business days.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
