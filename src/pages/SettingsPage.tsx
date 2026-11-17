import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { authApi } from "../api/authApi";

interface SettingsPageProps {
  readonly userEmail?: string;
}

// Settings page component for managing user preferences, account security, and multi-factor authentication
export const SettingsPage: React.FC<SettingsPageProps> = ({ userEmail }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaUri, setMfaUri] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial MFA activation status on component mount
  useEffect(() => {
    const fetchMfaStatus = async () => {
      try {
        const response = await authApi.getMfaStatus();
        setMfaEnabled(Boolean(response?.mfaEnabled));
      } catch (err: unknown) {
        console.error("[FETCH MFA STATUS ERROR]", err);
      }
    };

    void fetchMfaStatus();
  }, []);

  // Handle password change form submission
  const handlePasswordChange = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "Ο νέος κωδικός και η επιβεβαίωση δεν ταιριάζουν." });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες." });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setStatusMessage({ type: "success", text: "Ο κωδικός ενημερώθηκε!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorText = errorObj?.response?.data?.message || "Failed to update password. Please check your current password.";
      setStatusMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  // Initiate MFA setup flow or disable active MFA
  const handleToggleMfa = async () => {
    setStatusMessage(null);
    setLoading(true);

    try {
      if (mfaEnabled) {
        await authApi.disableMfa();
        setMfaEnabled(false);
        setMfaSecret(null);
        setMfaUri(null);
        setStatusMessage({ type: "success", text: "Η ταυτοποίηση δύο παραγόντων απενεργοποιήθηκε." });
      } else {
        const response = await authApi.setupMfa(userEmail);
        setMfaSecret(response.secret || "MFA-SECRET-KEY");
        setMfaUri(response.authenticatorUri || null);
        setStatusMessage({ type: "success", text: "Σαρώστε τον κωδικό QR ή εισάγετε το μυστικό κλειδί στην εφαρμογή ταυτοποίησης." });
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorText = errorObj?.response?.data?.message || "Η ενημέρωση των ρυθμίσεων MFA απέτυχε.";
      setStatusMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  // Confirm setup code to activate MFA
  const handleVerifyMfaSetup = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      await authApi.verifyMfaSetup({ code: mfaCode, email: userEmail });
      setMfaEnabled(true);
      setMfaSecret(null);
      setMfaUri(null);
      setMfaCode("");
      setStatusMessage({ type: "success", text: "Η ταυτοποίηση δύο παραγόντων ενεργοποιήθηκε!" });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorText = errorObj?.response?.data?.message || "Invalid verification code. Please try again.";
      setStatusMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">⚙️ Ρυθμίσεις και ασφάλεια λογαριασμού</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account credentials, view user status, and configure Multi-Factor Authentication (MFA).</p>
      </div>

      {/* Global Status Banner */}
      {statusMessage && <div className={`p-4 rounded-lg text-sm font-medium border ${statusMessage.type === "success" ? "bg-emerald-950/50 text-emerald-300 border-emerald-800" : "bg-red-950/50 text-red-300 border-red-800"}`}>{statusMessage.text}</div>}

      {/* Account Info Card */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Στοιχεία λογαριασμού</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label htmlFor="accountEmail" className="text-gray-400 block mb-1">
              Διεύθυνση email
            </label>
            <input id="accountEmail" type="text" readOnly value={userEmail || "user@carscanner.com"} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 cursor-not-allowed focus:outline-none" />
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Κατάσταση λογαριασμού</span>
            <div className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-emerald-400 font-medium">● Ενεργός και επαληθευμένος</div>
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication Card */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Two-Factor Authentication (MFA)</h2>
            <p className="text-xs text-gray-400 mt-0.5">{mfaEnabled ? "MFA is enabled. Your account has an extra layer of security." : "Secure your account using an authenticator application (e.g., Google Authenticator, Authy)."}</p>
          </div>
          <button type="button" onClick={handleToggleMfa} disabled={loading} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${mfaEnabled ? "bg-red-600/80 hover:bg-red-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"} disabled:opacity-50`}>
            {mfaEnabled ? "Απενεργοποίηση MFA" : "Ενεργοποίηση MFA"}
          </button>
        </div>

        {/* Secret Key & QR Display step rendered strictly when MFA is not yet enabled */}
        {!mfaEnabled && mfaSecret && (
          <div className="mt-4 p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-4">
            <p className="text-xs text-gray-300">1. Σαρώστε αυτόν τον κωδικό QR με την εφαρμογή ταυτοποίησης:</p>

            {/* Display QR image generated from backend authenticatorUri */}
            {mfaUri && (
              <div className="flex justify-center bg-white p-3 rounded-lg max-w-45 mx-auto border border-gray-700">
                <QRCodeSVG value={mfaUri} size={150} level="M" />
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs text-gray-400">Ή εισάγετε χειροκίνητα αυτό το μυστικό κλειδί:</p>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded text-center text-xs font-mono text-blue-400 select-all">{mfaSecret}</div>
            </div>

            <form onSubmit={handleVerifyMfaSetup} className="space-y-3">
              <label htmlFor="mfaCode" className="text-xs text-gray-300 block font-semibold">
                2. Επιβεβαιώστε τον κωδικό επαλήθευσης:
              </label>
              <div className="flex gap-2 items-center">
                <input id="mfaCode" type="text" placeholder="Κωδικός 6 ψηφίων" value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))} maxLength={6} required className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-48 font-mono tracking-widest text-center" />
                <button type="submit" disabled={loading || mfaCode.length < 6} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50">
                  Επιβεβαίωση κωδικού
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Αλλαγή κωδικού Card */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Αλλαγή κωδικού</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="text-xs text-gray-400 block mb-1">
              Τρέχων κωδικός
            </label>
            <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-xs text-gray-400 block mb-1">
              Νέος κωδικός
            </label>
            <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-xs text-gray-400 block mb-1">
              Επιβεβαίωση νέου κωδικού
            </label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50">
            Ενημέρωση κωδικού
          </button>
        </form>
      </div>
    </div>
  );
};
