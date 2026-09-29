import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { FaInstagram, FaPinterestP } from "react-icons/fa";
import { ArcGalleryHero } from "../components/ui/arc-gallery-hero-component";

// ─── DATA ────────────────────────────────────────────────────────────────────

const marqueeItems = [
  "Free shipping on orders over ₹999",
  "Handmade by master artisans",
  "100% authentic craft",
  "Shop thousands of unique pieces",
  "New arrivals every week",
];

const featuredItems = [
  {
    id: 1,
    name: "Terracotta Serving Bowl",
    artisan: "Meera Nair",
    location: "Jaipur, Rajasthan",
    price: "₹1,450",
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&q=90",
  },
  {
    id: 2,
    name: "Woven Silk Shawl",
    artisan: "Ananya Rao",
    location: "Varanasi, UP",
    price: "₹3,800",
    tag: "New",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=90",
  },
  {
    id: 3,
    name: "Dhokra Tribal Figurine",
    artisan: "Ramesh Baiga",
    location: "Bastar, Chhattisgarh",
    price: "₹2,100",
    tag: "One of a kind",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=90",
  },
  {
    id: 4,
    name: "Hand-Carved Wooden Tray",
    artisan: "Arjun Mistry",
    location: "Saharanpur, UP",
    price: "₹1,850",
    tag: "Hand carved",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=90",
  },
  {
    id: 5,
    name: "Indigo Block-Print Textile",
    artisan: "Kavita Sharma",
    location: "Bagru, Rajasthan",
    price: "₹2,600",
    tag: "Limited edition",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=90",
  },
];

