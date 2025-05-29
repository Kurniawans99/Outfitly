import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const useAuth = (): boolean => {
  const token = localStorage.getItem("authToken");
  return !!token; // Mengembalikan true jika token ada, false jika tidak
};

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  // Jika terautentikasi, render konten rute yang diminta dengan <Outlet />
  return <Outlet />;
};

export const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  // Jika terautentikasi, redirect ke dashboard
  return isAuthenticated ? (
    <Navigate to="/dashboard/overview" replace />
  ) : (
    <Outlet />
  );
};
