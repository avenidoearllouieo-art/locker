import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function NotificationCenter() {
  const { notifications, clearNotifications } = useNotifications();
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  useEffect(() => {
    setDisplayedNotifications(notifications.slice(0, 5)); // Show last 5 notifications
  }, [notifications]);

  if (displayedNotifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-center-wrapper">
      <div className="notification-center-header">
        <h3 className="notification-center-title">Notifications</h3>
        <button className="clear-all-btn" onClick={clearNotifications}>
          Clear All
        </button>
      </div>
      <div className="notification-center">
        {displayedNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification notification-${notification.type}`}
            role="alert"
          >
            <div className="notification-content">
              <div className="notification-message-section">
                <div className="notification-badge">{notification.type.toUpperCase()}</div>
                <p className="notification-message">{notification.message}</p>
              </div>
              <p className="notification-timestamp">{formatTime(notification.timestamp)}</p>
            </div>
            {notification.source === 'locker' && (
              <p className="notification-source">source: {notification.source}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationCenter;
