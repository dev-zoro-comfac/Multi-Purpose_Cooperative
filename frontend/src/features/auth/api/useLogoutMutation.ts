"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios-instance";
import { useRouter } from "next/navigation";
import { authQueryKey } from "./useAuthenticatedUser";

const logout = async () => {
  await axiosInstance.post("auth/spa/logout");
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [authQueryKey] });
      queryClient.removeQueries({ queryKey: [authQueryKey] });
      router.push("/");
    },
  });
};
