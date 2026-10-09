import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import './Recommendations.css';

function ProductCard({ product, onAddCart }) {
    const navigate = useNavigate();
    return (
        <div className="cust-rec-card cust-glass-card" onClick={() => navigate(`/customer/product/${product.id}`)}>
            <div className="cust-rec-card-img">
                {product.primary_image_url ? (
                    <img src={product.primary_image_url} alt={product.name} />
                ) : (
                    <div className="cust-rec-placeholder">🎨</div>
                )}
                <button 
                    className="cust-rec-quick-add" 
                    onClick={e => { e.stopPropagation(); onAddCart(product.id); }}
                    title="Add to cart"
                >
                    + Cart
                </button>
            </div>
            <div className="cust-rec-card-body">
                {product.recommendation_reason && (
                    <div className="cust-rec-reason" title={product.recommendation_reason}>
                        <span className="cust-rec-sparkle">✨</span>
                        <span className="cust-rec-reason-text">{product.recommendation_reason}</span>
                    </div>
                )}
                <h4>{product.name}</h4>
                <p className="cust-rec-seller">{product.seller_name}</p>
                <div className="cust-rec-card-footer">
                    <span className="cust-rec-price">₹{product.price}</span>
                    <span className="cust-rec-rating">⭐ {product.average_rating ? Number(product.average_rating).toFixed(1) : 'New'}</span>
                </div>
            </div>
        </div>
    );
}

function ScrollRow({ title, emoji, products, loading, onAddCart }) {
    const ref = useRef(null);
    const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

    return (
        <section className="cust-rec-section">
            <div className="cust-rec-section-header">
                <h3>{emoji} {title}</h3>
                <div className="cust-rec-scroll-btns">
                    <button onClick={() => scroll(-1)} title="Previous">‹</button>
                    <button onClick={() => scroll(1)} title="Next">›</button>
                </div>
            </div>
            <div className="cust-rec-scroll" ref={ref}>
                {loading ? Array(6).fill(0).map((_, i) => (
                    <div key={i} className="cust-skeleton" style={{ width: 240, height: 280, flexShrink: 0, borderRadius: 20 }} />
                )) : products.length > 0 ? products.map(p => (
                    <ProductCard key={p.id} product={p} onAddCart={onAddCart} />
                )) : <p className="cust-rec-empty">Nothing here yet — explore more crafts to see personalized picks!</p>}
            </div>
        </section>
    );
}

function Recommendations() {
    const [data, setData] = useState({ recommended: [], trending: [], new_arrivals: [] });
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const loadRecommendations = (silent = false) => {
        if (!silent) setLoading(true);
        Api.get('recommendations/')
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRecommendations();
        Api.get('categories/')
            .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
            .catch(() => { });
    }, []);

    const handleCategoryBoost = async (cat) => {
        try {
            setActiveCategory(cat.id);
            await Api.post('recommendations/interests/', { category_id: cat.id, delta: 2.5 });
            setToast({ type: 'success', msg: `Tuned AI recommendations for ${cat.name}! ✨` });
            loadRecommendations(true);
        } catch {
            setToast({ type: 'info', msg: `Exploring ${cat.name}` });
        }
        setTimeout(() => setToast(null), 3000);
    };

    const addToCart = async (productId) => {
        try {
            await Api.post('cart/add/', { product_id: productId, quantity: 1 });
            setToast({ type: 'success', msg: 'Added to cart!' });
        } catch (err) {
            setToast({ type: 'error', msg: err.response?.data?.detail || 'Failed' });
        }
        setTimeout(() => setToast(null), 2500);
    };

    return (
        <div className="cust-recommendations">
            <div className="cust-page-header">
                <h1 className="cust-page-title">AI Recommendations</h1>
                <p className="cust-page-subtitle">Intelligent personalized picks powered by vector semantic similarity</p>
            </div>

            {/* AI badge */}
            <div className="cust-rec-ai-badge cust-glass-card">
                <span>🧠</span>
                <div>
                    <strong>Semantic Taste Matching Active</strong>
                    <p>Ranked using local neural embeddings, browsing activity, saved wishlist pieces, and artisan craft affinities.</p>
                </div>
            </div>

            {/* Category Preferences Quick Tuning */}
            {categories.length > 0 && (
                <div className="cust-rec-interests-bar cust-glass-card">
                    <div className="cust-rec-interests-title">
                        <span>🎯</span> Tune Your AI Taste Profile:
                    </div>
                    <div className="cust-rec-interests-chips">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`cust-rec-interest-chip ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => handleCategoryBoost(cat)}
                            >
                                <span>🎨</span> {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <ScrollRow 
                title="Recommended For You" 
                emoji="🎯" 
                products={data.recommended} 
                loading={loading} 
                onAddCart={addToCart} 
            />

            <ScrollRow 
                title="Trending Crafts" 
                emoji="🔥" 
                products={data.trending} 
                loading={loading} 
                onAddCart={addToCart} 
            />

            <ScrollRow 
                title="New Arrivals" 
                emoji="✨" 
                products={data.new_arrivals} 
                loading={loading} 
                onAddCart={addToCart} 
            />

            {toast && <div className={`cust-toast cust-toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}

export default Recommendations;
