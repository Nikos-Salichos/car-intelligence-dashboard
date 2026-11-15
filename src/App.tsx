import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { VfmLeaderboardPage } from "./pages/VfmLeaderboardPage";
import { FairMarketPricePage } from "./pages/FairMarketPricePage";
import { NegotiationSignalsPage } from "./pages/NegotiationSignalsPage";
import { CompetitionPage } from "./pages/CompetitionPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ListingBriefPage } from "./pages/ListingBriefPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoginForm } from "./components/LoginForm";
import { authApi } from "./api/authApi";

const TABS = [
  { to: "/vfmdashboard", label: "🏆 Κατάταξη Ευκαιριών" },
  { to: "/negotiation", label: "📉 Διαπραγμάτευση" },
  { to: "/competition", label: "🤝 Ιδιώτες vs Έμποροι" },
  { to: "/fair-market-price", label: "📊 Δίκαιη Τιμή Αγοράς" },
  { to: "/settings", label: "⚙️ Ρυθμίσεις & MFA" },
];

// Real links: keyboard/screen-reader friendly, middle-click works, aria-current set automatically
function NavigationTabs() {
  return (
    <nav aria-label="Κύρια πλοήγηση" className="bg-gray-900/60 border-b border-gray-800 px-4 sm:px-6 py-2.5 flex justify-start md:justify-center gap-2 sm:gap-4 overflow-x-auto">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"}`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}

// Main Content layout for authenticated users
function AuthenticatedLayout({
  userEmail,
  onLogout,
  onOpenTerms,
  onOpenPrivacy,
}: Readonly<{
  userEmail: string;
  onLogout: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
      <Header onLogout={onLogout} />
      <NavigationTabs />

      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/vfmdashboard" element={<VfmLeaderboardPage />} />
          <Route path="/negotiation" element={<NegotiationSignalsPage />} />
          <Route path="/competition" element={<CompetitionPage />} />
          <Route path="/fair-market-price" element={<FairMarketPricePage />} />
          <Route path="/brief/:listingId" element={<ListingBriefPage />} />
          <Route path="/settings" element={<SettingsPage userEmail={userEmail} />} />
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
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem("userEmail") || "");
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  // Sync token state across storage events
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserEmail(localStorage.getItem("userEmail") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    const email = localStorage.getItem("userEmail") || "";
    await authApi.logout(email);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail("");
  };

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const storedEmail = localStorage.getItem("userEmail") || "";
    setUserEmail(storedEmail);
  };

  if (showTerms) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
        <main className="flex-1 w-full flex flex-col">
          <TermsPage onBack={() => setShowTerms(false)} />
        </main>
        <Footer
          onOpenTerms={() => {
            setShowPrivacy(false);
            setShowTerms(true);
          }}
          onOpenPrivacy={() => {
            setShowTerms(false);
            setShowPrivacy(true);
          }}
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
          onOpenTerms={() => {
            setShowPrivacy(false);
            setShowTerms(true);
          }}
          onOpenPrivacy={() => {
            setShowTerms(false);
            setShowPrivacy(true);
          }}
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
        userEmail={userEmail}
        onLogout={handleLogout}
        onOpenTerms={() => setShowTerms(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />
    </BrowserRouter>
  );
}