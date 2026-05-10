import React, { useState } from "react";
import { RENTAL_DURATIONS, RENTAL_DURATION_LABELS } from "../data/mockData";
import Button from "./Button";

function RentalDurationModal({ isOpen, onClose, onConfirm, availableLockers = [], lockerNumber = null }) {
  const [selectedDuration, setSelectedDuration] = useState(3600); // Default 1 hour
  const [selectedLockerForModal, setSelectedLockerForModal] = useState(null);
  const shouldShowLockerSelection = availableLockers && availableLockers.length > 0;

  const handleConfirm = () => {
    if (shouldShowLockerSelection) {
      // Dashboard modal: need both locker ID and duration
      if (selectedDuration && selectedLockerForModal) {
        onConfirm(selectedLockerForModal, selectedDuration);
        setSelectedDuration(3600);
        setSelectedLockerForModal(null);
      }
    } else {
      // Card modal: just duration (locker ID will be from parent context)
      if (selectedDuration) {
        onConfirm(selectedDuration);
        setSelectedDuration(3600);
      }
    }
  };

  const handleClose = () => {
    setSelectedDuration(3600);
    setSelectedLockerForModal(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content rental-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header rental-modal-header">
          <h2>
            {shouldShowLockerSelection ? 'Rent a Locker' : `Rent Locker #${lockerNumber}`}
          </h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body rental-modal-body">
          {/* Select Locker - Only shown in dashboard modal */}
          {shouldShowLockerSelection && (
            <div className="form-group">
              <label className="form-label">Select Locker</label>
              <select 
                className="form-control dropdown"
                value={selectedLockerForModal || ""}
                onChange={(e) => setSelectedLockerForModal(Number(e.target.value))}
              >
                <option value="">Choose a locker...</option>
                {availableLockers.map(l => (
                  <option key={l.id} value={l.id}>Locker #{l.number}</option>
                ))}
              </select>
            </div>
          )}

          {/* Rental Duration */}
          <div className="form-group">
            <label className="form-label">Rental Duration</label>
            <select 
              className="form-control dropdown"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
            >
              {Object.entries(RENTAL_DURATIONS).map(([key, value]) => (
                <option key={key} value={value}>
                  {RENTAL_DURATION_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Info Messages */}
          <div className="rental-info">
            <div className="info-message info-message-primary">
              <span className="info-icon">📋</span>
              <span>After renting, the locker will start counting down from the selected duration.</span>
            </div>
            <div className="info-message info-message-warning">
              <span className="info-icon">⏰</span>
              <span>You'll receive a warning when 5 minutes remain.</span>
            </div>
          </div>
        </div>

        <div className="modal-footer rental-modal-footer">
          <Button 
            className="btn-rent"
            onClick={handleConfirm}
          >
            Rent Locker
          </Button>
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RentalDurationModal;
