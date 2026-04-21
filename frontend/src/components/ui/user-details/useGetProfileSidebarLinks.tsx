"use client";

import { useMemo } from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { UserPermission } from "@/constant";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";

const useGetProfileSidebarLinks = (userId: string) => {
  const { data: user } = useAuthenticatedUser();
  const userPermissions = user?.data?.permissions ?? [];

  const hasPermission = (requiredPermissions?: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    return requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );
  };

  const userLinks = useMemo(
    () =>
      [
        {
          href: `/dashboard/users/${userId}`,
          label: "User Details",
          icon: <PersonOutlineIcon />,
        },
        {
          href: `/dashboard/users/${userId}/change-password`,
          label: "Change Password",
          icon: <LockOutlinedIcon />,
          requiredPermission: [UserPermission.ChangeOtherPassword],
        },
      ].filter(link => hasPermission(link.requiredPermission)),
    [userId, userPermissions]
  );

  return userLinks;
};

export default useGetProfileSidebarLinks;
