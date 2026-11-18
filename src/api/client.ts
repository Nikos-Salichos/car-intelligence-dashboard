import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { session } from "./session";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://carscanner.runasp.net";

export const apiClient = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" } });

apiClient.interceptors.request.use((config) => {
  const token = session.token();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One refresh at a time: when several requests get a 401 together they all wait for the same new token.
let refreshing: Promise<string> | null = null;

const refreshToken = (): Promise<string> =>
  (refreshing ??= (async () => {
    const token = session.token();
    const refresh = session.refreshToken();
    if (!token || !refresh) throw new Error("no refresh token");
    const { data } = await axios.post(`${BASE_URL}/Auth/refresh`, { token, refreshToken: refresh });
    if (!data?.token) throw new Error("refresh refused");
    session.save({ token: data.token, refreshToken: data.refreshToken });
    return data.token as string;
  })().finally(() => {
    refreshing = null;
  }));

type Retryable = InternalAxiosRequestConfig & { _retried?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as Retryable | undefined;
    const isAuthCall = original?.url?.startsWith("/Auth/");
    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        original.headers.Authorization = `Bearer ${await refreshToken()}`;
        return apiClient(original);
      } catch {
        session.clear(); // the session is over: the app shows the login screen
      }
    }
    return Promise.reject(error);
  },
);
