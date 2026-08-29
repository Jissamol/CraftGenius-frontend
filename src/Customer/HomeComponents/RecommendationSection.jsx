import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const RecommendationSection = ({ recommendations }) => {
  // Guard: ensure recommendations is always an array before rendering
  const items = Array.isArray(recommendations) ? recommendations : [];
  if (items.length === 0) return null;

  return (
    <div className="w-full mb-16 relative">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <div className="w-12 h-1 bg-[#1F1F1F] rounded-full mb-6" />
        <h2 className="text-3xl font-bold text-[#1F1F1F] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Chosen For You
        </h2>
        <p className="text-gray-500 font-medium">Personalized recommendations based on your taste</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            {/* Card Container */}
            <div className="w-full bg-[#F7F6F2] rounded-[24px] p-3 shadow-sm border border-white/60 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:bg-white overflow-hidden">
              
              {/* Image Area */}
              <div className="w-full h-48 md:h-56 rounded-[16px] overflow-hidden relative mb-4">
                <img 
                  src={product.primary_image_url || product.images?.[0]?.image || "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80"} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm z-10">
                  <FiHeart size={14} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                  <button className="w-full py-2.5 bg-white/95 backdrop-blur-md text-[#1F1F1F] font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#1F1F1F] hover:text-white transition-colors">
                    <FiShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>

              {/* Info Area */}
              <div className="px-2 pb-2 text-center">
                <Link to={`/customer/product/${product.id}`}>
                  <h3 className="text-base font-bold text-[#1F1F1F] mb-1 hover:text-[#8A6A55] transition-colors truncate">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-[#8A6A55]">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <FiStar className="fill-yellow-400 text-yellow-400" />
                    {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "New"}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
