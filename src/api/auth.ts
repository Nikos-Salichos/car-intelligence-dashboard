import { apiClient } from "./client";
import { session } from "./session";

export interface AuthResponse {
  token?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
  preAuthToken?: string;
}

export interface MfaSetup {
  secret: string;
  authenticatorUri: string;
}

// Every call here may be refused with a 400/401; the caller decides what to tell the user (never show the axios message: it is English).
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => (await apiClient.post<AuthResponse>("/Auth/login", { email, password })).data,

  verifyMfa: async (preAuthToken: string, code: string): Promise<AuthResponse> => (await apiClient.post<AuthResponse>("/Auth/verify-mfa", { preAuthToken, code })).data,

  /** Tell the server to forget the refresh token, then forget the session here whatever the server says. */
  logout: async (): Promise<void> => {
    const email = session.email();
    try {
      if (email) await apiClient.post("/Auth/revoke", { email });
    } catch {
      // the server could not be reached: still log out locally
    } finally {
      session.clear();
    }
  },

  getMfaStatus: async (): Promise<boolean> => Boolean((await apiClient.get<{ mfaEnabled: boolean }>("/Auth/mfa-status")).data?.mfaEnabled),
  setupMfa: async (): Promise<MfaSetup> => (await apiClient.post<MfaSetup>("/Auth/setup-mfa", { email: session.email() || undefined })).data,
  verifyMfaSetup: async (code: string): Promise<void> => void (await apiClient.post("/Auth/verify-mfa-setup", { email: session.email() || undefined, code })),
  disableMfa: async (): Promise<void> => void (await apiClient.post("/Auth/disable-mfa")),
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => void (await apiClient.post("/Auth/change-password", { currentPassword, newPassword })),
};
