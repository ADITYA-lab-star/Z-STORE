import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending:    "text-amber-400 border-amber-400/30 bg-amber-500/10",
  processing: "text-blue-400 border-blue-400/30 bg-blue-500/10",
  shipped:    "text-cyan-400 border-cyan-400/30 bg-cyan-500/10",
  delivered:  "text-emerald-400 border-emerald-400/30 bg-emerald-500/10",
  cancelled:  "text-red-400 border-red-400/30 bg-red-500/10",
};

const OrderManager = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const getToken = useCallback(() => currentUser.getIdToken(true), [currentUser]);

  const fetchOrders = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/orders?page=${p}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }, [getToken]);

  useEffect(() => { fetchOrders(1); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      // Update local state immediately for snappy UX
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status → ${newStatus}`);
    } catch { toast.error("Failed to update status"); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Orders</h3>
          <p className="text-sm text-white/40 mt-1">{total} total orders</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full">
          <Zap className="w-3.5 h-3.5" /> Status updates are real-time
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-brand-800/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] || "text-white/50 border-white/20"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/70 font-medium">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/30">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#0B0E14] capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  {updatingId === order._id && (
                    <div className="w-4 h-4 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button onClick={() => fetchOrders(page - 1)} disabled={page === 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => fetchOrders(page + 1)} disabled={page === pages} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
