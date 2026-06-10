"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { authQueryKey } from "./useAuthenticatedUser";

type RegisterPayload = {
  email: string;
  password: string;
};

const register = async (data: RegisterPayload) => {
  await axiosInstance.post("auth/spa/register", data);
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
