import { apiClient } from "./apiClient";

export interface LoginPayload {
  email: string;
  password?: string;
  passwordHash?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  passwordHash?: string;
}

export interface VerifyMfaPayload {
  preAuthToken?: string;
  userId?: string;
  code: string;
}

export interface SetupMfaResponse {
  secret: string;
  authenticatorUri: string;
  qrCodeUrl?: string;
}

export interface AuthResponse {
  requiresTwoFactor?: boolean;
  requiresMfa?: boolean;
  preAuthToken?: string;
  userId?: string;
  token?: string;
  refreshToken?: string;
  message?: string;
  userContext?: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId: string; // English Comment: Updated to string to support backend Guid deserialization
  };
}

// English Comment: Authenticate user using exact record structure matching LoginDto(string Email, string Password)
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const passwordVal = payload.password || payload.passwordHash || "";

  const response = await apiClient.post<AuthResponse>("/Auth/login", {
    email: payload.email,
    password: passwordVal,
  });

  // English Comment: Normalize MFA indicators across frontend components
  if (response.data.requiresTwoFactor) {
    response.data.requiresMfa = true;
  }

  // English Comment: Save tokens and email if standard authentication succeeds
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  if (response.data.refreshToken) {
    localStorage.setItem("refreshToken", response.data.refreshToken);
  }
  localStorage.setItem("userEmail", payload.email);

  return response.data;
};

// English Comment: Verify TOTP passcode using VerifyMfaDto(string PreAuthToken, string Code)
export const verifyMfaCode = async (payload: VerifyMfaPayload): Promise<AuthResponse> => {
  const preAuthToken = payload.preAuthToken || payload.userId || "";

  const response = await apiClient.post<AuthResponse>("/Auth/verify-mfa", {
    preAuthToken,
    code: payload.code,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  if (response.data.refreshToken) {
    localStorage.setItem("refreshToken", response.data.refreshToken);
  }

  return response.data;
};

// English Comment: Register new account
export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const passwordVal = payload.password || payload.passwordHash || "";
  const response = await apiClient.post<AuthResponse>("/Auth/register", {
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: passwordVal,
  });
  return response.data;
};

// English Comment: Revoke refresh token matching RevokeDto(string Email)
export const logoutUser = async (email?: string): Promise<void> => {
  const storedEmail = email || localStorage.getItem("userEmail") || "";

  if (storedEmail) {
    try {
      await apiClient.post("/Auth/revoke", { email: storedEmail });
    } catch (error) {
      console.warn("[AUTH LOGOUT] Failed to revoke refresh token on backend:", error);
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
};

// English Comment: Auth API interface matching backend controllers and frontend page dependencies
export const authApi = {
  login: loginUser,
  verifyMfa: verifyMfaCode,
  register: registerUser,
  logout: logoutUser,

  // English Comment: Setup MFA matching SetupMfaDto(string Email)
  setupMfa: async (email?: string): Promise<SetupMfaResponse> => {
    const targetEmail = email || localStorage.getItem("userEmail") || "";
    const res = await apiClient.post<SetupMfaResponse>("/Auth/setup-mfa", {
      email: targetEmail,
    });
    return {
      ...res.data,
      qrCodeUrl: res.data.authenticatorUri,
    };
  },

  // English Comment: Enable MFA matching EnableMfaDto(string Email, string Code)
  enableMfa: async (payload: { email?: string; code: string }) => {
    const targetEmail = payload.email || localStorage.getItem("userEmail") || "";
    const res = await apiClient.post("/Auth/enable-mfa", {
      email: targetEmail,
      code: payload.code,
    });
    return res.data;
  },

  // English Comment: Verify MFA setup submission from user settings page
  verifyMfaSetup: async (payload: { code: string; email?: string }) => {
    const targetEmail = payload.email || localStorage.getItem("userEmail") || "";
    const res = await apiClient.post("/Auth/enable-mfa", {
      email: targetEmail,
      code: payload.code,
    });
    return res.data;
  },

  // English Comment: Change active user account password
  changePassword: async (payload: { currentPassword?: string; oldPassword?: string; newPassword: string }) => {
    const res = await apiClient.post("/Auth/change-password", {
      currentPassword: payload.currentPassword || payload.oldPassword,
      newPassword: payload.newPassword,
    });
    return res.data;
  },

  // English Comment: Disable multi-factor authentication for current session account
  disableMfa: async () => {
    const res = await apiClient.post("/Auth/disable-mfa");
    return res.data;
  },
};