"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios-instance";

import { authQueryKey } from "./useAuthenticatedUser";

type useLoginParamsType = {
  email: string;
  password: string;
};

const useLogin = async ({ email, password }: useLoginParamsType) => {
  // STEP 1: CSRF
  await axiosInstance.get("/csrf-cookie");

  // STEP 2: LOGIN
  await axiosInstance.post("/auth/spa/login", {
    email,
    password,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: useLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [authQueryKey] });
    },
  });
};