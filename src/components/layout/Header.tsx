import React from "react";

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-gray-950 border-b border-gray-800/80 px-6 py-3.5 flex justify-between items-center text-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
        <span className="font-extrabold tracking-tight text-sm text-white">
          CARSCANNER <span className="text-gray-400 font-medium ml-1">ENGINE</span>
        </span>
      </div>
      <button
        onClick={onLogout}
        className="bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs font-semibold px-3.5 py-1.5 rounded-md transition-all"
      >
        Logout
      </button>
    </header>
  );
};