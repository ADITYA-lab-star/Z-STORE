import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Hexagon, User, LogOut, ShieldCheck, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import SearchModal from "./SearchModal";

const navLinks = [
  { type: "link", label: "Home", to: "/" },
  { type: "scroll", label: "Categories", target: "categories" },
  { type: "scroll", label: "Trending", target: "trending" },
  { type: "scroll", label: "Featured", target: "featured-products" },
  { type: "scroll", label: "Contact", target: "contacts" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    currentUser.getIdTokenResult().then((result) => {
      setIsAdmin(result.claims.role === "admin");
    }).catch(() => setIsAdmin(false));
  }, [currentUser]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (location.pathname === "/auth") {
    return null;
  }

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`pointer-events-auto w-full max-w-5xl flex items-center justify-between gap-4 rounded-full border px-4 sm:px-6 py-3 transition-all duration-500 ease-out
            ${scrolled
              ? "bg-brand-900/60 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "bg-transparent border-transparent"}`}
        >
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2 text-brand-light font-bold tracking-tight text-xl transition-transform hover:scale-105"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg">
              <Hexagon className="h-5 w-5 text-white fill-white/20" />
            </div>
            <span className="hidden sm:block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Z-STORE
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-2 py-1.5 backdrop-blur-md">
            {navLinks.map((item) => (
              <li key={item.label}>
                {item.type === "link" ? (
                  <Link
                    to={item.to}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full transition-all duration-300 hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(item.target)}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full transition-all duration-300 hover:bg-white/10"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA & Icons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-brand-900/90 backdrop-blur-xl shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-bold text-white truncate">{currentUser.displayName || "User"}</p>
                        <p className="text-xs text-white/50 truncate">{currentUser.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-violet-400 hover:text-violet-300 hover:bg-white/10 transition-colors">
                          <ShieldCheck className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left">
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex h-10 px-5 items-center justify-center rounded-full bg-white text-brand-900 text-sm font-bold hover:bg-brand-light transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            )}
            
            <button
              onClick={() => setSearchOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-brand-900">
                  {cartCount}
                </span>
              )}
            </Link>
 
            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </header>
 
      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-[88px] z-40 md:hidden pointer-events-auto"
          >
            <div className="rounded-3xl border border-white/10 bg-brand-900/90 backdrop-blur-2xl shadow-2xl p-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-500/10" />
              <ul className="relative z-10 flex flex-col gap-2">
                {navLinks.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {item.type === "link" ? (
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          scrollTo(item.target);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 text-lg font-medium text-left"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.li>
                ))}
                {currentUser && (
                  <>
                    <div className="h-px bg-white/10 my-2" />
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                      >
                        <User className="h-5 w-5" /> Profile
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-violet-400 hover:text-violet-300 hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                        >
                          <ShieldCheck className="h-5 w-5" /> Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors duration-200 text-lg font-medium text-left"
                      >
                        <LogOut className="h-5 w-5" /> Log out
                      </button>
                    </li>
                  </>
                )}
                {!currentUser && (
                  <>
                    <div className="h-px bg-white/10 my-2" />
                    <li>
                      <Link
                        to="/auth"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                      >
                        Sign In
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
