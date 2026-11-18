import React, { useState } from "react";
import { authApi } from "../api/auth";
import { session } from "../api/session";
import { Button } from "./ui/Button";
import { Field, TextInput } from "./ui/Field";
import { Notice } from "./ui/Feedback";
import { Panel } from "./ui/Panel";

// The MFA step must survive a page reload: the server only gave us a one-time token for it.
const PENDING = "mfa_pending";
interface Pending {
  preAuthToken: string;
  email: string;
}
const readPending = (): Pending | null => {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING) ?? "null");
  } catch {
    return null;
  }
};

/** Sign in with email and password, then (if the account has MFA) with the 6-digit code. A successful login saves the session; the app reacts to that. */
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(() => readPending()?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState<Pending | null>(readPending);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = (token: string, refreshToken?: string) => {
    sessionStorage.removeItem(PENDING);
    session.save({ token, refreshToken, email });
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await authApi.login(email, password);
      if (r.requiresTwoFactor && r.preAuthToken) {
        const next = { preAuthToken: r.preAuthToken, email };
        sessionStorage.setItem(PENDING, JSON.stringify(next));
        setPending(next);
      } else if (r.token) finish(r.token, r.refreshToken);
      else setError("Μη έγκυρα στοιχεία σύνδεσης.");
    } catch {
      setError("Η σύνδεση απέτυχε. Ελέγξτε τα στοιχεία σας και τη σύνδεσή σας.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    setLoading(true);
    setError(null);
    try {
      const r = await authApi.verifyMfa(pending.preAuthToken, code);
      if (r.token) finish(r.token, r.refreshToken);
      else throw new Error("no token");
    } catch {
      setCode("");
      setError("Ο κωδικός δεν είναι σωστός ή έχει λήξει. Δοκιμάστε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    sessionStorage.removeItem(PENDING);
    setPending(null);
    setCode("");
    setPassword("");
    setError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Panel className="w-full max-w-md !p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Car Scanner Intelligence</h1>
          <p className="text-sm text-gray-400 mt-2">{pending ? "Εισάγετε τον κωδικό 6 ψηφίων από την εφαρμογή ταυτοποίησης" : "Συνδεθείτε για πρόσβαση στις αναλύσεις αγοράς και στις ευκαιρίες"}</p>
        </div>

        {error && <Notice tone="danger" className="mb-4">{error}</Notice>}

        {!pending ? (
          <form onSubmit={login} className="flex flex-col gap-4">
            <Field label="Διεύθυνση email">
              <TextInput type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
            </Field>
            <Field label="Κωδικός πρόσβασης">
              <div className="flex gap-2">
                <TextInput type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="ghost" aria-label={showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"} onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? "🙈" : "👁"}
                </Button>
              </div>
            </Field>
            <Button type="submit" disabled={loading}>{loading ? "Σύνδεση..." : "Σύνδεση"}</Button>
          </form>
        ) : (
          <form onSubmit={verify} className="flex flex-col gap-4">
            <Field label="Κωδικός 6 ψηφίων από την εφαρμογή ταυτοποίησης">
              <TextInput inputMode="numeric" autoComplete="one-time-code" maxLength={6} required autoFocus value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="text-center tracking-[0.4em] font-mono" />
            </Field>
            <Button type="submit" disabled={loading || code.length < 6}>{loading ? "Επαλήθευση..." : "Επαλήθευση κωδικού"}</Button>
            <Button variant="ghost" onClick={backToLogin}>← Πίσω στη σύνδεση</Button>
          </form>
        )}
      </Panel>
    </div>
  );
};
