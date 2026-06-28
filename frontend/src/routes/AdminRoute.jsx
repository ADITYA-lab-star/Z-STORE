import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    currentUser.getIdTokenResult(true).then((result) => {
      setIsAdmin(result.claims.role === "admin");
    });
  }, [currentUser]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
