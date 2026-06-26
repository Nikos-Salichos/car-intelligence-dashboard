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

// English Comment: Interceptor to catch and log responses or authorization errors clearly
apiClient.interceptors.response.use(
  (res) => {
    console.log("[API RESPONSE]", res.config.url, res.status);
    return res;
  },
  (err) => {
    console.error("[API ERROR]", err?.response?.data || err.message);

    // English Comment: Optional global handling for expired or missing tokens (401 Unauthorized)
    if (err.response?.status === 401) {
      console.warn("Unauthorized request detected. Redirecting to login or clearing state...");
    }

    return Promise.reject(err);
  },
);
