import React, { useState } from "react";
import Button from "./Button";
import TimerDisplay from "./TimerDisplay";

function formatTime(sec) {
  if (sec <= 0) return "--";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function LockerCard({ locker, onOpen, onClose }) {
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isCloseLoading, setIsCloseLoading] = useState(false);

  const isAvailable = locker.status === "Available";
  const isInUse = locker.status === "In Use" || locker.status === "Occupied";
  const statusClass = locker.status.toLowerCase().replace(/\s+/g, "-");

  const timeLeft = locker.timeLeft || 0;
  const timeRemainingText = formatTime(timeLeft);

  const handleOpenClick = async () => {
    setIsOpenLoading(true);
    try {
      await onOpen(locker.lockerId);
    } finally {
      setIsOpenLoading(false);
    }
  };

  const handleCloseClick = async () => {
    setIsCloseLoading(true);
    try {
      await onClose(locker.lockerId);
    } finally {
      setIsCloseLoading(false);
    }
  };

  return (
    <div className={`locker-card ${statusClass}`} role="region" aria-labelledby={`${locker.lockerId}-label`}>
      <div className="locker-header">
        <span id={`${locker.lockerId}-label`} className="locker-id">
          {locker.lockerId}
        </span>
        <span className={`status-badge ${statusClass}`}>{locker.status}</span>
      </div>
      <div className="locker-details">
        {timeLeft > 0 && <TimerDisplay timeLeft={timeLeft} />}
        <p className="detail-row">
          <span className="label">Time Remaining:</span>
          <span className="value">{timeRemainingText}</span>
        </p>
        {locker.user && (
          <p className="detail-row">
            <span className="label">User:</span>
            <span className="value">{locker.user}</span>
          </p>
        )}
        {isAvailable && (
          <Button 
            onClick={handleOpenClick}
            disabled={isOpenLoading}
          >
            {isOpenLoading ? "Opening..." : "Open Locker"}
          </Button>
        )}
        {isInUse && (
          <Button 
            variant="secondary" 
            onClick={handleCloseClick}
            disabled={isCloseLoading}
          >
            {isCloseLoading ? "Releasing..." : "Release Lock"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.memo(LockerCard);