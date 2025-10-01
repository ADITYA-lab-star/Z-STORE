import React from "react";

const Checkout = ({ total }) => {
  const shipping = total > 0 ? 10 : 0;
  const grandTotal = total + shipping;
  return (
    <div className="checkout-container w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 mt-8 border-2 border-red-500 flex flex-col md:flex-row items-start justify-between gap-8">
      {/* Left: Form */}
      <div className="flex-1">
        <h2 className="text-3xl font-extrabold text-red-600 mb-6">Checkout</h2>
        <form className="space-y-6">
          <div className="flex gap-6">
            {/* Name */}
            <div className="flex-1">
              <label className="block text-lg font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your name"
                required
              />
            </div>
            {/* Email */}
            <div className="flex-1">
              <label className="block text-lg font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="you@email.com"
                required
              />
            </div>
          </div>
          <div className="flex gap-6">
            {/* Address */}
            <div className="flex-1">
              <label className="block text-lg font-bold text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Shipping address"
                required
              />
            </div>
            {/* Payment Method */}
            <div className="flex-1">
              <label className="block text-lg font-bold text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select</option>
                <option value="card">Credit/Debit Card</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-xl transition mt-4"
          >
            Checkout
          </button>
        </form>
      </div>
      {/* Right: Order Summary */}
      <div className="order-summary w-full md:w-96 bg-gray-50 border-t-2 md:border-t-0 md:border-l-2 border-yellow-500 rounded-xl p-4 sm:p-6 flex flex-col items-center mt-6 md:mt-0">
        <h3 className="text-2xl font-bold text-red-600 mb-4">Order Summary</h3>
        <div className="w-full flex flex-col gap-2 mb-6">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-red-500">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-gray-600 text-center">
          Thank you for shopping with Z-STORE!
        </p>
      </div>
    </div>
  );
};

export default Checkout;
