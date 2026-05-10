import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const listeners = useState(new Set())[0];

  // Add notification with real-time broadcast
  const addNotification = useCallback((message, type = 'info', source = 'system') => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date().toISOString(),
      source
    };

    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50

    // Broadcast to all listeners
    listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });

    return notification.id;
  }, [listeners]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Subscribe to real-time notifications
  const subscribe = useCallback((callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }, [listeners]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    subscribe
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

export default NotificationContext;
