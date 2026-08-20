import { apiClient } from "./apiClient";

export const authApi = {
  login: async (email: string, password: string) => {
    console.log("[AUTH] login attempt:", email);

    const { data } = await apiClient.post("/Auth/login", {
      email,
      password,
    });

    console.log("[AUTH] login success");

    localStorage.setItem("token", data.token);

    return data;
  },
};