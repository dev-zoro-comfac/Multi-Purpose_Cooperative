"use client";

import { useGetUserQuery } from "@/features/user/api/useGetUserQuery";
import { useParams } from "next/navigation";
import { Typography } from "@mui/material";
import React from "react";
import UserDetails from "@/components/ui/user-details/UserDetails";
import UserDetailsSkeleton from "@/components/ui/user-details/UserDetailsSkeleton";
import { UserPermission } from "@/constant";
import withPermission from "@/features/auth/components/withPermission";

const DetailsPage = () => {
  const { userId } = useParams();
  const id = userId as string;

  const { data: { data: user } = {}, isLoading, isError } = useGetUserQuery(id);

  if (isError) {
    return (
      <Typography align="center" color="error">
        Failed to load user details.
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

export default withPermission(DetailsPage, {
  requiredPermissions: [UserPermission.ViewAny],
});
