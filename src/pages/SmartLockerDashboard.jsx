import React, { useState, useEffect, useReducer, useMemo, useCallback } from "react";
import {
  adminUser,
  notificationsData,
  systemStatus
} from "../data/mockData";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import LockerCard from "../components/LockerCard";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// helper functions
function parseTime(str) {
  if (!str || str === "--") return 0;
  let seconds = 0;
  const hrMatch = str.match(/(\d+)\s*hour/);
  if (hrMatch) seconds += parseInt(hrMatch[1], 10) * 3600;
  const minMatch = str.match(/(\d+)\s*minute/);
  if (minMatch) seconds += parseInt(minMatch[1], 10) * 60;
  return seconds;
}


export default function SmartLockerDashboard() {
  const [apiLockers, setApiLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function reducer(state, action) {
      switch (action.type) {
      case "SET_LOCKERS":
        return action.payload.map((l) => ({
          ...l,
          timeLeft: l.time_remaining ? parseTime(l.time_remaining) : 0
        }));
      case "TICK":
        return state.map((l) => {
          if (l.timeLeft > 0) {
            const newTime = l.timeLeft - 1;
            const updates = { timeLeft: newTime };
            if (newTime === 300) {
              action.notify(`5 minutes remaining for ${l.id}`);
            }
            if (newTime <= 0) {
              return {
                ...l,
                status: "Available",
                timeLeft: 0,
                current_user: null
              };
            }
            return { ...l, ...updates };
          }
          return l;
        });
      case "OPEN":
        return state.map((l) =>
          l.id === action.id
            ? {
                ...l,
                status: "In Use",
                timeLeft: action.duration,
                current_user: action.user || "Guest User"
              }
            : l
        );
      case "CLOSE":
        return state.map((l) =>
          l.id === action.id
            ? { ...l, status: "Available", timeLeft: 0, current_user: null }
            : l
        );
      default:
        return state;
    }
  }

  const { selectedLocker, setSelectedLocker, logout, user } = useAuth();
  const { addNotification, notifications, removeNotification, clearNotifications } = useNotifications();
  const navigate = useNavigate();

  const [lockers, dispatch] = useReducer(reducer, []);

  // Fetch lockers from API on component mount
  useEffect(() => {
    const fetchLockers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/lockers/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch({ type: "SET_LOCKERS", payload: data });
      } catch (err) {
        setError(err.message);
        addNotification(`Failed to fetch lockers: ${err.message}`, 'error', 'system');
      } finally {
        setLoading(false);
      }
    };

    fetchLockers();
  }, [addNotification]);

  // tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "TICK", notify: (msg) => addNotification(msg, 'warning', 'system') });
    }, 1000);
    return () => clearInterval(timer);
  }, [addNotification]);

  const handleOpen = React.useCallback(
    async (id) => {
      try {
        setSelectedLocker(id);
        const response = await fetch(`${API_BASE_URL}/lockers/${id}/open/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to open locker. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update state with API response
        addNotification(`${id} opened successfully. Rental period started.`, 'success', 'locker');
        dispatch({
          type: "OPEN",
          id,
          duration: data.time_remaining ? parseTime(data.time_remaining) : 600,
          user: data.current_user || "Guest User"
        });
      } catch (err) {
        addNotification(`Error opening locker: ${err.message}`, 'error', 'locker');
      }
    },
    [setSelectedLocker, addNotification]
  );

  const handleClose = React.useCallback(
    (id) => {
      addNotification(`${id} has been released and is now available.`, 'info', 'locker');
      dispatch({ type: "CLOSE", id });
    },
    [addNotification]
  );

  // metrics memoized
  const metrics = React.useMemo(() => {
    const total = lockers.length;
    const available = lockers.filter((l) => l.status === "Available").length;
    const occupied = lockers.filter(
      (l) => l.status === "In Use" || l.status === "Occupied"
    ).length;
    const expired = lockers.filter((l) => l.status === "Expired").length;
    return { total, available, occupied, expired };
  }, [lockers]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar title="Locket" admin={adminUser} onLogout={() => { logout(); navigate('/login'); }} user={user} />
        <main className="dashboard-main">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading lockers...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Navbar title="Locket" admin={adminUser} onLogout={() => { logout(); navigate('/login'); }} user={user} />
        <main className="dashboard-main">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>Error loading lockers: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar title="Locket" admin={adminUser} onLogout={() => { logout(); navigate('/login'); }} user={user} />




      {/* Main Content Section */}
      <main className="dashboard-main">
        {selectedLocker && (
          <div className="selected-locker-banner">
            Selected Locker: {selectedLocker}
            <button className="btn secondary" onClick={() => { setSelectedLocker(null); }}>
              Clear
            </button>
          </div>
        )}
        {/* System Metrics Section */}
        <section className="metrics-section">
          <h2 className="section-title">System Metrics</h2>
          <div className="metrics-grid">
                {/* Total Lockers Card */}
            <div className="metric-card total">
              <h3 className="metric-title">Total Lockers</h3>
              <p className="metric-value">{metrics.total}</p>
              <p className="metric-subtitle">All units in system</p>
            </div>

            {/* Available Lockers Card */}
            <div className="metric-card available">
              <h3 className="metric-title">Available Lockers</h3>
              <p className="metric-value">{metrics.available}</p>
              <p className="metric-subtitle">Ready to use</p>
            </div>

            {/* Occupied Lockers Card */}
            <div className="metric-card occupied">
              <h3 className="metric-title">Occupied Lockers</h3>
              <p className="metric-value">{metrics.occupied}</p>
              <p className="metric-subtitle">Currently in use</p>
            </div>

            {/* Expired Rentals Card */}
            <div className="metric-card expired">
              <h3 className="metric-title">Expired Rentals</h3>
              <p className="metric-value">{metrics.expired}</p>
              <p className="metric-subtitle">Require attention</p>
            </div>
          </div>
        </section>

        {/* Locker Status Section */}
        <section className="lockers-section">
          <h2 className="section-title">Locker Status</h2>
          <div className="lockers-grid">
            {lockers.map((locker) => (
              <LockerCard
                key={locker.id}
                locker={{
                  ...locker,
                  lockerId: locker.id,
                  user: locker.current_user
                }}
                onOpen={handleOpen}
                onClose={handleClose}
              />
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="notifications-section">
          <div className="notifications-header">
            <h2 className="section-title">System Notifications</h2>
            {notifications.length > 0 && (
              <button className="btn secondary clear-notifications-btn" onClick={() => clearNotifications()}>
                Clear All
              </button>
            )}
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              <ul className="notification-items">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`notification-item ${notification.type}`}
                  >
                    <div className="notification-icon">
                      {notification.type === "warning" && "⚠️"}
                      {notification.type === "info" && "ℹ️"}
                      {notification.type === "alert" && "🚨"}
                      {notification.type === "success" && "✅"}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {notification.timestamp}
                      </span>
                    </div>
                    <button 
                      className="notification-delete-btn"
                      onClick={() => removeNotification(notification.id)}
                      aria-label="Delete notification"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-notifications">No notifications at this time</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="dashboard-footer">
        <p className="footer-status">{systemStatus}</p>
        <p className="footer-copyright">
          © 2026 IoT Smart Locker Vending System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
