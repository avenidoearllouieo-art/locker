import React from "react";
import {
  adminUser,
  systemMetrics,
  lockersData,
  notificationsData,
  systemStatus
} from "../data/mockData";
import "../styles/dashboard.css";

export default function SmartLockerDashboard() {
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="system-title">
            🔐 IoT Smart Locker Vending System
          </h1>
          <div className="admin-info">
            <span className="admin-label">Administrator:</span>
            <span className="admin-name">{adminUser.name}</span>
            <span className="admin-role">({adminUser.role})</span>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="dashboard-main">
        {/* System Metrics Section */}
        <section className="metrics-section">
          <h2 className="section-title">System Metrics</h2>
          <div className="metrics-grid">
            {/* Total Lockers Card */}
            <div className="metric-card total">
              <h3 className="metric-title">Total Lockers</h3>
              <p className="metric-value">{systemMetrics.totalLockers}</p>
              <p className="metric-subtitle">All units in system</p>
            </div>

            {/* Available Lockers Card */}
            <div className="metric-card available">
              <h3 className="metric-title">Available Lockers</h3>
              <p className="metric-value">{systemMetrics.availableLockers}</p>
              <p className="metric-subtitle">Ready to use</p>
            </div>

            {/* Occupied Lockers Card */}
            <div className="metric-card occupied">
              <h3 className="metric-title">Occupied Lockers</h3>
              <p className="metric-value">{systemMetrics.occupiedLockers}</p>
              <p className="metric-subtitle">Currently in use</p>
            </div>

            {/* Expired Rentals Card */}
            <div className="metric-card expired">
              <h3 className="metric-title">Expired Rentals</h3>
              <p className="metric-value">{systemMetrics.expiredRentals}</p>
              <p className="metric-subtitle">Require attention</p>
            </div>
          </div>
        </section>

        {/* Locker Status Section */}
        <section className="lockers-section">
          <h2 className="section-title">Locker Status</h2>
          <div className="lockers-grid">
            {lockersData.map((locker) => (
              <div key={locker.lockerId} className={`locker-card ${locker.status.toLowerCase()}`}>
                <div className="locker-header">
                  <span className="locker-id">{locker.lockerId}</span>
                  <span className={`status-badge ${locker.status.toLowerCase()}`}>
                    {locker.status}
                  </span>
                </div>
                <div className="locker-details">
                  <p className="detail-row">
                    <span className="label">Capacity:</span>
                    <span className="value">{locker.capacity}</span>
                  </p>
                  <p className="detail-row">
                    <span className="label">Time Remaining:</span>
                    <span className="value">{locker.timeRemaining}</span>
                  </p>
                  {locker.user && (
                    <p className="detail-row">
                      <span className="label">User:</span>
                      <span className="value">{locker.user}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="notifications-section">
          <h2 className="section-title">System Notifications</h2>
          <div className="notifications-list">
            {notificationsData.length > 0 ? (
              <ul className="notification-items">
                {notificationsData.map((notification) => (
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
