"use client";

import {
  Divider,
  Grid,
  Stack,
  Skeleton,
  Typography,
  List,
  ListItem,
  Box,
  Paper,
} from "@mui/material";

const UserDetailsSkeleton = () => {
  return (
    <Paper
      sx={{ border: theme => `1px solid ${theme.palette.divider}` }}
      elevation={0}
    >
      <Stack>
        <Stack
          sx={{
            p: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: { xs: 2, md: 1 },
          }}
          justifyContent="space-between"
        >
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Skeleton width="50%" height={32} />
          </Typography>
        </Stack>
        <Divider />
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ p: 3, gap: 3 }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index}>
                  <Skeleton width="30%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={56}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ pl: 4 }}>
            <Stack spacing={2} sx={{ flex: 1 }}>
              <List sx={{ flex: 1, pt: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  <Skeleton width="60%" height={28} />
                </Typography>
                <List>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <ListItem
                      key={index}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Skeleton width="80%" height={20} />
                    </ListItem>
                  ))}
                </List>
              </List>
            </Stack>
          </Grid>
        </Grid>
        <Stack sx={{ p: 2 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ alignSelf: "end" }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserDetailsSkeleton;
