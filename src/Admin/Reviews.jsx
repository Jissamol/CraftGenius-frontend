import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = () => {
        setLoading(true);
        Api.get('admin/reviews/')
            .then(res => setReviews(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = (id) => {
        if (window.confirm('Remove this review permanently?')) {
            Api.delete(`admin/reviews/${id}/`).then(() => fetchData());
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const filtered = reviews.filter(r =>
        r.product_name.toLowerCase().includes(search.toLowerCase()) ||
        r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Reviews Moderation</h1>
                <p>Monitor and moderate customer reviews</p>
            </div>

            <div className="admin-search-bar">
                <span>🔍</span>
                <input
                    placeholder="Search reviews..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="admin-glass-card">
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="admin-loading">No reviews found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Seller</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.id}>
                                        <td><strong>{r.product_name}</strong></td>
                                        <td>{r.customer_name}</td>
                                        <td>{r.seller_name}</td>
                                        <td>
                                            <span style={{ color: '#f39c12', fontSize: 15 }}>
                                                {renderStars(r.rating)}
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: 300 }}>
                                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4 }}>
                                                {r.comment.length > 100 ? r.comment.slice(0, 100) + '...' : r.comment}
                                            </p>
                                            {r.seller_reply && (
                                                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--admin-text-secondary)', fontStyle: 'italic' }}>
                                                    ↩ {r.seller_reply.length > 60 ? r.seller_reply.slice(0, 60) + '...' : r.seller_reply}
                                                </p>
                                            )}
                                        </td>
                                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="admin-btn danger sm" onClick={() => handleDelete(r.id)}>
                                                🗑 Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reviews;
