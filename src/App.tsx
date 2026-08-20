import { useState } from "react";
import { VfmLeaderboardPage } from "./pages/VfmLeaderboardPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoginForm } from "./components/LoginForm";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Direct access boundary - render login interface when token is absent
  if (!token) {
    return <LoginForm onSuccess={(newToken: string) => setToken(newToken)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">
      <Header onLogout={handleLogout} />

      <main className="flex-1 w-full flex flex-col">
        <VfmLeaderboardPage />
      </main>

      <Footer />
    </div>
  );
}
