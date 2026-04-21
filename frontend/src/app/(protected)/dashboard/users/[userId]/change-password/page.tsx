"use client";

import UserDetailsSkeleton from "@/components/ui/user-details/UserDetailsSkeleton";
import { Typography } from "@mui/material";
import { useGetUserQuery } from "@/features/user/api/useGetUserQuery";
import { useParams } from "next/navigation";
import ChangeUserAccountPassword from "@/features/user/components/ChangeUserAccountPassword";
import withPermission from "@/features/auth/components/withPermission";
import { UserPermission } from "@/constant";

const ChangePasswordPage = () => {
  const { userId } = useParams();
  const id = userId as string;

  const { data: { data: user } = {}, isLoading, isError } = useGetUserQuery(id);

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
    return <ChangeUserAccountPassword user={user} />;
  }
};
export default withPermission(ChangePasswordPage, {
  requiredPermissions: [UserPermission.ChangeOtherPassword],
  requireAll: true,
});
