import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { useTheme } from '../context/ThemeContext';

function Settings() {
    const { darkMode, toggleTheme } = useTheme();
    const [commission, setCommission] = useState(null);
    const [loading, setLoading] = useState(true);

    const adminName = localStorage.getItem('name') || 'Admin';
    const adminEmail = localStorage.getItem('email') || '';

    useEffect(() => {
        Api.get('admin/commission/')
            .then(res => setCommission(res.data.commission))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Settings</h1>
                <p>Platform configuration and admin profile</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Admin Profile */}
                <div className="admin-glass-card">
                    <h3 style={{ margin: '0 0 20px', fontWeight: 700, fontSize: 16 }}>Admin Profile</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 20,
                            background: 'var(--admin-gradient)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 26, fontWeight: 700
                        }}>
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: 18 }}>{adminName}</h4>
                            <p style={{ margin: '4px 0 0', color: 'var(--admin-text-secondary)', fontSize: 14 }}>
                                {adminEmail}
                            </p>
                            <span className="admin-badge approved" style={{ marginTop: 6, display: 'inline-block' }}>
                                Super Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="admin-glass-card">
                    <h3 style={{ margin: '0 0 20px', fontWeight: 700, fontSize: 16 }}>Appearance</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                            <strong>Dark Mode</strong>
                            <p style={{ margin: '4px 0 0', color: 'var(--admin-text-secondary)', fontSize: 13 }}>
                                Switch between light and dark themes
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: 56, height: 30, borderRadius: 15,
                                background: darkMode ? 'var(--admin-primary)' : 'var(--admin-border)',
                                border: 'none', cursor: 'pointer', position: 'relative',
                                transition: 'background 0.3s'
                            }}
                        >
                            <span style={{
                                width: 24, height: 24, borderRadius: '50%',
                                background: 'white', position: 'absolute',
                                top: 3, left: darkMode ? 29 : 3,
                                transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                            }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Platform Config */}
            <div className="admin-glass-card" style={{ marginTop: 20 }}>
                <h3 style={{ margin: '0 0 20px', fontWeight: 700, fontSize: 16 }}>Platform Configuration</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div style={{
                        padding: 20, borderRadius: 16,
                        background: 'var(--admin-primary-light)',
                        border: '1px solid var(--admin-border)'
                    }}>
                        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--admin-text-secondary)' }}>Commission Rate</p>
                        <strong style={{ fontSize: 24 }}>
                            {loading ? '...' : `${commission?.percentage}%`}
                        </strong>
                    </div>
                    <div style={{
                        padding: 20, borderRadius: 16,
                        background: 'var(--admin-primary-light)',
                        border: '1px solid var(--admin-border)'
                    }}>
                        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--admin-text-secondary)' }}>Auth Method</p>
                        <strong style={{ fontSize: 24 }}>JWT</strong>
                    </div>
                    <div style={{
                        padding: 20, borderRadius: 16,
                        background: 'var(--admin-primary-light)',
                        border: '1px solid var(--admin-border)'
                    }}>
                        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--admin-text-secondary)' }}>Roles</p>
                        <strong style={{ fontSize: 24 }}>3</strong>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="admin-glass-card" style={{ marginTop: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="admin-btn primary" onClick={() => window.open('/admin/handicrafters', '_self')}>
                        🎨 Review Approvals
                    </button>
                    <button className="admin-btn outline" onClick={() => window.open('/admin/commission', '_self')}>
                        💰 Commission Control
                    </button>
                    <button className="admin-btn outline" onClick={() => window.open('/admin/analytics', '_self')}>
                        📈 View Analytics
                    </button>
                    <button className="admin-btn outline" onClick={() => window.open('/admin/disputes', '_self')}>
                        ⚖️ Manage Disputes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
