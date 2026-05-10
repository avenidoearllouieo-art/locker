import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNotifications } from "./NotificationContext";
import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredUser,
  isAuthenticated
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const initializationAttempted = useRef(false);
  const { addNotification } = useNotifications();

  // Restore session from localStorage on mount
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initializationAttempted.current) {
      return;
    }
    initializationAttempted.current = true;

    // Restore authenticated session from localStorage
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
        addNotification(`Welcome back, ${storedUser.username || storedUser.name}!`, 'success', 'auth');
      }
    }
    
    setSessionRestored(true);
  }, [addNotification]);

  // Notify when locker is selected
  useEffect(() => {
    if (selectedLocker && isLoggedIn) {
      addNotification(`Locker ${selectedLocker} has been selected for operation.`, 'info', 'locker');
    }
  }, [selectedLocker, isLoggedIn, addNotification]);

  const signup = async ({ username, email, password }) => {
    setIsLoading(true);
    try {
      await registerUser({ username, email, password });
      addNotification(`Account created successfully for ${username}. You can now log in.`, 'success', 'auth');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.detail || error.error || error.message || "Registration failed";
      throw new Error(errorMessage);
    }
  };

  const login = async ({ username, password }) => {
    setIsLoading(true);
    try {
      const data = await loginUser({ username, password });
      setIsLoggedIn(true);
      setUser(data.user);
      setSelectedLocker(null); // Reset selected locker on new login
      addNotification(`Welcome back, ${data.user.username || data.user.name}! You have successfully logged in.`, 'success', 'auth');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.detail || error.error || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    const username = user?.name || user?.username || 'User';
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    setSelectedLocker(null);
    addNotification(`${username} has logged out successfully.`, 'info', 'auth');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        signup,
        selectedLocker,
        setSelectedLocker,
        isLoading,
        sessionRestored
      }}
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
