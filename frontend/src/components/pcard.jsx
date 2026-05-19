import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Heart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);

  const handleATC = (e) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      _id: product?._id,
      name: product?.name,
      price: product?.price,
      description: product?.description,
      image: product?.image,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative w-full max-w-[320px] rounded-[2rem] border border-white/10 bg-brand-800/40 backdrop-blur-xl p-5 overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_-20px_rgba(124,58,237,0.3)] hover:border-white/20 transition-all duration-500"
    >
      {/* Aurora hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(400px circle at 50% 0%, rgba(124,58,237,0.15), transparent 70%)",
        }}
      />

      {/* Image Container */}
      <div className="relative rounded-[1.5rem] overflow-hidden aspect-square bg-gradient-to-br from-white/[0.04] to-black/40 border border-white/5 mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.2),transparent_60%)]" />
        <motion.img
          src={product?.image || "/vite.svg"}
          alt={product?.name || "Product"}
          loading="lazy"
          className="relative z-10 h-full w-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          In stock
        </span>
        <button
          aria-label="Add to wishlist"
          className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-rose-400 hover:scale-110 transition-all duration-300"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {product?.category || "Tech"}
            </span>
            <div className="flex items-center gap-1 text-xs text-white/70 shrink-0">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.9</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
            {product?.name || "Product Name"}
          </h3>
        </div>

        <p className="text-sm text-brand-light/50 leading-relaxed line-clamp-2 min-h-[2.5rem] font-medium">
          {product?.description || "Premium build with timeless design and unmatched performance."}
        </p>

        <div className="flex items-end justify-between pt-4 mt-2 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">
              Price
            </span>
            <span className="text-2xl font-bold text-white tracking-tight">
              ${product?.price || "0.00"}
            </span>
          </div>
          
          <button
            onClick={handleATC}
            className={`relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 active:scale-95 ${
              added
                ? "bg-cyan-500 text-brand-900"
                : "bg-white text-brand-900 hover:bg-brand-light hover:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.3)] hover:scale-105"
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;

