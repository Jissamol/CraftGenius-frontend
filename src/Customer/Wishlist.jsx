import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import './Wishlist.css';

function Wishlist() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        Api.get('wishlist/')
            .then(res => setItems(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 2500); };

    const removeItem = async (id) => {
        setRemoving(id);
        try {
            await Api.delete(`wishlist/remove/${id}/`);
            setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 300);
            showToast('success', 'Removed from wishlist');
        } catch { showToast('error', 'Failed to remove'); }
        setTimeout(() => setRemoving(null), 350);
    };

    const moveToCart = async (item) => {
        try {
            await Api.post('cart/add/', { product_id: item.product, quantity: 1 });
            await Api.delete(`wishlist/remove/${item.id}/`);
            setItems(prev => prev.filter(i => i.id !== item.id));
            showToast('success', 'Moved to cart 🛒');
        } catch (err) {
            showToast('error', err.response?.data?.detail || 'Failed');
        }
    };

    return (
        <div className="cust-wishlist">
            <div className="cust-page-header">
                {/* <h1 className="cust-page-title">My Wishlist</h1> */}
                {/* <p className="cust-page-subtitle">{items.length} items saved</p> */}
            </div>

            {loading ? (
                <div className="cust-wishlist-grid">
                    {Array(6).fill(0).map((_, i) => <div key={i} className="cust-skeleton" style={{ height: 300, borderRadius: 20 }} />)}
                </div>
            ) : items.length === 0 ? (
                <div className="cust-empty-state cust-glass-card">
                    <span className="cust-empty-icon">💝</span>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love for later</p>
                    <button className="cust-btn cust-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/customer/marketplace')}>Explore</button>
                </div>
            ) : (
                <div className="cust-wishlist-grid">
                    {items.map(item => (
                        <div key={item.id} className={`cust-wishlist-card cust-glass-card ${removing === item.id ? 'removing' : ''}`}>
                            <div className="cust-wishlist-card-img" onClick={() => navigate(`/customer/product/${item.product}`)}>
                                {item.product_image ? <img src={item.product_image} alt={item.product_name} /> : <div className="cust-wishlist-placeholder">🎨</div>}
                                <button className="cust-wishlist-remove" onClick={e => { e.stopPropagation(); removeItem(item.id); }}>✕</button>
                            </div>
                            <div className="cust-wishlist-card-body">
                                <h4 onClick={() => navigate(`/customer/product/${item.product}`)}>{item.product_name}</h4>
                                <p className="cust-wishlist-seller">by {item.seller_name}</p>
                                <div className="cust-wishlist-card-meta">
                                    <span className="cust-wishlist-price">₹{item.product_price}</span>
                                    <span className="cust-wishlist-rating">⭐ {item.average_rating || '—'}</span>
                                </div>
                                <button className="cust-btn cust-btn-primary cust-btn-sm" style={{ width: '100%', marginTop: 10 }}
                                    disabled={item.stock === 0}
                                    onClick={() => moveToCart(item)}>
                                    🛒 Move to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && <div className={`cust-toast cust-toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}

export default Wishlist;
