import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Api from '../../services/Api';

const TrendingCarousel = ({ products }) => {
  const scrollRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = async (productId) => {
    try {
      await Api.post('cart/add/', { product_id: productId, quantity: 1 });
      showToast('success', 'Added to cart!');
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to add');
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mb-16 relative">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#1F1F1F] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Trending Now
          </h2>
          <p className="text-gray-500 font-medium">Most loved items this week</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:shadow-md transition-all"
          >
            ←
          </button>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-[#1F1F1F] shadow-sm flex items-center justify-center text-white hover:bg-[#333] hover:shadow-md transition-all"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 px-1 hide-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -8 }}
            className="flex-shrink-0 w-[260px] md:w-[300px] rounded-[24px] bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-gray-100 group relative"
          >
            {/* Image Container */}
            <div className="w-full h-[280px] rounded-[18px] overflow-hidden relative mb-4 bg-gray-50">
              <Link to={`/customer/product/${product.id}`}>
                <img 
                  src={product.primary_image_url || product.images?.[0]?.image || "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80"} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              
              {/* Floating Badges */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#8A6A55] shadow-sm">
                Artisan Made
              </div>
              
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:scale-110 transition-all shadow-sm">
                <FiHeart size={14} />
              </button>
              
              {/* Quick Add Overlay */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id); }}
                  className="w-full py-3 bg-white/95 backdrop-blur-xl text-[#1F1F1F] font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#1F1F1F] hover:text-white transition-colors"
                >
                  <FiShoppingBag size={16} /> Quick Add
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="px-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400 font-medium">{product.category_name || "Handcraft"}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                  <FiStar className="fill-yellow-400 text-yellow-400" />
                  {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "New"}
                </div>
              </div>
              <Link to={`/customer/product/${product.id}`}>
                <h3 className="text-lg font-bold text-[#1F1F1F] mb-1 hover:text-[#8A6A55] transition-colors truncate">
                  {product.name}
                </h3>
              </Link>
              <p className="text-base font-bold text-[#8A6A55]">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Toast Notification — rendered via portal to escape ancestor transforms */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 ${
                toast.type === 'success' ? 'bg-[#1F1F1F] text-white' : 'bg-red-600 text-white'
              }`}
            >
              {toast.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default TrendingCarousel;
