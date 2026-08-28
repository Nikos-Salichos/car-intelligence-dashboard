import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, verifyMfaCode, logoutUser, LoginPayload } from "../api/authApi";

interface AuthContextType {
    isAuthenticated: boolean;
    userToken: string | null;
    requiresMfa: boolean;
    mfaUserId: string | null;
    login: (credentials: LoginPayload) => Promise<boolean>;
    submitMfa: (code: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(localStorage.getItem("token"));
    const [requiresMfa, setRequiresMfa] = useState<boolean>(false);
    const [mfaUserId, setMfaUserId] = useState<string | null>(null);

    useEffect(() => {
        const existingToken = localStorage.getItem("token");
        if (existingToken) {
            setUserToken(existingToken);
        }
    }, []);

    // English Comment: Handle primary authentication step and determine if MFA verification is required
    const login = async (credentials: LoginPayload): Promise<boolean> => {
        try {
            const response = await loginUser(credentials);

            if (response.requiresMfa && response.userId) {
                setRequiresMfa(true);
                setMfaUserId(response.userId);
                return false; // MFA flow required before full login completion
            }

            if (response.token && response.refreshToken) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("refreshToken", response.refreshToken);
                setUserToken(response.token);
                setRequiresMfa(false);
                setMfaUserId(null);
                return true;
            }

            return false;
        } catch (error) {
            console.error("[AUTH CONTEXT] Login failed:", error);
            throw error;
        }
    };

    // English Comment: Handle multi-factor verification code submission
    const submitMfa = async (code: string): Promise<boolean> => {
        if (!mfaUserId) {
            throw new Error("Missing user identification for MFA submission.");
        }

        try {
            const response = await verifyMfaCode({ userId: mfaUserId, code });

            if (response.token && response.refreshToken) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("refreshToken", response.refreshToken);
                setUserToken(response.token);
                setRequiresMfa(false);
                setMfaUserId(null);
                return true;
            }

            return false;
        } catch (error) {
            console.error("[AUTH CONTEXT] MFA verification failed:", error);
            throw error;
        }
    };

    // English Comment: Clear authentication state and handle session termination
    const logout = async (): Promise<void> => {
        await logoutUser();
        setUserToken(null);
        setRequiresMfa(false);
        setMfaUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!userToken,
                userToken,
                requiresMfa,
                mfaUserId,
                login,
                submitMfa,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};