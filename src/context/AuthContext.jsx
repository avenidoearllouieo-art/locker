import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedLocker, setSelectedLocker] = useState(null);

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

  const login = ({ username }) => {
    setIsLoggedIn(true);
    setUser({ name: username });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSelectedLocker(null);
    sessionStorage.removeItem("auth");
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
