import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { getNameInitials } from "@/utils";
import { Avatar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

const DrawerFooter = () => {
  const { data } = useAuthenticatedUser();
  const firstRoleNameElement = data?.data?.roles?.[0] || "No role assigned";

  return (
    <Toolbar
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        zIndex: theme => theme.zIndex.appBar + 1,
        backgroundColor: theme => theme.palette.common.white,
        borderTop: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box>
        <Link href="/dashboard/profile">
          <Avatar
            sx={{
              bgcolor: theme => theme.palette.primary.dark,
              fontSize: "0.875rem",
            }}
          >
            {getNameInitials(data?.data?.name)}
          </Avatar>
        </Link>
      </Box>
      <Stack sx={{ flexDirection: "column", gap: 0, lineHeight: 1 }}>
        <Link href="/dashboard/profile">
          <Button
            sx={{
              maxWidth: "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
              mb: 0,
              p: 0,
              color: "primary",
              fontWeight: "bold",
            }}
          >
            {data?.data?.name ?? ""}
          </Button>
        </Link>

        <Typography
          variant="subtitle2"
          sx={{
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.2,
            mt: 0,
          }}
        >
          {firstRoleNameElement}
        </Typography>
      </Stack>
      <Box sx={{ ml: "auto" }}>
        <LogoutButton />
      </Box>
    </Toolbar>
  );
};

export default DrawerFooter;
