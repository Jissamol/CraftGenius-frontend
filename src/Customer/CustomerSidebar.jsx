import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Store, Package, Heart, Star, User, Palette, LogOut } from 'lucide-react';
import './CustomerSidebar.css';

const menuItems = [
    { path: 'home', icon: Home, label: 'Home' },
    { path: 'marketplace', icon: Store, label: 'Marketplace' },
    { path: 'orders', icon: Package, label: 'My Orders' },
    { path: 'wishlist', icon: Heart, label: 'Wishlist' },
    { path: 'reviews', icon: Star, label: 'Reviews' },
    { path: 'profile', icon: User, label: 'Profile' },
];

function CustomerSidebar({ collapsed, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        if (window.innerWidth <= 768) onClose();
    };

    const handleNavClick = () => {
        if (window.innerWidth <= 768) onClose();
    };

    return (
        <aside className={`cust-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="cust-sidebar-logo">
                <span className="cust-logo-icon"><Palette size={28} /></span>
                {!collapsed && <span className="cust-logo-text">CraftGenius</span>}
            </div>

            <nav className="cust-sidebar-nav">
                {menuItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={`/customer/${item.path}`}
                        className={({ isActive }) => `cust-nav-item ${isActive ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        <span className="cust-nav-icon"><item.icon size={20} /></span>
                        {!collapsed && <span className="cust-nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <button className="cust-nav-item cust-logout" onClick={handleLogout}>
                <span className="cust-nav-icon"><LogOut size={20} /></span>
                {!collapsed && <span className="cust-nav-label">Logout</span>}
            </button>
        </aside>
    );
}


export default CustomerSidebar;
