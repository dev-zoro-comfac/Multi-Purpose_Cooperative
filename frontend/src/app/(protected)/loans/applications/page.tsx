"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { api } from "@/lib/api";

type LoanApplication = {
  id: number;
  application_no: string;
  borrower_name: string;
  amount_requested: number;
  status: string;
};

export default function LoanApplicationsPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);

  useEffect(() => {
    api.get("/loan-applications").then(response => {
      setLoans(response.data.data);
    });
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3">
          Loan Applications
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Manage and monitor loan applications.
        </Typography>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application No</TableCell>
                <TableCell>Borrower</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    {loan.application_no}
                  </TableCell>

                  <TableCell>
                    {loan.borrower_name}
                  </TableCell>

                  <TableCell>
                    ₱{Number(
                      loan.amount_requested
                    ).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={loan.status}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}