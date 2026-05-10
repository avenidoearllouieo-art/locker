import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const validateForm = () => {
    if (!username.trim()) {
      return "Please enter a username.";
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (!email.trim()) {
      return "Please enter an email address.";
    }
    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (password.length < 4) {
      return "Password must be at least 4 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    setIsLoading(true);
    try {
      await signup({
        username: username.trim(),
        email: email.trim(),
        password: password
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <h2>Create Account</h2>
        <p className="signup-subtitle">Sign up to access Smart Locker System</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              disabled={isLoading}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isLoading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              autoComplete="new-password"
              disabled={isLoading}
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isLoading}
            />
          </label>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
