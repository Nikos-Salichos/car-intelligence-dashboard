import { useState } from "react";
import { VfmLeaderboardPage } from "./pages/VfmLeaderboardPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoginForm } from "./components/LoginForm";
import { authApi } from "./api/authApi";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  const handleLogout = async () => {
    // English Comment: Retrieve current user email or fallback to revoke token on logout
    const userEmail = localStorage.getItem("userEmail") || "";
    await authApi.logout(userEmail);
    setToken(null);
  };

  // English Comment: Render Terms page directly if user clicked the terms link
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

  // English Comment: Render Privacy Policy page directly if user clicked the privacy link
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

  // Direct access boundary - render login interface when token is absent
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0b]">
        <LoginForm onSuccess={(newToken: string) => setToken(newToken)} />
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
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
      <Header onLogout={handleLogout} />

      <main className="flex-1 w-full flex flex-col">
        <VfmLeaderboardPage />
      </main>

      <Footer
        onOpenTerms={() => setShowTerms(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />
    </div>
  );
}