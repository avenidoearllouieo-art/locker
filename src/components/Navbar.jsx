import React from "react";

export default function Navbar({ title, user, onLogout }) {

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">{title}</h1>
        </div>

        <nav className="navbar-info">
          <div className="user-section">
            {user ? (
              <>
                <span className="label">Logged in as:</span>
                <span className="user-name">{user.name}</span>
                <button className="btn logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <span className="label">Not logged in</span>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}