import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "sonner";
import {
  TrendingUp, ShoppingBag, Users, Package,
  AlertTriangle, DollarSign, RefreshCw
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl border border-white/10 bg-brand-800/40 backdrop-blur-sm p-6 overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${color}`} />
    <div className="relative z-10 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        <p className="text-sm font-semibold text-white/50 mt-1 uppercase tracking-widest">{label}</p>
        {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
      </div>
    </div>
  </motion.div>
);

const AdminStats = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );

  if (!stats) return null;

  const cards = [
    { icon: DollarSign, label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "bg-violet-500" },
    { icon: ShoppingBag, label: "Total Orders", value: stats.totalOrders.toLocaleString(), sub: `${stats.ordersToday} today`, color: "bg-cyan-500" },
    { icon: Users, label: "Total Users", value: stats.totalUsers.toLocaleString(), color: "bg-emerald-500" },
    { icon: Package, label: "Products", value: stats.totalProducts.toLocaleString(), color: "bg-blue-500" },
    { icon: AlertTriangle, label: "Low Stock", value: stats.lowStock, sub: "≤ 10 units remaining", color: "bg-amber-500" },
    { icon: TrendingUp, label: "Out of Stock", value: stats.outOfStock, color: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase tracking-widest text-white/60">Live Overview</h3>
        <button onClick={fetchStats} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>
    </div>
  );
};

export default AdminStats;
