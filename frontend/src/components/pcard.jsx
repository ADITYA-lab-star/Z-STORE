import React from "react";

const ProductCard = ({ product }) => {
  const handleATC = () => {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Add product to cart
    cart.push({
      _id: product?._id,
      name: product?.name,
      price: product?.price,
      description: product?.description,
      image: product?.image,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${product?.name || "Product"} to cart!`);
  };

  return (
    <div className="product-card bg-white border-2 border-red-500 rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition duration-300 w-72">
      {/* Product Image */}
      <img
        src={product?.image || "imac.png"}
        alt={product?.name || "Product"}
        className="h-40 w-auto object-contain mb-2 rounded bg-gray-50"
      />

      {/* Product Title */}
      <h2 className="text-lg font-extrabold text-red-600 hover:text-yellow-500 cursor-pointer text-center mb-1">
        {product?.name || "Product Name"}
      </h2>

      {/* Product Description */}
      <p className="text-sm text-gray-700 text-center mb-2">
        {product?.description || "No description available."}
      </p>

      {/* Product Price */}
      <p className="text-lg font-bold text-yellow-500 mt-1">
        ${product?.price || "0.00"}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={handleATC}
        className="mt-3 w-full bg-red-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg border border-yellow-500 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
