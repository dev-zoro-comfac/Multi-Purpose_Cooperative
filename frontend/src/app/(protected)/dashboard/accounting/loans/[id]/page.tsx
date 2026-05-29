"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { api } from "@/lib/api";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveLoan,
  downloadLoanDocumentUrl,
  getLoan,
  rejectLoan,
} from "@/lib/api/loan";

type LoanDocument = {
  id: number;
  document_type?: string | null;
  file_name?: string | null;
  name?: string | null;
};

type LoanAmortization = {
  id: number;
  payday_no?: number | string | null;
  amortization?: string | number | null;
  interest?: string | number | null;
  principal?: string | number | null;
  balance?: string | number | null;
};

type LoanActivityLog = {
  id: string | number;
  action?: string | null;
  notes?: string | null;
  created_at?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

type LoanApplication = {
  id: number;
  application_no?: string | null;
  borrower_name?: string | null;
  borrower_email?: string | null;
  borrower_contact_number?: string | null;
  borrower_address?: string | null;

  borrower_employer?: string | null;
  borrower_position?: string | null;
  borrower_length_of_service?: string | null;

  co_maker_name?: string | null;
  co_maker_email?: string | null;
  co_maker_contact_number?: string | null;
  co_maker_address?: string | null;

  co_maker_employer?: string | null;
  co_maker_length_of_service?: string | null;

  amount_requested?: string | number | null;

  loan_type?: string | null;
  annual_rate?: string | number | null;
  number_of_paydays?: string | number | null;

  processing_fee?: string | number | null;
  total_contribution?: string | number | null;
  outstanding_loan_balance?: string | number | null;

  purpose?: string | null;
  term?: string | number | null;
  payment_frequency?: string | null;
  accounting_notes?: string | null;
  created_at?: string | null;
  status?: string | null;

  documents?: LoanDocument[];
  amortizations?: LoanAmortization[];
  activity_logs?: LoanActivityLog[];
}; 

const AccountingLoanDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [accountingNotes, setAccountingNotes] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["loan-application", id],
    queryFn: () => getLoan(id),
    enabled: !!id,
  });

  const loan = (data?.data?.data ?? data?.data) as LoanApplication | undefined;

  const refreshLoan = () => {
    queryClient.invalidateQueries({
      queryKey: ["loan-application", id],
    });

    queryClient.invalidateQueries({
      queryKey: ["loan-applications"],
    });
  };

  const handleApprove = async () => {
    try {
      setIsSubmittingAction(true);
      await approveLoan(Number(id));
      refreshLoan();
      setSnackbarMessage("Loan approved successfully.");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReview = async () => {
    try {
      setIsSubmittingAction(true);
      await api.get("/csrf-cookie");
      await api.patch(`/loan-applications/${id}/review`);
      refreshLoan();
      setSnackbarMessage("Loan reviewed successfully.");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleRelease = async () => {
    try {
      setIsSubmittingAction(true);
      await api.patch(`/loan-applications/${id}/release`);
      refreshLoan();
      setSnackbarMessage("Loan released successfully.");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmittingAction(true);

      await rejectLoan(Number(id), {
        accounting_notes: accountingNotes,
      });

      setRejectDialogOpen(false);
      setAccountingNotes("");
      refreshLoan();
      setSnackbarMessage("Loan rejected successfully.");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (isLoading) {
    return (
      <Container
  maxWidth="xl"
  sx={{
    py: 4,
    bgcolor: "#f5f7fb",
    minHeight: "100vh",
  }}
>
        <Typography>Loading loan details...</Typography>
      </Container>
    );
  }

 if (error || !loan) {
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
          Loan Record Not Found
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
            router.push("/dashboard/accounting/loans")
          }
        >
          Back to Loan Records
        </Button>
      </Card>
    </Container>
  );
}

  const documents = loan.documents ?? [];
  const amortizations = loan.amortizations ?? [];

  return (
    <Container
  maxWidth="xl"
  sx={{
    py: 4,
    bgcolor: "#f5f7fb",
    minHeight: "100vh",
  }}
>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/dashboard/accounting/loans")}
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back to Loan Applications
        </Button>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
          sx={{
          mb: 1,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1" fontWeight={700}>
              {loan.application_no ?? `Loan Application #${loan.id}`}
            </Typography>

            <Typography color="text.secondary">
              Detailed review of borrower, loan information, documents, and accounting activity.
            </Typography>
          </Box>

          <Chip
            label={formatStatus(loan.status)}
            color={getStatusColor(loan.status)}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 1,
            }}
          />

          <Box sx={{ mt: 3 }}>
  <Typography
    variant="subtitle2"
    color="text.secondary"
    sx={{ mb: 1 }}
  >
    Loan Progress
  </Typography>

  <Stack direction="row" spacing={1} flexWrap="wrap">
    <Chip
      label="Submitted"
      color="info"
      variant="outlined"
    />

    {(loan.status === "approved" ||
      loan.status === "released") && (
      <Chip
        label="Approved"
        color="success"
        variant="outlined"
      />
    )}

    {loan.status === "rejected" && (
      <Chip
        label="Rejected"
        color="error"
        variant="outlined"
      />
    )}

    {loan.status === "released" && (
      <Chip
        label="Released"
        color="primary"
        variant="outlined"
      />
    )}
  </Stack>
</Box>

<Box sx={{ mt: 4 }}>
  <Typography
    variant="h6"
    fontWeight={700}
    gutterBottom
  >
    Activity Logs
  </Typography>

{loan.activity_logs?.length ? (
  <Stack spacing={2}>
    {loan.activity_logs.map((log) => (
      <Card
        key={log.id}
        variant="outlined"
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography fontWeight={600}>
            {log.notes || "No notes"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Activity recorded in the system.
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Stack>
) : (
  <Typography color="text.secondary">
    No activity logs yet.
  </Typography>
)}
</Box>

        </Stack>
      </Box>

      <Stack spacing={3}>
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
              Borrower Information
            </Typography>

            <Info label="Borrower Name" value={loan.borrower_name} />
            <Info label="Email" value={loan.borrower_email} />
            <Info label="Contact Number" value={loan.borrower_contact_number} />
            <Info label="Address" value={loan.borrower_address} />
            <Info
  label="Employer"
  value={loan.borrower_employer}
/>

<Info
  label="Position"
  value={loan.borrower_position}
/>

<Info
  label="Length of Service"
  value={loan.borrower_length_of_service}
/>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
              Co-maker Information
            </Typography>

            <Info label="Co-maker Name" value={loan.co_maker_name} />
            <Info label="Email" value={loan.co_maker_email} />
            <Info label="Contact Number" value={loan.co_maker_contact_number} />
            <Info label="Address" value={loan.co_maker_address} />
            <Info label="Employer" value={loan.co_maker_employer} />
            <Info
              label="Length of Service"
              value={loan.co_maker_length_of_service}
            />
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
              Loan Information
            </Typography>

            <Info label="Amount Requested" value={formatMoney(loan.amount_requested)} />
            <Info
  label="Loan Type"
  value={formatStatus(loan.loan_type)}
/>

<Info
  label="Interest Rate"
  value={`${loan.annual_rate || 0}%`}
/>

<Info
  label="Number of Paydays"
  value={loan.number_of_paydays}
/>

<Info
  label="Processing Fee"
  value={formatMoney(loan.processing_fee)}
/>

<Info
  label="Total Contribution"
  value={formatMoney(loan.total_contribution)}
/>

<Info
  label="Outstanding Loan Balance"
  value={formatMoney(loan.outstanding_loan_balance)}
/>
            <Info label="Purpose" value={loan.purpose} />
            <Info label="Term" value={loan.term} />
            <Info label="Payment Frequency" value={loan.payment_frequency} />
            <Info label="Submitted Date" value={formatDate(loan.created_at)} />
            <Info label="Accounting Notes" value={loan.accounting_notes} />
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
              Documents
            </Typography>

            {documents.length === 0 ? (
              <Typography color="text.secondary">
                No documents uploaded.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {documents.map((document) => (
                  <Stack
                    key={document.id}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        {formatStatus(document.document_type) ?? "Document"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {document.file_name ?? document.name ?? "Uploaded file"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        href={downloadLoanDocumentUrl(document.id)}
                        target="_blank"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Preview
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        href={downloadLoanDocumentUrl(document.id)}
                        target="_blank"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Download
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
              Accounting Actions
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {loan.status === "submitted_for_evaluation" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleReview}
                disabled={isSubmittingAction}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {isSubmittingAction ? "Reviewing..." : "Mark as Reviewed"}
              </Button>
            ) : loan.status === "reviewed" ? (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={isSubmittingAction}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {isSubmittingAction ? "Approving..." : "Approve Loan"}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={isSubmittingAction}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Reject Loan
                </Button>
              </Stack>
            ) : loan.status === "approved" ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleRelease}
                disabled={isSubmittingAction}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {isSubmittingAction ? "Releasing..." : "Release Loan"}
              </Button>
            ) : (
              <Typography color="text.secondary">
                No actions available for this loan status.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
              Amortization Schedule
            </Typography>

            {amortizations.length === 0 ? (
              <Typography color="text.secondary">
                No amortization schedule available.
              </Typography>
            ) : (
              <Box
                sx={{
                overflowX: "auto",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
              >
                <table
                  style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "700px",
                  background: "#fff",
                }}
                >
                  <thead>
                    <tr>
                      <TableHeader>Payday No.</TableHeader>
                      <TableHeader>Amortization</TableHeader>
                      <TableHeader>Interest</TableHeader>
                      <TableHeader>Principal</TableHeader>
                      <TableHeader>Balance</TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {amortizations.map((row) => (
                      <tr
                        key={row.id}
                        style={{
                      background:
                        Number(row.payday_no) % 2 === 0
                        ? "#fafafa"
                        : "#ffffff",
                      }}
                      > 
                        <TableCell>{row.payday_no}</TableCell>
                        <TableCell>{formatMoney(row.amortization)}</TableCell>
                        <TableCell>{formatMoney(row.interest)}</TableCell>
                        <TableCell>{formatMoney(row.principal)}</TableCell>
                        <td
  style={{
    padding: 12,
    fontWeight:
      row.payday_no === amortizations.length
        ? 700
        : 400,
    color:
      row.payday_no === amortizations.length
        ? "#2e7d32"
        : "inherit",
  }}
>
  {formatMoney(row.balance)}
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
              Activity Logs
            </Typography>

            <Stack spacing={2}>
              {loan.activity_logs?.length ? (
                [...loan.activity_logs]
                  .sort(
                    (a, b) =>
                      getTimestamp(b.created_at) -
                      getTimestamp(a.created_at)
                  )
                  .map((log) => (
                    <Box
                      key={log.id}
                      sx={{
                        borderLeft: "4px solid",
                        borderColor:
                          log.action === "approved"
                            ? "success.main"
                            : log.action === "rejected"
                            ? "error.main"
                            : "warning.main",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        p: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Chip
                        label={formatStatus(log.action)}
                        color={getStatusColor(log.action)}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      />

                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        By: {log.user?.name || log.user?.email || "System"}
                      </Typography>

                      <Typography color="text.secondary">
                        {formatDateTime(log.created_at)}
                      </Typography>

                      {log.notes && (
                        <Typography sx={{ mt: 1 }}>
                          {log.notes}
                        </Typography>
                      )}
                    </Box>
                  ))
              ) : (
                <Typography color="text.secondary">
                  No activity logs yet.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reject Loan Application</DialogTitle>

        <DialogContent>
          <TextField
            label="Accounting Notes"
            value={accountingNotes}
            onChange={(event) => setAccountingNotes(event.target.value)}
            fullWidth
            multiline
            minRows={4}
            margin="normal"
            placeholder="Enter reason for rejecting this loan application..."
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setRejectDialogOpen(false)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!accountingNotes.trim() || isSubmittingAction}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isSubmittingAction ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const Info = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{ mb: 1 }}
    >
      <Typography color="text.secondary" minWidth={180}>
        {label}:
      </Typography>

      <Typography fontWeight={500}>{value || "—"}</Typography>
    </Stack>
  );
};

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th
    style={{
      textAlign: "left",
      padding: "14px",
      background: "#1976d2",
      color: "#ffffff",
      fontWeight: 700,
      borderBottom: "1px solid #1565c0",
    }}
  >
    {children}
  </th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td
    style={{
      padding: "14px",
      borderBottom: "1px solid #e0e0e0",
      fontSize: "0.95rem",
    }}
  >
    {children}
  </td>
);

const formatMoney = (value?: string | number | null) => {
  return `₱${Number(value || 0).toLocaleString()}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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
    under_accounting_review: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    released: "Released",
  };

  return labels[status] || status.replaceAll("_", " ");
};

const getTimestamp = (value?: string | null) =>
  value ? new Date(value).getTime() : 0;

const getStatusColor = (
  status?: string | null
): "success" | "error" | "warning" | "info" | "default" => {
  if (status === "released") return "success";

  if (status === "approved") return "info";

  if (status === "reviewed") return "info";

  if (
    status === "submitted_for_evaluation" ||
    status === "pending" ||
    status === "created"
  ) {
    return "warning";
  }

  if (status === "rejected") return "error";

  return "default";
};

export default AccountingLoanDetailsPage;