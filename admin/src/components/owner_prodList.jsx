import React, { useEffect, useState } from "react";
import OwnerProdListCard from "./owner_prodListCard.jsx";

const OwnerProdList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((json) => setProducts(json))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <>
      <div className="home flex flex-col items-center justify-center gap-4 pb-6">
        <h2
          id="featured-products"
          className="text-4xl font-extrabold text-red-500"
        >
          ALL PRODUCTS IN Z STORE
        </h2>
        <div className="productCards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <OwnerProdListCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default OwnerProdList;
