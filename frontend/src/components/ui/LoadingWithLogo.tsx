"use client";
import { LinearProgress, Paper, Stack, Typography } from "@mui/material";
import Logo from "./Logo";

export default function LoadingWithLogo() {
  return (
    <Paper sx={{ bgcolor: "white", height: "100vh", minHeight: "400px" }}>
      <Stack
        sx={{
          placeItems: "center",
          flexDirection: "row",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          gap: 2,
        }}
      >
        <Logo sx={{ fontSize: 30 }} />
        <Stack
          sx={{
            placeItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 40, fontWeight: "bold" }}>App</Typography>
          <LinearProgress
            color="primary"
            sx={{ width: 90, height: 6, marginTop: "-18px" }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
