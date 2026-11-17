import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { authApi } from "../api/authApi";

interface Props {
    userEmail: string;
    isMfaEnabled?: boolean;
    onMfaDisabled?: () => void;
}

export const SetupMfaModal: React.FC<Props> = ({
    userEmail,
    isMfaEnabled = false,
    onMfaDisabled,
}) => {
    const [step, setStep] = useState<"initial" | "scan" | "success">("initial");
    const [mfaActive, setMfaActive] = useState<boolean>(isMfaEnabled);
    const [secret, setSecret] = useState<string>("");
    const [uri, setUri] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartSetup = async () => {
        setLoading(true);
        setError(null);
        try {
            // English Comment: Fetch TOTP secret and authenticator URI for setup flow
            const data = await authApi.setupMfa(userEmail);
            setSecret(data.secret);
            setUri(data.authenticatorUri);
            setStep("scan");
        } catch (err: unknown) {
            console.error("[MFA SETUP ERROR]", err);
            setError("Η έναρξη ρύθμισης MFA απέτυχε.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnableMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // English Comment: Verify TOTP code to complete activation
            await authApi.enableMfa({ email: userEmail, code });
            setMfaActive(true);
            setStep("success");
        } catch (err: unknown) {
            console.error("[MFA ENABLE ERROR]", err);
            setError("Μη έγκυρος κωδικός. Ελέγξτε την εφαρμογή ταυτοποίησης.");
        } finally {
            setLoading(false);
        }
    };

    const handleDisableMfa = async () => {
        setLoading(true);
        setError(null);

        try {
            // English Comment: Απενεργοποίηση MFA for user on backend API
            await authApi.disableMfa();
            setMfaActive(false);
            setStep("initial");
            setSecret("");
            setUri("");
            setCode("");
            if (onMfaDisabled) {
                onMfaDisabled();
            }
        } catch (err: unknown) {
            console.error("[MFA DISABLE ERROR]", err);
            setError("Η απενεργοποίηση του MFA απέτυχε. Δοκιμάστε ξανά.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-white max-w-lg font-sans">
            <h3 className="text-lg font-bold mb-2">Two-Factor Authentication (MFA)</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
                    {error}
                </div>
            )}

            {/* English Comment: Display disable action only if MFA is already active */}
            {mfaActive ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-300">
                        Η ταυτοποίηση δύο παραγόντων είναι ενεργή στον λογαριασμό σας.
                    </p>
                    <button
                        onClick={handleDisableMfa}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Disabling..." : "Disable Two-Factor Auth"}
                    </button>
                </div>
            ) : (
                <>
                    {step === "initial" && (
                        <div>
                            <p className="text-sm text-gray-300 mb-4">
                                Προστατέψτε τον λογαριασμό σας με Google Authenticator, Microsoft Authenticator ή 1Password.
                            </p>
                            <button
                                onClick={handleStartSetup}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                {loading ? "Initializing..." : "Enable Two-Factor Auth"}
                            </button>
                        </div>
                    )}

                    {step === "scan" && (
                        <form onSubmit={handleEnableMfa} className="space-y-4">
                            <p className="text-xs text-gray-300">
                                1. Σαρώστε αυτόν τον κωδικό QR με την εφαρμογή ταυτοποίησης:
                            </p>

                            {/* English Comment: Render visual QR code from authenticator URI payload */}
                            {uri && (
                                <div className="flex justify-center bg-white p-4 rounded-xl max-w-[200px] mx-auto border border-gray-700 shadow-inner">
                                    <QRCodeSVG value={uri} size={168} level="M" />
                                </div>
                            )}

                            <div className="space-y-1 text-center">
                                <p className="text-xs text-gray-400">Ή εισάγετε χειροκίνητα το κλειδί:</p>
                                <div className="bg-gray-900 border border-gray-700 p-2.5 rounded-lg font-mono text-center text-amber-400 tracking-wider text-xs select-all">
                                    {secret}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                    2. Εισάγετε τον κωδικό 6 ψηφίων για επιβεβαίωση
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                    placeholder="123456"
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || code.length !== 6}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                {loading ? "Activating..." : "Verify & Turn On MFA"}
                            </button>
                        </form>
                    )}

                    {step === "success" && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium text-center">
                            ✓ Η ταυτοποίηση δύο παραγόντων είναι πλέον ενεργή!
                        </div>
                    )}
                </>
            )}
        </div>
    );
};