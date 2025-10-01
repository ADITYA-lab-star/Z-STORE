import React from "react";

const owner_prodListCart = ({ product }) => {
  
  const handleEdit = async () => {
    const name = prompt("Edit name:", product.name);
    if (name === null) return;
    const price = prompt("Edit price:", product.price);
    if (price === null) return;
    const description = prompt("Edit description:", product.description);
    if (description === null) return;
    const image = prompt("Edit image URL:", product.image);
    if (image === null) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${product._id || product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, price, description, image }),
        }
      );
      if (res.ok) {
        alert("Product updated successfully");
        window.location.reload();
      } else {
        alert("Failed to update product");
      }
    } catch {
      alert("Network error");
    }
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/products/${product._id || product.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Product deleted successfully");
          window.location.reload(); // Refresh the page to reflect changes
        } else {
          alert("Failed to delete the product");
        }
      })
      .catch((err) => console.error("Error deleting product:", err));
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

      {/* Edit Button */}
      <button
        onClick={handleEdit}
        className="mt-3 w-full bg-red-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg border border-yellow-500 transition"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="mt-3 w-full bg-red-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg border border-yellow-500 transition"
      >
        Delete
      </button>
    </div>
  );
};

export default owner_prodListCart;
