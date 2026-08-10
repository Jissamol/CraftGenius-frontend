import { useState, useEffect, useRef } from 'react';
import Api from '../services/Api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, Palette, Clock, Package, ShoppingCart, IndianRupee, Gem, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Api.get('admin/dashboard/')
            .then(res => setStats(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;
    if (!stats) return <div className="admin-loading">Failed to load dashboard data.</div>;

    const statCards = [
        { label: 'Total Users', value: stats.total_users, icon: Users, color: '#8a6a55' },
        { label: 'Customers', value: stats.total_customers, icon: ShoppingBag, color: '#00b894' },
        { label: 'Handicrafters', value: stats.total_handicrafters, icon: Palette, color: '#a56b4f' },
        { label: 'Pending Approvals', value: stats.pending_approvals, icon: Clock, color: '#f39c12' },
        { label: 'Total Products', value: stats.total_products, icon: Package, color: '#6f8790' },
        { label: 'Total Orders', value: stats.total_orders, icon: ShoppingCart, color: '#927b62' },
        { label: 'Revenue', value: `₹${stats.total_revenue.toLocaleString()}`, icon: IndianRupee, color: '#5f8068' },
        { label: 'Commission Earned', value: `₹${stats.total_commission.toLocaleString()}`, icon: Gem, color: '#9a6870' },
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Dashboard</h1>
                <p>System overview and key metrics</p>
            </div>

            {/* Stat Cards with animated counters */}
            <div className="admin-stats-grid">
                {statCards.map((card, i) => (
                    <div className="admin-glass-card admin-stat-card" key={i}>
                        <div className="stat-card-icon" style={{ background: `${card.color}20`, color: card.color }}>
                            <card.icon size={22} />
                        </div>
                        <div className="stat-card-info">
                            <span className="stat-card-label">{card.label}</span>
                            <AnimatedCounter value={card.value} />
                        </div>
                        {card.label === 'Pending Approvals' && stats.pending_approvals > 0 && (
                            <span className="stat-card-alert">!</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Fraud Alert */}
            {stats.fraud_alerts > 0 && (
                <div className="admin-glass-card fraud-alert-card">
                    <span className="fraud-icon"><AlertTriangle size={24} color="#ef4444" /></span>
                    <div>
                        <strong>Fraud Alert</strong>
                        <p>{stats.fraud_alerts} suspicious high-value pending orders detected</p>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="dashboard-charts-row">
                {/* Recent Orders */}
                <div className="admin-glass-card dashboard-chart-card">
                    <h3>Recent Orders</h3>
                    <div className="recent-orders-list">
                        {stats.recent_orders.map(order => (
                            <div className="recent-order-row" key={order.id}>
                                <div className="recent-order-info">
                                    <strong>#{order.id}</strong>
                                    <span>{order.product_name}</span>
                                </div>
                                <span className={`admin-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                                <span className="recent-order-amount">₹{order.total_amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="admin-glass-card dashboard-chart-card">
                    <h3>Top Categories</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={stats.top_categories} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                            <XAxis dataKey="name" tick={{ fill: 'var(--admin-text-secondary)', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'var(--admin-text-secondary)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--admin-surface-solid)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: 12,
                                    color: 'var(--admin-text)'
                                }}
                            />
                            <Bar dataKey="order_count" fill="#8a6a55" radius={[3, 3, 0, 0]} name="Orders" />
                            <Bar dataKey="product_count" fill="#c9a98f" radius={[3, 3, 0, 0]} name="Products" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Users */}
            <div className="admin-glass-card" style={{ marginTop: 20 }}>
                <h3>Recent Registrations</h3>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`admin-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AnimatedCounter({ value }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const numericValue = typeof value === 'string'
            ? parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
            : value;

        if (numericValue === 0) {
            setDisplay(0);
            return;
        }

        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            start = Math.floor(eased * numericValue);
            setDisplay(start);

            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            }
        }

        ref.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(ref.current);
    }, [value]);

    const prefix = typeof value === 'string' && value.startsWith('₹') ? '₹' : '';

    return (
        <span className="stat-card-value">
            {prefix}{display.toLocaleString()}
        </span>
    );
}

export default Dashboard;
