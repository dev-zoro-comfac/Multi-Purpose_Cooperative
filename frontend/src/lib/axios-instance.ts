import axiosLib from "axios";
import { echo } from "@laravel/echo-react";

const axiosInstance = axiosLib.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000/api",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

axiosInstance.defaults.withXSRFToken = true;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(config => {
  const currentEcho = echo();

  if (currentEcho.socketId()) {
    config.headers["X-Socket-Id"] = currentEcho.socketId();
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      const message = error?.response?.data?.message;
      return Promise.reject(new Error(message || "An error occurred"));
    } else {
      return Promise.reject(
        new Error(
          "Network Error: Unable to connect to the server. Please check your internet connection or try again later."
        )
      );
    }
  }
);

export default axiosInstance;
