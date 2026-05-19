import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, Zap, Fingerprint, ArrowRight } from "lucide-react";
import ProductCard from "./pcard";

const aiPicks = [
  { id: 101, name: "Neural Sync Earbuds", price: "249", category: "Audio", description: "AI-adaptive noise cancellation that learns your environment.", image: "/vite.svg" },
  { id: 102, name: "Quantum Display Pro", price: "899", category: "Computing", description: "Holographic lightfield display with eye-tracking.", image: "/vite.svg" },
  { id: 103, name: "Aero Drone X", price: "599", category: "Creation", description: "Autonomous flight paths powered by computer vision.", image: "/vite.svg" },
];

const AiRecommendations = () => {
  const [status, setStatus] = useState("idle"); // idle, generating, ready

  const handleGenerate = () => {
    setStatus("generating");
    setTimeout(() => {
      setStatus("ready");
    }, 2500); // Simulate AI generation
  };

  return (
    <section id="ai-picks" className="w-full py-24 relative z-10 overflow-hidden bg-brand-900">
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-300 mb-6 backdrop-blur-md"
          >
            <Cpu className="h-3.5 w-3.5" />
            Z-Brain Engine
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Personalized via <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI Engine</span>
          </h2>
          <p className="text-brand-light/60 max-w-2xl">
            Our predictive AI analyzes your style and viewing history to curate the perfect tech setup just for you.
          </p>
          
          {status === "idle" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              className="mt-8 group relative inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <Sparkles className="h-5 w-5 relative z-10" />
              <span className="relative z-10">AI Picks For You</span>
            </motion.button>
          )}
        </div>

        {/* Dynamic Content Area */}
        <div className="relative min-h-[400px] w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {status === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Futuristic Loader */}
                <div className="relative w-full max-w-md aspect-[2/1] rounded-3xl border border-white/10 bg-brand-800/50 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden shadow-2xl">
                  {/* Scanning line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                  
                  <div className="relative">
                    <Fingerprint className="h-16 w-16 text-cyan-400/50 animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl animate-pulse" />
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <h3 className="text-white font-semibold tracking-wide flex items-center gap-2">
                      <Zap className="h-4 w-4 text-violet-400" />
                      Analyzing Preferences...
                    </h3>
                    <div className="w-48 h-1.5 bg-brand-900 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 animate-[progress_2.5s_ease-in-out_forwards]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "ready" && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative"
              >
                {/* Premium Dashboard glowing border wrapper */}
                <div className="relative rounded-[2.5rem] p-1 bg-gradient-to-br from-violet-500/30 via-white/5 to-cyan-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 blur-xl" />
                  
                  <div className="relative rounded-[2.4rem] bg-brand-900/80 backdrop-blur-2xl p-6 sm:p-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-violet-400" />
                          Curated For You
                        </h3>
                        <p className="text-sm text-brand-light/50 mt-1">Match Rate: 98.4%</p>
                      </div>
                      <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                        View All <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center">
                      {aiPicks.map((product, idx) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15 + 0.3 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default AiRecommendations;
