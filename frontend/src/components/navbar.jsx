import React from "react";
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <>
      <div className="Navbar flex items-center gap-4 bg-red-600 px-4">
        <div className="brandname font-extrabold text-8xl text-white">
          Z-STORE
        </div>
        <div className="nav-items  flex gap-4 ml-auto font-bold text-2xl text-white">
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
      </div>
    </>
  );
};

export default navbar;
