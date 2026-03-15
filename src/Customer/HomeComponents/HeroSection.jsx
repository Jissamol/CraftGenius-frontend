import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HeroSection = ({ featuredProduct, onImageLoad }) => {
  if (!featuredProduct) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-[35px] animate-pulse">
        <div className="text-gray-400 font-medium">Loading Featured Experience...</div>
      </div>
    );
  }

  // Use primary_image_url from ProductSerializer, fall back to first image in images array
  const productImage =
    featuredProduct.primary_image_url ||
    featuredProduct.images?.[0]?.image ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80";

  const rating = featuredProduct.average_rating
    ? parseFloat(featuredProduct.average_rating).toFixed(1)
    : null;
  const reviewCount = featuredProduct.total_orders || 0;

  return (
    <div className="relative w-full h-auto min-h-[500px] lg:h-[600px] rounded-[35px] overflow-hidden mb-8 bg-[#F7F6F2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
      {/* Background Decorative Elements */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#E8DDD4]/40 to-[#DCE8F2]/40 blur-[80px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#B7C4B0]/30 to-[#F7F6F2]/30 blur-[60px] pointer-events-none"
      />

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center p-8 lg:p-16">
        {/* Left Content Area */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center pr-0 lg:pr-12 mb-10 lg:mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white text-xs font-semibold tracking-wider uppercase text-[#8A6A55] shadow-sm">
                Featured Product
              </span>
              {featuredProduct.category_name && (
                <span className="px-4 py-1.5 rounded-full bg-[#E8DDD4]/60 border border-[#C7B8AA]/40 text-xs font-semibold tracking-wider uppercase text-[#8A6A55]">
                  {featuredProduct.category_name}
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-[#1F1F1F] leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {featuredProduct.name || "Handcrafted Elegance"}
            </h1>
            
            <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-md leading-relaxed font-medium">
              {featuredProduct.description
                ? featuredProduct.description.slice(0, 160) + (featuredProduct.description.length > 160 ? '...' : '')
                : "Discover the perfect blend of traditional craftsmanship and modern design. Each piece is uniquely created to bring warmth to your space."}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link to={`/customer/product/${featuredProduct.id}`}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#1F1F1F] text-white rounded-full font-semibold flex items-center gap-2 shadow-[0_10px_20px_rgba(31,31,31,0.2)] hover:bg-[#333] transition-colors"
                >
                  View Product <FiArrowRight />
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-md border border-gray-100 hover:text-red-500 hover:border-red-100 transition-colors"
              >
                <FiHeart size={20} />
              </motion.button>
            </div>

            {rating && (
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200/60">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1,2,3,4,5].map(star => (
                    <FiStar key={star} className={parseFloat(rating) >= star ? 'fill-current' : 'fill-current text-yellow-400/30'} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">{rating}</span>
                {reviewCount > 0 && <span className="text-sm text-gray-500">({reviewCount} orders)</span>}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Image Area */}
        <div className="w-full lg:w-1/2 h-[300px] lg:h-full relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative w-[80%] h-[120%] lg:w-[90%] lg:h-[130%]"
          >
            {/* Soft shadow under image */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-black/10 blur-xl rounded-full" />
            
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src={productImage} 
              alt={featuredProduct.name}
              className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-10 relative"
              onLoad={onImageLoad}
            />
            
            {/* Floating Price Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-1/4 -left-4 lg:-left-12 bg-white/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-white/50 z-20"
            >
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Price</div>
              <div className="text-xl font-bold text-[#1F1F1F]">₹{parseFloat(featuredProduct.price).toLocaleString('en-IN')}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
