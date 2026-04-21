import { Stack, Box, Paper, Skeleton, Divider, Grid } from "@mui/material";

const RoleLoadingSkeleton = () => {
  const loadingPermissions = Array(12).fill(null);

  return (
    <Stack spacing={2}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>

      <Paper
        sx={{
          p: 4,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Stack sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="text" width={60} height={32} />
            <Skeleton variant="text" width={120} height={32} />
          </Stack>
          <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1 }} />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {loadingPermissions.map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="rectangular" width={24} height={24} />
                <Skeleton variant="text" width="70%" height={24} />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
};

export default RoleLoadingSkeleton;
