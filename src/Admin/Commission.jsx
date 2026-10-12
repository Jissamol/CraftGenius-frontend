import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Commission() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newRate, setNewRate] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchData = () => {
        setLoading(true);
        Api.get('admin/commission/')
            .then(res => {
                setData(res.data);
                setNewRate(res.data.commission.percentage);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdate = () => {
        setUpdating(true);
        Api.put('admin/commission/', { percentage: parseFloat(newRate) })
            .then(() => fetchData())
            .catch(() => alert('Failed to update.'))
            .finally(() => setUpdating(false));
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (!data) return <div className="admin-loading">Failed to load commission data.</div>;

    const totalCommission = data.seller_breakdown.reduce((sum, s) => sum + s.total_commission, 0);
    const totalSales = data.seller_breakdown.reduce((sum, s) => sum + s.total_sales, 0);

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Commission Control</h1>
                <p>Manage platform commission rate and track revenue</p>
            </div>

            {/* Commission Rate Card */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-glass-card admin-stat-card">
                    <div className="stat-card-icon" style={{ background: '#6c5ce720', color: '#6c5ce7' }}>💎</div>
                    <div className="stat-card-info">
                        <span className="stat-card-label">Current Rate</span>
                        <span className="stat-card-value">{data.commission.percentage}%</span>
                    </div>
                </div>
                <div className="admin-glass-card admin-stat-card">
                    <div className="stat-card-icon" style={{ background: '#27ae6020', color: '#27ae60' }}>💰</div>
                    <div className="stat-card-info">
                        <span className="stat-card-label">Total Commission</span>
                        <span className="stat-card-value">₹{totalCommission.toLocaleString()}</span>
                    </div>
                </div>
                <div className="admin-glass-card admin-stat-card">
                    <div className="stat-card-icon" style={{ background: '#098fe320', color: '#0984e3' }}>📊</div>
                    <div className="stat-card-info">
                        <span className="stat-card-label">Total Sales</span>
                        <span className="stat-card-value">₹{totalSales.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Update Rate */}
            <div className="admin-glass-card" style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Update Commission Rate</h3>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0, flex: 1, maxWidth: 300 }}>
                        <label>Percentage (%)</label>
                        <input
                            className="admin-input"
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={newRate}
                            onChange={e => setNewRate(e.target.value)}
                        />
                    </div>
                    <button
                        className="admin-btn primary"
                        onClick={handleUpdate}
                        disabled={updating}
                        style={{ height: 46 }}
                    >
                        {updating ? 'Updating...' : 'Update Rate'}
                    </button>
                </div>
                {data.commission.updated_by_name && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                        Last updated by <strong>{data.commission.updated_by_name}</strong> on {new Date(data.commission.updated_at).toLocaleString()}
                    </p>
                )}
            </div>

            {/* Per-Seller Breakdown */}
            <div className="admin-glass-card">
                <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Per-Seller Revenue Breakdown</h3>
                {data.seller_breakdown.length === 0 ? (
                    <p style={{ color: 'var(--admin-text-secondary)' }}>No seller data yet.</p>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Seller</th>
                                    <th>Total Sales</th>
                                    <th>Commission</th>
                                    <th>Net Payout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.seller_breakdown.map(s => (
                                    <tr key={s.id}>
                                        <td><strong>{s.name}</strong></td>
                                        <td>₹{s.total_sales.toLocaleString()}</td>
                                        <td style={{ color: 'var(--admin-danger)', fontWeight: 600 }}>
                                            ₹{s.total_commission.toLocaleString()}
                                        </td>
                                        <td style={{ color: 'var(--admin-success)', fontWeight: 600 }}>
                                            ₹{s.total_net.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Seller Payout Requests & Ledger Reconciliation */}
            <AdminPayoutSection onPayoutProcessed={fetchData} />
        </div>
    );
}

function AdminPayoutSection({ onPayoutProcessed }) {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchPayouts = () => {
        setLoading(true);
        Api.get('admin/payouts/')
            .then(res => setPayouts(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    const handleProcess = async (payoutId, action) => {
        let referenceId = '';
        let notes = '';

        if (action === 'APPROVE') {
            referenceId = window.prompt('Enter Bank UTR / Transfer Reference ID (leave blank to auto-generate):', '') || '';
        } else {
            notes = window.prompt('Enter reason for rejecting this payout request:', '');
            if (!notes) return;
        }

        setProcessingId(payoutId);
        try {
            const res = await Api.post(`admin/payouts/${payoutId}/process/`, {
                action,
                reference_id: referenceId,
                notes
            });
            alert(res.data.detail || 'Payout updated successfully!');
            fetchPayouts();
            if (onPayoutProcessed) onPayoutProcessed();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to process payout.');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="admin-glass-card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Seller Payout Disbursements</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                        Approve or reject seller payout requests and record them directly in the financial ledger
                    </p>
                </div>
                <button className="admin-btn secondary" onClick={fetchPayouts} disabled={loading} style={{ fontSize: 12 }}>
                    {loading ? 'Refreshing...' : '🔄 Refresh Payouts'}
                </button>
            </div>

            {payouts.length === 0 ? (
                <p style={{ color: 'var(--admin-text-secondary)', margin: '16px 0' }}>No payout requests found.</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Seller</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Account Details</th>
                                <th>Status</th>
                                <th>Requested</th>
                                <th>Reference / Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.map(p => (
                                <tr key={p.id}>
                                    <td><strong>{p.seller_name}</strong></td>
                                    <td><strong style={{ color: '#27ae60' }}>₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                                    <td>{p.payout_method_display || p.payout_method}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.account_details}</td>
                                    <td>
                                        <span className={`admin-badge ${p.status === 'PAID' ? 'active' : p.status === 'REJECTED' ? 'inactive' : 'warning'}`}>
                                            {p.status_display || p.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                                        {new Date(p.requested_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ fontSize: 12 }}>
                                        {p.reference_id && <div><strong>Ref:</strong> {p.reference_id}</div>}
                                        {p.notes && <div style={{ color: 'var(--admin-text-secondary)' }}>{p.notes}</div>}
                                        {!p.reference_id && !p.notes && <span style={{ color: 'var(--admin-text-secondary)' }}>—</span>}
                                    </td>
                                    <td>
                                        {p.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button
                                                    className="admin-btn primary"
                                                    style={{ padding: '4px 10px', fontSize: 11, background: '#27ae60' }}
                                                    onClick={() => handleProcess(p.id, 'APPROVE')}
                                                    disabled={processingId === p.id}
                                                >
                                                    {processingId === p.id ? '...' : 'Approve & Pay'}
                                                </button>
                                                <button
                                                    className="admin-btn danger"
                                                    style={{ padding: '4px 10px', fontSize: 11 }}
                                                    onClick={() => handleProcess(p.id, 'REJECT')}
                                                    disabled={processingId === p.id}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>Reconciled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Commission;

