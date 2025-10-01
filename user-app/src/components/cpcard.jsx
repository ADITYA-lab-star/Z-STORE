import React from "react";

const Cpcard = ({ product, onRemove }) => {
  const handleRemove = () => {
    if (onRemove) onRemove(product);
  };

  return (
    <div className="cpcard flex items-center justify-between bg-white border-2 border-red-500 rounded-xl shadow-md p-6 my-4 w-full max-w-3xl mx-auto">
      {/* Product Image */}
      <img
        src={product?.image || "imac.png"}
        alt={product?.name || "Product"}
        className="w-36 h-36 object-contain rounded-lg border border-yellow-500 bg-gray-50"
      />

      {/* Product Details */}
      <div className="ml-8 flex-1">
        <h2 className="text-2xl font-extrabold text-red-600 hover:text-yellow-500 cursor-pointer mb-1">
          {product?.name || "Product Name"}
        </h2>
        <p className="text-base text-gray-700">
          {product?.description || "No description available."}
        </p>
        <p className="text-base text-green-600 font-semibold">In Stock</p>

        {/* Quantity + Actions */}
        <div className="flex items-center gap-6 mt-4">
          <button
            className="text-red-600 font-bold hover:text-yellow-500 transition"
            onClick={handleRemove}
          >
            Remove
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Qty:</span>
            <input
              type="number"
              min="1"
              defaultValue={product?.quantity || 1}
              className="w-12 px-2 py-1 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-right font-extrabold text-2xl text-red-500 px-4 py-2 rounded-lg shadow">
        ${product?.price || "0.00"}
      </div>
    </div>
  );
};

export default Cpcard;
