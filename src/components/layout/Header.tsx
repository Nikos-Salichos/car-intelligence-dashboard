import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { session } from "../../api/session";

const TABS = [
  { to: "/opportunities", label: "🎯 Ευκαιρίες" },
  { to: "/valuation", label: "📊 Αποτίμηση" },
];

/** The account menu: who is signed in, settings, sign out. Closes on a click elsewhere or Escape. */
const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const email = session.email();
  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg"
      >
        <span aria-hidden>👤</span>
        <span className="hidden sm:inline max-w-[160px] truncate">{email || "Λογαριασμός"}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 py-1 text-sm">
          <Link role="menuitem" to="/settings" onClick={() => setOpen(false)} className="block px-3 py-2 text-gray-200 hover:bg-gray-800">
            ⚙️ Ρυθμίσεις και MFA
          </Link>
          <button
            role="menuitem"
            onClick={async () => {
              await authApi.logout();
              navigate("/");
            }}
            className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-800"
          >
            Αποσύνδεση
          </button>
        </div>
      )}
    </div>
  );
};

/** Brand, the two main sections, and the account menu. */
export const Header: React.FC = () => (
  <header className="bg-gray-950 border-b border-gray-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-4 min-w-0">
      <Link to="/opportunities" className="flex items-center gap-2 font-extrabold text-sm text-white whitespace-nowrap">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" aria-hidden />
        <span className="hidden sm:inline">Car Market Intelligence</span>
      </Link>
      <nav aria-label="Κύρια πλοήγηση" className="flex gap-1">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
    <UserMenu />
  </header>
);
