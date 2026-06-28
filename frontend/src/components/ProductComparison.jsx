import React, { useMemo } from 'react';

const ProductComparison = ({ products = [] }) => {
  // Gracefully handle empty or single product states
  if (!products || products.length === 0) {
    return <div className="p-8 text-center text-lg font-medium opacity-60">No products selected for comparison.</div>;
  }

  // 1. Dynamically extract every unique specification key across all products
  const allSpecKeys = useMemo(() => {
    const keys = new Set();
    products.forEach((product) => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach((key) => keys.add(key));
      }
    });
    // Sort keys alphabetically for a consistent table layout
    return Array.from(keys).sort();
  }, [products]);

  // 2. Helper to determine if a specification has different values across the products
  const isSpecDifferent = (key) => {
    if (products.length < 2) return false;
    
    const values = products.map((p) => p.specifications?.[key]);
    const firstVal = values[0];
    
    // Returns true if any product has a different value for this specific key
    return values.some(val => val !== firstVal);
  };

  return (
    <div className="w-full overflow-x-auto p-4 md:p-8 bg-inherit text-current">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            {/* Empty top-left cell for the specification labels */}
            <th className="w-1/4 p-4 border-b-2 border-r border-current border-opacity-30"></th>
            
            {/* Dynamically render product headers */}
            {products.map((product) => (
              <th 
                key={product._id || product.id || product.name}
                className="w-1/4 p-4 text-center align-bottom border-b-2 border-current border-opacity-30 transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-32 h-32 object-contain mx-auto mb-6 transition-transform duration-500 hover:scale-110"
                  />
                )}
                <h3 className="text-xl font-black uppercase tracking-tighter">
                  {product.name}
                </h3>
                <p className="text-2xl font-light mt-2 tracking-widest">
                  ${product.price}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="text-sm md:text-base">
          {/* Map through every unique specification key found */}
          {allSpecKeys.map((key) => {
            const differs = isSpecDifferent(key);
            
            return (
              <tr 
                key={key} 
                className="group transition-opacity duration-200 hover:opacity-90"
              >
                {/* Specification Name Column */}
                <td className={`p-4 border-b border-r border-current border-opacity-10 capitalize ${differs ? 'font-bold tracking-wide' : 'font-medium opacity-70'}`}>
                  <div className="flex items-center justify-between">
                    <span>{key}</span>
                    {/* Animated structural badge for differing rows */}
                    {differs && (
                      <span className="text-[10px] uppercase border border-current rounded-full px-2 py-0.5 animate-pulse opacity-80">
                        Differs
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Product Values Row */}
                {products.map((product, idx) => (
                  <td 
                    key={`${product.name}-${idx}`} 
                    className={`p-4 text-center border-b border-current border-opacity-10 ${
                      differs 
                        ? 'font-bold scale-100 group-hover:scale-105 transition-transform duration-300' 
                        : 'opacity-70 font-normal'
                    }`}
                  >
                    {product.specifications?.[key] || '-'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparison;
