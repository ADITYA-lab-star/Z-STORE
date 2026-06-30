import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Watch, Laptop, Mouse, Smartphone, Camera, X } from "lucide-react";
import ProductCard from "./pcard";
import { API_BASE_URL } from "../utils/api";

const categories = [
  { id: 1, name: "Audio", icon: <Headphones className="h-8 w-8" />, desc: "Headphones & Earbuds", color: "from-violet-500/20 to-fuchsia-500/20", border: "group-hover:border-violet-500/50" },
  { id: 2, name: "Wearables", icon: <Watch className="h-8 w-8" />, desc: "Smartwatches & Trackers", color: "from-cyan-500/20 to-blue-500/20", border: "group-hover:border-cyan-500/50" },
  { id: 3, name: "Computing", icon: <Laptop className="h-8 w-8" />, desc: "Laptops & Desktops", color: "from-emerald-500/20 to-teal-500/20", border: "group-hover:border-emerald-500/50" },
  { id: 4, name: "Accessories", icon: <Mouse className="h-8 w-8" />, desc: "Keyboards & Mice", color: "from-rose-500/20 to-orange-500/20", border: "group-hover:border-rose-500/50" },
  { id: 5, name: "Mobile", icon: <Smartphone className="h-8 w-8" />, desc: "Phones & Tablets", color: "from-blue-500/20 to-indigo-500/20", border: "group-hover:border-blue-500/50" },
  { id: 6, name: "Creation", icon: <Camera className="h-8 w-8" />, desc: "Cameras & Gear", color: "from-amber-500/20 to-yellow-500/20", border: "group-hover:border-amber-500/50" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products specific to the selected category dynamically
  useEffect(() => {
    if (!activeCategory) return;
    
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const allProducts = await response.json();
        
        // Filter dynamically on the client for rapid UI response
        const filtered = allProducts.filter(
          p => p.category.toLowerCase() === activeCategory.name.toLowerCase()
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [activeCategory]);

  return (
    <section id="categories" className="w-full py-24 bg-brand-900 relative z-10">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-800/30 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Shop by <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-brand-light/60 max-w-2xl">
            Explore our meticulously organized collections. Click any category to reveal top products instantly.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {categories.map((cat) => {
            const isActive = activeCategory?.id === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative flex flex-col items-center text-center p-6 rounded-3xl backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? `bg-brand-800 shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-white/20 scale-105`
                    : `bg-brand-800/40 border border-white/5 ${cat.border}`
                }`}
              >
                {/* Legacy Colorful Gradient Retained */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`} />
                
                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 mb-4 ${
                  isActive 
                    ? 'bg-white/20 border-white/30 scale-110 text-white' 
                    : 'bg-white/5 border-white/10 text-white group-hover:bg-white/10 group-hover:scale-110'
                }`}>
                  {cat.icon}
                </div>
                
                <h3 className="relative z-10 text-lg font-bold text-white mb-1">
                  {cat.name}
                </h3>
                <p className="relative z-10 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                  {cat.desc}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Innovative Spotlight Expansion Drawer */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="w-full bg-brand-800/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 relative shadow-2xl overflow-hidden">
                {/* Background ambient glow matching category */}
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${activeCategory.color} rounded-full blur-3xl opacity-20 pointer-events-none`} />
                
                {/* Close Button */}
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activeCategory.color}`}>
                    {activeCategory.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Top in {activeCategory.name}</h3>
                    <p className="text-sm text-white/50">Handpicked selections just for you.</p>
                  </div>
                </div>

                <div className="relative z-10">
                  {isLoading ? (
                    <div className="w-full py-12 flex justify-center items-center">
                      <div className="animate-pulse text-white/50 font-bold uppercase tracking-widest text-lg">
                        Loading {activeCategory.name}...
                      </div>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="w-full py-12 flex justify-center items-center text-white/30 text-base font-medium">
                      No products found in this category yet.
                    </div>
                  ) : (
                    <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                      {products.map((product) => (
                        <div key={product._id} className="shrink-0 snap-center w-[280px] sm:w-[320px]">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Categories;
