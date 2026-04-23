import axiosLib from "axios";
import { echo } from "@laravel/echo-react";

const axiosInstance = axiosLib.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

axiosInstance.defaults.withXSRFToken = true;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(config => {
  try {
    const currentEcho = echo();
    if (currentEcho && typeof currentEcho.socketId === "function") {
      const socketId = currentEcho.socketId();

      if (socketId) {
        config.headers["X-Socket-Id"] = socketId;
      }
    }
  } catch (error) {
    console.warn("Echo not ready, skipping X-Socket-Id header", error);
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const message = error?.response?.data?.message;
      return Promise.reject(new Error(message || "An error occurred"));
    }

    return Promise.reject(
      new Error(
        "Network Error: Unable to connect to the server. Please check your internet connection or try again later."
      )
    );
  }
);

export default axiosInstance;