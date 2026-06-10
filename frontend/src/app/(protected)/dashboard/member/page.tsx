"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { getLoans } from "@/lib/api/loan";

const DashboardPage = () => {
  const router = useRouter();

  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  const { data: loansResponse } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: getLoans,
  });

  const loans = loansResponse?.data?.data ?? loansResponse?.data ?? [];

  useEffect(() => {
    const roles = authUser?.roles ?? [];

    if (roles.includes("member") || roles.includes("non-member")) {
      router.replace("/dashboard/member");
    }
  }, [authUser, router]);

  const totalLoans = loans.length;

  const pendingLoans = loans.filter(
    (loan: { status?: string | null }) =>
      loan.status === "pending" ||
      loan.status === "created" ||
      loan.status === "submitted_for_evaluation"
  ).length;

  const releasedLoans = loans.filter(
    (loan: { status?: string | null }) => loan.status === "released"
  ).length;

  const approvedLoans = loans.filter(
    (loan: { status?: string | null }) => loan.status === "approved"
  ).length;

  const rejectedLoans = loans.filter(
    (loan: { status?: string | null }) => loan.status === "rejected"
  ).length;

  const totalBorrowedAmount = loans.reduce(
    (
      sum: number,
      loan: {
        amount_requested?: number | string | null;
      }
    ) => sum + Number(loan.amount_requested || 0),
    0
  );

  const totalReleasedAmount = loans
    .filter((loan: { status?: string | null }) => loan.status === "released")
    .reduce(
      (
        sum: number,
        loan: {
          amount_requested?: number | string | null;
        }
      ) => sum + Number(loan.amount_requested || 0),
      0
    );

  const totalContributionOnRecord = Math.max(
    0,
    ...loans.map((loan: { total_contribution?: number | string | null }) =>
      Number(loan.total_contribution || 0)
    )
  );

  const activeLoanBalance = loans
    .filter(
      (loan: { status?: string | null }) =>
        loan.status !== "rejected" && loan.status !== "draft"
    )
    .reduce(
      (
        sum: number,
        loan: {
          outstanding_loan_balance?: number | string | null;
        }
      ) => sum + Number(loan.outstanding_loan_balance || 0),
      0
    );

  const latestActiveLoan = loans.find(
    (loan: { status?: string | null }) =>
      loan.status !== "rejected" && loan.status !== "draft"
  );

  const nextAmortization = latestActiveLoan
    ? Number(
        (
          latestActiveLoan as {
            monthly_amortization?: number | string | null;
            amortization_per_payday?: number | string | null;
          }
        ).monthly_amortization ||
          (
            latestActiveLoan as {
              amortization_per_payday?: number | string | null;
            }
          ).amortization_per_payday ||
          0
      )
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
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
          Monitor your loan applications, payment status, and cooperative
          account activity.
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
          }}
          onClick={() => router.push("/dashboard/accounting/loans/create")}
        >
          Apply for New Loan
        </Button>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Member Account Summary
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Quick view of your cooperative contribution and loan standing.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStat title="Member Status" value="Active" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStat
            title="Total Contributions"
            value={`₱${totalContributionOnRecord.toLocaleString()}`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStat
            title="Active Loan Balance"
            value={`₱${activeLoanBalance.toLocaleString()}`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStat
            title="Next Amortization"
            value={`₱${nextAmortization.toLocaleString()}`}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Loan Overview
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Summary of your cooperative loan applications and released amounts.
        </Typography>
      </Box>

      <Card
        elevation={1}
        sx={{
          mb: 4,
          borderRadius: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <DashboardStat title="Total Loans" value={totalLoans} compact />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <DashboardStat
                title="Total Borrowed"
                value={`₱${totalBorrowedAmount.toLocaleString()}`}
                compact
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <DashboardStat
                title="Released Amount"
                value={`₱${totalReleasedAmount.toLocaleString()}`}
                compact
              />
            </Grid>
          </Grid>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mt: 2 }}
          >
            <Chip label={`Pending: ${pendingLoans}`} color="warning" variant="outlined" />
            <Chip label={`Approved: ${approvedLoans}`} color="info" variant="outlined" />
            <Chip label={`Released: ${releasedLoans}`} color="success" variant="outlined" />
            <Chip label={`Rejected: ${rejectedLoans}`} color="error" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>


      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          My Loan Applications
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Review your loan applications, payable amount, amortization, and
          cooperative contribution record.
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {loans.length === 0 ? (
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                No loan applications yet.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          loans.map(
            (loan: {
              id: number;
              application_no?: string | null;
              amount_requested?: string | number | null;
              total_amount_payable?: string | number | null;
              monthly_amortization?: string | number | null;
              total_contribution?: string | number | null;
              outstanding_loan_balance?: string | number | null;
              status?: string | null;
            }) => (
              <Card
                key={loan.id}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  border: theme => `1px solid ${theme.palette.divider}`,
                  transition: "0.2s ease",
                  "&:hover": {
                    boxShadow: 6,
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                    spacing={3}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {loan.application_no || `Loan #${loan.id}`}
                      </Typography>

                      <Typography color="text.secondary">
                        Principal Applied: ₱
                        {Number(loan.amount_requested || 0).toLocaleString()}
                      </Typography>

                      <Typography color="text.secondary">
                        Total Payable: ₱
                        {Number(loan.total_amount_payable || 0).toLocaleString()}
                      </Typography>

                      <Typography color="text.secondary">
                        Amortization: ₱
                        {Number(loan.monthly_amortization || 0).toLocaleString()}
                      </Typography>

                      <Typography color="text.secondary">
                        Contribution on Record: ₱
                        {Number(loan.total_contribution || 0).toLocaleString()}
                      </Typography>

                      <Typography color="text.secondary">
                        Outstanding Balance: ₱
                        {Number(
                          loan.outstanding_loan_balance || 0
                        ).toLocaleString()}
                      </Typography>

                      <Chip
                        label={formatStatus(loan.status)}
                        color={getStatusColor(loan.status)}
                        size="small"
                        sx={{
                          mt: 1,
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      />
                    </Box>

                    <Button
                      variant="outlined"
                      onClick={() =>
                        router.push(`/dashboard/member/loans/${loan.id}`)
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        alignSelf: { xs: "stretch", md: "center" },
                        minWidth: { md: 130 },
                      }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )
          )
        )}
      </Stack>

    </Container>
  );
};

const DashboardStat = ({
  title,
  value,
  compact = false,
}: {
  title: string;
  value: string | number;
  compact?: boolean;
}) => {
  if (compact) {
    return (
      <Box
        sx={{
          p: 2,
          height: "100%",
          borderRadius: 2,
          bgcolor: "background.default",
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography color="text.secondary" fontWeight={600}>
          {title}
        </Typography>

        <Typography variant="h5" fontWeight={700} color="primary">
          {value}
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
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

const formatStatus = (status?: string | null) => {
  if (!status) return "Unknown";

  const labels: Record<string, string> = {
    draft: "Draft",
    created: "Created",
    pending: "Pending Review",
    documents_generated: "Documents Generated",
    documents_uploaded: "Documents Uploaded",
    submitted_for_evaluation: "For Evaluation",
    reviewed: "Reviewed",
    approved: "Approved",
    rejected: "Rejected",
    released: "Released",
  };

  return (
    labels[status] ||
    status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

const getStatusColor = (
  status?: string | null
): "success" | "error" | "warning" | "info" | "default" => {
  if (status === "released") return "success";
  if (status === "approved") return "info";
  if (status === "rejected") return "error";
  return "warning";
};

export default DashboardPage;