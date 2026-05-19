import React from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";

const Cpcard = ({ product, onRemove, index = 0 }) => {
  const handleRemove = () => {
    if (onRemove) onRemove(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col sm:flex-row items-center justify-between bg-brand-800/40 border border-white/10 rounded-[1.5rem] p-4 sm:p-5 w-full backdrop-blur-md hover:border-white/20 transition-colors shadow-lg"
    >
      {/* Product Image */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[1rem] bg-gradient-to-br from-white/5 to-black/30 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center p-4">
        <img
          src={product?.image || "/vite.svg"}
          alt={product?.name || "Product"}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="sm:ml-6 flex-1 w-full mt-4 sm:mt-0 flex flex-col justify-center">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 line-clamp-1">
              {product?.name || "Product Name"}
            </h2>
            <p className="text-sm text-brand-light/50 line-clamp-1 mb-2">
              {product?.description || "Premium quality item."}
            </p>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              In Stock
            </span>
          </div>
          
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-lg font-bold text-white tracking-tight">
              ${product?.price || "0.00"}
            </div>
          </div>
        </div>

        {/* Quantity + Actions */}
        <div className="flex items-center justify-between sm:justify-start gap-4 mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-light/50 uppercase tracking-widest">
              Qty
            </span>
            <div className="flex items-center rounded-lg border border-white/10 bg-black/20">
              <button className="px-2.5 py-1.5 text-white/50 hover:text-white transition-colors">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white">
                {product?.quantity || 1}
              </span>
              <button className="px-2.5 py-1.5 text-white/50 hover:text-white transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-400/80 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
          
          <div className="sm:hidden text-lg font-bold text-white tracking-tight ml-auto">
            ${product?.price || "0.00"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cpcard;
