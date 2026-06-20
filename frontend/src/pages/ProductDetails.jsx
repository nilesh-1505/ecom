import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { token } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    throw new Error("Product not found");
                }
            } catch (err) {
                console.error("Error loading product details:", err);
                alert("Product not found or system error.");
                navigate('/shop');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, navigate]);

    const handleQuantityChange = (val) => {
        if (val < 1) return;
        if (product && val > product.stock) {
            alert(`Only ${product.stock} units available in stock.`);
            return;
        }
        setQuantity(val);
    };

    const handleAddToCart = async () => {
        if (!token) {
            navigate('/auth');
            return;
        }
        setAdding(true);
        const success = await addToCart(product.id, quantity);
        setAdding(false);
        if (success) {
            alert(`${quantity} unit(s) of "${product.name}" added to your cart successfully!`);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Retrieving product details...</p>
            </div>
        );
    }

    if (!product) return null;

    // Stable mock ratings
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
        <div className="product-details-page animate-fade-in">
            <Link to="/shop" className="back-link">&larr; Back to Shop</Link>
            
            <div className="product-details-container glass">
                <div className="details-image-section">
                    <img 
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600'} 
                        alt={product.name} 
                        className="details-img"
                    />
                </div>
                
                <div className="details-info-section">
                    <span className="details-category-pill">{product.category.name}</span>
                    <h1 className="details-title">{product.name}</h1>
                    
                    <div className="details-rating-bar">
                        <div className="stars-wrapper">{renderStars()}</div>
                        <span className="rating-score">{rating} stars</span>
                        <span className="rating-count">({ratingCount} verified buyer reviews)</span>
                    </div>

                    <div className="details-price">₹{product.price.toFixed(2)}</div>
                    
                    <div className="details-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="purchase-controls-block glass">
                        <div className="stock-status">
                            {product.stock > 0 ? (
                                <span className="stock-badge in-stock">In Stock ({product.stock} left)</span>
                            ) : (
                                <span className="stock-badge out-of-stock">Temporarily Out of Stock</span>
                            )}
                        </div>

                        {product.stock > 0 && (
                            <>
                                <div className="quantity-selector-group">
                                    <label>Quantity:</label>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleQuantityChange(quantity - 1)} className="qty-btn">-</button>
                                        <input 
                                            type="number" 
                                            value={quantity} 
                                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                            className="qty-input"
                                            min="1"
                                            max={product.stock}
                                        />
                                        <button onClick={() => handleQuantityChange(quantity + 1)} className="qty-btn">+</button>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAddToCart} 
                                    className="btn btn-primary btn-lg w-full add-cart-action-btn"
                                    disabled={adding}
                                >
                                    {adding ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
