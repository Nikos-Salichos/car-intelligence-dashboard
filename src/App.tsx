import { useEffect, useState, useCallback, useRef } from "react";
import { authApi } from "./api/auth";
import { Dashboard } from "./pages/Dashboard";
import { GlobalDealsPage } from "./pages/GlobalDealsPage";
import { VfmLeaderboardPage } from "./pages/VfmLeaderboardPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticating = useRef<boolean>(false);

  // English Comment: Extended view switcher state definition to include independent value-for-money metrics platform layer
  const [currentView, setCurrentView] = useState<"dashboard" | "global-deals" | "vfm-leaderboard">("dashboard");

  const autoLogin = useCallback(async () => {
    if (isAuthenticating.current) return;

    try {
      console.log("[APP] AUTO LOGIN START");
      isAuthenticating.current = true;
      setLoading(true);
      setAuthError(null);

      const data = await authApi.login("admin@system.local", "ChangeMe_123!");

      console.log("[APP] LOGIN SUCCESS:", data);

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err: unknown) {
      console.error("[APP] AUTH FAILED:", err);

      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Authentication failed");
      }
    } finally {
      setLoading(false);
      isAuthenticating.current = false;
    }
  }, []);

  useEffect(() => {
    if (!token && !isAuthenticating.current) {
      const timer = setTimeout(() => {
        autoLogin();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, autoLogin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f172a",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 360,
            padding: 24,
            borderRadius: 12,
            background: "#111827",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ marginBottom: 16 }}>System Access Node</h2>

          {loading && <p>Authenticating...</p>}

          {authError && <pre style={{ color: "red", fontSize: 12 }}>{authError}</pre>}

          {!loading && !authError && (
            <button
              onClick={autoLogin}
              style={{
                width: "100%",
                padding: 10,
                background: "#2563eb",
                border: 0,
                color: "white",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Authenticate Core
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header onLogout={handleLogout} />

      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex gap-3">
        <button onClick={() => setCurrentView("dashboard")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
          Overview Dashboard
        </button>
        <button onClick={() => setCurrentView("vfm-leaderboard")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "vfm-leaderboard" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
          VFM Leaderboard
        </button>
        <button onClick={() => setCurrentView("global-deals")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "global-deals" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
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