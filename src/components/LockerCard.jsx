import React, { useState } from "react";
import Button from "./Button";
import TimerDisplay from "./TimerDisplay";
import RentalDurationModal from "./RentalDurationModal";

function formatTime(sec) {
  if (sec <= 0) return "--";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function LockerCard({ locker, onOpen, onClose }) {
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isCloseLoading, setIsCloseLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAvailable = locker.status === "Available";
  const isInUse = locker.status === "In Use";
  const statusClass = locker.status.toLowerCase().replace(/\s+/g, "-");

  const timeLeft = locker.time_left || 0;
  const timeRemainingText = formatTime(timeLeft);

  const handleOpenClick = () => {
    setIsModalOpen(true);
  };

  const handleDurationSelect = async (duration) => {
    setIsModalOpen(false);
    setIsOpenLoading(true);
    try {
      await onOpen(duration);
    } finally {
      setIsOpenLoading(false);
    }
  };

  const handleCloseClick = async () => {
    setIsCloseLoading(true);
    try {
      await onClose(locker.id);
    } finally {
      setIsCloseLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`locker-card ${statusClass}`} 
        role="region" 
        aria-labelledby={`locker-${locker.id}-label`}
      >
        <div className="locker-header">
          <span id={`locker-${locker.id}-label`} className="locker-id">
            Locker #{locker.number}
          </span>
          <span className={`status-badge ${statusClass}`}>{locker.status}</span>
        </div>

        <div className="locker-details">
          {timeLeft > 0 && <TimerDisplay timeLeft={timeLeft} />}
          
          <p className="detail-row">
            <span className="label">Time Remaining:</span>
            <span className="value">{timeRemainingText}</span>
          </p>

          {locker.owner && (
            <p className="detail-row">
              <span className="label">Rented by:</span>
              <span className="value">{locker.owner}</span>
            </p>
          )}

          <div className="locker-actions">
            {isAvailable && (
              <Button 
                onClick={handleOpenClick}
                disabled={isOpenLoading}
              >
                {isOpenLoading ? "Opening..." : "Rent Locker"}
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
      </div>

      <RentalDurationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDurationSelect}
        lockerNumber={locker.number}
      />
    </>
  );
}

export default React.memo(LockerCard);