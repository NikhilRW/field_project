import axios, { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { BASE_URI } from "@/shared/constants/uri";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/shared/utils/secureStore";

const http = axios.create({
  baseURL: BASE_URI,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: BASE_URI,
  timeout: 15000,
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await refreshClient.post("/api/auth/refresh", {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;

  await Promise.all([
    setAccessToken(accessToken),
    setRefreshToken(newRefreshToken),
  ]);

  return accessToken as string;
};

http.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      if (__DEV__ && config.baseURL?.includes("ngrok-free.app")) {
        headers.set("ngrok-skip-browser-warning", `true`);
      }
      config.headers = headers;
    }

    if (__DEV__) {
      console.log("[HTTP Request]", config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log("[HTTP Response]", response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthRoute =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/google") ||
      originalRequest?.url?.includes("/api/auth/register") ||
      originalRequest?.url?.includes("/api/auth/refresh");

    if (
      error.response?.status === 401 &&
      !isAuthRoute &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
        });
      }

      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        originalRequest.headers = headers;
        return http(originalRequest);
      }

      await clearTokens();
      await useAuthStore.getState().logout();
      router.replace("/(auth)/login");
    }

    if (__DEV__) {
      console.error("[HTTP Error]", error.response?.status, error.config?.url);
    }

    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.message === "Network Error") {
      error.message =
        "Unable to connect. Please check your internet connection.";
    } else if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please try again.";
    }

    return Promise.reject(error);
  },
);

export default http;
