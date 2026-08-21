import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { VfmLeaderboardPage } from "./pages/VfmLeaderboardPage";
import { FairMarketPricePage } from "./pages/FairMarketPricePage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoginForm } from "./components/LoginForm";
import { authApi } from "./api/authApi";

// Component για τα Tabs Πλοήγησης που αλλάζει το URL
function NavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const isVfm = location.pathname === "/vfmdashboard" || location.pathname === "/";
  const isValuation = location.pathname === "/fair-market-price";

  return (
    <div className="bg-gray-900/60 border-b border-gray-800 px-6 py-2.5 flex justify-center gap-4">
      <button
        onClick={() => navigate("/vfmdashboard")}
        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${isVfm
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          }`}
      >
        🏆 VFM Leaderboard
      </button>
      <button
        onClick={() => navigate("/fair-market-price")}
        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${isValuation
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          }`}
      >
        📊 Fair Market Price
      </button>
    </div>
  );
}

// Main Content layout για συνδεδεμένους χρήστες
function AuthenticatedLayout({ onLogout, onOpenTerms, onOpenPrivacy }: {
  onLogout: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
      <Header onLogout={onLogout} />
      <NavigationTabs />

      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/vfmdashboard" element={<VfmLeaderboardPage />} />
          <Route path="/fair-market-price" element={<FairMarketPricePage />} />
          <Route path="/" element={<Navigate to="/vfmdashboard" replace />} />
          <Route path="*" element={<Navigate to="/vfmdashboard" replace />} />
        </Routes>
      </main>

      <Footer onOpenTerms={onOpenTerms} onOpenPrivacy={onOpenPrivacy} />
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  // Ενημέρωση του state αν αλλάξει το token στο localStorage
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    const userEmail = localStorage.getItem("userEmail") || "";
    await authApi.logout(userEmail);
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  if (showTerms) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
        <main className="flex-1 w-full flex flex-col">
          <TermsPage onBack={() => setShowTerms(false)} />
        </main>
        <Footer
          onOpenTerms={() => { setShowPrivacy(false); setShowTerms(true); }}
          onOpenPrivacy={() => { setShowTerms(false); setShowPrivacy(true); }}
        />
      </div>
    );
  }

  if (showPrivacy) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
        <main className="flex-1 w-full flex flex-col">
          <PrivacyPage onBack={() => setShowPrivacy(false)} />
        </main>
        <Footer
          onOpenTerms={() => { setShowPrivacy(false); setShowTerms(true); }}
          onOpenPrivacy={() => { setShowTerms(false); setShowPrivacy(true); }}
        />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0b]">
        <LoginForm onSuccess={handleLoginSuccess} />
        <div className="text-center pb-6 flex justify-center gap-4">
          <button
            onClick={() => setShowTerms(true)}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline transition-colors"
          >
            Όροι &amp; Προϋποθέσεις Χρήσης
          </button>
          <span className="text-xs text-zinc-600">•</span>
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline transition-colors"
          >
            Πολιτική Απορρήτου
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthenticatedLayout
        onLogout={handleLogout}
        onOpenTerms={() => setShowTerms(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />
    </BrowserRouter>
  );
}