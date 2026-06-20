import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            navigate('/auth');
            return;
        }
        addToCart(product.id, 1);
    };

    // Stable mock ratings based on product id
    const rating = ((product.id * 3) % 2) + 3.5; 
    const ratingCount = (product.id * 17) % 150 + 20;

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i} className="star full">&#9733;</span>);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(<span key={i} className="star half">&#9733;</span>);
            } else {
                stars.push(<span key={i} className="star empty">&#9733;</span>);
            }
        }
        return stars;
    };

    return (
        <div className="product-card card">
            <Link to={`/products/${product.id}`} className="card-link">
                <div className="product-card-image-wrapper">
                    <img 
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'} 
                        alt={product.name} 
                        className="product-card-img" 
                        loading="lazy"
                    />
                    <span className="product-card-category-badge">{product.category.name}</span>
                </div>
                
                <div className="product-card-info">
                    <h3 className="product-card-title">{product.name}</h3>
                    
                    <div className="product-card-rating">
                        <div className="stars-wrapper">{renderStars()}</div>
                        <span className="rating-text">({ratingCount})</span>
                    </div>

                    <div className="product-card-footer">
                        <span className="product-card-price">₹{product.price.toFixed(2)}</span>
                        {product.stock > 0 ? (
                            <button 
                                onClick={handleAddToCart} 
                                className="btn btn-primary add-to-cart-quick-btn"
                                aria-label="Add to Cart"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                <span>Add</span>
                            </button>
                        ) : (
                            <span className="out-of-stock-label">Out of Stock</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
