import React from "react";
import logoImg from "../logo.png";

export default function Navbar({ title, admin, onLogout, user }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1 className="system-title">
          <img src={logoImg} alt="Locket Logo" className="logo-img" />
          {title}
        </h1>
        <div className="admin-info">
          <span className="admin-label">Administrator:</span>
          <span className="admin-name">{admin.name}</span>
          <span className="admin-role">({admin.role})</span>
          {user && <span className="current-user">Logged in: {user.name}</span>}
          {onLogout && (
            <button className="btn secondary logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}