import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, ShoppingBag, HeartPulse } from "lucide-react";

const AnimatedCounter = ({ from, to, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * (to - from) + from));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{count}</span>;
};

const stats = [
  { id: 1, label: "Happy Customers", value: 10, suffix: "K+", icon: <Users className="h-6 w-6 text-violet-400" /> },
  { id: 2, label: "Orders Delivered", value: 50, suffix: "K+", icon: <ShoppingBag className="h-6 w-6 text-cyan-400" /> },
  { id: 3, label: "Satisfaction Rate", value: 99, suffix: "%", icon: <HeartPulse className="h-6 w-6 text-rose-400" /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Statistics = () => {
  return (
    <section className="w-full py-24 relative z-10 bg-brand-900 border-t border-white/5 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="relative group p-8 rounded-[2rem] bg-brand-800/40 border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden hover:border-white/10 transition-colors"
            >
              {/* Subtle hover gradient inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
              </div>
              
              <div className="flex items-baseline text-5xl font-bold tracking-tighter text-white mb-2 font-display">
                <AnimatedCounter from={0} to={stat.value} duration={2.5} />
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent ml-1">
                  {stat.suffix}
                </span>
              </div>
              
              <div className="text-sm font-semibold tracking-wider text-brand-light/50 uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;
