import React from "react";
import logoImg from "../logo.png";

export default function Navbar({ title, admin }) {
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
        </div>
      </div>
    </header>
  );
}