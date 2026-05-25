"use client";

import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { useQueryClient } from "@tanstack/react-query";
import { useEchoNotification } from "@laravel/echo-react";

const SocketListeners = () => {
  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  if (!process.env.NEXT_PUBLIC_REVERB_APP_KEY || !authUser?.id) {
    return null;
  }

  return <NotificationListener userId={authUser.id} />;
};

const NotificationListener = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  useEchoNotification(`users.${userId}`, () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  });

  return null;
};

export default SocketListeners;
