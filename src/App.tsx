import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { GlobalDealsPage } from "./pages/GlobalDealsPage";
import { VfmLeaderboardPage } from "./pages/VfmLeaderboardPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoginForm } from "./components/LoginForm";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [currentView, setCurrentView] = useState<"dashboard" | "global-deals" | "vfm-leaderboard">("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // English Comment: If no active authorization token exists, render the core login form screen
  if (!token) {
    return <LoginForm onSuccess={(newToken: string) => setToken(newToken)} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header onLogout={handleLogout} />

      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex gap-3">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Overview Dashboard
        </button>
        <button
          onClick={() => setCurrentView("vfm-leaderboard")}
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "vfm-leaderboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          VFM Leaderboard
        </button>
        <button
          onClick={() => setCurrentView("global-deals")}
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "global-deals"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Global High-VFM Deals
        </button>
      </div>

      <main style={{ flex: 1 }}>
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "vfm-leaderboard" && <VfmLeaderboardPage />}
        {currentView === "global-deals" && <GlobalDealsPage />}
      </main>

      <Footer />
    </div>
  );
}