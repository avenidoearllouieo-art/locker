import React from "react";

export default function TimerDisplay({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const padded = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const warning = timeLeft > 0 && timeLeft <= 60;
  return (
    <div className={`timer-display${warning ? " warning" : ""}`}>
      {padded}
    </div>
  );
}