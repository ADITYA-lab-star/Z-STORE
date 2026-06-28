import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./pcard";
import { API_BASE_URL } from "../utils/api";

const Trending = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [filters, setFilters] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the top 10 trending products from our new backend logic
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/trending`);
        const data = await response.json();
        setTrendingProducts(data);

        // Dynamically extract and build our category filters based purely on the trending results
        const categories = new Set(data.map((p) => p.category));
        
        setFilters(["All", ...Array.from(categories)]);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const filteredProducts =
    activeFilter === "All"
      ? trendingProducts
      : trendingProducts.filter((p) => p.category === activeFilter);

  return (
    <section
      id="trending"
      className="w-full py-24 border-t border-white/5 relative z-10 overflow-hidden bg-brand-900"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
              Trending Now
            </h2>
            <p className="text-brand-light/60 max-w-md font-medium">
              Discover what's hot right now, ranked organically by live user
              views.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((f) => {
              const displayLabel = f.toUpperCase();
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 border ${
                    activeFilter === f
                      ? "border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105"
                      : "border-white/10 text-brand-light/50 hover:text-white hover:border-white/30"
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-4">
          {isLoading ? (
            <div className="w-full py-12 flex justify-center items-center">
              <div className="animate-pulse font-bold uppercase tracking-widest text-brand-light/50 text-xl">
                Loading Trends...
              </div>
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="w-full py-12 flex justify-center items-center text-brand-light/50">
              No trending products found.
            </div>
          ) : (
            <div
              className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 -mx-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    // Robust key mapping to support MongoDB '_id'
                    key={product._id || product.id}
                    className="shrink-0 snap-center first:pl-4"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Trending;
