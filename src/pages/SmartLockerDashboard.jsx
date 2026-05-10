import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { fetchLockers, rentLocker, releaseLocker } from "../services/lockerService";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import LockerCard from "../components/LockerCard";
import NotificationCenter from "../components/NotificationCenter";
import RentalDurationModal from "../components/RentalDurationModal";

export default function SmartLockerDashboard() {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    expired: 0
  });

  const { isLoggedIn, user, logout, sessionRestored } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    if (!isLoggedIn && sessionRestored) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, sessionRestored]);

  // Fetch lockers from API
  const loadLockers = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchLockers();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setLockers(data);
        addNotification("Lockers loaded successfully from backend", 'info', 'system');
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (err) {
      const errorMessage = err.error || err.message || "Failed to load lockers";
      setError(errorMessage);
      addNotification(`Failed to load lockers: ${errorMessage}`, 'error', 'system');
      // No fallback to mock data - backend is required
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Initialize lockers from API on mount
  useEffect(() => {
    loadLockers();
  }, [loadLockers]);

  // Timer tick effect - countdown for in-use lockers (local display)
  useEffect(() => {
    const interval = setInterval(() => {
      setLockers(prevLockers => {
        return prevLockers.map(locker => {
          if (locker.status === "In Use" && locker.time_left > 0) {
            const newTimeLeft = locker.time_left - 1;

            // 5-minute warning (300 seconds)
            if (newTimeLeft === 300) {
              addNotification(
                `⏰ Warning: Locker #${locker.number} has 5 minutes remaining!`,
                'warning',
                'locker'
              );
            }

            return {
              ...locker,
              time_left: newTimeLeft
            };
          }
          return locker;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Periodic refresh effect - sync with backend every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !error) {
        loadLockers();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [loadLockers, loading, error]);

  // Update statistics whenever lockers change
  useEffect(() => {
    const total = lockers.length;
    const available = lockers.filter(l => l.status === "Available").length;
    const inUse = lockers.filter(l => l.status === "In Use").length;
    const expired = lockers.filter(l => l.status === "Expired").length;

    setStats({ total, available, inUse, expired });
  }, [lockers]);

  // Handle refresh status
  const handleRefreshStatus = async () => {
    await loadLockers();
  };

  // Handle rent locker (open modal)
  const handleRentLocker = () => {
    if (stats.available > 0) {
      setIsRentModalOpen(true);
    } else {
      addNotification("No lockers available for rent", 'warning', 'system');
    }
  };

  // Handle rental confirmation from dashboard modal
  const handleRentalConfirm = (lockerId, rentalDuration) => {
    if (lockerId && rentalDuration) {
      handleOpenLocker(lockerId, rentalDuration);
      setIsRentModalOpen(false);
    }
  };

  // Handle opening a locker with selected duration
  const handleOpenLocker = useCallback(async (id, rentalDuration) => {
    try {
      await rentLocker(id, rentalDuration);
      
      // Refresh locker data from backend to ensure sync
      await loadLockers();
      
      // Find the locker to show notification
      const locker = lockers.find(l => l.id === id);
      if (locker) {
        const durationMinutes = Math.floor(rentalDuration / 60);
        addNotification(
          `🔓 Locker #${locker.number} has been opened. Rental started for ${durationMinutes} minutes.`,
          'success',
          'locker'
        );
      }
    } catch (err) {
      const errorMessage = err.error || err.message || "Failed to rent locker";
      addNotification(`Error renting locker: ${errorMessage}`, 'error', 'locker');
    }
  }, [lockers, addNotification, loadLockers]);

  // Handle releasing/closing a locker
  const handleReleaseLocker = useCallback(async (id) => {
    try {
      await releaseLocker(id);
      
      // Refresh locker data from backend to ensure sync
      await loadLockers();
      
      // Find the locker to show notification
      const locker = lockers.find(l => l.id === id);
      if (locker) {
        addNotification(
          `🔒 Locker #${locker.number} has been released and is now available.`,
          'info',
          'locker'
        );
      }
    } catch (err) {
      const errorMessage = err.error || err.message || "Failed to release locker";
      addNotification(`Error releasing locker: ${errorMessage}`, 'error', 'locker');
    }
  }, [lockers, addNotification, loadLockers]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading Smart Locker System...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar 
        title="Dashboard" 
        user={user}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-welcome">Welcome, {user?.username || user?.name || 'User'}</p>
        </div>

        {error && (
          <div className="error-banner" style={{ background: '#ffe0e0', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ff6b6b' }}>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#c92a2a' }}>⚠️ Backend Connection Error</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555' }}>
                Cannot connect to API at <code style={{ background: '#f0f0f0', padding: '2px 5px', borderRadius: '3px' }}>http://localhost:8000/api</code>
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#555' }}>
                Make sure your Django backend is running: <code style={{ background: '#f0f0f0', padding: '2px 5px', borderRadius: '3px' }}>python manage.py runserver</code>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleRefreshStatus} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                🔄 Retry Connection
              </button>
            </div>
          </div>
        )}

        <section className="system-status-section">
          <h2 className="section-title">System Status</h2>
          <div className="dashboard-stats">
            <div className="stat-card stat-total">
              <p className="stat-value">{stats.total}</p>
              <h3>Total</h3>
            </div>
            <div className="stat-card stat-available">
              <p className="stat-value">{stats.available}</p>
              <h3>Available</h3>
            </div>
            <div className="stat-card stat-in-use">
              <p className="stat-value">{stats.inUse}</p>
              <h3>In Use</h3>
            </div>
            <div className="stat-card stat-expired">
              <p className="stat-value">{stats.expired}</p>
              <h3>Expired</h3>
            </div>
          </div>
        </section>

        <div className="action-buttons">
          <button className="btn btn-primary btn-large" onClick={handleRefreshStatus}>
            Refresh Status
          </button>
          <button className="btn btn-outline btn-large" onClick={handleRentLocker}>
            Rent a Locker ({stats.available} available)
          </button>
        </div>

        <section className="all-lockers-section">
          <h2 className="section-title">All Lockers</h2>
          <div className="lockers-grid">
            {lockers.map(locker => (
              <LockerCard
                key={locker.id}
                locker={locker}
                onOpen={(duration) => handleOpenLocker(locker.id, duration)}
                onClose={() => handleReleaseLocker(locker.id)}
              />
            ))}
          </div>
        </section>

        <section className="notifications-section">
          <NotificationCenter />
        </section>

        <RentalDurationModal 
          isOpen={isRentModalOpen}
          onClose={() => setIsRentModalOpen(false)}
          onConfirm={handleRentalConfirm}
          availableLockers={lockers.filter(l => l.status === "Available")}
        />
      </main>
    </div>
  );
}
