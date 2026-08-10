import { useState, useEffect } from 'react';
import Api from '../services/Api';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8a6a55', '#c9a98f', '#9a6870', '#6f8790', '#5f8068', '#a56b4f', '#927b62', '#756f68'];

function Analytics() {
    const [data, setData] = useState(null);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Api.get(`admin/analytics/?period=${period}`)
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [period]);

    if (loading) return <div className="admin-loading">Loading analytics...</div>;
    if (!data) return <div className="admin-loading">Failed to load analytics.</div>;

    return (
        <div>
            <div className="admin-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Analytics</h1>
                    <p>Platform performance insights</p>
                </div>
                <div className="admin-filter-tabs" style={{ marginBottom: 0 }}>
                    {['7d', '30d', '6m', '1y'].map(p => (
                        <button
                            key={p}
                            className={`admin-filter-tab ${period === p ? 'active' : ''}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Revenue Chart */}
                <div className="admin-glass-card">
                    <h3 style={{ margin: '0 0 16px', fontWeight: 700 }}>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={data.revenue_data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8a6a55" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8a6a55" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                            <XAxis dataKey="date" tick={{ fill: 'var(--admin-text-secondary)', fontSize: 11 }}
                                tickFormatter={v => v ? new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                            />
                            <YAxis tick={{ fill: 'var(--admin-text-secondary)', fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: 'var(--admin-surface-solid)', border: '1px solid var(--admin-border)', borderRadius: 12 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#8a6a55" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue (₹)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Daily Orders Chart */}
                <div className="admin-glass-card">
                    <h3 style={{ margin: '0 0 16px', fontWeight: 700 }}>Daily Orders</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data.daily_orders} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                            <XAxis dataKey="date" tick={{ fill: 'var(--admin-text-secondary)', fontSize: 11 }}
                                tickFormatter={v => v ? new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                            />
                            <YAxis tick={{ fill: 'var(--admin-text-secondary)', fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: 'var(--admin-surface-solid)', border: '1px solid var(--admin-border)', borderRadius: 12 }} />
                            <Bar dataKey="count" fill="#c9a98f" radius={[3, 3, 0, 0]} name="Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* User Growth */}
                <div className="admin-glass-card">
                    <h3 style={{ margin: '0 0 16px', fontWeight: 700 }}>User Growth</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={data.user_growth} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                            <XAxis dataKey="date" tick={{ fill: 'var(--admin-text-secondary)', fontSize: 11 }}
                                tickFormatter={v => v ? new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                            />
                            <YAxis tick={{ fill: 'var(--admin-text-secondary)', fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: 'var(--admin-surface-solid)', border: '1px solid var(--admin-border)', borderRadius: 12 }} />
                            <Line type="monotone" dataKey="count" stroke="#6f8790" strokeWidth={2.5} dot={{ r: 4, fill: '#6f8790' }} name="New Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="admin-glass-card">
                    <h3 style={{ margin: '0 0 16px', fontWeight: 700 }}>Category Sales Distribution</h3>
                    {data.category_distribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={data.category_distribution}
                                    dataKey="sales"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    paddingAngle={3}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.category_distribution.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--admin-surface-solid)', border: '1px solid var(--admin-border)', borderRadius: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: 'var(--admin-text-secondary)', textAlign: 'center', padding: 40 }}>No data yet</p>
                    )}
                </div>
            </div>

            {/* Seller Performance */}
            <div className="admin-glass-card">
                <h3 style={{ margin: '0 0 16px', fontWeight: 700 }}>Top Seller Performance</h3>
                {data.seller_performance.length > 0 ? (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Seller</th>
                                    <th>Total Sales</th>
                                    <th>Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.seller_performance.map((s, i) => (
                                    <tr key={i}>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 28,
                                                height: 28,
                                                borderRadius: 8,
                                                background: i < 3 ? 'var(--admin-gradient)' : 'var(--admin-primary-light)',
                                                color: i < 3 ? 'white' : 'var(--admin-primary)',
                                                fontWeight: 700,
                                                fontSize: 13
                                            }}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td><strong>{s.name}</strong></td>
                                        <td style={{ fontWeight: 600, color: 'var(--admin-success)' }}>₹{s.total_sales.toLocaleString()}</td>
                                        <td>{s.order_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--admin-text-secondary)' }}>No seller data available.</p>
                )}
            </div>
        </div>
    );
}

export default Analytics;
