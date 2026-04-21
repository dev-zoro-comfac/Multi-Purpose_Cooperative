"use client";

import UserDetails from "@/components/ui/user-details/UserDetails";
import UserDetailsSkeleton from "@/components/ui/user-details/UserDetailsSkeleton";
import { Typography } from "@mui/material";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { useGetUserQuery } from "@/features/user/api/useGetUserQuery";

const ProfileDetailsPage = () => {
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
    return <UserDetails user={user} />;
  }
};

export default ProfileDetailsPage;
