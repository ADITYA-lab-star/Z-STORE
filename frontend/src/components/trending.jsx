import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./pcard";

const filters = ["All", "Audio", "Wearables", "Accessories", "Computing"];

const dummyTrending = [
  { id: 1, name: "Studio Pro Headphones", price: "349", category: "Audio", description: "Immersive sound with active noise cancellation.", image: "/vite.svg" },
  { id: 2, name: "Ultra Smartwatch 3", price: "299", category: "Wearables", description: "Advanced health tracking and cellular connectivity.", image: "/vite.svg" },
  { id: 3, name: "Minimalist Keyboard", price: "129", category: "Accessories", description: "Mechanical precision in a sleek aluminum body.", image: "/vite.svg" },
  { id: 4, name: "Aura Laptop 14\"", price: "1499", category: "Computing", description: "Power meets portability. Next-gen silicon inside.", image: "/vite.svg" },
  { id: 5, name: "Wireless Earbuds", price: "199", category: "Audio", description: "Crystal clear calls and rich bass.", image: "/vite.svg" },
];

const Trending = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = activeFilter === "All" 
    ? dummyTrending 
    : dummyTrending.filter(p => p.category === activeFilter);

  return (
    <section id="trending" className="w-full py-24 bg-brand-900 border-t border-white/5 relative z-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Trending <span className="text-cyan-400">Now</span>
            </h2>
            <p className="text-brand-light/60 max-w-md">
              Discover what's hot right now. The most loved tech of the season.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-white text-brand-900 shadow-md"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-4">
          <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 -mx-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="shrink-0 snap-center first:pl-4"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-brand-900 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default Trending;
