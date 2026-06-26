import { useEffect, useState, useCallback, useRef } from "react";
import { authApi } from "./api/auth";
import { Dashboard } from "./pages/Dashboard";
import { GlobalDealsPage } from "./pages/GlobalDealsPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // English Comment: Prevent duplicate execution and synchronous cascading render triggers
  const isAuthenticating = useRef<boolean>(false);

  // English Comment: Navigation view state layer switcher between standard analytics and high-vfm global deals
  const [currentView, setCurrentView] = useState<"dashboard" | "global-deals">("dashboard");

  const autoLogin = useCallback(async () => {
    if (isAuthenticating.current) return;

    try {
      console.log("[APP] AUTO LOGIN START");
      isAuthenticating.current = true;
      setLoading(true);
      setAuthError(null);

      const data = await authApi.login("admin@system.local", "ChangeMe_123!");

      console.log("[APP] LOGIN SUCCESS:", data);

      // English Comment: Synchronize storage and component memory layers instantly for interceptors
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
      // English Comment: Defer execution slightly to prevent synchronous state change inside current render tree pass
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

  // 🔥 LOGIN SCREEN
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

  // 🔥 DASHBOARD MODE WITH NAVIGATION SWITCHER
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header onLogout={handleLogout} />

      {/* English Comment: Top sub-navigation control bar to swap context sections dynamically */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex gap-3">
        <button onClick={() => setCurrentView("dashboard")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
          Overview Dashboard
        </button>
        <button onClick={() => setCurrentView("global-deals")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${currentView === "global-deals" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
          Global High-VFM Deals
        </button>
      </div>

      <main style={{ flex: 1 }}>{currentView === "dashboard" ? <Dashboard /> : <GlobalDealsPage />}</main>

      <Footer />
    </div>
  );
}
