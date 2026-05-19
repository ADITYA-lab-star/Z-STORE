import React from "react";
import { Hexagon, MessageCircle, Globe, Share2, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full relative bg-brand-900 pt-20 pb-10 border-t border-white/10 overflow-hidden z-10">
      {/* Background Glows */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter - Span 4 */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 text-brand-light font-bold tracking-tight text-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg">
                <Hexagon className="h-6 w-6 text-white fill-white/20" />
              </div>
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Z-STORE
              </span>
            </Link>
            <p className="text-sm text-brand-light/60 leading-relaxed max-w-sm">
              Curating the future of technology. Premium devices, unmatched performance, and timeless design.
            </p>
            
            <div className="mt-2 flex flex-col gap-3">
              <span className="text-xs font-semibold text-white uppercase tracking-widest">Subscribe</span>
              <div className="relative max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/30 backdrop-blur-sm"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white text-brand-900 flex items-center justify-center hover:bg-brand-light transition-colors hover:scale-105">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Links Grid - Span 8 */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Products</h4>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Audio</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Wearables</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Computing</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Accessories</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Company</h4>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">About Us</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Careers</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Press</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Blog</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Support</h4>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Help Center</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Shipping</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Returns</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Contact Us</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Legal</h4>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="#" className="text-sm text-brand-light/60 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-brand-light/40">
            © {new Date().getFullYear()} Z-STORE. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
              <Share2 className="h-4 w-4" />
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
