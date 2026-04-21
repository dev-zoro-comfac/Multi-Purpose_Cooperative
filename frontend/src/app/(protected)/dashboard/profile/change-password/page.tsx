"use client";

import UserDetailsSkeleton from "@/components/ui/user-details/UserDetailsSkeleton";
import { Typography } from "@mui/material";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { useGetUserQuery } from "@/features/user/api/useGetUserQuery";
import ChangeAccountPassword from "@/components/ui/user-details/ChangeAccountPassword";

const ChangePasswordPage = () => {
  const { data: { data: authUser } = {} } = useAuthenticatedUser();

  const {
    data: { data: user } = {},
    isLoading,
    isError,
  } = useGetUserQuery(authUser?.id || "");

  if (isError) {
    return (
      <Typography align="center" color="error">
        Failed to load profile details.
      </Typography>
    );
  }

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  if (user) {
    return <ChangeAccountPassword user={user} />;
  }
};

export default ChangePasswordPage;
