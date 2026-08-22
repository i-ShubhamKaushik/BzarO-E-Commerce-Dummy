import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// API Baseline URL (matches backend port, customizable for production/Render build)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Single-flight refresh token queue handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Standard normalized API error format fallback
    const apiError = error.response?.data?.error || {
      code: 'INTERNAL_ERROR',
      message: error.message || 'Network connection error.',
    };

    // If 401 Unauthorized, try to refresh tokens (avoiding loop on refresh itself)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/login') {
        // If refresh itself or login fails with 401, bubble up and do not retry
        return Promise.reject(apiError);
      }

      if (isRefreshing) {
        // Enqueue request while refresh is in-flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh
        await api.post('/auth/refresh');
        isRefreshing = false;
        processQueue(null);
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Refresh token expired or invalid, trigger logout state
        // Dispatch custom event to let redux/app clear auth state
        window.dispatchEvent(new Event('auth:unauthorized'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(apiError);
  }
);
