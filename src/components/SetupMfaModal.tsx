import React, { useState } from "react";
import { authApi } from "../api/authApi";

interface Props {
    userEmail: string;
}

export const SetupMfaModal: React.FC<Props> = ({ userEmail }) => {
    const [step, setStep] = useState<"initial" | "scan" | "success">("initial");
    const [secret, setSecret] = useState<string>("");
    const [uri, setUri] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartSetup = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.setupMfa(userEmail);
            setSecret(data.secret);
            setUri(data.authenticatorUri);
            setStep("scan");
        } catch (err: unknown) {
            console.error("[MFA SETUP ERROR]", err);
            setError("Failed to initialize MFA setup.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnableMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authApi.enableMfa(userEmail, code);
            setStep("success");
        } catch (err: unknown) {
            console.error("[MFA ENABLE ERROR]", err);
            setError("Invalid verification code. Please check your authenticator app.");
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

            {step === "initial" && (
                <div>
                    <p className="text-sm text-gray-300 mb-4">
                        Protect your account with Google Authenticator, Microsoft Authenticator, or 1Password.
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
                        1. Add this secret key manually into your Authenticator App:
                    </p>

                    <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg font-mono text-center text-amber-400 tracking-wider text-sm select-all">
                        {secret}
                    </div>

                    <p className="text-xs text-gray-400">
                        Authenticator URI: <span className="font-mono text-gray-500 break-all">{uri}</span>
                    </p>

                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                            2. Enter 6-Digit Code to Confirm
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
                    ✓ Two-Factor Authentication is now active on your account!
                </div>
            )}
        </div>
    );
};