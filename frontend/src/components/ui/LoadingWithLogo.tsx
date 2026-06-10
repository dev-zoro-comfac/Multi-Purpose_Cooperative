"use client";
import { Box, Paper, Stack, Typography } from "@mui/material";
import Logo from "./Logo";

export default function LoadingWithLogo() {
  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        position: "relative",
        background:
          "radial-gradient(circle at 50% 35%, rgba(31, 111, 74, 0.16), transparent 28%), linear-gradient(135deg, #f7faf8 0%, #eef8f2 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "auto auto 12% 10%",
          width: 160,
          height: 160,
          borderRadius: "50%",
          bgcolor: "primary.100",
          opacity: 0.5,
          filter: "blur(8px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "14%",
          right: "12%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: theme => `1px solid ${theme.palette.primary[200]}`,
          opacity: 0.55,
        }}
      />
      <Stack
        sx={{
          alignItems: "center",
          gap: 2.5,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 92,
            height: 92,
            borderRadius: "32px",
            display: "grid",
            placeItems: "center",
            bgcolor: "white",
            border: theme => `1px solid ${theme.palette.primary[100]}`,
            boxShadow: "0 18px 45px rgba(15, 77, 51, 0.16)",
            animation: "logoFloat 2.4s ease-in-out infinite",
            "@keyframes logoFloat": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-8px)" },
            },
          }}
        >
          <Logo sx={{ width: 52, height: 52 }} />
        </Box>

        <Stack sx={{ gap: 0.75, alignItems: "center" }}>
          <Typography variant="h3" fontWeight={800}>
            Cornersteel Cooperative
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Loading your cooperative workspace
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          {[0, 1, 2].map(index => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "primary.main",
                animation: "dotPulse 1s ease-in-out infinite",
                animationDelay: `${index * 0.16}s`,
                "@keyframes dotPulse": {
                  "0%, 80%, 100%": {
                    opacity: 0.35,
                    transform: "scale(0.75)",
                  },
                  "40%": {
                    opacity: 1,
                    transform: "scale(1)",
                  },
                },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
