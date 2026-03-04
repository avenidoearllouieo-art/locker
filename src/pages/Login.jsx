import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) return setError("Please enter username.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    // simple mock validation
    login({ username: username.trim() });
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <h2>Login to Locket</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn primary">Sign In</button>
          </div>
        </form>
      </main>
    </div>
  );
}
