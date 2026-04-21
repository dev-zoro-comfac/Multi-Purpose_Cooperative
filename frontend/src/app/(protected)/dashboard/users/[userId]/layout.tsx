"use client";

import { useParams } from "next/navigation";
import { Box, Stack } from "@mui/material";
import { RouteLayout } from "@/types/layout-type";
import { useGetUserQuery } from "@/features/user/api/useGetUserQuery";
import Error from "@/components/error/Error";
import withPermission from "@/features/auth/components/withPermission";
import { UserPermission } from "@/constant";
import UserDetailsSideBar from "@/features/user/components/UserDetailsSideBar";
import useGetProfileSidebarLinks from "@/components/ui/user-details/useGetProfileSidebarLinks";

const UserLayout = ({ children }: RouteLayout) => {
  const { userId } = useParams();
  const id = (userId as string) || "";

  const { isError } = useGetUserQuery(id);
  const userLinks = useGetProfileSidebarLinks(id);

  if (isError) {
    return <Error message="Failed to fetch user details." />;
  }

  return (
    <Stack
      sx={{
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        maxWidth: theme => theme.breakpoints.values.xl,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "22%" },
          flexShrink: 0,
        }}
      >
        <UserDetailsSideBar userId={userId as string} links={userLinks} />
      </Box>
      <Stack
        sx={{
          flex: 1,
          width: { xs: "100%", md: "78%" },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export default withPermission(UserLayout, {
  requiredPermissions: [UserPermission.ViewAny],
});
