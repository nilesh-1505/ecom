import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

    return (
        <header className="navbar-header glass">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-accent">Apex</span>Market
                </Link>

                <form onSubmit={handleSearchSubmit} className="navbar-search">
                    <input
                        type="text"
                        placeholder="Search products, brands, and categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </form>

                <nav className="navbar-links">
                    <Link to="/shop" className="nav-link">Shop</Link>
                    {user && <Link to="/orders" className="nav-link">My Orders</Link>}
                    {isAdmin && <Link to="/admin" className="nav-link admin-pill">Admin Panel</Link>}
                </nav>

                <div className="navbar-actions">
                    <Link to="/cart" className="cart-badge-container">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        {getCartCount() > 0 && <span className="cart-badge-count">{getCartCount()}</span>}
                    </Link>

                    {user ? (
                        <div className="user-profile-menu">
                            <span className="user-email-display">{user.email.split('@')[0]}</span>
                            <button onClick={logout} className="btn btn-outline logout-btn">Logout</button>
                        </div>
                    ) : (
                        <Link to="/auth" className="btn btn-primary login-btn">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
