import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "sonner";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const StatusStepper = ({ status }) => {
  const currentIdx = STATUS_STEPS.indexOf(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="w-full mt-4">
      {isCancelled ? (
        <div className="text-center py-2 text-sm font-bold text-red-400 uppercase tracking-widest border border-red-400/30 rounded-lg bg-red-500/5">
          Order Cancelled
        </div>
      ) : (
        <div className="relative flex items-center justify-between gap-1">
          {/* Progress bar track */}
          <div className="absolute top-[14px] left-0 right-0 h-0.5 bg-white/10 z-0" />
          {/* Active progress fill */}
          <motion.div
            className="absolute top-[14px] left-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 z-0"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isActive = idx === currentIdx;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                    isCompleted
                      ? "bg-gradient-to-br from-violet-500 to-cyan-400 border-transparent text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                      : "bg-brand-900 border-white/20 text-white/30"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </motion.div>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${isCompleted ? "text-white/80" : "text-white/30"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [rawOrders, setRawOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/orders/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRawOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load order history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  // ─── Real-time socket listener ───────────────────────────────────────
  useEffect(() => {
    const { io } = require("socket.io-client");
    const socket = io("http://localhost:5000", { autoConnect: true });

    socket.on("order_status_updated", ({ orderId, newStatus }) => {
      setRawOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    });

    return () => socket.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse font-black uppercase tracking-widest opacity-50 text-white">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">
        Order History
      </h2>

      {rawOrders.length === 0 ? (
        <div className="p-8 text-center border border-white/10 border-dashed rounded-2xl text-white/40 font-medium">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {rawOrders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-white/10 rounded-2xl p-6 bg-brand-800/30 backdrop-blur-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    order.status === "delivered" ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" :
                    order.status === "shipped"   ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" :
                    order.status === "cancelled" ? "border-red-500/40 text-red-400 bg-red-500/10" :
                    "border-violet-500/40 text-violet-400 bg-violet-500/10"
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Live Stepper */}
                <StatusStepper status={order.status} />

                {/* Items */}
                <div className="flex flex-col gap-2 pt-2">
                  {order.items.map((item) => (
                    <div key={item._id || item.productId} className="flex justify-between items-center text-sm">
                      <span className="text-white/80 font-medium">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="text-white/60">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-bold">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="font-black text-xl text-white">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
