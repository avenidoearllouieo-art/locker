import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SmartLockerDashboard from "./pages/SmartLockerDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationListener from "./components/NotificationListener";

function AppRoutes() {
  const { isLoggedIn, sessionRestored } = useAuth();

  // Wait for session to be restored before routing
  if (!sessionRestored) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignUp />} />
      <Route path="/dashboard" element={isLoggedIn ? <SmartLockerDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <NotificationListener>
              <AppRoutes />
            </NotificationListener>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </div>
  );
}
