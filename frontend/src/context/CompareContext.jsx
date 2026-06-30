import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  const toggleCompare = (product) => {
    setCompareItems((prev) => {
      const exists = prev.find((p) => p._id === (product._id || product.id));
      if (exists) {
        return prev.filter((p) => p._id !== (product._id || product.id));
      }
      if (prev.length >= 3) {
        toast.error("You can only compare up to 3 products at a time.");
        return prev;
      }
      toast.success(`${product.name} added to comparison.`);
      // Ensure product has specifications (create mock if it doesn't exist for demo purposes)
      const p = { ...product, _id: product._id || product.id };
      if (!p.specifications) {
        p.specifications = {
          "Material": "Premium Aluminum/Glass",
          "Warranty": "1 Year Limited",
          "Weight": Math.floor(Math.random() * 500) + 100 + "g",
          "Dimensions": "Standard"
        };
      }
      return [...prev, p];
    });
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, toggleCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
