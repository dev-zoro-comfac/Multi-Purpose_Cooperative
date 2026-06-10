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
      <Stack
  sx={{
    flexDirection: "row",
    gap: 1.5,
    alignItems: "center",
  }}
>
  <Logo sx={{ fontSize: 40, flexShrink: 0 }} />

  <Stack spacing={0}>
    <Typography
      variant="subtitle1"
      fontWeight={800}
      color="primary"
      lineHeight={1}
    >
      Cornersteel
    </Typography>

    <Typography
      variant="caption"
      color="text.secondary"
      lineHeight={1.2}
    >
      Cooperative
    </Typography>
  </Stack>
</Stack>
    </MuiLink>
  );
};

export default LogoWithText;
