"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { api } from "@/lib/api";

type DashboardStats = {
  total_loans: number;
  pending_loans: number;
  documents_generated: number;
  documents_uploaded: number;
  submitted_for_evaluation: number;
  reviewed_loans: number;
  approved_loans: number;
  released_loans: number;
  rejected_loans: number;
  total_amount_requested: number;
  total_amount_approved: number;
  total_net_proceeds: number;
};

export default function LoanDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

 useEffect(() => {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  api.get("/loan-applications-dashboard")
    .then(response => {
      console.log(response.data);
      setStats(response.data.data);
    })
    .catch(error => {
      console.error(error);
    });
}, []);

  const cards = [
    ["Total Loans", stats?.total_loans],
    ["Pending", stats?.pending_loans],
    ["Submitted", stats?.submitted_for_evaluation],
    ["Reviewed", stats?.reviewed_loans],
    ["Approved", stats?.approved_loans],
    ["Released", stats?.released_loans],
    ["Rejected", stats?.rejected_loans],
    ["Total Requested", `₱${Number(stats?.total_amount_requested ?? 0).toLocaleString()}`],
    ["Total Net Proceeds", `₱${Number(stats?.total_net_proceeds ?? 0).toLocaleString()}`],
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3">Loan Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Overview of loan applications and approvals.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={0} sx={{ border: theme => `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography color="text.secondary">{label}</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                    {String(value ?? "...")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}