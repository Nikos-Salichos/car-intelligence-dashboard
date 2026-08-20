import { apiClient } from "./apiClient";

export const authApi = {
  login: async (email: string, password: string) => {
    console.log("[AUTH] login attempt:", email);

    const { data } = await apiClient.post("/Auth/login", {
      email,
      password,
    });

    console.log("[AUTH] login success");

    // English Comment: Save both Access Token and Refresh Token upon successful login
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  },

  logout: async (email: string) => {
    try {
      // English Comment: Notify backend to cancel refresh token in database
      await apiClient.post("/Auth/revoke", { email });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  },

  refreshToken: async (email: string) => {
    const currentRefreshToken = localStorage.getItem("refreshToken");

    // English Comment: Send email and existing refresh token to revoke/rotate and acquire new access token
    const { data } = await apiClient.post("/Auth/refresh", {
      email,
      refreshToken: currentRefreshToken,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data;
  },
};