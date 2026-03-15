import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import Api from '../services/Api';
import './Marketplace.css';

function Marketplace() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isImageSearching, setIsImageSearching] = useState(false);

    // Filters
    const [search, setSearch] = useState(searchParams.get('search') || '');

    // Update search state if URL changes externally (e.g. clicking search in navbar again)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        setSearch(urlSearch);
    }, [searchParams]);
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('newest');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');

    useEffect(() => {
        Api.get('categories/').then(res => setCategories(res.data)).catch(() => { });
    }, []);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page, sort, page_size: 12 });
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (minRating) params.append('min_rating', minRating);

        Api.get(`products/?${params.toString()}`)
            .then(res => {
                setProducts(res.data.products || []);
                setTotalPages(res.data.pages || 1);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [page, search, category, sort, minPrice, maxPrice, minRating]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const addToCart = async (productId) => {
        try {
            await Api.post('cart/add/', { product_id: productId, quantity: 1 });
            setToast({ type: 'success', msg: 'Added to cart!' });
        } catch (err) {
            setToast({ type: 'error', msg: err.response?.data?.detail || 'Failed' });
        }
        setTimeout(() => setToast(null), 2500);
    };

    const toggleWishlist = async (productId) => {
        try {
            await Api.post('wishlist/add/', { product_id: productId });
            setToast({ type: 'success', msg: 'Added to wishlist ❤️' });
        } catch {
            setToast({ type: 'info', msg: 'Already in wishlist' });
        }
        setTimeout(() => setToast(null), 2500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setImagePreview(null);
        setPage(1);
        fetchProducts();
    };

    const handleImageSearch = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setIsImageSearching(true);
        setSearch('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await Api.post('products/image-search/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProducts(res.data.products || []);
            setTotalPages(1);
            setPage(1);
        } catch (err) {
            setToast({ type: 'error', msg: 'Image search failed' });
            setImagePreview(null);
        } finally {
            setIsImageSearching(false);
        }
    };

    const clearImageSearch = () => {
        setImagePreview(null);
        fetchProducts();
    };

    return (
        <div className="cust-marketplace">
            

            {/* Filters */}
            <div className="cust-mp-filters cust-glass-card">
                <form className="cust-mp-search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="cust-mp-search"
                        placeholder="Search crafts, materials, artisans..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <label className="cust-mp-image-search-btn">
                        📷
                        <input type="file" accept="image/*" onChange={handleImageSearch} style={{ display: 'none' }} />
                    </label>
                    <button type="submit" className="cust-btn cust-btn-primary cust-btn-sm">Search</button>
                </form>

                {imagePreview && (
                    <div className="cust-mp-search-preview">
                        <img src={imagePreview} alt="Search" className="cust-mp-preview-img" />
                        <div className="cust-mp-search-text">
                            <p>{isImageSearching ? 'Analyzing image...' : 'Showing results similar to your image'}</p>
                        </div>
                        <button className="cust-mp-clear-search" onClick={clearImageSearch}>✕</button>
                    </div>
                )}
                <div className="cust-mp-filter-row">
                    <select className="cust-form-select cust-mp-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <select className="cust-form-select cust-mp-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                        <option value="newest">Newest</option>
                        <option value="price_low">Price: Low → High</option>
                        <option value="price_high">Price: High → Low</option>
                        <option value="rating">Best Rating</option>
                    </select>

                    <input type="number" className="cust-form-input cust-mp-price-input" placeholder="Min ₹" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                    <input type="number" className="cust-form-input cust-mp-price-input" placeholder="Max ₹" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />

                    <select className="cust-form-select cust-mp-select" value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1); }}>
                        <option value="">Any Rating</option>
                        <option value="4">4★ & up</option>
                        <option value="3">3★ & up</option>
                        <option value="2">2★ & up</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="cust-mp-grid">
                    {Array(12).fill(0).map((_, i) => <div key={i} className="cust-skeleton" style={{ height: 340, borderRadius: 20 }} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="cust-empty-state cust-glass-card">
                    <span className="cust-empty-icon">🔍</span>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            ) : (
                <div className="cust-mp-grid">
                    {products.map(product => (
                        <div key={product.id} className="cust-mp-card cust-glass-card" onClick={() => navigate(`/customer/product/${product.id}`)}>
                            <div className="cust-mp-card-img">
                                {product.primary_image_url
                                    ? <img src={product.primary_image_url} alt={product.name} />
                                    : <div className="cust-mp-card-placeholder">🎨</div>}
                                <button className="cust-mp-wishlist-btn" onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}>♡</button>
                            </div>
                            <div className="cust-mp-card-body">
                                <h4>{product.name}</h4>
                                <p className="cust-mp-card-seller">by {product.seller_name}</p>
                                <div className="cust-mp-card-meta">
                                    <span className="cust-mp-card-rating">⭐ {product.average_rating || '—'}</span>
                                    <span className="cust-mp-card-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                                </div>
                                <div className="cust-mp-card-bottom">
                                    <span className="cust-mp-card-price">₹{product.price}</span>
                                    <button
                                        className="cust-btn cust-btn-primary cust-btn-sm"
                                        disabled={product.stock === 0}
                                        onClick={e => { e.stopPropagation(); addToCart(product.id); }}
                                    >🛒 Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="cust-mp-pagination">
                    <button className="cust-btn cust-btn-secondary cust-btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span className="cust-mp-page-info">Page {page} of {totalPages}</span>
                    <button className="cust-btn cust-btn-secondary cust-btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 ${
                            toast.type === 'success' ? 'bg-[#1F1F1F] text-white' : 'bg-red-600 text-white'
                        }`}
                    >
                        {toast.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Marketplace;
