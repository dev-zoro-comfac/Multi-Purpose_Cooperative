"use client";

import { Box, Typography } from "@mui/material";

const GlobalError = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
        Something Went Wrong
      </Typography>
      <Typography variant="body1" component="p" color="textSecondary" mb={2}>
        We&#39;re sorry for the inconvenience. Please try refreshing the page or
        go back to the homepage.
      </Typography>
    </Box>
  );
};

export default GlobalError;
