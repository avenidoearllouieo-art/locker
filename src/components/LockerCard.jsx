import React from "react";
import Button from "./Button";
import TimerDisplay from "./TimerDisplay";

function formatTime(sec) {
  if (sec <= 0) return "--";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function LockerCard({ locker, onOpen, onClose }) {
  const isAvailable = locker.status === "Available";
  const isInUse = locker.status === "In Use" || locker.status === "Occupied";
  const statusClass = locker.status.toLowerCase().replace(/\s+/g, "-");

  const timeLeft = locker.timeLeft || 0;
  const timeRemainingText = formatTime(timeLeft);

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
          <Button onClick={() => onOpen(locker.lockerId)}>
            Open Locker
          </Button>
        )}
        {isInUse && (
          <Button variant="secondary" onClick={() => onClose(locker.lockerId)}>
            Release Lock
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.memo(LockerCard);