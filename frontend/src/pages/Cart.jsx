import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 99.00;
    const orderTotal = subtotal + shipping;

    const handleCheckout = () => {
        if (!token) {
            navigate('/auth');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page empty-cart-page animate-fade-in">
                <div className="empty-cart-container glass">
                    <div className="cart-empty-icon">🛒</div>
                    <h2>Your Shopping Cart is Empty</h2>
                    <p>Looks like you haven't added anything to your cart yet. Explore our premium catalog and find something you love!</p>
                    <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page animate-fade-in">
            <h1 className="page-title">Shopping Cart</h1>
            
            <div className="cart-layout">
                {/* Cart Items List */}
                <div className="cart-items-list-panel">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item-row glass">
                            <div className="item-img-wrapper">
                                <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-img" />
                            </div>
                            
                            <div className="item-details-wrapper">
                                <Link to={`/products/${item.product.id}`} className="item-name-link">
                                    <h3>{item.product.name}</h3>
                                </Link>
                                <p className="item-category-label">{item.product.category.name}</p>
                                <button 
                                    onClick={() => removeFromCart(item.id)} 
                                    className="remove-item-btn"
                                >
                                    Remove Item
                                </button>
                            </div>
                            
                            <div className="item-quantity-wrapper">
                                <label>Qty:</label>
                                <div className="qty-controls">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                        className="qty-btn"
                                        disabled={item.quantity <= 1}
                                    >-</button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                        className="qty-btn"
                                        disabled={item.quantity >= item.product.stock}
                                    >+</button>
                                </div>
                                <p className="stock-notice">{item.product.stock} units available</p>
                            </div>
                            
                            <div className="item-price-wrapper">
                                <span className="unit-price">₹{item.product.price.toFixed(2)} each</span>
                                <span className="total-item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Summary Panel */}
                <div className="cart-summary-panel glass">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-row">
                        <span>Items Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                        <span>Shipping & Delivery</span>
                        <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row total-row">
                        <span>Order Total</span>
                        <span>₹{orderTotal.toFixed(2)}</span>
                    </div>

                    {shipping > 0 && (
                        <p className="shipping-promo-tip">
                            💡 Add <span>₹{(500 - subtotal).toFixed(2)}</span> more to qualify for <strong>FREE shipping</strong>!
                        </p>
                    )}

                    <button 
                        onClick={handleCheckout} 
                        className="btn btn-primary btn-lg w-full checkout-btn"
                    >
                        Proceed to Checkout
                    </button>
                    
                    <Link to="/shop" className="continue-shopping-link">&larr; Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
