import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-brand-section">
                    <Link to="/" className="footer-logo">
                        <span className="logo-accent">Apex</span>Market
                    </Link>
                    <p className="footer-tagline">
                        Your one-stop destination for premium products, designed to elevate your life. Fast shipping, secure payments.
                    </p>
                </div>
                
                <div className="footer-links-grid">
                    <div className="footer-links-col">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/shop?category=1">Smartphones</Link></li>
                            <li><Link to="/shop?category=2">Laptops</Link></li>
                            <li><Link to="/shop?category=3">Audio Gear</Link></li>
                            <li><Link to="/shop?category=4">Clothing</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-links-col">
                        <h4>Account</h4>
                        <ul>
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/auth">Login / Register</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4>Customer Care</h4>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#shipping">Shipping & Delivery</a></li>
                            <li><a href="#returns">Returns & Replacements</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} ApexMarket. All rights reserved. Created for demonstration purposes.</p>
            </div>
        </footer>
    );
};

export default Footer;
