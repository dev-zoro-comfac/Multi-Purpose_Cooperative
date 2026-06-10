import axiosLib from "axios";
import { echo } from "@laravel/echo-react";
import { getBackendApiUrl } from "./get-backend-api-url";

const axiosInstance = axiosLib.create({
  baseURL: getBackendApiUrl(),
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
  } catch {
    // Echo is optional and may not be configured before the first auth request.
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
