/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { FiInstagram, FiTwitter, FiFacebook, FiArrowRight } from 'react-icons/fi';

const LuxuryFooter = () => {
  return (
    <footer className="w-full bg-[#1F1F1F] text-[#F7F6F2] rounded-[35px] mt-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8A6A55]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B7C4B0]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-serif italic font-bold">C</div>
              <span className="font-serif font-bold text-xl tracking-wide">CraftGenius</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              A premium marketplace connecting master artisans with those who appreciate authentic, handcrafted luxury.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Shop</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">All Categories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Featured Artisans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trending Now</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-4">Subscribe to our newsletter for early access to new collections.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 w-10 bg-white text-[#1F1F1F] rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 CraftGenius. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;
