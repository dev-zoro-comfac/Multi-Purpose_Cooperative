"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { authQueryKey } from "./useAuthenticatedUser";

const register = async () => {
  await axiosInstance.post("auth/spa/register", {
    email: "test@example.com",
    password: "password",
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [authQueryKey] });
    },
  });
};
