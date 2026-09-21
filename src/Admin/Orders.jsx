import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const fetchData = () => {
        setLoading(true);
        const url = filter ? `admin/orders/?status=${filter}` : 'admin/orders/';
        Api.get(url)
            .then(res => setOrders(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData(); }, [filter]);

    const handleStatusUpdate = (id) => {
        if (!newStatus) return;
        Api.put(`admin/orders/${id}/status/`, { status: newStatus })
            .then(() => { setSelectedOrder(null); setNewStatus(''); fetchData(); })
            .catch(() => alert('Failed to update status.'));
    };

    const handleRefund = (id) => {
        if (window.confirm('Issue refund and cancel this order?')) {
            Api.post(`admin/orders/${id}/refund/`)
                .then(() => fetchData())
                .catch(() => alert('Failed to refund.'));
        }
    };

    const statuses = ['', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Order Management</h1>
                <p>Monitor and manage all platform orders</p>
            </div>

            <div className="admin-filter-tabs">
                {statuses.map(s => (
                    <button
                        key={s}
                        className={`admin-filter-tab ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="admin-glass-card">
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="admin-loading">No orders found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Seller</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id}>
                                        <td><strong>#{o.id}</strong></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {o.product_image && (
                                                    <img src={o.product_image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                                                )}
                                                {o.product_name}
                                            </div>
                                        </td>
                                        <td>{o.customer_name}</td>
                                        <td>{o.seller_name}</td>
                                        <td>{o.quantity}</td>
                                        <td style={{ fontWeight: 700 }}>₹{o.total_amount}</td>
                                        <td>
                                            <span className={`admin-badge ${o.status.toLowerCase()}`}>{o.status}</span>
                                        </td>
                                        <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="admin-btn outline sm" onClick={() => { setSelectedOrder(o); setNewStatus(o.status); }}>
                                                    Edit
                                                </button>
                                                {o.status !== 'CANCELLED' && (
                                                    <button className="admin-btn danger sm" onClick={() => handleRefund(o.id)}>
                                                        Refund
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {selectedOrder && (
                <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Update Order #{selectedOrder.id}</h3>
                        <div className="admin-form-group">
                            <label>Product</label>
                            <p style={{ margin: 0 }}>{selectedOrder.product_name}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Customer</label>
                            <p style={{ margin: 0 }}>{selectedOrder.customer_name} ({selectedOrder.customer_email})</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Status</label>
                            <select className="admin-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => setSelectedOrder(null)}>Cancel</button>
                            <button className="admin-btn primary" onClick={() => handleStatusUpdate(selectedOrder.id)}>
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
