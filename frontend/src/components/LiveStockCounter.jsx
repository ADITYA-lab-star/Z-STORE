import React from 'react';
import { useLiveInventory } from '../hooks/useLiveInventory';

const LiveStockCounter = ({ productId, initialStock }) => {
  // Leverage our custom WebSocket hook
  const { stock, isDropping } = useLiveInventory(initialStock, productId);

  return (
    <div className="flex flex-col items-start gap-1 p-4 border-2 border-current border-opacity-10 rounded-lg bg-inherit text-current w-fit">
      <span className="text-xs font-black uppercase tracking-widest opacity-50">
        Live Inventory
      </span>
      
      {/* 
        This is where the magic happens. We apply `animate-pulse` structurally 
        when the stock drops, completely avoiding color changes.
      */}
      <div 
        className={`text-5xl font-black tabular-nums transition-transform duration-300 ${
          isDropping ? 'animate-pulse scale-110' : 'scale-100'
        }`}
      >
        {stock}
      </div>
      
      {/* Structural Low Stock Indicator */}
      {stock > 0 && stock <= 10 && (
        <span className="mt-3 inline-flex items-center text-[10px] uppercase font-black tracking-widest border border-current rounded-full px-3 py-1 animate-bounce">
          Almost Gone
        </span>
      )}

      {/* Structural Sold Out Indicator */}
      {stock === 0 && (
        <span className="mt-3 inline-flex items-center text-[10px] uppercase font-black tracking-widest border border-current rounded-full px-3 py-1 opacity-40">
          Sold Out
        </span>
      )}
    </div>
  );
};

export default LiveStockCounter;
