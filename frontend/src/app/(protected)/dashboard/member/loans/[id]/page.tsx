"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getLoan, downloadLoanDocumentUrl } from "@/lib/api/loan";
import { useParams, useRouter } from "next/navigation";

type ActivityLog = {
  id: number | string;
  notes?: string | null;
};

type LoanDocument = {
  id: number | string;
  document_type?: string | null;
};

const MemberLoanDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const loanId = params?.id as string;

  const { data: loanResponse } = useQuery({
    queryKey: ["member-loan", loanId],
    queryFn: () => getLoan(loanId),
    enabled: !!loanId,
  });

  const loan = loanResponse?.data?.data;
  const activityLogs: ActivityLog[] = loan?.activity_logs ?? [];
if (!loan) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
          textAlign: "center",
          p: 5,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="error"
          gutterBottom
        >
          Loan Details Not Available
        </Typography>

        <Typography color="text.secondary">
          The requested loan application could not be loaded.
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() =>
            router.push("/dashboard/member")
          }
        >
          Back to Borrower Portal
        </Button>
      </Card>
    </Container>
  );
}

  const documents: LoanDocument[] = loan?.documents ?? [];
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Loan Application Details
      </Typography>

      <Button
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
        onClick={() => router.push("/dashboard/member")}
      >
        Back to Borrower Portal
      </Button>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography color="text.secondary">
                Application No
              </Typography>
              <Typography fontWeight={700}>
                {loan.application_no || `Loan #${loan.id}`}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Amount Requested
              </Typography>
              <Typography fontWeight={700}>
                ₱{Number(loan.amount_requested || 0).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Total Amount Payable
              </Typography>
              <Typography fontWeight={700}>
                ₱{Number(loan.total_amount_payable || 0).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Monthly Amortization
              </Typography>
              <Typography fontWeight={700}>
                ₱{Number(loan.monthly_amortization || 0).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">Status</Typography>

              <Chip
                label={formatStatus(loan.status)}
                color={
                loan.status === "released"
                  ? "success"
                : loan.status === "approved"
                  ? "info"
                : loan.status === "rejected"
                  ? "error"
                : "warning"
              }
                sx={{ mt: 1, fontWeight: 700 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Last updated status of your loan application.
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">Loan Timeline</Typography>

              <Stack spacing={1} sx={{ mt: 1 }}>
                <Chip label="Application Submitted" color="info" variant="outlined" />

                {loan.status !== "pending" && (
                  <Chip label="Under Evaluation" color="warning" variant="outlined" />
                )}

                {(loan.status === "approved" || loan.status === "released") && (
                  <Chip label="Approved" color="success" variant="outlined" />
                )}

                {loan.status === "released" && (
                  <Chip label="Released" color="primary" variant="outlined" />
                )}
              </Stack>
            </Box>

            <Box>
              <Typography color="text.secondary">Purpose</Typography>
              <Typography>{loan.purpose || "—"}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Loan Documents
          </Typography>

          {documents.length === 0 ? (
            <Typography color="text.secondary">
              No documents available yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {documents.map((document) => (
                <Box
                  key={document.id}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={700}>
                    {formatStatus(document.document_type)}
                  </Typography>

                  <Button
                    variant="outlined"
                    sx={{
                      mt: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    href={downloadLoanDocumentUrl(Number(document.id))}
                    target="_blank"
                  >
                    Download Document
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
  <CardContent sx={{ p: 3 }}>
    <Typography variant="h5" fontWeight={700} gutterBottom>
      Status History
    </Typography>

    {activityLogs.length ? (
      <Stack spacing={2}>
        {activityLogs.map((log) => (
          <Box
            key={log.id}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography fontWeight={700}>
              {log.notes || "Loan activity updated."}
            </Typography>
          </Box>
        ))}
      </Stack>
    ) : (
      <Typography color="text.secondary">
        No status history available yet.
      </Typography>
    )}
  </CardContent>
</Card>
    </Container>
  );
};

const formatStatus = (status?: string | null) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default MemberLoanDetailsPage;