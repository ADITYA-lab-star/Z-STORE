import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight } from "lucide-react";

const EMPTY_FORM = { name: "", price: "", stock: "", category: "", description: "", image: "" };
const CATEGORIES = ["Audio", "Wearables", "Computing", "Accessories", "Mobile", "Creation"];

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(product ? { ...product, price: product.price, stock: product.stock } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const fields = [
    { key: "name", label: "Product Name", type: "text", placeholder: "e.g. Aurora Pro Headphones" },
    { key: "price", label: "Price ($)", type: "number", placeholder: "e.g. 299" },
    { key: "stock", label: "Stock", type: "number", placeholder: "e.g. 50" },
    { key: "image", label: "Image URL", type: "text", placeholder: "/headphone.png" },
    { key: "description", label: "Description", type: "textarea", placeholder: "Product description..." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B0E14] border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-white uppercase tracking-wider">
            {product ? "Edit Product" : "Add New Product"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</label>
              {type === "textarea" ? (
                <textarea
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50">Category</label>
            <select
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0B0E14]">{c}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl font-bold bg-white text-brand-900 hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-brand-900/30 border-t-brand-900 rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {product ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ProductManager = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | productObj
  const [deletingId, setDeletingId] = useState(null);

  const getToken = useCallback(() => currentUser.getIdToken(true), [currentUser]);

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/products?page=${p}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  }, [getToken]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  const handleSave = async (form) => {
    const isEdit = modal && modal._id;
    try {
      const token = await getToken();
      const url = isEdit ? `${API_BASE_URL}/api/admin/products/${modal._id}` : `${API_BASE_URL}/api/admin/products`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Product updated!" : "Product created!");
      setModal(null);
      fetchProducts(page);
    } catch { toast.error("Failed to save product"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this product?")) return;
    setDeletingId(id);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Product deleted.");
      fetchProducts(page);
    } catch { toast.error("Failed to delete product"); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Products</h3>
          <p className="text-sm text-white/40 mt-1">{total} total products</p>
        </div>
        <button onClick={() => setModal("add")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-900 font-bold hover:bg-white/90 transition-all">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {products.map((p) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image || "/imac.png"} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-white/5" onError={(e) => { e.target.src = "/imac.png"; }} />
                        <span className="font-semibold text-white line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50">{p.category}</td>
                    <td className="px-4 py-3 text-white font-bold">${p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${p.stock === 0 ? "text-red-400" : p.stock <= 10 ? "text-amber-400" : "text-emerald-400"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all disabled:opacity-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button onClick={() => fetchProducts(page - 1)} disabled={page === 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => fetchProducts(page + 1)} disabled={page === pages} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ProductModal
            product={modal === "add" ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;