const categories = [
  { name: "Pottery", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85" },
  { name: "Jewelry", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85" },
  { name: "Textiles", image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=700&q=85" },
  { name: "Woodwork", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=85" },
  { name: "Paintings", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=85" },
];

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

function Reveal({ children, className = "", delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Marquee() {
  const track = [...marqueeItems, ...marqueeItems];
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full overflow-hidden bg-[#1F1F1F] py-2.5">
      <motion.div
        className="flex whitespace-nowrap"
        animate={shouldReduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {track.map((item, i) => (
          <span key={i} className="text-xs font-medium text-[#F7F6F2] uppercase tracking-[0.15em] px-8">
            {item} <span className="text-gray-500 mx-4">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <div className="bg-[#F7F6F2] sticky top-0 z-50 border-b border-gray-200 transition-shadow duration-300" style={{ boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none" }}>
        <div className="max-w-screen-2xl mx-auto px-5 lg:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-4 h-4 text-[#1F1F1F]" />
            <span className="text-xl font-black tracking-tight text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>
              CraftGenius
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            <a href="#featured" className="hover:text-[#1F1F1F] transition-colors">Shop</a>
            <a href="#artisans" className="hover:text-[#1F1F1F] transition-colors">Artisans</a>
            <a href="#about" className="hover:text-[#1F1F1F] transition-colors">About</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-[#1F1F1F] transition-colors">
                Sign in
              </Link>
              
            </div>
            <button
              className="md:hidden text-[#1F1F1F]"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
        <div className="fixed inset-0 z-[60] flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="w-72 bg-[#F7F6F2] h-full flex flex-col p-8"
          >
            <button onClick={() => setOpen(false)} className="mb-10 self-end text-gray-500" aria-label="Close navigation menu">
              <X className="w-5 h-5" />
            </button>
            <nav className="flex flex-col gap-6 text-2xl font-black tracking-tight text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>
              <a href="#featured" className="text-left" onClick={() => setOpen(false)}>Shop</a>
              <a href="#artisans" className="text-left" onClick={() => setOpen(false)}>Artisans</a>
              <a href="#about" className="text-left" onClick={() => setOpen(false)}>About</a>
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <Link to="/login" className="text-center border border-[#1F1F1F] py-3 text-sm font-semibold">Sign In</Link>
              <Link to="/register" className="text-center bg-[#1F1F1F] text-white py-3 text-sm font-semibold">Join Free</Link>
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
// Arc Gallery Hero Layout

function Hero() {
  const existingProductImages = [
    ...featuredItems.map(item => item.image),
    ...categories.map(cat => cat.image)
  ];

  return (
    <section className="w-full bg-[#F7F6F2] max-w-screen-2xl mx-auto overflow-hidden">
      <ArcGalleryHero images={existingProductImages}>
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B5A4B] mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#6B5A4B]"></span>
            CraftGenius Marketplace
            <span className="w-8 h-[2px] bg-[#6B5A4B]"></span>
          </p>
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[1.05] tracking-tight text-[#1F1F1F] mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            Discover the Art <br />
            Behind Every <span className="italic font-normal text-[#6B5A4B]">Creation.</span>
          </h1>
          <p className="text-base md:text-lg text-[#1F1F1F]/75 max-w-xl mb-10 leading-relaxed font-medium bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
            Explore unique handmade creations from talented artisans and find something truly made for you. Let AI help you discover pieces that match your style.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white text-sm font-bold px-8 py-4 rounded-full shadow-xl shadow-black/15 hover:bg-[#3B2B25] transition-all group">
                Explore Products
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="#artisans" className="inline-flex items-center gap-2 bg-white text-[#1F1F1F] text-sm font-bold px-8 py-4 rounded-full shadow-lg border border-gray-200 hover:border-gray-300 transition-all">
                Meet Our Artisans
              </a>
            </motion.div>
          </div>
        </motion.div>
      </ArcGalleryHero>
    </section>
  );
}

// ─── FEATURED PICKS (Premium Layout) ─────────────────────────────────────────

function FeaturedPicks() {
  return (
    <section id="featured" className="py-24 px-5 lg:px-10 max-w-screen-2xl mx-auto scroll-mt-20">
      <Reveal className="flex items-baseline justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>
            Curated For You
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Handpicked by our experts this week</p>
        </div>
        <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-[#1F1F1F] border-b border-[#1F1F1F] pb-0.5 hover:text-[#6B5A4B] hover:border-[#6B5A4B] transition-colors">
          View Collection
        </Link>
      </Reveal>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Large Featured Item */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:w-2/3 group cursor-pointer relative overflow-hidden rounded-[2.5rem] shadow-xl border border-gray-100 min-h-[500px] lg:min-h-[700px] flex flex-col justify-end"
        >
          <img
            src={featuredItems[0].image}
            alt={featuredItems[0].name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 p-8 lg:p-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1F1F1F] bg-white px-4 py-2 rounded-full mb-4 inline-block shadow-lg">
              {featuredItems[0].tag}
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
              <div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                  {featuredItems[0].name}
                </h3>
                <p className="text-white/90 font-medium text-lg flex items-center gap-2 drop-shadow">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  {featuredItems[0].artisan} <span className="text-white/50">•</span> {featuredItems[0].location}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl px-6 py-3 rounded-2xl shrink-0">
                <span className="text-2xl font-bold text-white drop-shadow-md">{featuredItems[0].price}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side: List of horizontal cards */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          {featuredItems.slice(1).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group cursor-pointer bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex items-center gap-5 flex-1"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B5A4B] bg-[#F7F6F2] px-2 py-1 rounded-full">
                  {item.tag}
                </span>
                <h4 className="text-lg font-bold text-[#1F1F1F] truncate mt-2">{item.name}</h4>
                <p className="text-sm text-gray-500 font-medium truncate mt-0.5">{item.artisan}</p>
                <div className="mt-2 font-bold text-[#1F1F1F]">{item.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FULL BLEED DIVIDER ───────────────────────────────────────────────────────

function TextDivider() {
  return (
    <div className="bg-[#EDE6DC] py-16 px-5 lg:px-10 overflow-hidden">
      <p className="text-center text-2xl md:text-4xl font-black text-[#1F1F1F] leading-snug max-w-3xl mx-auto" style={{ fontFamily: "'Georgia', serif" }}>
        "Supporting a CraftGenius artisan means supporting a <span className="italic font-normal">family, a tradition,</span> and an entire community."
      </p>
    </div>
  );
}

// ─── CATEGORIES (Horizontal scroll) ─────────────────────────────────────────

function Categories() {
  const scrollRef = useRef(null);

  return (
    <section className="py-24 bg-[#F7F6F2]">
      <div className="px-5 lg:px-10 max-w-screen-2xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B5A4B] mb-3">Explore Collections</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>
            Shop by Craft
          </h2>
        </div>
        <div className="flex items-center gap-2 hidden md:flex">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Swipe to explore</p>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <span className="text-gray-400">→</span>
          </motion.div>
        </div>
      </div>

      {/* Horizontally scrollable row on mobile, grid on desktop */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 px-5 lg:px-10 scrollbar-none lg:grid lg:grid-cols-5 lg:overflow-visible"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative group cursor-pointer shrink-0 w-64 lg:w-auto overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Image container */}
            <div className="aspect-[3/4] w-full bg-gray-200">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

            {/* Text & Icon Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="text-lg lg:text-xl font-bold uppercase tracking-widest text-white mb-1">{cat.name}</h3>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EDE6DC]">Explore</span>
                <ArrowUpRight className="w-3 h-3 text-[#EDE6DC]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── ARTISAN FEATURE BANNER ──────────────────────────────────────────────────

function ArtisanBanner() {
  return (
    <section id="artisans" className="w-full bg-[#F7F6F2] py-24 px-5 lg:px-10 scroll-mt-20">
      <div className="max-w-screen-2xl mx-auto bg-[#EDE6DC] rounded-[3rem] overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-10 py-16 lg:px-24">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B5A4B] mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#6B5A4B]"></span>
            Artisan Spotlight
          </p>
          <h2 className="text-5xl lg:text-6xl font-black text-[#1F1F1F] leading-[1.05] mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            Sell what you<br /><span className="italic font-normal text-[#6B5A4B]">create.</span>
          </h2>
          <p className="text-[#1F1F1F]/75 mb-10 leading-relaxed max-w-md text-lg">
            Join over 1,200 artisans already selling on CraftGenius. Zero listing fees. Direct payments. Real buyers who value real craft.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="self-start">
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white text-sm font-bold px-8 py-4 rounded-full shadow-lg shadow-black/10 hover:bg-[#3B2B25] transition-all group">
              Become a Seller
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Image */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-[600px] p-6 lg:p-10 flex items-center justify-center">
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85"
              alt="Artisan painting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="about" className="bg-[#F7F6F2] border-t border-gray-200 scroll-mt-20">
      <div className="max-w-screen-2xl mx-auto px-5 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-[#1F1F1F]" />
            <span className="text-xl font-black tracking-tight text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>CraftGenius</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
            India's home for authentic handmade goods. Direct from the artisan, to your door.
          </p>
          <div className="flex gap-4 text-gray-400">
            <FaInstagram className="w-5 h-5 hover:text-[#1F1F1F] cursor-pointer transition-colors" />
            <FaPinterestP className="w-5 h-5 hover:text-[#1F1F1F] cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Shop</p>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><button className="hover:text-[#1F1F1F] transition-colors">All Products</button></li>
            <li><button className="hover:text-[#1F1F1F] transition-colors">Artisans</button></li>
            <li><button className="hover:text-[#1F1F1F] transition-colors">New Arrivals</button></li>
            <li><button className="hover:text-[#1F1F1F] transition-colors">Gift Cards</button></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Help</p>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><button className="hover:text-[#1F1F1F] transition-colors">About Us</button></li>
            <li><button className="hover:text-[#1F1F1F] transition-colors">Contact</button></li>
            <li><button className="hover:text-[#1F1F1F] transition-colors">Shipping Info</button></li>
            <li><button className="hover:text-[#1F1F1F] transition-colors">Returns</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 px-5 lg:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
        <p>© 2026 CraftGenius Pvt. Ltd. — Made in India 🇮🇳</p>
        <div className="flex gap-6">
          <button className="hover:text-[#1F1F1F] transition-colors">Privacy</button>
          <button className="hover:text-[#1F1F1F] transition-colors">Terms</button>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Guest() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1F1F1F]">
      <Navbar />
      <Hero />
      <FeaturedPicks />
      <TextDivider />
      <Categories />
      <ArtisanBanner />
      <Footer />
    </div>
  );
}