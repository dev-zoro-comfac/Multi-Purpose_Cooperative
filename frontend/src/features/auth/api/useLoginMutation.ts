"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios-instance";
import { getBackendOrigin } from "@/lib/get-backend-api-url";

import { authQueryKey, getAuthenticatedUser } from "./useAuthenticatedUser";

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.withXSRFToken = true;

type useLoginParamsType = {
  email: string;
  password: string;
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
      const authUser = await queryClient.fetchQuery({
        queryKey: [authQueryKey],
        queryFn: getAuthenticatedUser,
      });

      const roles = authUser?.data?.roles ?? [];

      if (roles.includes("member")) {
        router.push("/dashboard/member");
        return;
      }

      router.push("/dashboard");
    },
  });
};
