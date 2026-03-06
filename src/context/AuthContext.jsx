import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // optional: restore session from sessionStorage
    const saved = sessionStorage.getItem("auth");
    if (saved) {
      const data = JSON.parse(saved);
      setIsLoggedIn(data.isLoggedIn ?? false);
      setUser(data.user ?? null);
      setSelectedLocker(data.selectedLocker ?? null);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("auth", JSON.stringify({ isLoggedIn, user, selectedLocker }));
  }, [isLoggedIn, user, selectedLocker]);

  // Real-time notification for locker selection changes
  useEffect(() => {
    if (selectedLocker && isLoggedIn) {
      addNotification(`Locker ${selectedLocker} has been selected for operation.`, 'info', 'locker');
    }
  }, [selectedLocker, isLoggedIn, addNotification]);

  const login = ({ username }) => {
    setIsLoggedIn(true);
    setUser({ name: username });
    addNotification(`Welcome back, ${username}! You have successfully logged in.`, 'success', 'auth');
  };

  const logout = () => {
    const username = user?.name || 'User';
    setIsLoggedIn(false);
    setUser(null);
    setSelectedLocker(null);
    sessionStorage.removeItem("auth");
    addNotification(`${username} has logged out successfully.`, 'info', 'auth');
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, selectedLocker, setSelectedLocker }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
