import React, { useState } from "react";
import { authApi } from "../api/authApi";

interface SettingsPageProps {
    userEmail?: string;
}

// English Comment: Settings page component for managing user preferences, account security, and multi-factor authentication
export const SettingsPage: React.FC<SettingsPageProps> = ({ userEmail }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
    const [mfaCode, setMfaCode] = useState("");
    const [mfaSecret, setMfaSecret] = useState<string | null>(null);

    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // English Comment: Handle password change form submission
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);

        if (newPassword !== confirmPassword) {
            setStatusMessage({ type: "error", text: "New password and confirmation do not match." });
            return;
        }

        if (newPassword.length < 6) {
            setStatusMessage({ type: "error", text: "Password must be at least 6 characters long." });
            return;
        }

        setLoading(true);
        try {
            // English Comment: Call backend API endpoint to update user password credentials
            await authApi.changePassword({
                currentPassword,
                newPassword,
            });

            setStatusMessage({ type: "success", text: "Password updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            const errorText = err?.response?.data?.message || "Failed to update password. Please check your current password.";
            setStatusMessage({ type: "error", text: errorText });
        } finally {
            setLoading(false);
        }
    };

    // English Comment: Initiate MFA setup flow or disable active MFA
    const handleToggleMfa = async () => {
        setStatusMessage(null);
        setLoading(true);

        try {
            if (mfaEnabled) {
                // English Comment: Disable MFA on backend
                await authApi.disableMfa();
                setMfaEnabled(false);
                setMfaSecret(null);
                setStatusMessage({ type: "success", text: "Multi-Factor Authentication disabled." });
            } else {
                // English Comment: Request new MFA secret/QR seed from backend API
                const response = await authApi.setupMfa();
                setMfaSecret(response.secret || response.qrCodeUrl || "MFA-SECRET-KEY");
                setStatusMessage({ type: "success", text: "Scan the secret or key below in your authenticator app." });
            }
        } catch (err: any) {
            const errorText = err?.response?.data?.message || "Failed to update MFA settings.";
            setStatusMessage({ type: "error", text: errorText });
        } finally {
            setLoading(false);
        }
    };

    // English Comment: Confirm setup code to activate MFA
    const handleVerifyMfaSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);
        setLoading(true);

        try {
            await authApi.verifyMfaSetup({ code: mfaCode });
            setMfaEnabled(true);
            setMfaSecret(null);
            setMfaCode("");
            setStatusMessage({ type: "success", text: "Multi-Factor Authentication enabled successfully!" });
        } catch (err: any) {
            const errorText = err?.response?.data?.message || "Invalid verification code. Please try again.";
            setStatusMessage({ type: "error", text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header section */}
            <div className="border-b border-gray-800 pb-5">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    ⚙️ Settings & Account Security
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your account credentials, view user status, and configure Multi-Factor Authentication (MFA).
                </p>
            </div>

            {/* Global Status Banner */}
            {statusMessage && (
                <div
                    className={`p-4 rounded-lg text-sm font-medium border ${statusMessage.type === "success"
                            ? "bg-emerald-950/50 text-emerald-300 border-emerald-800"
                            : "bg-red-950/50 text-red-300 border-red-800"
                        }`}
                >
                    {statusMessage.text}
                </div>
            )}

            {/* Account Info Card */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <label className="text-gray-400 block mb-1">Email Address</label>
                        <input
                            type="text"
                            readOnly
                            value={userEmail || "user@carscanner.com"}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 cursor-not-allowed focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 block mb-1">Account Status</label>
                        <div className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-emerald-400 font-medium">
                            ● Active & Verified
                        </div>
                    </div>
                </div>
            </div>

            {/* Multi-Factor Authentication Card */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Two-Factor Authentication (MFA)</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Secure your account using an authenticator application (e.g., Google Authenticator, Authy).
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggleMfa}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${mfaEnabled
                                ? "bg-red-600/80 hover:bg-red-600 text-white"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                            } disabled:opacity-50`}
                    >
                        {mfaEnabled ? "Disable MFA" : "Setup MFA"}
                    </button>
                </div>

                {/* Secret Key Display & Verification Step */}
                {mfaSecret && (
                    <div className="mt-4 p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-4">
                        <p className="text-xs text-gray-300">
                            Enter this secret key into your authenticator app:
                        </p>
                        <div className="bg-gray-900 border border-gray-800 p-2.5 rounded text-center text-xs font-mono text-blue-400 select-all">
                            {mfaSecret}
                        </div>

                        <form onSubmit={handleVerifyMfaSetup} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                maxLength={6}
                                required
                                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-48"
                            />
                            <button
                                type="submit"
                                disabled={loading || mfaCode.length < 6}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                            >
                                Confirm Code
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Change Password Card */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};