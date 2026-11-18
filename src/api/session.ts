// The login session lives in localStorage (same keys as before, so nobody is logged out by this change).
const TOKEN = "token";
const REFRESH = "refreshToken";
const EMAIL = "userEmail";

export interface Session {
  token: string;
  refreshToken?: string | null;
  email?: string | null;
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const session = {
  token: (): string | null => localStorage.getItem(TOKEN),
  refreshToken: (): string | null => localStorage.getItem(REFRESH),
  email: (): string => localStorage.getItem(EMAIL) ?? "",

  save(s: Session) {
    localStorage.setItem(TOKEN, s.token);
    if (s.refreshToken) localStorage.setItem(REFRESH, s.refreshToken);
    if (s.email) localStorage.setItem(EMAIL, s.email);
    notify();
  },

  clear() {
    [TOKEN, REFRESH, EMAIL].forEach((k) => localStorage.removeItem(k));
    notify();
  },

  /** Called after any change in this tab or in another one. Returns the unsubscribe function. */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => (e.key === TOKEN || e.key === null) && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
};
