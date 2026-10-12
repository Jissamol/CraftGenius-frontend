import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiAward, FiStar, FiShoppingBag, FiHeart,
  FiCheck, FiShare2, FiClock, FiTool, FiBox, FiMessageCircle,
  FiArrowLeft, FiImage, FiMaximize2, FiX
} from 'react-icons/fi';
import Api from '../services/Api';

function ArtisanStorefront() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'story' | 'reviews'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [toast, setToast] = useState(null);
  const [activeWorkshopPhoto, setActiveWorkshopPhoto] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStorefront();
  }, [id, selectedCategory, sortOption]);

  const fetchStorefront = () => {
    setLoading(true);
    let url = `artisan/${id}/?sort=${sortOption}`;
    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }
    Api.get(url)
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Failed to load artisan:', err);
        setData(null);
      })
      .finally(() => setLoading(false));
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (productId) => {
    try {
      await Api.post('cart/add/', { product_id: productId, quantity: 1 });
      showToast('success', 'Added to cart! 🛒');
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to add to cart');
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await Api.post('wishlist/add/', { product_id: productId });
      showToast('success', 'Saved to wishlist ❤️');
    } catch {
      showToast('info', 'Already in your wishlist');
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1F1F1F] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium text-sm">Opening Artisan Studio...</p>
      </div>
    );
  }

  if (!data || !data.artisan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm my-8">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-3xl mb-4">🏺</div>
        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">Artisan Not Found</h2>
        <p className="text-gray-500 text-sm max-w-md mb-6">
          This artisan storefront may be inactive or does not exist. Explore our marketplace for authentic handcrafted creations.
        </p>
        <button
          onClick={() => navigate('/customer/marketplace')}
          className="px-6 py-3 bg-[#1F1F1F] text-white rounded-full font-bold text-sm hover:bg-[#333] transition-colors"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const { artisan, products, reviews, categories } = data;

  const techniquesList = artisan.techniques_used
    ? artisan.techniques_used.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const materialsList = artisan.materials_used
    ? artisan.materials_used.split(',').map(m => m.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen pb-16 space-y-8">
      {/* ── Navigation / Breadcrumb ── */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-400 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 hover:text-[#1F1F1F] transition-colors font-bold uppercase tracking-wider"
        >
          <FiArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Link to="/customer/marketplace" className="hover:text-[#1F1F1F]">Marketplace</Link>
          <span>/</span>
          <span className="text-[#1F1F1F] font-bold">Artisan Storefront</span>
        </div>
      </div>

      {/* ── HERO BANNER & PROFILE CARD ── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Wide Cover Banner */}
        <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden bg-gradient-to-r from-[#2c221e] via-[#48372f] to-[#1f1a18]">
          {artisan.cover_banner_url ? (
            <img
              src={artisan.cover_banner_url}
              alt={`${artisan.name} Banner`}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <span className="text-8xl select-none">🏺</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Specialty tag overlay on banner */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-[#1F1F1F] shadow-sm uppercase tracking-wider">
              {artisan.craft_specialty || 'Handcrafted Heritage'}
            </span>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-6 sm:px-10 pb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#FAF7F2] shrink-0">
                {artisan.profile_picture_url ? (
                  <img
                    src={artisan.profile_picture_url}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-[#F0EBE1]">
                    👨‍🎨
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight">
                    {artisan.name}
                  </h1>
                  {artisan.is_verified && (
                    <span
                      title="CraftGenius Certified Artisan"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                    >
                      <FiCheck size={12} className="stroke-[3]" /> Verified Artisan
                    </span>
                  )}
                </div>

                {artisan.workshop_headline && (
                  <p className="text-gray-600 font-medium text-sm">
                    {artisan.workshop_headline}
                  </p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-gray-400 flex-wrap pt-0.5">
                  {artisan.location && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <FiMapPin className="text-amber-700" /> {artisan.location}
                    </span>
                  )}
                  {artisan.years_of_experience > 0 && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <FiClock className="text-amber-700" /> {artisan.years_of_experience}+ Years Crafting
                    </span>
                  )}
                  <span>•</span>
                  <span>Joined {new Date(artisan.member_since).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions / Share */}
            <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('success', 'Storefront link copied to clipboard!');
                }}
                className="px-4 py-2.5 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiShare2 size={14} /> Share Shop
              </button>

              <button
                onClick={() => navigate('/customer/chat')}
                className="px-5 py-2.5 rounded-full bg-[#1F1F1F] text-white text-xs font-bold hover:bg-[#333] transition-colors flex items-center gap-2 shadow-sm"
              >
                <FiMessageCircle size={14} /> Inquire with Studio
              </button>
            </div>
          </div>

          {/* Short Bio */}
          {artisan.bio && (
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mb-6">
              {artisan.bio}
            </p>
          )}

          {/* Distinctive Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-gray-100">
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-gray-50 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                Creations
              </span>
              <p className="text-xl font-black text-[#1F1F1F]">{artisan.total_products}</p>
              <span className="text-[11px] text-gray-500">Handmade items</span>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-gray-50 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                Rating
              </span>
              <p className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
                <FiStar className="fill-amber-400 text-amber-400" size={18} /> {artisan.average_rating}
              </p>
              <span className="text-[11px] text-gray-500">{artisan.total_reviews} reviews</span>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-gray-50 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                Orders Fulfilled
              </span>
              <p className="text-xl font-black text-[#1F1F1F]">{artisan.fulfilled_orders}</p>
              <span className="text-[11px] text-gray-500">Happy collectors</span>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-gray-50 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                Certification
              </span>
              <p className="text-xs font-black text-emerald-700 flex items-center justify-center gap-1 mt-1">
                <FiAward size={16} /> Certified
              </p>
              <span className="text-[11px] text-gray-500">{artisan.badge_label || 'Master Artisan'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STOREFRONT NAVIGATION TABS ── */}
      <div className="flex border-b border-gray-200 gap-8 text-sm font-bold">
        {[
          { key: 'products', label: `Store Catalog (${products.length})` },
          { key: 'story',    label: 'Craft Story & Workshop' },
          { key: 'reviews',  label: `Customer Reviews (${reviews.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab.key ? 'text-[#1F1F1F]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F1F1F]"
              />
            )}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB 1: PRODUCT CATALOG ══════════════ */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls: Categories & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === ''
                    ? 'bg-[#1F1F1F] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#1F1F1F] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold shrink-0 self-end sm:self-auto">
              <span className="text-gray-400 uppercase tracking-wider">Sort:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1F1F1F]"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-400 text-sm">No creations found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div
                      onClick={() => navigate(`/customer/product/${product.id}`)}
                      className="relative h-56 bg-[#FAF7F2] overflow-hidden cursor-pointer"
                    >
                      {product.primary_image_url ? (
                        <img
                          src={product.primary_image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                      )}

                      {/* Stock badge */}
                      {product.stock <= 0 && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Sold Out
                        </span>
                      )}

                      {/* Wishlist quick button */}
                      <button
                        onClick={e => { e.stopPropagation(); addToWishlist(product.id); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-colors"
                      >
                        <FiHeart size={14} />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                        <span>{product.category_name}</span>
                        {product.average_rating > 0 && (
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <FiStar className="fill-amber-400 text-amber-400" size={12} /> {product.average_rating}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => navigate(`/customer/product/${product.id}`)}
                        className="font-bold text-[#1F1F1F] text-sm group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <p className="font-black text-base text-[#1F1F1F] pt-1">
                        ₹{parseFloat(product.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <div className="p-4 pt-0">
                    <button
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product.id)}
                      className="w-full py-2.5 rounded-xl bg-[#FAF7F2] text-[#1F1F1F] text-xs font-bold hover:bg-[#1F1F1F] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <FiShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ TAB 2: CRAFT STORY & WORKSHOP ══════════════ */}
      {activeTab === 'story' && (
        <div className="space-y-10">
          
          {/* Biography & Craft Story */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg font-bold">
                📜
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F1F1F]">Behind the Craft</h2>
                <p className="text-gray-400 text-xs">Heritage, philosophy, and handcrafting traditions</p>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              {artisan.craft_story ? (
                artisan.craft_story.split('\n').map((para, i) => (
                  para.trim() ? <p key={i}>{para}</p> : null
                ))
              ) : (
                <p className="italic text-gray-400">
                  {artisan.name} is a dedicated handicrafter devoted to traditional craftsmanship. Every piece reflects hours of devoted manual technique and raw material appreciation.
                </p>
              )}
            </div>

            {/* Techniques & Materials Showcase */}
            {(techniquesList.length > 0 || materialsList.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                {techniquesList.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <FiTool className="text-amber-700" /> Techniques & Methodology
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {techniquesList.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-gray-200 text-xs font-semibold text-gray-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {materialsList.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <FiBox className="text-amber-700" /> Sourced Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {materialsList.map((mat, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs font-semibold text-emerald-800">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Workshop & Studio Photos Gallery */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center text-lg">
                  📸
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1F1F1F]">Workshop & Studio Gallery</h2>
                  <p className="text-gray-400 text-xs">Authentic look into where the handcrafted magic happens</p>
                </div>
              </div>
            </div>

            {artisan.workshop_photos && artisan.workshop_photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artisan.workshop_photos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => setActiveWorkshopPhoto(photo)}
                    className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-video sm:aspect-square cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || 'Workshop'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      {photo.caption && (
                        <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>
                      )}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-800">
                        <FiMaximize2 size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-[#FAF9F6] rounded-2xl border border-dashed border-gray-200">
                <FiImage className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm font-semibold">Workshop photos being curated</p>
                <p className="text-gray-400 text-xs mt-1">Check back soon for studio behind-the-scenes photography.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ TAB 3: CUSTOMER REVIEWS ══════════════ */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1F1F1F]">Collector Feedback</h2>
              <p className="text-gray-400 text-xs">Authentic reviews from verified buyers</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600 flex items-center gap-1 justify-end">
                <FiStar className="fill-amber-400 text-amber-400" size={22} /> {artisan.average_rating}
              </span>
              <span className="text-xs text-gray-400 font-semibold">{artisan.total_reviews} total ratings</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">No reviews yet for this artisan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-5 bg-[#FAF9F6] rounded-2xl border border-gray-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#1F1F1F] block">{rev.customer_name}</span>
                      <span className="text-[11px] text-gray-400">On {rev.product_name}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {'⭐'.repeat(rev.rating)}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{rev.comment}</p>
                  )}

                  {rev.seller_reply && (
                    <div className="mt-3 p-3 bg-white border border-gray-200/80 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-[#1F1F1F] flex items-center gap-1.5">
                        💬 {artisan.name}'s Reply
                      </span>
                      <p className="text-gray-600 italic">"{rev.seller_reply}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Workshop Photo Lightbox Modal */}
      <AnimatePresence>
        {activeWorkshopPhoto && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setActiveWorkshopPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setActiveWorkshopPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors z-10"
              >
                <FiX size={18} />
              </button>
              <img
                src={activeWorkshopPhoto.image_url}
                alt=""
                className="w-full max-h-[75vh] object-contain bg-black"
              />
              {activeWorkshopPhoto.caption && (
                <div className="p-5 bg-white">
                  <p className="text-sm font-semibold text-[#1F1F1F]">{activeWorkshopPhoto.caption}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full text-xs font-bold tracking-wide shadow-2xl flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-[#1F1F1F] text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <FiCheck size={16} /> : '⚠️'}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ArtisanStorefront;
