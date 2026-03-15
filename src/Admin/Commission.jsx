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
        </div>
    );
}

export default Commission;
