import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Handicrafters() {
    const [handicrafters, setHandicrafters] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(null);

    const fetchData = () => {
        setLoading(true);
        Api.get(`admin/handicrafters/?filter=${filter}`)
            .then(res => setHandicrafters(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData(); }, [filter]);

    const handleApprove = (id) => {
        Api.put(`admin/handicrafters/${id}/approve/`)
            .then(() => fetchData())
            .catch(() => alert('Failed to approve.'));
    };

    const handleReject = (id) => {
        Api.put(`admin/handicrafters/${id}/reject/`, { reason: rejectReason })
            .then(() => { setShowRejectModal(null); setRejectReason(''); fetchData(); })
            .catch(() => alert('Failed to reject.'));
    };

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Handicrafter Approvals</h1>
                <p>Review and manage handicrafter registrations</p>
            </div>

            <div className="admin-filter-tabs">
                {['pending', 'approved', 'all'].map(f => (
                    <button
                        key={f}
                        className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="admin-glass-card">
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : handicrafters.length === 0 ? (
                    <div className="admin-loading">No handicrafters found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialty</th>
                                    <th>Location</th>
                                    <th>Products</th>
                                    <th>Registered</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {handicrafters.map(h => (
                                    <tr key={h.id}>
                                        <td><strong>{h.name}</strong></td>
                                        <td>{h.email}</td>
                                        <td>{h.craft_specialty || '—'}</td>
                                        <td>{h.location || '—'}</td>
                                        <td>{h.product_count}</td>
                                        <td>{new Date(h.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`admin-badge ${h.is_approved ? 'approved' : 'pending'}`}>
                                                {h.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="admin-btn outline sm" onClick={() => setSelectedUser(h)}>
                                                    View
                                                </button>
                                                {!h.is_approved && (
                                                    <>
                                                        <button className="admin-btn success sm" onClick={() => handleApprove(h.id)}>
                                                            ✓ Approve
                                                        </button>
                                                        <button className="admin-btn danger sm" onClick={() => setShowRejectModal(h)}>
                                                            ✕ Reject
                                                        </button>
                                                    </>
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

            {/* View Profile Modal */}
            {selectedUser && (
                <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Handicrafter Profile</h3>
                        <div className="admin-form-group">
                            <label>Name</label>
                            <p style={{ margin: 0 }}>{selectedUser.name}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Email</label>
                            <p style={{ margin: 0 }}>{selectedUser.email}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Specialty</label>
                            <p style={{ margin: 0 }}>{selectedUser.craft_specialty || 'Not provided'}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Location</label>
                            <p style={{ margin: 0 }}>{selectedUser.location || 'Not provided'}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Products</label>
                            <p style={{ margin: 0 }}>{selectedUser.product_count}</p>
                        </div>
                        <div className="admin-form-group">
                            <label>Status</label>
                            <span className={`admin-badge ${selectedUser.is_approved ? 'approved' : 'pending'}`}>
                                {selectedUser.is_approved ? 'Approved' : 'Pending'}
                            </span>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="admin-modal-overlay" onClick={() => { setShowRejectModal(null); setRejectReason(''); }}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Reject {showRejectModal.name}?</h3>
                        <div className="admin-form-group">
                            <label>Reason (optional)</label>
                            <textarea
                                className="admin-textarea"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for rejection..."
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => { setShowRejectModal(null); setRejectReason(''); }}>
                                Cancel
                            </button>
                            <button className="admin-btn danger" onClick={() => handleReject(showRejectModal.id)}>
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Handicrafters;
