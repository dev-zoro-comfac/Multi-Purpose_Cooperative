"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Logo from "@/components/ui/Logo";

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f8fb",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Logo sx={{ width: 52, height: 44 }} />

              <Box>
                <Typography variant="h5" fontWeight={800} color="primary">
                  Cornersteel Cooperative
                </Typography>
                <Typography color="text.secondary">
                  Member loans, records, and cooperative services
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Card
            elevation={2}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background:
                "linear-gradient(135deg, rgba(31, 111, 74, 0.12) 0%, #ffffff 72%)",
              border: theme => `1px solid ${theme.palette.primary[100]}`,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="h2" fontWeight={800} gutterBottom>
                    Cooperative loan applications made easier
                  </Typography>

                  <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    New borrowers can submit an application without a portal
                    account. Accounting will review the request and create the
                    account when processing begins.
                  </Typography>

                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Existing members can sign in to view their account, while new
                    applicants can start with the public loan application form.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      component={NextLink}
                      href="/apply-loan"
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 800,
                      }}
                    >
                      Apply for Loan
                    </Button>

                    <Button
                      component={NextLink}
                      href="/login"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      I already have an account
                    </Button>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={2}>
                    {[
                      "Submit borrower, employment, and loan details",
                      "Accounting reviews the application and computation",
                      "Approved borrowers receive account setup instructions",
                      "Wet-signed loan documents are handled after review",
                    ].map((item, index) => (
                      <Card key={item} variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                          <Typography fontWeight={800} color="primary">
                            Step {index + 1}
                          </Typography>
                          <Typography>{item}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {[
              ["Loan Application", "Apply for member or non-member cooperative loan assistance."],
              ["Accounting Review", "Applications go directly to the accounting loan register."],
              ["Account Setup", "Borrower accounts are created after accounting verifies the application."],
            ].map(([title, description]) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={800}>
                      {title}
                    </Typography>
                    <Typography color="text.secondary">{description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
