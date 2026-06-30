import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Zap, Sparkles } from "lucide-react";

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImages = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const scrollToFeatured = () => {
    const el = document.getElementById("featured-products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFlashSale = () => {
    const el = document.getElementById("flash-sale");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-brand-900 text-brand-light min-h-[92vh] flex items-center pt-24">
      {/* Animated gradient backdrop */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 opacity-80 animate-gradient-shift mix-blend-screen pointer-events-none"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(120deg, var(--color-brand-900) 0%, #170b2e 25%, #051937 50%, #170b2e 75%, var(--color-brand-900) 100%)",
            backgroundSize: "300% 300%",
          }}
        />
      </motion.div>

      {/* Floating blobs */}
      <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[100px] animate-blob pointer-events-none" />
      <div
        className="absolute top-1/3 -right-24 h-[480px] w-[480px] rounded-full bg-cyan-500/15 blur-[100px] animate-blob pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <motion.div
          className="lg:col-span-7 flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-light/90">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              New collection · Summer 2026
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Curated tech.
            <br />
            <span
              className="bg-clip-text text-transparent animate-shine"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #fff 0%, #c4b5fd 25%, #67e8f9 50%, #c4b5fd 75%, #fff 100%)",
                backgroundSize: "200% auto",
              }}
            >
              Designed to obsess.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg sm:text-xl text-brand-light/60 leading-relaxed font-light"
          >
            Handpicked devices and accessories from the world's most coveted brands. Engineered for performance, built to last, priced to move.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={scrollToFeatured}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-900 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_15px_50px_-10px_rgba(196,181,253,0.6)]"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button 
              onClick={scrollToFlashSale}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-medium text-white/90 hover:bg-white/10 hover:border-white/30 transition-all duration-300 active:scale-95"
            >
              <Zap className="h-4 w-4 fill-current text-[#00F0FF]" />
              Active Deals
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-10 max-w-md border-t border-white/10 mt-4"
          >
            {[
              { v: "120k+", l: "Happy customers" },
              { v: "4.9", l: "Average rating", icon: <Star className="h-3 w-3 inline text-yellow-400 ml-1" /> },
              { v: "48h", l: "Express delivery" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold tracking-tight text-white flex items-center">
                  {s.v} {s.icon}
                </div>
                <div className="text-xs text-white/50 mt-1 font-medium">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating product showcase */}
        <motion.div
          style={{ y: yImages }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative h-[480px] sm:h-[560px]"
        >
          {/* Glow */}
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-500/30 blur-[80px]" />

          {/* Main card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-[4/5] rounded-[2rem] border border-white/15 bg-brand-800/40 backdrop-blur-3xl p-6 flex flex-col justify-between shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] animate-float-slow cursor-pointer" onClick={scrollToFeatured}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">
                Featured
              </span>
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-white">
                NEW
              </span>
            </div>
            
            <div className="relative flex-1 flex items-center justify-center">
              <img
                src="/headphone.png"
                alt="Aurora Pro Headphones"
                className="relative z-10 h-56 w-56 object-contain drop-shadow-[0_20px_40px_rgba(139,92,246,0.4)] transition-transform duration-700 hover:scale-110"
              />
            </div>

            <div>
              <div className="text-sm text-white/50 font-medium mb-1">Aurora Pro · 2026</div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white">$1,299</div>
                <div className="text-xs font-semibold text-cyan-400">In stock</div>
              </div>
            </div>
          </div>

          {/* Floating small cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute top-10 right-0 w-48 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4 shadow-2xl animate-float-slower"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Studio Buds</div>
                <div className="text-[10px] text-cyan-400 font-medium mt-0.5">+12% this week</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-12 -left-4 w-52 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4 shadow-2xl animate-float-slow"
          >
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
              Free shipping
            </div>
            <div className="text-sm font-bold text-white mt-1">
              On every order over $99
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-brand-900 pointer-events-none" />
    </section>
  );
};

export default Hero;
