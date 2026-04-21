"use client";
import { Paper, Stack, Typography, Avatar, Box, Divider } from "@mui/material";
import { usePathname } from "next/navigation";
import {
  emptyResponse,
  useGetUserQuery,
} from "@/features/user/api/useGetUserQuery";
import Link from "next/link";
import UserIDLayoutSkeleton from "@/features/user/components/UserIDLayoutSkeleton";

type LinkType = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type PUserDetailsSideBar = {
  userId?: string;
  links: LinkType[];
};

const UserDetailsSideBar = ({ userId, links }: PUserDetailsSideBar) => {
  const pathname = usePathname();

  const { data: { data: user } = {}, isLoading = { data: emptyResponse } } =
    useGetUserQuery(userId || "");

  if (isLoading) {
    return <UserIDLayoutSkeleton />;
  }

  return (
    <Paper
      sx={{
        height: "500px",
        boxSizing: "border-box",
        border: theme => `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        p: 2,
      }}
      elevation={0}
    >
      <Stack sx={{ flex: 1, mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            pb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: theme => theme.palette.primary.dark,
            }}
            alt=""
            src=""
          />
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h4">
              {user?.profile?.first_name && user?.profile?.last_name
                ? `${user?.profile.first_name} ${user?.profile.last_name}`
                : ""}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Stack sx={{ width: "100%", mt: 2 }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  fontSize: "normal",
                  py: 1.5,
                  px: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor:
                    pathname === link.href
                      ? theme => theme.palette.primary.lighter
                      : "inherit",
                  "&:hover": {
                    backgroundColor: theme => theme.palette.primary.lighter,
                    "& *": {
                      color: theme => theme.palette.primary.main,
                    },
                  },
                  color:
                    pathname === link.href
                      ? theme => theme.palette.primary.main
                      : "black",
                  "& *": {
                    color:
                      pathname === link.href
                        ? theme => theme.palette.primary.main
                        : "black",
                  },
                }}
              >
                {link.icon}
                <Typography>{link.label}</Typography>
              </Box>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserDetailsSideBar;
