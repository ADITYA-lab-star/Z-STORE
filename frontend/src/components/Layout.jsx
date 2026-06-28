import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  // Mock state to demonstrate the cart animation trigger
  const [isItemAdded, setIsItemAdded] = useState(false);

  // This function would typically be called when an item is added to the cart
  const handleMockAddToCart = () => {
    setIsItemAdded(true);
    // Reset the animation state after it completes
    setTimeout(() => setIsItemAdded(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-inherit text-current">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 md:px-8 border-b border-current border-opacity-10">
        {/* Logo/Brand */}
        <div className="text-2xl font-black tracking-tighter uppercase cursor-pointer hover:scale-105 transition-transform duration-300">
          Z-Store
        </div>
        
        {/* Navigation Links & Cart */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            <li><a href="#" className="hover:opacity-60 transition-opacity duration-200">Shop</a></li>
            <li><a href="#" className="hover:opacity-60 transition-opacity duration-200">Collections</a></li>
            <li><a href="#" className="hover:opacity-60 transition-opacity duration-200">About</a></li>
          </ul>

          {/* Cart Icon Placeholder with Custom Animation */}
          <button 
            onClick={handleMockAddToCart}
            className="relative p-2 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label="Cart"
          >
            <svg 
              className={`w-6 h-6 ${isItemAdded ? 'animate-bounce' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            {/* Cart Badge Placeholder */}
            {isItemAdded && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full border border-current">
                1
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
        {/* Render explicitly passed children, or react-router Outlet if used as a router layout */}
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="p-6 md:p-8 mt-auto border-t border-current border-opacity-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity duration-300">
            &copy; {new Date().getFullYear()} Z-Store. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm opacity-80 hover:opacity-100 hover:underline transition-all duration-300">Privacy</a>
            <a href="#" className="text-sm opacity-80 hover:opacity-100 hover:underline transition-all duration-300">Terms</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Layout;
