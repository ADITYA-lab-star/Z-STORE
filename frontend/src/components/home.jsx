import React from "react";
import { useEffect, useState } from "react";
import ProductCard from "./pcard.jsx";
import Hero from "./Hero.jsx";

const Home = () => {
  const [products, setproducts] = useState([]);

  useEffect(() => {
    fetch("https://z-store.onrender.com/api/products") // backend endpoint
      .then((res) => res.json())
      .then((json) => setproducts(json))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <>
      <Hero />
      <div className="home bg-[#05060a] flex flex-col items-center justify-center gap-4 pb-16 w-full">
        <h2
          id="featured-products"
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white text-center mt-16 mb-2"
        >
          Featured{" "}
          <span className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            Products
          </span>
        </h2>
        <p className="text-white/55 text-sm sm:text-base text-center max-w-lg mb-6 px-4">
          Hand-selected pieces from the season's most sought-after drops.
        </p>

        <div className="productCards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 sm:px-6 max-w-7xl place-items-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <footer className="footer bg-[#05060a] border-t border-white/10 py-12 w-full flex flex-col items-center text-white/80">
        <div id="contacts" className="contacts-section mb-6 text-center">
          <h3 className="text-2xl font-semibold mb-3 text-white">Contact Us</h3>
          <p className="text-sm text-white/60">Email: support@zstore.com</p>
          <p className="text-sm text-white/60">Phone: +1 234 567 890</p>
          <p className="text-sm text-white/60">Address: 123 Main St, City, Country</p>
        </div>
        <div id="terms" className="terms-section text-center px-4">
          <h3 className="text-2xl font-semibold mb-3 text-white">Terms &amp; Conditions</h3>
          <p className="max-w-xl mx-auto text-sm text-white/55 leading-relaxed">
            By using Z-STORE, you agree to our terms and conditions. All
            products are subject to availability. Prices and offers may change
            without prior notice. For more details, contact our support team.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;
