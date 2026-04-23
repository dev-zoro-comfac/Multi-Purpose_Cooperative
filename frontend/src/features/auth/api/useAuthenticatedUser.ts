"use client";

import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios-instance";
import { logInDevelopment } from "@/utils";
import { AuthResponse, authResponseSchema } from "@/lib/zod/schemas/auth";

export const emptyAuth = {
  id: "",
  email: "",
  name: "",
  roles: [],
  permissions: [],
};

const getAuthenticatedUser = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get<unknown>("/auth/spa/authenticate");

  const validatedResponse = authResponseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return {
      success: false,
      message: "Parse error. Invalid response format",
      data: emptyAuth,
    };
  }

  return validatedResponse.data;
};

export const authQueryKey = "auth";

export const useAuthenticatedUser = () =>
  useQuery<AuthResponse>({
    queryKey: [authQueryKey],
    queryFn: getAuthenticatedUser,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
