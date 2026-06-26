import React from "react";

type HeaderProps = {
  onLogout: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header
      style={{
        padding: "1rem 2rem",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        borderBottom: "2px solid #333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Dynamic Shell Logo */}
      <h2 style={{ margin: 0, color: "#0070f3", fontFamily: "sans-serif" }}>
        🏎️ CarScanner Intelligence Engine
      </h2>

      {/* Primary Action Button */}
      <button
        onClick={onLogout}
        style={{
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </header>
  );
};