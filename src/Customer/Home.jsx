import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  fetchCategories,
  fetchFeaturedProduct,
  fetchTrendingProducts,
  fetchFeaturedCollection,
  fetchRecommendations,
  fetchCart,
  fetchProducts,
} from '../services/homeApi';

// Import Components
import HeroSection from './HomeComponents/HeroSection';
import CategoryFilters from './HomeComponents/CategoryFilters';
import ProductWidgetGrid from './HomeComponents/ProductWidgetGrid';
import TrendingCarousel from './HomeComponents/TrendingCarousel';
import FeaturedCollection from './HomeComponents/FeaturedCollection';
import RecommendationSection from './HomeComponents/RecommendationSection';
import LuxuryFooter from './HomeComponents/LuxuryFooter';

/* ── Fisher-Yates shuffle (returns a new array) ── */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CustomerHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState('All');

  const [data, setData] = useState({
    categories: [],
    featuredProduct: null,
    allProducts: [],       // used for category filtering
    trendingProducts: [],  // default trending (no filter)
    featuredCollection: null,
    recommendations: [],
    cartCount: 0,
  });

  // Displayed products — changes when category is selected
  const [displayedProducts, setDisplayedProducts] = useState([]);

  /* ── Initial load ── */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          categories,
          featuredProduct,
          trendingProducts,
          featuredCollection,
          recommendations,
          cartData,
        ] = await Promise.all([
          fetchCategories(),
          fetchFeaturedProduct(),
          fetchTrendingProducts(),
          fetchFeaturedCollection(),
          fetchRecommendations(),
          fetchCart(),
        ]);

        const trending = shuffle(Array.isArray(trendingProducts) ? trendingProducts : []);
        const recs = shuffle(Array.isArray(recommendations) ? recommendations : []);

        // Pick a random product from trending as the hero featured product on each load
        const heroProduct = trending.length > 0
          ? trending[Math.floor(Math.random() * trending.length)]
          : (featuredProduct || null);

        // Shuffle products inside the featured collection so images rotate on each refresh
        const shuffledCollection = featuredCollection
          ? { ...featuredCollection, products: shuffle(featuredCollection.products || []) }
          : null;

        setData({
          categories: Array.isArray(categories) ? categories : [],
          featuredProduct: heroProduct,
          allProducts: trending,
          trendingProducts: trending,
          featuredCollection: shuffledCollection,
          recommendations: recs.slice(0, 4),
          cartCount: cartData?.total_items || 0,
        });

        setDisplayedProducts(trending);
      } catch (error) {
        console.error('Failed to load home page data', error);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    loadData();
  }, []);

  /* ── Category change handler ── */
  const handleCategoryChange = useCallback(
    async (categoryId, categoryName) => {
      setActiveCategoryId(categoryId);
      setActiveCategoryName(categoryName || 'All');
      setCategoryLoading(true);

      try {
        if (!categoryId) {
          // "All" selected — restore default trending products
          setDisplayedProducts(data.trendingProducts);
        } else {
          // Fetch products filtered by this category
          const filtered = await fetchProducts({ category: categoryId, page_size: 12 });
          setDisplayedProducts(Array.isArray(filtered) ? filtered : []);
        }
      } catch {
        setDisplayedProducts([]);
      } finally {
        setCategoryLoading(false);
      }
    },
    [data.trendingProducts]
  );

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F6F2]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1F1F1F] to-[#3B2B25] flex items-center justify-center text-white font-serif italic font-bold text-2xl"
        >
          C
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#FDFDFD] font-sans overflow-x-hidden"
    >
      {/* Noise Texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-50"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="w-full bg-white/40 backdrop-blur-3xl rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-white/80 p-4 sm:p-8 relative">

          <HeroSection featuredProduct={data.featuredProduct} onImageLoad={() => {}} />

          {/* Category Filters — pass both the callback and the categories list */}
          <CategoryFilters
            categories={data.categories}
            onCategoryChange={(id) => {
              const cat = data.categories.find(c => c.id === id);
              handleCategoryChange(id, cat?.name);
            }}
          />

          {/* Category-filtered products section */}
          {categoryLoading ? (
            <div className="w-full mb-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-100 rounded-[22px] h-72 animate-pulse" />
                ))}
              </div>
            </div>
          ) : displayedProducts.length === 0 && activeCategoryId ? (
            <div className="w-full mb-16 text-center py-16">
              <div className="text-5xl mb-4">🪴</div>
              <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">No products found</h3>
              <p className="text-gray-500">No handmade items available in <strong>{activeCategoryName}</strong> yet.</p>
            </div>
          ) : (
            <ProductWidgetGrid
              trendingProducts={displayedProducts}
              title={activeCategoryId ? activeCategoryName : 'Discover More'}
              subtitle={activeCategoryId ? `Handmade items in ${activeCategoryName}` : 'Curated selections just for you'}
            />
          )}

          <TrendingCarousel products={data.trendingProducts} />

          <FeaturedCollection collection={data.featuredCollection} />

          <RecommendationSection recommendations={data.recommendations} />

        </div>

        <LuxuryFooter />
      </div>
    </motion.div>
  );
};

export default CustomerHomePage;
