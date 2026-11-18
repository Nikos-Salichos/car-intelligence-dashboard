import React, { lazy, Suspense, useSyncExternalStore } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { session } from "./api/session";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { LoginForm } from "./components/LoginForm";
import { Loading } from "./components/ui/Feedback";

// Each screen is its own file that loads when first visited: the first page stays small.
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));
const ValuationPage = lazy(() => import("./pages/ValuationPage"));
const ListingBriefPage = lazy(() => import("./pages/ListingBriefPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage").then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })));

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-sans text-[#f2f2f4]">{children}</div>;

/** The signed-in app: header, the current screen, footer. */
const AppShell: React.FC = () => (
  <Frame>
    <Header />
    <main className="flex-1 w-full flex flex-col">
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </main>
    <Footer />
  </Frame>
);

/** Terms and privacy are readable without signing in. */
const Legal: React.FC<{ page: "terms" | "privacy" }> = ({ page }) => {
  const navigate = useNavigate();
  const Page = page === "terms" ? TermsPage : PrivacyPage;
  return (
    <Frame>
      <main className="flex-1 w-full flex flex-col">
        <Suspense fallback={<Loading />}>
          <Page onBack={() => navigate(-1)} />
        </Suspense>
      </main>
      <Footer />
    </Frame>
  );
};

export default function App() {
  const signedIn = useSyncExternalStore(session.subscribe, () => Boolean(session.token()));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route path="/privacy" element={<Legal page="privacy" />} />

        {signedIn ? (
          <Route element={<AppShell />}>
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/brief/:listingId" element={<ListingBriefPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* addresses of the previous versions, so bookmarks keep working */}
            <Route path="/vfmdashboard" element={<Navigate to="/opportunities?view=all" replace />} />
            <Route path="/negotiation" element={<Navigate to="/opportunities?view=negotiation" replace />} />
            <Route path="/competition" element={<Navigate to="/opportunities?view=flip&by=model" replace />} />
            <Route path="/fair-market-price" element={<Navigate to="/valuation" replace />} />
            <Route path="*" element={<Navigate to="/opportunities" replace />} />
          </Route>
        ) : (
          <Route
            path="*"
            element={
              <Frame>
                <LoginForm />
                <Footer />
              </Frame>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}
