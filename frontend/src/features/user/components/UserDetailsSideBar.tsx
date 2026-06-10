"use client";
import { Paper, Stack, Typography, Avatar, Box, Divider, Chip } from "@mui/material";
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
  const roleNames = user?.roles?.map(role => role.name).filter(Boolean) ?? [];

  if (isLoading) {
    return <UserIDLayoutSkeleton />;
  }

  return (
    <Paper
      sx={{
        height: "500px",
        boxSizing: "border-box",
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
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
            <Typography variant="h4" fontWeight={700}>
              {user?.profile?.first_name && user?.profile?.last_name
                ? `${user?.profile.first_name} ${user?.profile.last_name}`
                : ""}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user?.id ? `USER-${String(user.id).padStart(5, "0")}` : "Member Account"}
            </Typography>

            <Stack
              direction="row"
              justifyContent="center"
              flexWrap="wrap"
              gap={0.75}
              sx={{ mt: 1.5 }}
            >
              {(roleNames.length ? roleNames : ["member"]).map(role => (
                <Chip
                  key={role}
                  label={formatLabel(role)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              ))}
            </Stack>
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

const formatLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, char => char.toUpperCase());

export default UserDetailsSideBar;
