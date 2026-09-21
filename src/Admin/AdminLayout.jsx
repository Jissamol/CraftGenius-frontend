import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, Palette, PackageSearch, ShoppingCart, 
  Users, Tags, Star, Scale, DollarSign, TrendingUp, 
  Settings, ChevronLeft, ChevronRight, LogOut, Sun, Moon, Bell 
} from 'lucide-react';
import './AdminLayout.css';

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const adminName = localStorage.getItem('name') || 'Admin';
    const adminEmail = localStorage.getItem('email') || '';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { path: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: 'handicrafters', icon: <Palette size={20} />, label: 'Handicrafter Approvals' },
        { path: 'products', icon: <PackageSearch size={20} />, label: 'Product Moderation' },
        { path: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
        { path: 'customers', icon: <Users size={20} />, label: 'Customers' },
        { path: 'categories', icon: <Tags size={20} />, label: 'Categories' },
        { path: 'reviews', icon: <Star size={20} />, label: 'Reviews' },
        { path: 'disputes', icon: <Scale size={20} />, label: 'Disputes' },
        { path: 'commission', icon: <DollarSign size={20} />, label: 'Commission Control' },
        { path: 'analytics', icon: <TrendingUp size={20} />, label: 'Analytics' },
        { path: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className={`admin-layout ${darkMode ? 'dark' : ''}`}>
            {/* Background blobs */}
            <div className="admin-bg-blob blob-1" />
            <div className="admin-bg-blob blob-2" />
            <div className="admin-bg-blob blob-3" />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo" onClick={() => navigate('/admin/dashboard')}>
                        {!collapsed && <span className="admin-logo-text">CraftGenius</span>}
                        {collapsed && <span className="admin-logo-icon">CG</span>}
                    </div>
                    <button
                        className="admin-collapse-btn flex items-center justify-center"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {!collapsed && <div className="admin-sidebar-label">ADMIN PANEL</div>}

                <nav className="admin-sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={`/admin/${item.path}`}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'active' : ''}`
                            }
                            title={item.label}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
                        <span className="admin-nav-icon"><LogOut size={20} /></span>
                        {!collapsed && <span className="admin-nav-label">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="admin-main-wrapper">
                {/* Top Navbar */}
                <header className="admin-navbar">
                    <div className="admin-navbar-left">
                        <h2 className="admin-page-title">Admin Panel</h2>
                    </div>

                    <div className="admin-navbar-right">
                        {/* Theme toggle */}
                        <button className="admin-theme-toggle flex items-center justify-center" onClick={toggleTheme} title="Toggle theme">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <button className="admin-notif-btn flex items-center justify-center" title="Notifications">
                            <Bell size={20} />
                            <span className="admin-notif-badge">3</span>
                        </button>

                        {/* Profile dropdown */}
                        <div className="admin-profile-wrapper" ref={profileRef}>
                            <button
                                className="admin-profile-btn"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="admin-avatar">{adminName.charAt(0).toUpperCase()}</div>
                                {<span className="admin-profile-name">{adminName}</span>}
                            </button>

                            {profileOpen && (
                                <div className="admin-profile-dropdown">
                                    <div className="admin-dropdown-header">
                                        <strong>{adminName}</strong>
                                        <small>{adminEmail}</small>
                                    </div>
                                    <hr />
                                    <button onClick={() => { navigate('/admin/settings'); setProfileOpen(false); }} className="flex items-center gap-2">
                                        <Settings size={16} /> Settings
                                    </button>
                                    <button onClick={handleLogout} className="flex items-center gap-2">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
