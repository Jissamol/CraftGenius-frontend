import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import Api from '../services/Api';
import './ProductDetails.css';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [qty, setQty] = useState(1);
    const [toast, setToast] = useState(null);
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        setLoading(true);
        Api.get(`products/${id}/`)
            .then(res => {
                setProduct(res.data);
                // Fetch similar products
                if (res.data.category) {
                    Api.get(`products/?category=${res.data.category}&page_size=6`)
                        .then(r => setSimilar((r.data.products || []).filter(p => p.id !== res.data.id).slice(0, 4)))
                        .catch(() => { });
                }
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 2500); };

    const addToCart = async () => {
        try {
            await Api.post('cart/add/', { product_id: product.id, quantity: qty });
            showToast('success', 'Added to cart!');
        } catch (err) {
            showToast('error', err.response?.data?.detail || 'Failed');
        }
    };

    const addToWishlist = async () => {
        try {
            await Api.post('wishlist/add/', { product_id: product.id });
            showToast('success', 'Added to wishlist ❤️');
        } catch {
            showToast('info', 'Already in wishlist');
        }
    };

    const buyNow = async () => {
        try {
            const res = await Api.post('stripe/create-session/', {
                product_id: product.id,
                quantity: qty
            });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            showToast('error', err.response?.data?.error || 'Failed to initiate checkout');
        }
    };

    if (loading) return (
        <div className="cust-pd">
            <div className="cust-pd-main cust-glass-card"><div className="cust-skeleton" style={{ height: 400 }} /></div>
        </div>
    );

    if (!product) return (
        <div className="cust-empty-state cust-glass-card">
            <span className="cust-empty-icon">🔍</span><h3>Product not found</h3>
        </div>
    );

    const images = product.images || [];
    const currentImg = images[activeImg]?.image || product.primary_image_url;

    return (
        <div className="cust-pd">
            <button className="cust-pd-back" onClick={() => navigate(-1)}>← Back</button>

            <div className="cust-pd-main cust-glass-card">
                {/* Image Gallery */}
                <div className="cust-pd-gallery">
                    <div className="cust-pd-img-main">
                        {currentImg ? <img src={currentImg} alt={product.name} /> : <div className="cust-pd-img-placeholder">🎨</div>}
                    </div>
                    {images.length > 1 && (
                        <div className="cust-pd-thumbs">
                            {images.map((img, i) => (
                                <div key={i}
                                    className={`cust-pd-thumb ${i === activeImg ? 'active' : ''}`}
                                    onClick={() => setActiveImg(i)}
                                >
                                    <img src={img.image} alt="" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="cust-pd-info">
                    <span className="cust-pd-category">{product.category_name}</span>
                    <h1 className="cust-pd-title">{product.name}</h1>
                    <p className="cust-pd-seller">by <strong>{product.seller_name}</strong></p>
                    <div className="cust-pd-meta">
                        <span className="cust-pd-rating">⭐ {product.average_rating || 'No ratings'}</span>
                        <span className="cust-pd-orders">{product.total_orders} sold</span>
                    </div>
                    <div className="cust-pd-price">₹{product.price}</div>
                    {qty > 1 && <div style={{ fontSize: 15, color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>Total: ₹{(product.price * qty).toFixed(2)} ({qty} × ₹{product.price})</div>}
                    <p className="cust-pd-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

                    {product.tags && (
                        <div className="cust-pd-tags">
                            {product.tags.split(',').map((t, i) => <span key={i} className="cust-pd-tag">{t.trim()}</span>)}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-6">
                        <div className="flex items-center gap-3 bg-[#F7F6F2] px-4 py-2 rounded-full border border-gray-100">
                            <button className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30" disabled={product.stock === 0} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <span className="font-bold w-6 text-center">{qty}</span>
                            <button className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30" disabled={product.stock === 0} onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                        </div>
                        <button 
                            disabled={product.stock === 0} 
                            onClick={addToCart}
                            className="px-6 py-3 bg-white text-[#1F1F1F] font-bold rounded-full border-2 border-[#1F1F1F] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            🛒 Add to Cart
                        </button>
                        <button 
                            disabled={product.stock === 0} 
                            onClick={buyNow}
                            className="px-8 py-3.5 bg-[#1F1F1F] text-white font-bold rounded-full hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                        >
                            Buy Now
                        </button>
                        <button 
                            onClick={addToWishlist}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                            title="Add to Wishlist"
                        >
                            ♡
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="cust-pd-tabs cust-glass-card">
                <div className="cust-pd-tab-header">
                    {['description', 'reviews', 'seller'].map(t => (
                        <button key={t}
                            className={`cust-pd-tab-btn ${activeTab === t ? 'active' : ''}`}
                            onClick={() => setActiveTab(t)}
                        >{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                    ))}
                </div>
                <div className="cust-pd-tab-content">
                    {activeTab === 'description' && <p className="cust-pd-desc">{product.description || 'No description available.'}</p>}
                    {activeTab === 'reviews' && (
                        <div className="cust-pd-reviews">
                            {(product.reviews || []).length === 0 ? <p className="cust-pd-no-reviews">No reviews yet</p> : (
                                product.reviews.map(r => (
                                    <div key={r.id} className="cust-pd-review-item">
                                        <div className="cust-pd-review-top">
                                            <strong>{r.customer_name}</strong>
                                            <span>{'⭐'.repeat(r.rating)}</span>
                                        </div>
                                        <p>{r.comment}</p>
                                        {r.seller_reply && <div className="cust-pd-seller-reply"><strong>Seller:</strong> {r.seller_reply}</div>}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'seller' && (
                        <div className="cust-pd-seller-info">
                            <p><strong>Name:</strong> {product.seller_name}</p>
                            <p><strong>Total Products:</strong> View on marketplace</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Products */}
            {similar.length > 0 && (
                <div className="cust-pd-similar">
                    <h3>Similar Products</h3>
                    <div className="cust-pd-similar-grid">
                        {similar.map(p => (
                            <div key={p.id} className="cust-pd-similar-card cust-glass-card" onClick={() => navigate(`/customer/product/${p.id}`)}>
                                {p.primary_image_url ? <img src={p.primary_image_url} alt={p.name} /> : <div className="cust-pd-img-placeholder">🎨</div>}
                                <div className="cust-pd-similar-body">
                                    <h4>{p.name}</h4>
                                    <span>₹{p.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
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

export default ProductDetails;
