"use client";

import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useQuery } from "@tanstack/react-query";

import { useGetFilteredMenu } from "@/components/ui/dashboard/drawer/useGetFilteredMenu";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { getLoans } from "@/lib/api/loan";

const DashboardPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  const filteredMenu = useGetFilteredMenu() ?? [];

  const { data: loansResponse } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: getLoans,
  });

  const loans =
    loansResponse?.data?.data ??
    loansResponse?.data ??
    [];

  useEffect(() => {
    const roles = authUser?.roles ?? [];

    if (
      roles.includes("member") ||
      roles.includes("non_member")
    ) {
      router.replace("/dashboard/member");
    }
  }, [authUser, router]);

  const totalLoans = loans.length;

  const pendingLoans = loans.filter(
    (loan: any) =>
      loan.status === "pending" ||
      loan.status === "created" ||
      loan.status === "submitted_for_evaluation"
  ).length;

  const releasedLoans = loans.filter(
    (loan: any) => loan.status === "released"
  ).length;

  const totalReleasedAmount = loans
    .filter((loan: any) => loan.status === "released")
    .reduce(
      (sum: number, loan: any) =>
        sum + Number(loan.amount_requested || 0),
      0
    );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <Typography variant="h3" fontWeight={700}>
          Welcome,{" "}
          <Typography
            component="span"
            variant="h3"
            color="primary.dark"
            fontWeight={700}
          >
            {authUser?.name || "User"}
          </Typography>
          !
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Monitor cooperative loan activity, borrower applications, and
          accounting workflow progress.
        </Typography>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <DashboardStat title="Total Loans" value={totalLoans} />
        <DashboardStat title="Pending Loans" value={pendingLoans} />
        <DashboardStat title="Released Loans" value={releasedLoans} />
        <DashboardStat
          title="Released Amount"
          value={`₱${totalReleasedAmount.toLocaleString()}`}
        />
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Management Modules
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Choose a module to review records, manage applications, or continue
          workflow tasks.
        </Typography>
      </Box>

      {filteredMenu.map((group) => (
        <Box key={group.id} sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {group.children?.map((item) => {
              if (item.url === pathname) return null;

              return (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      transition: "0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <MuiLink
                        href={item.url}
                        component={NextLink}
                        underline="none"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          component="span"
                          color="primary"
                        >
                          {item.title}
                        </Typography>

                        <ArrowForwardOutlinedIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 20,
                          }}
                        />
                      </MuiLink>

                      <Typography variant="body1" color="text.secondary">
                        {item.description || "Open this module."}
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

const DashboardStat = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <Card elevation={2} sx={{ flex: 1, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography color="text.secondary" fontWeight={600}>
          {title}
        </Typography>

        <Typography variant="h5" fontWeight={700} color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;