import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Disputes() {
    const [disputes, setDisputes] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [resolution, setResolution] = useState('');
    const [resolveStatus, setResolveStatus] = useState('RESOLVED');

    const fetchData = () => {
        setLoading(true);
        const url = filter ? `admin/disputes/?status=${filter}` : 'admin/disputes/';
        Api.get(url)
            .then(res => setDisputes(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData(); }, [filter]);

    const handleResolve = () => {
        Api.put(`admin/disputes/${selectedDispute.id}/`, {
            status: resolveStatus,
            resolution: resolution
        })
            .then(() => { setSelectedDispute(null); setResolution(''); fetchData(); })
            .catch(() => alert('Failed to update dispute.'));
    };

    const statusFilters = ['', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'];

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Dispute Management</h1>
                <p>Handle complaints and refund requests</p>
            </div>

            <div className="admin-filter-tabs">
                {statusFilters.map(s => (
                    <button
                        key={s}
                        className={`admin-filter-tab ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s ? s.replace('_', ' ') : 'All'}
                    </button>
                ))}
            </div>

            <div className="admin-glass-card">
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : disputes.length === 0 ? (
                    <div className="admin-loading">No disputes found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Raised By</th>
                                    <th>Order</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disputes.map(d => (
                                    <tr key={d.id}>
                                        <td><strong>#{d.id}</strong></td>
                                        <td>{d.subject}</td>
                                        <td>
                                            <span className="admin-badge pending">
                                                {d.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{d.raised_by_name}</td>
                                        <td>
                                            <div>
                                                <div>Order #{d.order}</div>
                                                <small style={{ color: 'var(--admin-text-secondary)' }}>
                                                    {d.order_product}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${d.status.toLowerCase()}`}>
                                                {d.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{new Date(d.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="admin-btn outline sm"
                                                onClick={() => {
                                                    setSelectedDispute(d);
                                                    setResolution(d.resolution || '');
                                                    setResolveStatus(d.status);
                                                }}
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedDispute && (
                <div className="admin-modal-overlay" onClick={() => setSelectedDispute(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Dispute #{selectedDispute.id}</h3>
                        <div className="admin-form-group">
                            <label>Subject</label>
                            <p style={{ margin: 0 }}>{selectedDispute.subject}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Description</label>
                            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{selectedDispute.description}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Customer</label>
                            <p style={{ margin: 0 }}>{selectedDispute.order_customer}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Seller</label>
                            <p style={{ margin: 0 }}>{selectedDispute.order_seller}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Update Status</label>
                            <select className="admin-select" value={resolveStatus} onChange={e => setResolveStatus(e.target.value)}>
                                {['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'].map(s => (
                                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Resolution</label>
                            <textarea
                                className="admin-textarea"
                                value={resolution}
                                onChange={e => setResolution(e.target.value)}
                                placeholder="Provide resolution details..."
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => setSelectedDispute(null)}>Cancel</button>
                            <button className="admin-btn primary" onClick={handleResolve}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Disputes;
