import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Search, ChevronDown, LogOut, User } from 'lucide-react';
import NotificationBell from './NotificationBell';

function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const userName = localStorage.getItem('name') || 'Handicrafter';
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const close = () => { setProfileOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-50 shadow-sm">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Greeting */}
      <div className="hidden sm:block min-w-0">
        <h2 className="text-sm font-semibold text-gray-900 leading-tight truncate">
          Welcome back, {userName}
        </h2>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar */}
      <div className={`hidden md:flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-1.5 transition-all duration-200 ${
          searchFocused ? 'border-[#8A6A55] ring-2 ring-[#E8DDD4] bg-white' : 'border-gray-200'
      }`}>
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search products, orders…"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-48"
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        title={darkMode ? 'Light mode' : 'Dark mode'}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Notifications */}
      <NotificationBell />

      {/* Profile avatar dropdown */}
      <div className="relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setProfileOpen(p => !p)}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 rounded bg-[#1F1F1F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">{userName.split(' ')[0]}</span>
          <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{localStorage.getItem('email') || 'contact@example.com'}</p>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => navigate('/handicrafter/profile')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <User size={14} className="text-gray-400" /> My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium mt-1"
              >
                <LogOut size={14} className="text-red-500" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
