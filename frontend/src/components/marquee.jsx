import React from "react";
import { motion } from "framer-motion";

const brands = [
  "Apple", "Sony", "Nike", "Samsung", "Bose", "Stripe", "Vercel", "Logitech", "Nintendo", "Canon"
];

// Duplicate for seamless infinite scrolling
const marqueeItems = [...brands, ...brands, ...brands];

const Marquee = () => {
  return (
    <section className="w-full py-16 relative z-10 bg-brand-900 border-t border-white/5 overflow-hidden">
      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-900 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-900 to-transparent z-20 pointer-events-none" />

      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex whitespace-nowrap items-center gap-16 px-8"
        >
          {marqueeItems.map((brand, idx) => (
            <div
              key={idx}
              className="text-2xl md:text-3xl font-extrabold tracking-widest text-white/20 uppercase hover:text-white/40 transition-colors duration-300"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
            >
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Marquee;
