import React from "react";

interface State {
  failed: boolean;
}

// Without this, any error while rendering a page unmounts the whole app and the user sees a blank screen.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("Page crashed:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="m-6 p-4 max-w-xl mx-auto bg-red-950/40 border border-red-900/60 text-red-300 rounded-lg text-sm">
        Κάτι πήγε στραβά σε αυτή τη σελίδα.{" "}
        <button className="underline" onClick={() => window.location.reload()}>
          Δοκιμάστε ξανά
        </button>
      </div>
    );
  }
}
