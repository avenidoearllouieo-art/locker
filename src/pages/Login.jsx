import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      return setError("Please enter username.");
    }
    if (password.length < 4) {
      return setError("Password must be at least 4 characters.");
    }

    setIsLoading(true);
    try {
      await login({ username: username.trim(), password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <h2>Login to Smart Locker</h2>
        <p className="login-subtitle">Access your lockers and manage rentals</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              disabled={isLoading}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <div className="form-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
