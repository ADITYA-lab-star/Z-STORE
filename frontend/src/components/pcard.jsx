import React, { useState } from "react";

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);

  const handleATC = () => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article
      className="group relative w-full max-w-[300px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-4 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:border-white/25 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_-20px_rgba(139,92,246,0.45)]"
    >
      {/* Aurora hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, rgba(167,139,250,0.22), transparent 60%)",
        }}
      />

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-white/[0.06] to-black/30 border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.25),transparent_60%)]" />
        <img
          src={product?.image || "imac.png"}
          alt={product?.name || "Product"}
          loading="lazy"
          className="relative z-10 h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-1"
        />
        <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur border border-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/90 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          In stock
        </span>
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/15 text-white/80 hover:text-rose-400 hover:scale-110 transition-all duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-1.5 pt-5 pb-1 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white tracking-tight truncate">
            {product?.name || "Product Name"}
          </h3>
          <div className="flex items-center gap-1 text-xs text-white/70 shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15">
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-medium">4.9</span>
          </div>
        </div>

        <p className="text-sm text-white/55 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {product?.description || "Premium build with timeless design."}
        </p>

        <div className="flex items-end justify-between pt-3 mt-1 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              Price
            </span>
            <span className="text-2xl font-semibold text-white tracking-tight">
              ${product?.price || "0.00"}
            </span>
          </div>
          <button
            onClick={handleATC}
            className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-95 ${
              added
                ? "bg-emerald-400 text-black"
                : "bg-white text-black hover:bg-white hover:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.4)] hover:scale-105"
            }`}
          >
            {added ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

