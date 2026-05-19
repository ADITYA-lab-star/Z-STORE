import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { type: "link", label: "Home", to: "/" },
  { type: "scroll", label: "Featured", target: "featured-products" },
  { type: "scroll", label: "Contact", target: "contacts" },
  { type: "link", label: "Cart", to: "/cart" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Spacer so floating nav doesn't overlap content */}
      <div className="h-24" aria-hidden="true" />

      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
        <nav
          className={`pointer-events-auto w-full max-w-6xl flex items-center justify-between gap-4 rounded-2xl border border-white/15 px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-500 ease-out
            ${scrolled
              ? "bg-black/55 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              : "bg-black/30 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"}
            backdrop-blur-xl backdrop-saturate-150`}
          style={{
            WebkitBackdropFilter: "saturate(150%) blur(20px)",
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2 text-white font-semibold tracking-tight text-lg sm:text-xl"
          >
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-white/90 to-white/60 text-black font-black shadow-inner">
              Z
            </span>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Z-Store
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-1.5 py-1">
            {navLinks.map((item) => (
              <li key={item.label}>
                {item.type === "link" ? (
                  <Link
                    to={item.to}
                    className="relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-full transition-all duration-300 hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(item.target)}
                    className="relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-full transition-all duration-300 hover:bg-white/10"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            to="/cart"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.25)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Shop
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all duration-300"
          >
            <div className="relative w-5 h-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-x-3 z-40 md:hidden transition-all duration-300 ease-out ${
          menuOpen
            ? "top-[88px] opacity-100 translate-y-0 pointer-events-auto"
            : "top-[80px] opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map((item, i) => (
              <li
                key={item.label}
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                className={`transition-all duration-300 ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
              >
                {item.type === "link" ? (
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 text-base font-medium"
                  >
                    {item.label}
                    <span className="text-white/40">→</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      scrollTo(item.target);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 text-base font-medium"
                  >
                    {item.label}
                    <span className="text-white/40">→</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
