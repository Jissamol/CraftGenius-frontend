import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Resolve product image the same way ProductWidgetGrid does
const getImg = (product) =>
  product?.primary_image_url ||
  product?.images?.[0]?.image ||
  product?.image ||
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80';

const FeaturedCollection = ({ collection }) => {
  if (!collection) return null;

  return (
    <div className="w-full mb-16 relative overflow-hidden rounded-[35px] bg-[#E8DDD4]/20 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F7F6F2] to-transparent z-0" />
      
      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-bold uppercase tracking-widest text-[#8A6A55] mb-4">Featured Collection</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1F1F1F] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {collection.title}
            </h2>
            <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-md leading-relaxed">
              {collection.description}
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-fit"
            >
              <Link
                to="/customer/marketplace"
                className="px-8 py-4 bg-[#8A6A55] text-white rounded-full font-semibold flex items-center gap-2 shadow-[0_10px_20px_rgba(138,106,85,0.2)] hover:bg-[#725745] transition-colors"
              >
                Explore Collection <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Images (Overlapping) */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 relative min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-8 right-8 lg:right-24 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-white"
          >
            <img 
              src={getImg(collection.products?.[0])}
              alt={collection.products?.[0]?.name || 'Collection item 1'}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-8 left-8 lg:left-12 w-3/5 h-3/5 rounded-3xl overflow-hidden shadow-xl z-20 border-4 border-white"
          >
            <img 
              src={getImg(collection.products?.[1])}
              alt={collection.products?.[1]?.name || 'Collection item 2'}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Decorative Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#B7C4B0]/40 blur-3xl rounded-full -z-10" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;
