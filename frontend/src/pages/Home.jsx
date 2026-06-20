import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);
                
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData.slice(0, 4)); // Show first 4 products as featured
                }
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }
            } catch (error) {
                console.error("Error loading homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="home-page animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section glass">
                <div className="hero-content">
                    <span className="hero-tagline">Exclusive Deals & High Quality</span>
                    <h1>Unleash the Power of Premium Shopping</h1>
                    <p>Upgrade your lifestyle with our curated collection of elite smartphones, workspace laptops, clothing, and home decor.</p>
                    <div className="hero-ctas">
                        <Link to="/shop" className="btn btn-primary btn-lg">Explore Catalog</Link>
                        <a href="#featured" className="btn btn-outline btn-lg">Featured Products</a>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* Visual background element */}
                    <div className="hero-circle-1"></div>
                    <div className="hero-circle-2"></div>
                </div>
            </section>

            {/* Categories Showcase */}
            <section className="categories-section">
                <h2 className="section-title">Shop by Category</h2>
                <div className="categories-grid">
                    {categories.map((category) => (
                        <Link 
                            key={category.id} 
                            to={`/shop?category=${category.id}`} 
                            className="category-card glass"
                        >
                            <div className="category-icon-wrapper">
                                {/* Use simple text emoji/letters as category icons */}
                                {category.name === 'Smartphones' && '📱'}
                                {category.name === 'Laptops' && '💻'}
                                {category.name === 'Audio' && '🎧'}
                                {category.name === 'Clothing' && '👕'}
                                {category.name === 'Home Decor' && '🛋️'}
                            </div>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section id="featured" className="featured-section">
                <div className="section-header-flex">
                    <h2 className="section-title">Featured Products</h2>
                    <Link to="/shop" className="view-all-link">View All Products &rarr;</Link>
                </div>
                
                {loading ? (
                    <div className="loading-spinner-container">
                        <div className="spinner"></div>
                        <p>Loading featured products...</p>
                    </div>
                ) : (
                    <div className="grid-products">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Quality Seals */}
            <section className="features-banner-section glass">
                <div className="feature-seal">
                    <div className="seal-icon">🚀</div>
                    <h3>Express Delivery</h3>
                    <p>Free and fast delivery on all eligible orders over ₹500.</p>
                </div>
                <div className="feature-seal">
                    <div className="seal-icon">🔒</div>
                    <h3>Secure Checkout</h3>
                    <p>SSL certified encryption and advanced bank-grade security protocols.</p>
                </div>
                <div className="feature-seal">
                    <div className="seal-icon">🔄</div>
                    <h3>30-Day Returns</h3>
                    <p>Not satisfied? Return it within 30 days for a hassle-free refund.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
