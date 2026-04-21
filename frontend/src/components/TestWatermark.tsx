"use client";

import theme from "@/lib/mui/theme";
import { Box, Typography } from "@mui/material";

const Watermark = () => {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "local") {
    return null;
  }

  return (
    <Box
      sx={{
        ml: 2,
        borderRadius: 1.5,
        border: `1px solid ${theme.palette.error.main}`,
      }}
    >
      <Typography
        variant="subtitle1"
        color="error"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.5,
          py: 0.5,
          fontWeight: "bold",
        }}
      >
        DEV MODE
      </Typography>
    </Box>
  );
};

export default Watermark;
