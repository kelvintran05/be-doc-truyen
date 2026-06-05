import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { decryptPayload } from "./crypto";
import { ENV } from "../config/env";
import { useAuthStore } from "../../features/auth/auth.store";

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Inject JWT accessToken if available
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("SecureStore error in request:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Decrypt payload if encrypted, handle token refreshes
apiClient.interceptors.response.use(
  async (response) => {
    if (response.data && response.data.payload) {
      response.data = decryptPayload(response.data.payload);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Attempt refresh
        const { data } = await axios.post(`${ENV.API_URL}/auth/refresh`, { refreshToken });
        
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        // Auth session expired
        try {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
        } catch {}
        useAuthStore.getState().logout();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
