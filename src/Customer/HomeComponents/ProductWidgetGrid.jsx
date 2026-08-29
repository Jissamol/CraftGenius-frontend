import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Api from '../../services/Api';

const ProductWidgetGrid = ({ trendingProducts, title = 'Discover More', subtitle = 'Curated selections just for you' }) => {
  const [toast, setToast] = useState(null);

  const products = Array.isArray(trendingProducts) ? trendingProducts : [];

  if (products.length === 0) return null;

  // Pick up to 4 products for the grid
  const featured = products.slice(0, 4);

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

  const getImage = (p) =>
    p.primary_image_url || p.images?.[0]?.image ||
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80';

  const formatPrice = (p) =>
    parseFloat(p).toLocaleString('en-IN');

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    return [1, 2, 3, 4, 5].map(s => (
      <FiStar
        key={s}
        size={12}
        className={r >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="w-full mb-16">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2
            className="text-3xl font-bold text-[#1F1F1F] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h2>
          <p className="text-gray-500 font-medium">{subtitle}</p>
        </div>
        <Link
          to="/customer/marketplace"
          className="text-sm font-semibold text-[#8A6A55] hover:text-black flex items-center gap-1 transition-colors"
        >
          View All <FiArrowRight />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product, idx) => (
          <motion.div
            key={product.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
            className="group bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative"
          >
            {/* Image */}
            <div className="w-full h-52 overflow-hidden relative bg-[#F7F6F2]">
              <Link to={`/customer/product/${product.id}`}>
                <img
                  src={getImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                />
              </Link>

              {/* Wishlist */}
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm z-10">
                <FiHeart size={14} />
              </button>

              {/* Category badge */}
              {product.category_name && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-[#8A6A55] uppercase tracking-wide shadow-sm">
                  {product.category_name}
                </div>
              )}

              {/* Quick Add on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id); }}
                  className="w-full py-2.5 bg-white/95 backdrop-blur-md text-[#1F1F1F] font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#1F1F1F] hover:text-white transition-colors"
                >
                  <FiShoppingBag size={14} /> Quick Add
                </button>
              </div>

            </div>

            {/* Info */}
            <div className="p-4">
              <Link to={`/customer/product/${product.id}`}>
                <h3 className="text-sm font-bold text-[#1F1F1F] mb-1 truncate hover:text-[#8A6A55] transition-colors">
                  {product.name}
                </h3>
              </Link>
              {product.seller_name && (
                <p className="text-xs text-gray-400 mb-2">by {product.seller_name}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#1F1F1F]">
                  ₹{formatPrice(product.price)}
                </span>
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    {renderStars(product.average_rating)}
                    <span className="text-xs text-gray-500 ml-1">
                      {parseFloat(product.average_rating).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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

export default ProductWidgetGrid;
