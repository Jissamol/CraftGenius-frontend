import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Products() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = () => {
        setLoading(true);
        Api.get(`admin/products/?filter=${filter}`)
            .then(res => setProducts(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData(); }, [filter]);

    const handleApprove = (id) => {
        Api.put(`admin/products/${id}/approve/`).then(() => fetchData());
    };

    const handleReject = (id) => {
        Api.put(`admin/products/${id}/reject/`).then(() => fetchData());
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            Api.delete(`admin/products/${id}/`).then(() => fetchData());
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.seller_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Product Moderation</h1>
                <p>Review, approve, and manage all marketplace products</p>
            </div>

            <div className="admin-filter-tabs">
                {['all', 'pending', 'approved'].map(f => (
                    <button
                        key={f}
                        className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="admin-search-bar">
                <span>🔍</span>
                <input
                    placeholder="Search products or sellers..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="admin-glass-card">
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="admin-loading">No products found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Seller</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Orders</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                {p.primary_image_url && (
                                                    <img
                                                        src={p.primary_image_url}
                                                        alt=""
                                                        style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }}
                                                    />
                                                )}
                                                <strong>{p.name}</strong>
                                            </div>
                                        </td>
                                        <td>{p.seller_name}</td>
                                        <td>{p.category_name || '—'}</td>
                                        <td>₹{p.price}</td>
                                        <td>{p.stock}</td>
                                        <td>{p.order_count}</td>
                                        <td>
                                            <span className={`admin-badge ${p.is_approved ? 'approved' : 'pending'}`}>
                                                {p.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {!p.is_approved && (
                                                    <button className="admin-btn success sm" onClick={() => handleApprove(p.id)}>
                                                        ✓
                                                    </button>
                                                )}
                                                {p.is_approved && (
                                                    <button className="admin-btn outline sm" onClick={() => handleReject(p.id)}>
                                                        ✕
                                                    </button>
                                                )}
                                                <button className="admin-btn danger sm" onClick={() => handleDelete(p.id)}>
                                                    🗑
                                                </button>
                                            </div>
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

export default Products;
