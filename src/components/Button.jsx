import React from "react";
import "../styles/dashboard.css";

export default function Button({ children, onClick, variant = "primary", disabled = false }) {
  const className = `btn ${variant}${disabled ? " disabled" : ""}`;
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}