import axios from "axios";

const BASE_URL = "https://carscanner.runasp.net";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // English Comment: Prevent browser-level caching of dynamic report datasets
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// English Comment: Interceptor to attach token automatically & bust aggressive intermediate proxies safely
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // English Comment: Use pure HTTP Headers for cache-busting instead of URL params to prevent backend 500 mapping errors
    if (config.method === "get" || config.method === "GET") {
      if (config.headers) {
        config.headers["If-Modified-Since"] = "0";
        config.headers["X-Cache-Bust"] = Date.now().toString(); // English Comment: Custom header instead of query param (_t)
      }
    }

    console.log("[API REQUEST]", config.url, config.method);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// English Comment: Interceptor to catch 401s and handle automatic refresh token rotation
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

        // English Comment: Request new access token using current refresh token
        const res = await axios.post(`${BASE_URL}/Auth/refresh`, {
          token,
          refreshToken,
        });

        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          apiClient.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
          originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // English Comment: Session completely expired or canceled; clear state and direct user to login
        console.warn("Session expired or revoked. Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("[API ERROR]", err?.response?.data || err.message);
    return Promise.reject(err);
  },
);