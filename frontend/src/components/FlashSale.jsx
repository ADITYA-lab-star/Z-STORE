import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Zap, ShoppingCart } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const CountdownTimer = ({ endTimeString, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const end = new Date(endTimeString).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft(0);
        onExpire();
        return false;
      }
      setTimeLeft(Math.floor(diff / 1000));
      return true;
    };

    if (!updateTimer()) return;

    const interval = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimeString, onExpire]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isUnder5Mins = timeLeft > 0 && timeLeft < 300;

  if (timeLeft === 0) {
    return <div className="text-lg font-bold text-rose-500 font-mono tracking-wider ml-2 mt-0.5">00:00:00</div>;
  }

  return (
    <div 
      className={`text-lg font-bold font-mono tracking-wider transition-colors duration-300 ml-2 mt-0.5 ${
        isUnder5Mins ? 'text-rose-500 animate-pulse' : 'text-[#00F0FF]'
      }`}
    >
      {formatTime(timeLeft)}
    </div>
  );
};

const FlashSale = () => {
  const [flashSale, setFlashSale] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/flash-sale/active`);
        if (res.ok) {
          const data = await res.json();
          // Verify it hasn't expired yet
          if (new Date(data.endTime).getTime() > Date.now()) {
            setFlashSale(data);
          }
        }
      } catch (err) {
        console.error("Failed to load flash sale", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  if (loading || !flashSale || !flashSale.productId) return null;

  const product = flashSale.productId;
  const msrp = product.price;
  const salePrice = msrp - (msrp * (flashSale.discountPercentage / 100));

  const handleATC = () => {
    if (isExpired || product.stock === 0) return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      _id: product._id,
      name: product.name,
      price: salePrice,
      description: product.description,
      image: product.image,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  // Mock progress based on stock (assuming 50 was total)
  const initialAssumedStock = 50; 
  const currentStock = product.stock;
  const claimedPercent = Math.min(100, Math.max(0, ((initialAssumedStock - currentStock) / initialAssumedStock) * 100));

  return (
    <section className="w-full bg-[#0B0E14] px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden z-10 border-b border-white/5">
       <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent" />
       
       <div className="max-w-7xl mx-auto">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7, ease: "easeOut" }}
           className="relative rounded-3xl border border-[#7000FF]/30 bg-[#121824]/80 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(112,0,255,0.15)] group"
         >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7000FF]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-0 items-stretch relative z-10">
               {/* Left: Image Column */}
               <div className="p-8 lg:p-12 flex items-center justify-center bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#7000FF]/5 to-transparent pointer-events-none" />
                 
                 <div className="relative w-full max-w-sm">
                   <div className="absolute inset-0 bg-[#00F0FF] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
                   <img 
                     src={product.image || "/hero-illustration.png"} 
                     alt={product.name} 
                     className="relative z-10 w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                     onError={(e) => { e.target.src = "/hero-illustration.png"; }}
                   />
                   
                   <motion.div 
                     initial={{ rotate: -12, scale: 0 }}
                     whileInView={{ scale: 1 }}
                     transition={{ type: "spring", delay: 0.3 }}
                     className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 z-20 bg-rose-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                   >
                     <Zap className="w-4 h-4 fill-white" /> Deal of the Day
                   </motion.div>
                 </div>
               </div>

               {/* Right: Content Column */}
               <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#0B0E14]/40">
                 <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                   <span className="text-[#00F0FF] font-semibold tracking-widest text-xs sm:text-sm uppercase bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-3 py-1 rounded-full">
                     Limited Time Offer
                   </span>
                   <div className="flex items-center text-white bg-black/50 px-4 py-2 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
                     <Timer className={`w-4 h-4 ${isExpired ? 'text-rose-500' : 'text-[#7000FF]'}`} />
                     <CountdownTimer endTimeString={flashSale.endTime} onExpire={() => setIsExpired(true)} />
                   </div>
                 </div>

                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-[1.1] tracking-tight">
                   {product.name}
                 </h2>
                 <p className="text-white/60 mb-8 text-base sm:text-lg leading-relaxed font-medium">
                   {product.description}
                 </p>

                 <div className="flex items-end flex-wrap gap-4 mb-10">
                   <div className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
                     ${isExpired ? msrp.toFixed(2) : salePrice.toFixed(2)}
                   </div>
                   {!isExpired && (
                     <>
                       <div className="text-xl text-white/40 line-through font-semibold mb-1.5">
                         ${msrp.toFixed(2)}
                       </div>
                       <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg text-sm font-bold mb-2.5">
                         Save {flashSale.discountPercentage}%
                       </div>
                     </>
                   )}
                 </div>

                 <div className="mb-8">
                   <div className="flex justify-between text-xs sm:text-sm font-semibold mb-3 uppercase tracking-wider">
                     <span className="text-white/60">Stock Remaining</span>
                     <span className="text-[#00F0FF]">{Math.round(claimedPercent)}% Claimed</span>
                   </div>
                   <div className="h-2.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                     <div className="h-full bg-gradient-to-r from-[#7000FF] to-[#00F0FF] rounded-full relative transition-all duration-1000" style={{ width: `${claimedPercent}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] animate-[shine_2s_infinite]" />
                     </div>
                   </div>
                   <p className="text-xs text-white/40 mt-3 font-medium flex items-center gap-2">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                     </span>
                     {currentStock === 0 ? "Sold Out!" : `Selling fast! Only ${currentStock} units left at this price`}
                   </p>
                 </div>

                 <button 
                   onClick={handleATC}
                   disabled={isExpired || currentStock === 0}
                   className={`w-full py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                     isExpired || currentStock === 0
                       ? "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
                       : added 
                         ? "bg-[#00F0FF] text-[#0B0E14] scale-[0.98]"
                         : "bg-white text-[#0B0E14] hover:bg-white/90 hover:shadow-[0_15px_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:scale-[0.98]"
                   }`}
                 >
                   {isExpired ? (
                     "Sale Ended"
                   ) : currentStock === 0 ? (
                     "Sold Out"
                   ) : added ? (
                     <>
                       <Check className="w-6 h-6" /> Added to Cart
                     </>
                   ) : (
                     <>
                       <ShoppingCart className="w-6 h-6" /> Claim Deal Now
                     </>
                   )}
                 </button>
               </div>
            </div>
         </motion.div>
       </div>
    </section>
  );
};

export default FlashSale;
