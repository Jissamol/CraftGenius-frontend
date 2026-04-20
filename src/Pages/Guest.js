import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { FaInstagram, FaPinterestP } from "react-icons/fa";

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
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=900&q=90",
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
// Bento-style asymmetric layout: big image, overlapping text, small accent cards

function Hero() {
  return (
    <section className="w-full bg-[#F7F6F2] pt-6 px-5 lg:px-10 pb-0 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-12 grid-rows-[auto] gap-3">

        {/* ── Big Headline Block */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-end pb-8 pt-12 lg:pt-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-5">
              India's finest handcraft marketplace
            </p>
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tight text-[#1F1F1F] mb-8" style={{ fontFamily: "'Georgia', serif" }}>
              Art<br/>
              Made<br/>
              <span className="italic font-normal text-[#6B5A4B]">by Hand.</span>
            </h1>
            <p className="text-base text-gray-500 max-w-xs mb-10 leading-relaxed">
              Every piece on CraftGenius is handmade by a real person, in a real place, using a skill passed down for generations.
            </p>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white text-sm font-bold px-7 py-3.5 hover:bg-[#3B2B25] transition-colors group">
              Start Exploring
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Large Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="col-span-12 lg:col-span-7 relative overflow-hidden"
          style={{ height: "clamp(340px, 55vh, 680px)" }}
        >
          <img
            src="https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1400&q=90"
            alt="Artisan at work"
            className="w-full h-full object-cover"
          />
          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-6 left-6 bg-[#F7F6F2] px-5 py-4 shadow-xl"
          >
            <p className="text-3xl font-black text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>1,200+</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mt-0.5">Verified Artisans</p>
          </motion.div>
        </motion.div>

        {/* ── Bottom Strip: accent cards */}
        <div className="col-span-12 grid grid-cols-3 gap-3 mt-0">
          {[
            { val: "50,000+", label: "Pieces sold" },
            { val: "28", label: "States covered" },
            { val: "100%", label: "Handmade guarantee" },
          ].map((s) => (
            <motion.div
              key={s.val}
              whileHover={{ y: -4, borderColor: "#C9B49A" }}
              transition={{ duration: 0.2 }}
              className="border border-gray-200 bg-white px-5 py-5"
            >
              <p className="text-2xl font-black text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>{s.val}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED PICKS (Staggered mosaic) ─────────────────────────────────────

function FeaturedPicks() {
  return (
    <section id="featured" className="py-24 px-5 lg:px-10 max-w-screen-2xl mx-auto scroll-mt-20">
      <Reveal className="flex items-baseline justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>
            Featured Picks
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Handpicked by our curators this week</p>
        </div>
        <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-[#1F1F1F] border-b border-[#1F1F1F] pb-0.5 hover:text-[#6B5A4B] hover:border-[#6B5A4B] transition-colors">
          See all
        </Link>
      </Reveal>

      {/* Asymmetric 3-column mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Large item */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:row-span-2 group cursor-pointer"
        >
          <div className="overflow-hidden" style={{ height: "clamp(380px,60vh,700px)" }}>
            <img
              src={featuredItems[0].image}
              alt={featuredItems[0].name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </div>
          <div className="mt-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] bg-[#EDE6DC] px-2 py-0.5 mr-2">{featuredItems[0].tag}</span>
              <h3 className="text-xl font-bold text-[#1F1F1F] mt-2">{featuredItems[0].name}</h3>
              <p className="text-sm text-gray-500 italic mt-0.5">{featuredItems[0].artisan} — {featuredItems[0].location}</p>
            </div>
            <span className="text-xl font-bold text-[#1F1F1F] ml-4 shrink-0">{featuredItems[0].price}</span>
          </div>
        </motion.div>

        {/* Supporting pieces in a balanced two-row grid */}
        {featuredItems.slice(1).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (i + 1) * 0.12 }}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden" style={{ height: "clamp(200px,28vh,340px)" }}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
            </div>
            <div className="mt-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] bg-[#EDE6DC] px-2 py-0.5">{item.tag}</span>
                <h3 className="text-lg font-bold text-[#1F1F1F] mt-2">{item.name}</h3>
                <p className="text-sm text-gray-500 italic mt-0.5">{item.artisan}</p>
              </div>
              <span className="text-lg font-bold text-[#1F1F1F] ml-4 shrink-0">{item.price}</span>
            </div>
          </motion.div>
        ))}
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
      <div className="px-5 lg:px-10 max-w-screen-2xl mx-auto mb-10 flex items-baseline justify-between">
        <h2 className="text-3xl font-black text-[#1F1F1F]" style={{ fontFamily: "'Georgia', serif" }}>
          Shop by Craft
        </h2>
        <p className="text-sm text-gray-500">Scroll →</p>
      </div>

      {/* Horizontally scrollable row on mobile, grid on desktop */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-5 lg:px-10 scrollbar-none lg:grid lg:grid-cols-5 lg:overflow-visible"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group cursor-pointer shrink-0 w-52 lg:w-auto"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="overflow-hidden aspect-[3/4]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
              />
            </div>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[#1F1F1F]">{cat.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── ARTISAN FEATURE BANNER ──────────────────────────────────────────────────

function ArtisanBanner() {
  return (
    <section id="artisans" className="w-full bg-[#1F1F1F] overflow-hidden scroll-mt-20">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ minHeight: 400 }}>
          <img
            src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=900&q=85"
            alt="Artisan crafting"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col justify-center px-10 py-16 lg:px-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">Artisan Spotlight</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            Sell what you<br /><span className="italic font-normal text-[#C9B49A]">create.</span>
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-sm">
            Join over 1,200 artisans already selling on CraftGenius. Zero listing fees. Direct payments. Real buyers who value real craft.
          </p>
          <Link to="/register" className="self-start inline-flex items-center gap-2 border border-white text-white text-sm font-bold px-7 py-3.5 hover:bg-white hover:text-[#1F1F1F] transition-colors group">
            Become a Seller
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
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
    <div className="min-h-screen my-6 mx-4 md:mx-8 lg:mx-12 bg-[#F7F6F2] text-[#1F1F1F] overflow-x-hidden">
      <Marquee />
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