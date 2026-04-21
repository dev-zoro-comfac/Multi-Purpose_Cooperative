"use client";

import { Box, Typography } from "@mui/material";

const Error = ({ message }: { message: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        textAlign: "center",
        p: 2,
      }}
    >
      <Box
        sx={theme => ({
          px: 6,
          py: 2,
          borderRadius: 1,
          bgcolor: theme.palette.error.lighter,
          border: `1px solid ${theme.palette.error[200]}`,
        })}
      >
        <Typography color="error" variant="h5">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default Error;
