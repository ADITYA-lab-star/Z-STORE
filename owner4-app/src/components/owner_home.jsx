import React, { useState } from "react";

const OwnerHome = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    try {
      const res = await fetch("http://localhost:5000/api/addprod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setResult("Product added successfully!");
        setForm({ name: "", price: "", description: "", image: "" });
      } else {
        setResult("Error adding product.");
      }
    } catch {
      setResult("Network error.");
    }
  };

  return (
    <div className="home flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center">
          Add Product
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="2"
              placeholder="Enter product description"
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter image URL"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg text-xl transition"
          >
            Add Product
          </button>
        </form>
        <div className="mt-4 text-center text-lg font-bold">{result}</div>
      </div>
    </div>
  );
};

export default OwnerHome;
 