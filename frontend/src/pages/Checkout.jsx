import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
    const { token } = useContext(AuthContext);
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    // New Address Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('USA');

    // Mock Credit Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 99.00;
    const orderTotal = subtotal + shipping;

    // Load Addresses
    const fetchAddresses = async () => {
        if (!token) return;
        setLoadingAddresses(true);
        try {
            const response = await fetch('/api/addresses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddressId(data[0].id.toString());
                }
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
        } finally {
            setLoadingAddresses(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
        fetchAddresses();
    }, [token, cartItems.length, navigate]);

    // Handle New Address Submit
    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!street || !city || !state || !zipCode || !country) {
            alert('Please fill out all address fields.');
            return;
        }

        try {
            const response = await fetch('/api/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ street, city, state, zipCode, country })
            });

            if (response.ok) {
                const newAddr = await response.json();
                setAddresses([...addresses, newAddr]);
                setSelectedAddressId(newAddr.id.toString());
                // Clear Form
                setStreet('');
                setCity('');
                setState('');
                setZipCode('');
                setShowAddForm(false);
            } else {
                alert('Failed to add address');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Handle Order Submission (Checkout)
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!selectedAddressId) {
            alert('Please select or add a shipping address.');
            return;
        }
        if (!cardNumber || !cardName || !expiry || !cvv) {
            alert('Please fill out all mock payment card details.');
            return;
        }

        setPlacingOrder(true);
        try {
            const response = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ addressId: Number(selectedAddressId) })
            });

            if (response.ok) {
                const orderData = await response.json();
                alert(`Order placed successfully! Order ID: #${orderData.id}`);
                // Clear cart state (handled by context sync, but let's navigate to order history)
                navigate('/orders');
            } else {
                const text = await response.text();
                alert(`Checkout failed: ${text}`);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('System failure during checkout');
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="checkout-page animate-fade-in">
            <h1 className="page-title">Secure Checkout</h1>
            
            <div className="checkout-layout">
                {/* Checkout Steps */}
                <div className="checkout-steps-panel">
                    
                    {/* Shipping Address Selection */}
                    <div className="checkout-step-section glass">
                        <h2>1. Shipping Address</h2>
                        
                        {loadingAddresses ? (
                            <p>Loading your addresses...</p>
                        ) : (
                            <div className="address-selectors-list">
                                {addresses.map((addr) => (
                                    <label key={addr.id} className={`address-selector-card glass ${selectedAddressId === addr.id.toString() ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="shippingAddress"
                                            value={addr.id}
                                            checked={selectedAddressId === addr.id.toString()}
                                            onChange={(e) => setSelectedAddressId(e.target.value)}
                                        />
                                        <div className="address-details-text">
                                            <p className="street-line">{addr.street}</p>
                                            <p className="city-state-line">{addr.city}, {addr.state} {addr.zipCode}</p>
                                            <p className="country-line">{addr.country}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="address-form-toggle-block">
                            <button 
                                onClick={() => setShowAddForm(!showAddForm)} 
                                className="btn btn-outline"
                            >
                                {showAddForm ? 'Cancel New Address' : '+ Add New Address'}
                            </button>
                        </div>

                        {showAddForm && (
                            <form onSubmit={handleAddAddress} className="new-address-form glass animate-fade-in">
                                <h3>Add a Shipping Address</h3>
                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input 
                                        type="text" 
                                        value={street} 
                                        onChange={(e) => setStreet(e.target.value)}
                                        className="form-input" 
                                        placeholder="e.g. 123 Main St, Apt 4B" 
                                        required 
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-half">
                                        <label className="form-label">City</label>
                                        <input 
                                            type="text" 
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)}
                                            className="form-input" 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group col-quarter">
                                        <label className="form-label">State</label>
                                        <input 
                                            type="text" 
                                            value={state} 
                                            onChange={(e) => setState(e.target.value)}
                                            className="form-input" 
                                            placeholder="e.g. NY" 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group col-quarter">
                                        <label className="form-label">Zip Code</label>
                                        <input 
                                            type="text" 
                                            value={zipCode} 
                                            onChange={(e) => setZipCode(e.target.value)}
                                            className="form-input" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-secondary">Save Address</button>
                            </form>
                        )}
                    </div>

                    {/* Mock Payment Details */}
                    <div className="checkout-step-section glass">
                        <h2>2. Payment Method</h2>
                        
                        <div className="payment-gateway-wrapper">
                            {/* Premium Interactive Mock Credit Card */}
                            <div className="mock-card-visual glass">
                                <div className="card-chip"></div>
                                <div className="card-number-display">
                                    {cardNumber || '•••• •••• •••• ••••'}
                                </div>
                                <div className="card-details-flex">
                                    <div className="card-holder-display">
                                        <span className="card-label">CARDHOLDER</span>
                                        <span>{cardName.toUpperCase() || 'YOUR NAME'}</span>
                                    </div>
                                    <div className="card-expiry-display">
                                        <span className="card-label">EXPIRES</span>
                                        <span>{expiry || 'MM/YY'}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="payment-details-form">
                                <div className="form-group">
                                    <label className="form-label">Cardholder Name</label>
                                    <input 
                                        type="text" 
                                        value={cardName} 
                                        onChange={(e) => setCardName(e.target.value)}
                                        className="form-input" 
                                        placeholder="Full name as printed on card" 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Card Number</label>
                                    <input 
                                        type="text" 
                                        value={cardNumber} 
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="form-input" 
                                        placeholder="16-digit card number"
                                        maxLength="19" 
                                        required 
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-half">
                                        <label className="form-label">Expiration Date</label>
                                        <input 
                                            type="text" 
                                            value={expiry} 
                                            onChange={(e) => setExpiry(e.target.value)}
                                            className="form-input" 
                                            placeholder="MM/YY"
                                            maxLength="5" 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group col-half">
                                        <label className="form-label">CVV</label>
                                        <input 
                                            type="password" 
                                            value={cvv} 
                                            onChange={(e) => setCvv(e.target.value)}
                                            className="form-input" 
                                            placeholder="3 digits"
                                            maxLength="3" 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-full checkout-place-order-btn"
                                    disabled={placingOrder}
                                >
                                    {placingOrder ? 'Processing Payment...' : `Pay & Place Order (₹${orderTotal.toFixed(2)})`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary Review */}
                <div className="checkout-summary-panel glass">
                    <h2>Review Items</h2>
                    
                    <div className="checkout-items-summary-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="checkout-summary-item">
                                <span className="item-qty-badge">{item.quantity}x</span>
                                <span className="item-name">{item.product.name}</span>
                                <span className="item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row">
                        <span>Items Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row total-row">
                        <span>Order Total</span>
                        <span>₹{orderTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
