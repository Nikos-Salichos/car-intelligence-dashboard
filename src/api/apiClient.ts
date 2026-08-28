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