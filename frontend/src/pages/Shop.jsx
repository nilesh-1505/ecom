import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const searchParam = queryParams.get('search') || '';
    const categoryParam = queryParams.get('category') || '';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters & Sorting state
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low-high', 'price-high-low'
    const [priceRange, setPriceRange] = useState(150000); // Max price limit
    const [searchQuery, setSearchQuery] = useState(searchParam);

    // Sync state when URL params change
    useEffect(() => {
        setSelectedCategory(categoryParam);
        setSearchQuery(searchParam);
    }, [categoryParam, searchParam]);

    // Fetch Products and Categories
    useEffect(() => {
        const loadProductsAndCategories = async () => {
            setLoading(true);
            try {
                // Build API URL based on active category/search filter
                let url = '/api/products';
                const params = [];
                if (selectedCategory) {
                    params.push(`category=${selectedCategory}`);
                }
                if (searchQuery) {
                    params.push(`search=${encodeURIComponent(searchQuery)}`);
                }
                if (params.length > 0) {
                    url += '?' + params.join('&');
                }

                const [prodRes, catRes] = await Promise.all([
                    fetch(url),
                    fetch('/api/categories')
                ]);

                if (prodRes.ok) {
                    const data = await prodRes.json();
                    setProducts(data);
                }
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }
            } catch (err) {
                console.error("Error loading products:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProductsAndCategories();
    }, [selectedCategory, searchQuery]);

    // Apply front-end filtering (price limit) and sorting
    const filteredProducts = products
        .filter(prod => prod.price <= priceRange)
        .sort((a, b) => {
            if (sortBy === 'price-low-high') {
                return a.price - b.price;
            } else if (sortBy === 'price-high-low') {
                return b.price - a.price;
            }
            return 0; // Featured (Default order from backend)
        });

    return (
        <div className="shop-page animate-fade-in">
            <div className="shop-layout">
                {/* Sidebar Filters */}
                <aside className="shop-sidebar glass">
                    <h3>Filters</h3>
                    
                    {/* Category Filter */}
                    <div className="filter-group">
                        <h4>Category</h4>
                        <div className="filter-options">
                            <label className="filter-label-checkbox">
                                <input 
                                    type="radio" 
                                    name="categoryFilter" 
                                    value="" 
                                    checked={selectedCategory === ''} 
                                    onChange={() => setSelectedCategory('')}
                                />
                                <span>All Categories</span>
                            </label>
                            {categories.map(cat => (
                                <label key={cat.id} className="filter-label-checkbox">
                                    <input 
                                        type="radio" 
                                        name="categoryFilter" 
                                        value={cat.id} 
                                        checked={selectedCategory.toString() === cat.id.toString()} 
                                        onChange={() => setSelectedCategory(cat.id.toString())}
                                    />
                                    <span>{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="filter-group">
                        <h4>Max Price: <span className="price-limit-val">₹{priceRange.toLocaleString('en-IN')}</span></h4>
                        <input 
                            type="range" 
                            min="10" 
                            max="150000" 
                            step="100"
                            value={priceRange} 
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="price-slider"
                        />
                        <div className="slider-limits">
                            <span>₹10</span>
                            <span>₹1,50,000</span>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <button 
                        onClick={() => {
                            setSelectedCategory('');
                            setPriceRange(150000);
                            setSortBy('featured');
                            setSearchQuery('');
                        }} 
                        className="btn btn-outline w-full"
                    >
                        Reset All Filters
                    </button>
                </aside>

                {/* Main Product Panel */}
                <main className="shop-products-panel">
                    <div className="products-panel-header glass">
                        <div className="search-result-info">
                            {searchQuery ? (
                                <h3>Search Results for: <span>"{searchQuery}"</span></h3>
                            ) : (
                                <h3>All Products</h3>
                            )}
                            <p>{filteredProducts.length} items found</p>
                        </div>
                        
                        <div className="sorting-menu">
                            <label htmlFor="sortBy">Sort By:</label>
                            <select 
                                id="sortBy" 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner-container">
                            <div className="spinner"></div>
                            <p>Loading products catalog...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="empty-results-container glass">
                            <div className="empty-icon">🔍</div>
                            <h3>No products match your criteria.</h3>
                            <p>Try clearing filters or adjusting your price slider limits.</p>
                        </div>
                    ) : (
                        <div className="grid-products">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
