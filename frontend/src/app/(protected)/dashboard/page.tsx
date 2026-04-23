"use client";

import {
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Box,
  Link as MuiLink,
} from "@mui/material";
import NextLink from "next/link";
import { useGetFilteredMenu } from "@/components/ui/dashboard/drawer/useGetFilteredMenu";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { usePathname } from "next/navigation";

const DashboardPage = () => {
  const pathname = usePathname();
  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  const filteredMenu = useGetFilteredMenu() ?? [];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: { xs: 2, sm: 4, md: 5 }, mt: { md: 4, xs: 3 } }}>
        <Typography variant="h2">
          Welcome,{" "}
          <Typography component="span" variant="h2" color="primary.dark">
            {authUser?.name}
          </Typography>
          !
        </Typography>
        <Typography
          variant="h6"
          color="secondary"
          fontSize={16}
          sx={{ mt: 0.75 }}
        >
          Get familiar with the system by exploring the menu below.
        </Typography>
      </Box>
      {filteredMenu.map(group => (
        <Box key={group.id} sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {group.children?.map(item => {
              if (item.url === pathname) {
                return null;
              }
              return (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={theme => ({
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1.5,
                    })}
                    elevation={0}
                  >
                    <CardContent>
                      <MuiLink
                        href={item.url}
                        component={NextLink}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="span"
                          sx={{ color: theme => theme.palette.secondary.dark }}
                        >
                          {item.title}
                        </Typography>
                        <ArrowForwardOutlinedIcon
                          sx={{
                            color: "secondary.main",
                            fontSize: 18,
                          }}
                        />
                      </MuiLink>
                      <Typography variant="body1" color="text.secondary">
                        {item?.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default DashboardPage;
