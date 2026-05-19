import React from "react";
import { motion } from "framer-motion";
import { Headphones, Watch, Laptop, Mouse, Smartphone, Camera } from "lucide-react";

const categories = [
  { id: 1, name: "Audio", icon: <Headphones className="h-8 w-8" />, desc: "Headphones & Earbuds", color: "from-violet-500/20 to-fuchsia-500/20", border: "group-hover:border-violet-500/50" },
  { id: 2, name: "Wearables", icon: <Watch className="h-8 w-8" />, desc: "Smartwatches & Trackers", color: "from-cyan-500/20 to-blue-500/20", border: "group-hover:border-cyan-500/50" },
  { id: 3, name: "Computing", icon: <Laptop className="h-8 w-8" />, desc: "Laptops & Desktops", color: "from-emerald-500/20 to-teal-500/20", border: "group-hover:border-emerald-500/50" },
  { id: 4, name: "Accessories", icon: <Mouse className="h-8 w-8" />, desc: "Keyboards & Mice", color: "from-rose-500/20 to-orange-500/20", border: "group-hover:border-rose-500/50" },
  { id: 5, name: "Mobile", icon: <Smartphone className="h-8 w-8" />, desc: "Phones & Tablets", color: "from-blue-500/20 to-indigo-500/20", border: "group-hover:border-blue-500/50" },
  { id: 6, name: "Creation", icon: <Camera className="h-8 w-8" />, desc: "Cameras & Gear", color: "from-amber-500/20 to-yellow-500/20", border: "group-hover:border-amber-500/50" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Categories = () => {
  return (
    <section id="categories" className="w-full py-24 bg-brand-900 relative z-10">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-800/30 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Shop by <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-brand-light/60 max-w-2xl">
            Explore our meticulously organized collections. From immersive audio to powerful computing.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {categories.map((cat) => (
            <motion.a
              key={cat.id}
              href={`#category-${cat.id}`}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative flex flex-col items-center text-center p-6 rounded-3xl bg-brand-800/40 border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 ${cat.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white mb-4 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                {cat.icon}
              </div>
              
              <h3 className="relative z-10 text-lg font-bold text-white mb-1">
                {cat.name}
              </h3>
              <p className="relative z-10 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {cat.desc}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
