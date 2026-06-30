import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const socket = io(SOCKET_URL, { autoConnect: false });

export const useLiveOrderStatus = (initialOrders) => {
  const [orders, setOrders] = useState(initialOrders || []);

  // Keep orders in sync if parent re-fetches
  useEffect(() => {
    setOrders(initialOrders || []);
  }, [initialOrders]);

  useEffect(() => {
    socket.connect();

    const handleStatusUpdate = ({ orderId, newStatus }) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    };

    socket.on("order_status_updated", handleStatusUpdate);

    return () => {
      socket.off("order_status_updated", handleStatusUpdate);
    };
  }, []);

  return { orders, setOrders };
};
