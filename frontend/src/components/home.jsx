import React from "react";
import { useEffect, useState } from "react";
import ProductCard from "./pcard.jsx";

const Home = () => {
  const [products, setproducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products") // backend endpoint
      .then(res => res.json())
      .then(json => setproducts(json))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <>
      <div className="home flex flex-col items-center justify-center gap-4 pb-6">
        <div className="poster">
          <img src="./macpos.png" alt="" />
        </div>

        <h2
          id="featured-products"
          className="text-4xl font-extrabold text-red-500"
        >
          Featured Products
        </h2>

        <div className="productCards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
      <footer className="footer bg-gray-100 py-8 mt-8 w-full flex flex-col items-center">
        <div id="contacts" className="contacts-section mb-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
          <p>Email: support@zstore.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Main St, City, Country</p>
        </div>
        <div id="terms" className="terms-section text-center">
          <h3 className="text-2xl font-bold mb-2">Terms &amp; Conditions</h3>
          <p className="max-w-xl mx-auto text-gray-700">
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
