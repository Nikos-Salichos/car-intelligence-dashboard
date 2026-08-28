import React, { useState } from "react";
import { authApi } from "../api/authApi";

interface Props {
    onSuccess: (token: string) => void;
}

export const LoginForm: React.FC<Props> = ({ onSuccess }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // MFA States
    const [requiresMfa, setRequiresMfa] = useState<boolean>(false);
    const [preAuthToken, setPreAuthToken] = useState<string>("");
    const [mfaCode, setMfaCode] = useState<string>("");

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // English Comment: Pass payload object to match LoginPayload signature expected by authApi.login
            const response = await authApi.login({ email, password });

            if (response.requiresTwoFactor && response.preAuthToken) {
                setRequiresMfa(true);
                setPreAuthToken(response.preAuthToken);
            } else if (response.token) {
                onSuccess(response.token);
            } else {
                setError("Invalid credentials or response payload from Auth API.");
            }
        } catch (err: unknown) {
            console.error("[LOGIN ERROR]", err);
            setError("Login failed. Please verify your credentials and API connectivity.");
        } finally {
            setLoading(false);
        }
    };

    const handleMfaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // English Comment: Validate 6-digit TOTP code against pre-auth token using VerifyMfaPayload structure
            const response = await authApi.verifyMfa({ preAuthToken, code: mfaCode });

            if (response.token) {
                onSuccess(response.token);
            } else {
                setError("Verification failed. Please double-check your code.");
            }
        } catch (err: unknown) {
            console.error("[MFA VERIFY ERROR]", err);
            setError("Invalid or expired authentication code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetToLogin = () => {
        setRequiresMfa(false);
        setPreAuthToken("");
        setMfaCode("");
        setError(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
            <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Car Scanner Intelligence</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {requiresMfa
                            ? "Enter the code from your authenticator app"
                            : "Sign in to access analytics and VFM leaderboard"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
                        {error}
                    </div>
                )}

                {!requiresMfa ? (
                    /* English Comment: Standard Login Form */
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-11 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 focus:text-blue-400 focus:outline-none transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>
                ) : (
                    /* English Comment: MFA Verification Form */
                    <form onSubmit={handleMfaSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                6-Digit Authenticator Code
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                autoFocus
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="123456"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || mfaCode.length !== 6}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>

                        <button
                            type="button"
                            onClick={resetToLogin}
                            className="w-full py-2.5 bg-transparent hover:bg-gray-700/50 text-gray-400 font-medium rounded-lg text-xs transition-colors mt-1 focus:outline-none"
                        >
                            ← Back to credentials login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};