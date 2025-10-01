import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="Navbar flex items-center bg-red-600 px-4 py-2 relative">
      <div className="brandname font-extrabold text-4xl sm:text-6xl md:text-8xl text-white">
        Z-STORE
      </div>
      {/* Desktop Nav */}
      <div className="nav-items hidden md:flex gap-4 ml-auto font-bold text-lg md:text-2xl text-white">
        <Link to="/">Home</Link>
        <button
          className="bg-transparent border-none text-white cursor-pointer"
          onClick={() => {
            const el = document.getElementById("featured-products");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Featured
        </button>
        <button
          className="bg-transparent border-none text-white cursor-pointer"
          onClick={() => {
            const el = document.getElementById("contacts");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Contact
        </button>
        <Link to="/cart">Cart</Link>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden ml-auto text-white text-3xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        &#9776;
      </button>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-red-700 flex flex-col items-center py-2 z-50 md:hidden">
          <Link
            to="/"
            className="py-2 w-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <button
            className="bg-transparent border-none text-white py-2 w-full text-center"
            onClick={() => {
              const el = document.getElementById("featured-products");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
              setMenuOpen(false);
            }}
          >
            Featured
          </button>
          <button
            className="bg-transparent border-none text-white py-2 w-full text-center"
            onClick={() => {
              const el = document.getElementById("contacts");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
              setMenuOpen(false);
            }}
          >
            Contact
          </button>
          <Link
            to="/cart"
            className="py-2 w-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
