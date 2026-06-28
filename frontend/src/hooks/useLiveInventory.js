import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Initialize the socket outside the hook to maintain a single global connection
const socket = io('http://localhost:5000', {
  autoConnect: false, // We'll connect manually when the hook is mounted
});

export const useLiveInventory = (initialStock, productId) => {
  const [stock, setStock] = useState(initialStock);
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    // Connect to the WebSocket server
    socket.connect();

    const handleInventoryUpdate = (data) => {
      // Verify this update is for the product we are currently viewing
      if (data.productId === productId) {
        setStock((prevStock) => {
          if (data.newStock < prevStock) {
            // Trigger the structural dropping animation state
            setIsDropping(true);
            setTimeout(() => setIsDropping(false), 1000);
          }
          return data.newStock;
        });
      }
    };

    // Listen for the specific inventory_updated event broadcasted from Express
    socket.on('inventory_updated', handleInventoryUpdate);

    return () => {
      socket.off('inventory_updated', handleInventoryUpdate);
      // Optional: socket.disconnect() could go here if you strictly want one connection at a time,
      // but leaving it alive is often preferred for multi-product views
    };
  }, [productId]);

  return { stock, isDropping };
};
