import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Client side filtering for responsiveness
        const filtered = data.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to top 5
        
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-brand-900/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-brand-800/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto backdrop-blur-xl"
            >
              {/* Search Input Area */}
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/50 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, categories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-white/30"
                />
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Results Area */}
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {query.length > 0 && query.length < 2 && (
                  <div className="p-6 text-center text-white/50">Type at least 2 characters to search...</div>
                )}
                
                {query.length >= 2 && results.length === 0 && !isLoading && (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-white/70">No products found for "{query}"</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-2">
                    {results.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-white/50 px-2 py-0.5 rounded-full bg-white/5">
                              {product.category}
                            </span>
                            <span className="text-sm font-bold text-violet-400">
                              ${product.price}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
