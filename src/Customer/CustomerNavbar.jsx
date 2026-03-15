import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Api from '../services/Api';
import { Menu, Sun, Moon, ShoppingCart, LogOut } from 'lucide-react';
import './CustomerNavbar.css';

function CustomerNavbar({ onToggle }) {
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Customer';
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        Api.get('cart/').then(res => {
            setCartCount(res.data.total_items || 0);
        }).catch(() => { });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="cust-navbar">
            <div className="cust-navbar-container">
                <button className="cust-menu-toggle" onClick={onToggle}>
                    <Menu size={24} />
                </button>

                <div className="cust-navbar-right">
                    <button className="cust-theme-toggle" onClick={toggleTheme}>
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button className="cust-cart-btn" onClick={() => navigate('/customer/cart')}>
                        <ShoppingCart size={18} />
                        {cartCount > 0 && <span className="cust-cart-badge">{cartCount}</span>}
                    </button>

                    <div className="cust-user-pill">
                        <div className="cust-user-avatar">{userName.charAt(0).toUpperCase()}</div>
                        <span className="cust-user-name">{userName}</span>
                    </div>

                    <button className="cust-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );

}

export default CustomerNavbar;
