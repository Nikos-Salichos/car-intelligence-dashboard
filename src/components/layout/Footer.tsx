interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export function Footer({ onOpenTerms, onOpenPrivacy }: FooterProps) {
  return (
    <footer className="w-full bg-[#121215] border-t border-zinc-800 text-zinc-400 py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div>
          <p>© {new Date().getFullYear()} Car Market Intelligence. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onOpenTerms}
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Όροι &amp; Προϋποθέσεις
          </button>

          <button
            onClick={onOpenPrivacy}
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Πολιτική Απορρήτου
          </button>
        </div>
      </div>
    </footer>
  );
}