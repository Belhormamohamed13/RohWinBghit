import axios from "axios";

import { clearAccessToken, getAccessToken, setAccessToken } from "./authTokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const apiClient = axios.create({
  baseURL: baseURL ?? "http://localhost:4000/api",
  withCredentials: true,
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? getAccessToken() : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      original._retry = true;
      try {
        const refreshResponse = await apiClient.post("/auth/refresh");
        const accessToken = refreshResponse.data?.data?.accessToken;
        if (accessToken) {
          setAccessToken(accessToken);
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient.request(original);
        }
        clearAccessToken();
        return Promise.reject(error);
      } catch {
        clearAccessToken();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);


