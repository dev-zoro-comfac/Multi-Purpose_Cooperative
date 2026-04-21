"use client";

import { Box, Skeleton, Stack } from "@mui/material";

const SkeletonAllNotification = () => {
  return (
    <Stack gap={2}>
      <Stack spacing={0} sx={{ flexGrow: 1, overflowY: "auto" }}>
        {[...Array(8)].map((_, index) => (
          <Box key={index} sx={{ my: 1 }}>
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default SkeletonAllNotification;
