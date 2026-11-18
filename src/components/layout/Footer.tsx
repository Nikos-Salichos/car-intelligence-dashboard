import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 text-gray-400 py-5 px-4 mt-auto text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Car Market Intelligence</p>
        <nav aria-label="Νομικά" className="flex items-center gap-6">
          <Link to="/terms" className="hover:text-white underline-offset-4 hover:underline">
            Όροι &amp; Προϋποθέσεις
          </Link>
          <Link to="/privacy" className="hover:text-white underline-offset-4 hover:underline">
            Πολιτική Απορρήτου
          </Link>
        </nav>
      </div>
    </footer>
  );
}
