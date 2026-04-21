"use client";
import { Paper, Stack, Box, Skeleton, Typography } from "@mui/material";

const UserIDLayoutSkeleton = () => {
  return (
    <Paper
      sx={{
        width: "300px",
        maxWidth: "300px",
        height: "500px",
        boxSizing: "border-box",
        border: theme => `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
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
          <Skeleton variant="circular" width={100} height={100} />
          <Box sx={{ mt: 2, textAlign: "center", width: "80%" }}>
            <Typography variant="h4">
              <Skeleton width="60%" />
            </Typography>
            <Typography variant="h6" color="secondary">
              <Skeleton width="40%" />
            </Typography>
          </Box>
        </Box>
        <Stack sx={{ width: "100%", mt: 2 }}>
          {Array.from({ length: 2 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                py: 1.5,
                px: 3,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&:hover": {
                  backgroundColor: theme => theme.palette.primary.lighter,
                },
              }}
            >
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton width="50%" />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserIDLayoutSkeleton;
