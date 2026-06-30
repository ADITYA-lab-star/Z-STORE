import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminStats from "../components/admin/AdminStats";
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import UserManager from "../components/admin/UserManager";
import FlashSaleManager from "../components/admin/FlashSaleManager";
import { LayoutDashboard, Package, ShoppingBag, Users, ShieldCheck, Zap } from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products",  label: "Products",  icon: Package },
  { id: "flash",     label: "Flash Sales", icon: Zap },
  { id: "orders",    label: "Orders",    icon: ShoppingBag },
  { id: "users",     label: "Users",     icon: Users },
];

const Admin = () => {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!currentUser) return;
    currentUser.getIdTokenResult(true).then((result) => {
      setIsAdmin(result.claims.role === "admin");
    });
  }, [currentUser]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  if (!currentUser || !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-brand-900 text-white pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-brand-900/80 backdrop-blur-xl sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-violet-400" />
            <span className="font-black uppercase tracking-widest text-sm text-white/80">Admin Panel</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30 font-medium">
            Logged in as <span className="text-white/60 ml-1 font-bold">{currentUser.email}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
                activeTab === id ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {activeTab === id && (
                <motion.div
                  layoutId="admin-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <div className="flex flex-col gap-8">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, Admin 👋</h1>
                  <p className="text-white/50 mt-2">Here's what's happening with your store today.</p>
                </div>
                <AdminStats />
              </div>
            )}
            {activeTab === "products" && <ProductManager />}
            {activeTab === "flash"    && <FlashSaleManager />}
            {activeTab === "orders"   && <OrderManager />}
            {activeTab === "users"    && <UserManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
