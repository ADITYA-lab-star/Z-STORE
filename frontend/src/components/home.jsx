import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import ProductCard from "./pcard.jsx";
import Hero from "./Hero.jsx";
import FlashSale from "./FlashSale.jsx";
import Trending from "./trending.jsx";
import Categories from "./categories.jsx";
import Statistics from "./statistics.jsx";
import Marquee from "./marquee.jsx";
import Footer from "./footer.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Hero />
      <div className="bg-brand-900 w-full relative z-10">
        <FlashSale />

        <Categories />

        <Trending />

        <section className="flex flex-col items-center justify-center gap-6 pb-24 pt-16 w-full">
          <div className="w-full max-w-7xl px-4 sm:px-6 flex flex-col items-center">
            <h2
              id="featured-products"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-center mb-4"
            >
              Featured{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-brand-light/60 text-base text-center max-w-lg mb-12">
              Hand-selected pieces from the season's most sought-after drops.
            </p>

            {loading ? (
              <div className="flex items-center justify-center h-64 w-full">
                <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-cyan-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full place-items-center">
                {products.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <Statistics />
        <Marquee />
      </div>

      <Footer />
    </>
  );
};

export default Home;
