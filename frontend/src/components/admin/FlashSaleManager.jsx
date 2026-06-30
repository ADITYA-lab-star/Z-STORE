import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "sonner";
import { Plus, Trash2, Check, Zap, Play, Square } from "lucide-react";

const FlashSaleManager = () => {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    discountPercentage: 20,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    isActive: false,
  });

  const getToken = useCallback(() => currentUser.getIdToken(true), [currentUser]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const [salesRes, prodRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/flash-sales`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/admin/products?limit=100`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const salesData = await salesRes.json();
      const prodData = await prodRes.json();
      setSales(salesData);
      setProducts(prodData.products || []);
    } catch {
      toast.error("Failed to load flash sales");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/flash-sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Flash Sale created!");
      fetchData();
    } catch {
      toast.error("Failed to create flash sale");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/flash-sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(currentStatus ? "Flash Sale stopped." : "Flash Sale started!");
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flash sale?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/flash-sales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Flash Sale deleted.");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" /> Flash Sales
        </h3>
        <p className="text-sm text-white/40 mt-1">Manage active and upcoming flash sales.</p>
      </div>

      <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Create New Sale</h4>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50">Product</label>
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
              required
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p._id} value={p._id} className="bg-[#0B0E14]">{p.name} (${p.price})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50">Discount %</label>
            <input
              type="number"
              min="1"
              max="99"
              value={form.discountPercentage}
              onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50">End Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
              required
            />
          </div>
          <button type="submit" disabled={creating} className="w-full py-3 rounded-xl font-bold bg-white text-brand-900 hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Create
          </button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {sales.map((sale) => (
              <motion.div
                key={sale._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 rounded-2xl border ${sale.isActive ? 'border-yellow-400/50 bg-yellow-400/5' : 'border-white/10 bg-[#0B0E14]'} flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <img src={sale.productId?.image || "/imac.png"} alt="Product" className="w-16 h-16 object-contain rounded-xl bg-white/5" />
                  <div>
                    <h5 className="font-bold text-white text-lg">{sale.productId?.name || "Unknown Product"}</h5>
                    <div className="flex gap-3 text-sm text-white/50 mt-1">
                      <span className="text-yellow-400 font-bold">{sale.discountPercentage}% OFF</span>
                      <span>Ends: {new Date(sale.endTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(sale._id, sale.isActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      sale.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {sale.isActive ? <><Square className="w-4 h-4" /> Stop Sale</> : <><Play className="w-4 h-4" /> Start Sale</>}
                  </button>
                  <button onClick={() => handleDelete(sale._id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            {sales.length === 0 && (
              <div className="p-10 text-center text-white/40 border border-white/5 border-dashed rounded-2xl">
                No flash sales configured yet.
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FlashSaleManager;
