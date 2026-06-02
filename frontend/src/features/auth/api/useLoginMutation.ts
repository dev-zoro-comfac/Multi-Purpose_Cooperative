"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios-instance";

import { authQueryKey } from "./useAuthenticatedUser";

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.withXSRFToken = true;

type useLoginParamsType = {
  email: string;
  password: string;
};

const getBackendOrigin = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:8000/api/v1";

  return new URL(apiUrl).origin;
};

const useLogin = async ({ email, password }: useLoginParamsType) => {
  await axiosInstance.get("/sanctum/csrf-cookie", {
    baseURL: getBackendOrigin(),
  });

  const response = await axiosInstance.post("auth/spa/login", {
    email,
    password,
  });

  return response.data;
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: useLogin,
    onSuccess: async () => {
  await queryClient.invalidateQueries({
    queryKey: [authQueryKey],
  });

  const authUser = queryClient.getQueryData([
    authQueryKey,
  ]) as {
    data?: {
      roles?: string[];
    };
  };

  const roles = authUser?.data?.roles ?? [];

  if (roles.includes("member")) {
    router.push("/dashboard/member");
    return;
  }

  router.push("/dashboard");
},
  });
};
