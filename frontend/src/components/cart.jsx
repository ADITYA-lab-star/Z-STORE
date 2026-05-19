import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Cpcard from "./cpcard";
import Checkout from "./checkout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const handleRemove = (productToRemove) => {
    const updatedCart = cartItems.filter(
      (item, idx) =>
        item._id !== productToRemove._id ||
        item.id !== productToRemove.id ||
        idx !== cartItems.indexOf(productToRemove)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-brand-900 pt-28 pb-16 px-4 sm:px-6 flex flex-col items-center w-full relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-12 w-12 rounded-2xl bg-brand-800 border border-white/10 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Cart
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full rounded-3xl border border-white/10 bg-brand-800/30 backdrop-blur-md p-12 flex flex-col items-center justify-center text-center"
              >
                <ShoppingBag className="h-12 w-12 text-white/20 mb-4" />
                <p className="text-lg text-brand-light/60 font-medium">
                  Your cart is currently empty.
                </p>
                <button className="mt-6 px-6 py-3 rounded-full bg-white text-brand-900 font-bold hover:bg-brand-light hover:scale-105 transition-all">
                  Start Shopping
                </button>
              </motion.div>
            ) : (
              cartItems.map((product, idx) => (
                <Cpcard
                  key={product._id || product.id || idx}
                  product={product}
                  onRemove={handleRemove}
                  index={idx}
                />
              ))
            )}
          </div>
          
          <div className="lg:col-span-5 w-full">
            <Checkout total={total} cartCount={cartItems.length} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
