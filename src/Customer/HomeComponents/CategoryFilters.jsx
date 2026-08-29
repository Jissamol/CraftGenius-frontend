import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CategoryFilters = ({ categories, onCategoryChange }) => {
  const scrollRef = useRef(null);
  const [activeId, setActiveId] = useState(null); // null = "All"

  useEffect(() => {
    // Notify parent of initial selection (null = all products)
    if (onCategoryChange) onCategoryChange(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!categories || categories.length === 0) return null;

  const handleSelect = (id) => {
    setActiveId(id);
    if (onCategoryChange) onCategoryChange(id);
  };

  const allCategories = [{ id: null, name: 'All' }, ...categories];

  return (
    <div className="relative w-full mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#1F1F1F]">Explore Categories</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-black hidden md:flex"
          >
            ←
          </button>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-black hidden md:flex"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Pills */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 pb-4 px-1 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <motion.button
              key={cat.id ?? 'all'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(cat.id)}
              className={`relative flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-[#1F1F1F] text-white shadow-lg shadow-black/20'
                  : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:border-gray-300'
              }`}
            >
              <span className="font-semibold text-sm whitespace-nowrap">{cat.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#1F1F1F] rounded-full -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CategoryFilters;
