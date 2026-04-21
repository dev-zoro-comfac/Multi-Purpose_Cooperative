import { Stack, Typography, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import Logo from "@/components/ui/Logo";

const LogoWithText = () => {
  return (
    <MuiLink
      component={NextLink}
      href="/dashboard"
      underline="none"
      sx={{ display: "flex", alignItems: "center", color: "inherit" }}
    >
      <Stack sx={{ flexDirection: "row", gap: 1.5, alignItems: "center" }}>
        <Logo sx={{ fontSize: 28 }} />
        <Typography variant="h4">App</Typography>
      </Stack>
    </MuiLink>
  );
};

export default LogoWithText;
