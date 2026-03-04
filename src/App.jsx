import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SmartLockerDashboard from "./pages/SmartLockerDashboard";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={isLoggedIn ? <SmartLockerDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
