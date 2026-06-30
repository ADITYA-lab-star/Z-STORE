import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Heart, Star, X, Layers } from "lucide-react";
import { API_BASE_URL } from "../utils/api";
import { useCompare } from "../context/CompareContext";
import LiveStockCounter from "./LiveStockCounter";

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(product);
  const productId = product?._id || product?.id;
  const { toggleCompare, compareItems } = useCompare();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.includes(productId));
  }, [productId]);

  useEffect(() => {
    setProductDetails(product);
  }, [product]);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    if (!productId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to load product details");
      }
      const data = await response.json();
      setProductDetails(data);
    } catch (error) {
      console.error("Product view update failed:", error);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      setIsWishlisted(false);
    } else {
      wishlist.push(productId);
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleATC = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      _id: productId,
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

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#0B0E14] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white transition-colors border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-[#121824] to-black p-8 sm:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,0,255,0.15),transparent_70%)] pointer-events-none" />
              <img
                src={productDetails?.image || product?.image || "/imac.png"}
                alt={productDetails?.name || product?.name || "Product"}
                className="relative z-10 w-full h-auto max-h-[400px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.target.src = "/imac.png"; }}
              />
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-between bg-[#0B0E14]/80 overflow-y-auto">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00F0FF] bg-[#00F0FF]/10 px-3 py-1 rounded-full border border-[#00F0FF]/20">
                      {productDetails?.category || "Tech"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/70">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{productDetails?.rating || 4.9} / 5.0</span>
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(productDetails);
                    }}
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all border ${
                      compareItems.find((p) => (p._id || p.id) === productId)
                        ? "bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/50"
                        : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    {compareItems.find((p) => (p._id || p.id) === productId) ? "Comparing" : "Compare"}
                  </button>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4 leading-tight">
                  {productDetails?.name || product?.name || "Product Name"}
                </h2>
                <p className="text-white/60 leading-relaxed font-medium text-base sm:text-lg mb-8">
                  {productDetails?.description ||
                    product?.description ||
                    "Premium build with timeless design and unmatched performance. Experience the next generation of technology with seamless integration."}
                </p>

                {/* Real-time stock counter inside modal */}
                {productDetails && (
                  <div className="mb-6">
                    <LiveStockCounter productId={productId} initialStock={productDetails.stock} />
                  </div>
                )}

                {/* Mock Variants */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">
                    Available Editions
                  </h4>
                  <div className="flex gap-3">
                    <button className="h-10 w-10 rounded-full border-2 border-[#00F0FF] bg-slate-900 shadow-[0_0_15px_rgba(0,240,255,0.3)]"></button>
                    <button className="h-10 w-10 rounded-full border-2 border-white/10 bg-slate-200 hover:border-white/50 transition-colors"></button>
                    <button className="h-10 w-10 rounded-full border-2 border-white/10 bg-[#7000FF] hover:border-white/50 transition-colors"></button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-4">
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">
                    Total Price
                  </div>
                  <div className="text-4xl font-bold text-white tracking-tight">
                    ${productDetails?.price ?? product?.price ?? "0.00"}
                  </div>
                </div>
                <button
                  onClick={handleATC}
                  className={`flex h-14 items-center justify-center gap-3 rounded-full px-8 font-bold transition-all duration-300 active:scale-95 ${
                    added
                      ? "bg-[#00F0FF] text-[#0B0E14]"
                      : "bg-white text-[#0B0E14] hover:bg-white/90 hover:shadow-[0_10px_30px_-5px_rgba(255,255,255,0.4)]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.article
        onClick={handleOpenModal}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group relative w-full max-w-[320px] rounded-[2rem] border border-white/10 bg-[#121824]/40 backdrop-blur-xl p-5 overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_-20px_rgba(112,0,255,0.2)] hover:border-white/20 transition-all duration-500 cursor-pointer"
      >
        {/* Aurora hover glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(400px circle at 50% 0%, rgba(112,0,255,0.15), transparent 70%)",
          }}
        />

        {/* Image Container */}
        <div className="relative rounded-[1.5rem] overflow-hidden aspect-square bg-gradient-to-br from-white/[0.04] to-black/40 border border-white/5 mb-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,240,255,0.15),transparent_60%)] pointer-events-none" />
          <motion.img
            src={product?.image || "/imac.png"}
            alt={product?.name || "Product"}
            loading="lazy"
            className="relative z-10 h-full w-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => { e.target.src = "/imac.png"; }}
          />
          {product?.stock === 0 ? (
            <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              Sold Out
            </span>
          ) : product?.stock <= 10 ? (
            <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              Low Stock
            </span>
          ) : (
            <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              In stock
            </span>
          )}
          <button
            aria-label="Add to wishlist"
            onClick={handleWishlist}
            className={`absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:scale-110 transition-all duration-300 ${
              isWishlisted ? "text-rose-500" : "text-white/70 hover:text-rose-400"
            }`}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded-full border border-[#00F0FF]/20">
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

          <p className="text-sm text-white/50 leading-relaxed line-clamp-2 min-h-[2.5rem] font-medium">
            {product?.description ||
              "Premium build with timeless design and unmatched performance."}
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
                  ? "bg-[#00F0FF] text-[#0B0E14]"
                  : "bg-white text-[#0B0E14] hover:bg-white/90 hover:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.3)] hover:scale-105"
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

      {createPortal(modalContent, document.body)}
    </>
  );
};

export default ProductCard;
