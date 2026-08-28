import axios from "axios";

const BASE_URL = "https://carscanner.runasp.net";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// English Comment: Attach stored JWT bearer token to outgoing HTTP requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("[API REQUEST]", config.url, config.method);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// English Comment: Handle token refresh rotation on 401 response matching RefreshTokenDto(string Token, string RefreshToken)
apiClient.interceptors.response.use(
  (res) => {
    console.log("[API RESPONSE]", res.config.url, res.status);
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token || !refreshToken) {
          throw new Error("No tokens available");
        }

        // English Comment: Call backend /Auth/refresh endpoint with RefreshTokenDto fields
        const res = await axios.post(`${BASE_URL}/Auth/refresh`, {
          token,
          refreshToken,
        });

        if (res.status === 200 && res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          apiClient.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
          originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // English Comment: Clear authentication state on complete session failure
        console.warn("[AUTH] Session expired. Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("[API ERROR]", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

// English Comment: DTO Interfaces for API requests and responses
export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  email?: string;
  password?: string;
}

export interface VerifyMfaPayload {
  email?: string;
  code: string;
  preAuthToken?: string;
}

export interface SetupMfaResponse {
  secret: string;
  authenticatorUri: string;
}

export interface MfaStatusResponse {
  mfaEnabled: boolean;
}

export interface AuthResponse {
  token?: string;
  refreshToken?: string;
  requiresMfa?: boolean;
  requiresTwoFactor?: boolean;
  preAuthToken?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}

export interface RefreshTokenPayload {
  token?: string;
  refreshToken?: string;
}

// English Comment: Top-level exported helper functions for direct component consumption
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/Auth/login", payload);
  return response.data;
};

export const verifyMfaCode = async (payload: VerifyMfaPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/Auth/verify-mfa", payload);
  return response.data;
};

export const logoutUser = async (userEmail?: string): Promise<void> => {
  try {
    const email = userEmail || localStorage.getItem("userEmail");
    if (email) {
      await apiClient.post("/Auth/revoke", { email });
    }
  } catch (err: unknown) {
    console.warn("[AUTH LOGOUT] Revoke token failed on server:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
  }
};

// English Comment: Authentication API module containing endpoints for user authentication and MFA operations
export const authApi = {
  // English Comment: Authenticate user credentials with email and password
  login: loginUser,

  // English Comment: Register a new user account
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/Auth/register", payload);
    return response.data;
  },

  // English Comment: Verify multi-factor authentication code during login process
  verifyMfa: verifyMfaCode,

  // English Comment: Retrieve MFA activation status for the current authenticated user
  getMfaStatus: async (): Promise<MfaStatusResponse> => {
    const response = await apiClient.get<MfaStatusResponse>("/Auth/mfa-status");
    return response.data;
  },

  // English Comment: Request TOTP secret key and QR URI for setting up MFA
  setupMfa: async (email?: string): Promise<SetupMfaResponse> => {
    const response = await apiClient.post<SetupMfaResponse>("/Auth/setup-mfa", { email });
    return response.data;
  },

  // English Comment: Enable MFA after verifying initial setup code
  enableMfa: async (payload: VerifyMfaPayload): Promise<void> => {
    await apiClient.post("/Auth/enable-mfa", payload);
  },

  // English Comment: Verify MFA setup code during initial configuration
  verifyMfaSetup: async (payload: VerifyMfaPayload): Promise<void> => {
    await apiClient.post("/Auth/verify-mfa-setup", payload);
  },

  // English Comment: Disable MFA for the current user
  disableMfa: async (): Promise<void> => {
    await apiClient.post("/Auth/disable-mfa");
  },

  // English Comment: Change user password credentials
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await apiClient.post("/Auth/change-password", payload);
  },

  // English Comment: Refresh expired access token using refresh token (supports string or RefreshTokenPayload object)
  refreshToken: async (payload?: string | RefreshTokenPayload): Promise<AuthResponse> => {
    let token = "";
    let refreshToken = "";

    if (typeof payload === "string") {
      token = localStorage.getItem("token") || "";
      refreshToken = payload;
    } else if (payload && typeof payload === "object") {
      token = payload.token || localStorage.getItem("token") || "";
      refreshToken = payload.refreshToken || localStorage.getItem("refreshToken") || "";
    } else {
      token = localStorage.getItem("token") || "";
      refreshToken = localStorage.getItem("refreshToken") || "";
    }

    const response = await apiClient.post<AuthResponse>("/Auth/refresh", {
      token,
      refreshToken,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  },

  // English Comment: Revoke user token on backend and clear client-side auth state
  logout: logoutUser,
};