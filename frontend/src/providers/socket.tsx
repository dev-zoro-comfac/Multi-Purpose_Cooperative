"use client";

import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { useQueryClient } from "@tanstack/react-query";
import { useEchoNotification } from "@laravel/echo-react";

const SocketListeners = () => {
  const queryClient = useQueryClient();
  const { data: { data: authUser } = {} } = useAuthenticatedUser();

  useEchoNotification(`users.${authUser?.id}`, () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  });

  return null;
};

export default SocketListeners;
