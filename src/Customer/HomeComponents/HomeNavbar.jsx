import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const HomeNavbar = ({ cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50 w-full mb-8"
    >
      <div className="mx-auto bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <Link to="/customer/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1F1F1F] to-[#3B2B25] flex items-center justify-center text-white font-serif italic font-bold group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-serif font-bold text-xl text-[#1F1F1F] tracking-wide hidden sm:block">CraftGenius</span>
          </Link>
        </div>

        {/* Center: Sidebar Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link to="/customer/home" className="text-[#1F1F1F] hover:text-[#8A6A55] transition-colors">Home</Link>
          <Link to="/customer/marketplace" className="hover:text-[#8A6A55] transition-colors">Marketplace</Link>
          <Link to="/customer/orders" className="hover:text-[#8A6A55] transition-colors">My Orders</Link>
          <Link to="/customer/wishlist" className="hover:text-[#8A6A55] transition-colors">Wishlist</Link>
          <Link to="/customer/reviews" className="hover:text-[#8A6A55] transition-colors">Reviews</Link>
        </div>

        {/* Right: Search, Cart, Profile, Logout */}
        <div className="flex items-center gap-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.search.value.trim();
              if (val) {
                navigate(`/customer/marketplace?search=${encodeURIComponent(val)}`);
              } else {
                navigate(`/customer/marketplace`);
              }
            }}
            className="relative hidden xl:block w-48 mr-2"
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              name="search"
              type="text" 
              placeholder="Search crafts..." 
              className="w-full bg-[#F7F6F2] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8DDD4] transition-shadow"
            />
          </form>

          <Link to="/customer/cart" className="relative flex items-center gap-2 text-gray-600 hover:text-[#1F1F1F] transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100/50">
            <FiShoppingCart size={20} />
            <span className="font-bold text-sm hidden sm:block">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8A6A55] text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

          <Link to="/customer/profile">
            <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden cursor-pointer hover:border-[#8A6A55] transition-colors shadow-sm">
              <img src={`https://ui-avatars.com/api/?name=${localStorage.getItem('userName') || 'User'}&background=E8DDD4&color=8A6A55`} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </Link>

          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors ml-2" title="Logout">
            <FiLogOut size={20} />
          </button>
        </div>

      </div>
    </motion.nav>
  );
};

export default HomeNavbar;
