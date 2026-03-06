import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

function NotificationListener({ children }) {
  const { subscribe } = useNotifications();

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribe = subscribe((notification) => {
      console.log('Real-time notification received:', notification);
      
      // You can add additional real-time handling here:
      // - Sound notifications
      // - Browser notifications
      // - Analytics tracking
      // - WebSocket broadcasting
      
      if (notification.type === 'warning' || notification.type === 'alert') {
        // Show browser notification for important alerts
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.message, {
            body: `Source: ${notification.source}`,
            icon: '/favicon.ico'
          });
        }
      }
    });

    return unsubscribe;
  }, [subscribe]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return <>{children}</>;
}

export default NotificationListener;
