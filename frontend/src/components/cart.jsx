import React, { useEffect, useState } from "react";
import Cpcard from "./cpcard";
import Checkout from "./checkout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const handleRemove = (productToRemove) => {
    const updatedCart = cartItems.filter(
      (item, idx) =>
        item._id !== productToRemove._id ||
        item.id !== productToRemove.id ||
        idx !== cartItems.indexOf(productToRemove)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart flex flex-col items-center justify-center gap-4 pb-6 w-full px-2">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 mt-4 text-center">
        Your Cart
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-700 text-center">
          Your cart is currently empty.
        </p>
      ) : (
        cartItems.map((product, idx) => (
          <Cpcard
            key={product._id || product.id || idx}
            product={product}
            onRemove={handleRemove}
          />
        ))
      )}
      <Checkout total={total} />
    </div>
  );
};

export default Cart;
