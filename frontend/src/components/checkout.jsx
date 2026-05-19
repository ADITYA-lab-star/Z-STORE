import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";

const Checkout = ({ total, cartCount }) => {
  const shipping = total > 0 ? 10 : 0;
  const grandTotal = total + shipping;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full flex flex-col gap-6"
    >
      <div className="w-full bg-brand-800/50 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 sm:p-8 flex flex-col gap-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Checkout</h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure Encrypted
          </div>
        </div>
        
        <form className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/20"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-1">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/20"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-1">
              Shipping Address
            </label>
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/20"
              placeholder="123 Innovation Drive, Tech City, 10001"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-1">
              Payment Method
            </label>
            <div className="relative">
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                required
              >
                <option value="card" className="bg-brand-900 text-white">Credit/Debit Card</option>
                <option value="crypto" className="bg-brand-900 text-white">Crypto (USDC / ETH)</option>
                <option value="applepay" className="bg-brand-900 text-white">Apple Pay</option>
              </select>
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
            </div>
          </div>
        </form>
      </div>

      <div className="w-full bg-gradient-to-br from-violet-600/10 to-cyan-500/10 rounded-[2rem] border border-white/10 p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md">
        <h3 className="text-xl font-bold text-white tracking-tight">Order Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-brand-light/60">Items ({cartCount || 0})</span>
            <span className="font-semibold text-white">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-brand-light/60">Shipping</span>
            <span className="font-semibold text-white">${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-brand-light/60">Taxes</span>
            <span className="font-semibold text-white">Calculated at checkout</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ${grandTotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          className="w-full py-4 mt-2 bg-white text-brand-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-light hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)]"
        >
          <Lock className="h-4 w-4" />
          Pay ${grandTotal.toFixed(2)}
        </button>
        <p className="text-center text-[10px] text-brand-light/40 uppercase tracking-widest mt-1">
          By clicking pay, you agree to our terms.
        </p>
      </div>
    </motion.div>
  );
};

export default Checkout;
