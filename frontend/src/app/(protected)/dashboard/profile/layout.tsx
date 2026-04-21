"use client";

import { Stack, Container, Box } from "@mui/material";
import { RouteLayout } from "@/types/layout-type";
import UserDetailsSideBar from "@/features/user/components/UserDetailsSideBar";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
const profileLinks = [
  {
    href: "/dashboard/profile",
    label: "Profile Details",
    icon: <PersonOutlineIcon />,
  },
  {
    href: "/dashboard/profile/change-password",
    label: "Change Password",
    icon: <LockOutlinedIcon />,
  },
];

const ProfileLayout = ({ children }: RouteLayout) => {
  const { data: { data: authUser } = {} } = useAuthenticatedUser();

  return (
    <Container maxWidth="xl">
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
          <UserDetailsSideBar userId={authUser?.id} links={profileLinks} />
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
    </Container>
  );
};

export default ProfileLayout;
