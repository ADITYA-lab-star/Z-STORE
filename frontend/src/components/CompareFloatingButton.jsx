import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "../context/CompareContext";
import { X, Layers } from "lucide-react";
import ProductComparison from "./ProductComparison";

const CompareFloatingButton = () => {
  const { compareItems, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);

  if (compareItems.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-white text-brand-900 font-bold shadow-[0_10px_30px_-5px_rgba(255,255,255,0.4)] hover:scale-105 transition-all"
        >
          <Layers className="w-5 h-5" />
          Compare ({compareItems.length})
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-brand-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-brand-900/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-[#00F0FF]" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                    Product Comparison
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearCompare();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 bg-[#0B0E14] text-white">
                <ProductComparison products={compareItems} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompareFloatingButton;
