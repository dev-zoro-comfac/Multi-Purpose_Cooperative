"use client";

import {
  Alert,
  Avatar,
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
  MenuItem,
  Pagination,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveLoan,
  downloadLoanDocumentUrl,
  getLoans,
  rejectLoan,
  releaseLoan,
} from "@/lib/api/loan";

type LoanDocument = {
  id: number;
  document_type?: string | null;
};

type LoanActivityLog = {
  id: string | number;
  notes?: string | null;
};

type LoanApplication = {
  id: number;
  application_no?: string | null;
  borrower_name?: string | null;
  amount_requested?: string | number | null;
  status?: string | null;
  created_at?: string | null;
  documents?: LoanDocument[];
  activity_logs?: LoanActivityLog[];
};

const AccountingLoansPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [accountingNotes, setAccountingNotes] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const loansPerPage = 5;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));

    router.replace(`${pathname}?${params.toString()}`);
  }, [search, statusFilter, sortBy, page, pathname, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: getLoans,
  });

  const loans = (data?.data?.data ?? []) as LoanApplication[];

  const filteredLoans = loans
    .filter((loan) => {
      const keyword = debouncedSearch.toLowerCase();

      const matchesSearch =
        loan.application_no?.toLowerCase().includes(keyword) ||
        loan.borrower_name?.toLowerCase().includes(keyword) ||
        loan.status?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return getTimestamp(b.created_at) - getTimestamp(a.created_at);
      }

      if (sortBy === "oldest") {
        return getTimestamp(a.created_at) - getTimestamp(b.created_at);
      }

      if (sortBy === "highest_amount") {
        return Number(b.amount_requested) - Number(a.amount_requested);
      }

      if (sortBy === "lowest_amount") {
        return Number(a.amount_requested) - Number(b.amount_requested);
      }

      return 0;
    });

  const paginatedLoans = filteredLoans.slice(
    (page - 1) * loansPerPage,
    page * loansPerPage
  );

  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);

  const totalLoans = loans.length;

  const pendingLoans = loans.filter(
    (loan) =>
      loan.status === "created" ||
      loan.status === "pending" ||
      loan.status === "documents_generated" ||
      loan.status === "documents_uploaded" ||
      loan.status === "submitted_for_evaluation"
  ).length;

  const approvedLoans = loans.filter((loan) => loan.status === "approved").length;
  const rejectedLoans = loans.filter((loan) => loan.status === "rejected").length;

  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + Number(loan.amount_requested || 0),
    0
  );

  const refreshLoans = () => {
    queryClient.invalidateQueries({
      queryKey: ["loan-applications"],
    });
  };

  const handleApprove = async () => {
    if (!selectedLoanId) return;

    try {
      setIsSubmittingAction(true);

      await approveLoan(selectedLoanId);

      setApproveDialogOpen(false);
      setSelectedLoanId(null);
      refreshLoans();

      setSnackbarMessage("Loan approved successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(
        getErrorMessage(error, "Failed to approve loan application.")
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReject = async () => {
  if (!selectedLoanId) return;

  try {
    setIsSubmittingAction(true);

    await rejectLoan(selectedLoanId, {
      accounting_notes: accountingNotes,
    });

    setRejectDialogOpen(false);
    setSelectedLoanId(null);
    setAccountingNotes("");
    refreshLoans();

    setSnackbarMessage("Loan rejected successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  } catch (error) {
    setSnackbarMessage(
      getErrorMessage(error, "Failed to reject loan application.")
    );
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setIsSubmittingAction(false);
  }
};

  const handleRelease = async (loanId: number) => {
  try {
    setIsSubmittingAction(true);

    await releaseLoan(loanId);

    refreshLoans();

    setSnackbarMessage("Loan released successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  } catch (error) {
    setSnackbarMessage(
      getErrorMessage(error, "Failed to release loan.")
    );
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setIsSubmittingAction(false);
  }
};

  if (
    authUser &&
    !(
      authUser.roles.includes("accounting") ||
      authUser.roles.includes("admin")
    )
  ) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography color="error">
          You are not authorized to access this page.
        </Typography>
      </Container>
    );
  }

  if (isLoading) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 10,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          minWidth: 320,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
        >
          Loading Loan Applications
        </Typography>

        <Typography color="text.secondary">
          Please wait while we fetch records.
        </Typography>
      </Card>
    </Container>
  );
}

  if (error) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 10,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          minWidth: 320,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="error"
          gutterBottom
        >
          Failed to Load Loans
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Something went wrong while loading loan applications.
        </Typography>

        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Card>
    </Container>
  );
}

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Card elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Loan Applications
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Review submitted loan applications and supporting documents.
          </Typography>

          <TextField
            label="Search loan applications"
            variant="outlined"
            placeholder="Search by application no, borrower, or status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              label="All"
              color={statusFilter === "all" ? "primary" : "default"}
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
            />

            <Chip
              label="Pending"
              color={
                statusFilter === "submitted_for_evaluation"
                  ? "warning"
                  : "default"
              }
              onClick={() => {
                setStatusFilter("submitted_for_evaluation");
                setPage(1);
              }}
            />

            <Chip
              label="Approved"
              color={statusFilter === "approved" ? "success" : "default"}
              onClick={() => {
                setStatusFilter("approved");
                setPage(1);
              }}
            />

            <Chip
              label="Rejected"
              color={statusFilter === "rejected" ? "error" : "default"}
              onClick={() => {
                setStatusFilter("rejected");
                setPage(1);
              }}
            />
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <TextField
              select
              label="Sort by"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="highest_amount">Highest Amount</MenuItem>
              <MenuItem value="lowest_amount">Lowest Amount</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                minWidth: 140,
              }}
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setSortBy("newest");
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={2}
      >
        <Typography variant="h5" fontWeight={700}>
          Loan Records
        </Typography>

        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() => router.push("/dashboard/accounting/loans/create")}
        >
          New Loan Application
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <SummaryCard title="Total Loans" value={totalLoans} />
        <SummaryCard title="Pending / In Progress" value={pendingLoans} />
        <SummaryCard title="Approved" value={approvedLoans} />
        <SummaryCard title="Rejected" value={rejectedLoans} />
        <SummaryCard
          title="Total Amount"
          value={`₱${totalLoanAmount.toLocaleString()}`}
        />
      </Stack>

      {filteredLoans.length === 0 && (
        <Card
          variant="outlined"
          sx={{
            py: 6,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              No Matching Loan Applications
            </Typography>

            <Typography color="text.secondary">
              Try changing your filters or create a new loan application.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Showing {paginatedLoans.length} of {filteredLoans.length} loan
        applications
      </Typography>

      <Stack spacing={2} sx={{ width: "100%" }}>
        {paginatedLoans.map((loan) => {
          const supportingDocument = loan.documents?.find(
            (doc) => doc.document_type === "supporting_documents"
          );

          return (
            <Card
              key={loan.id}
              elevation={2}
              sx={{
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {loan.borrower_name?.charAt(0) || "?"}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color="primary"
                      >
                        {loan.application_no || `Loan #${loan.id}`}
                      </Typography>

                      <Typography>
                        Borrower: <b>{loan.borrower_name || "—"}</b>
                      </Typography>

                      <Typography>
                        Amount Requested:{" "}
                        {formatMoney(loan.amount_requested)}
                      </Typography>

                      <Typography color="text.secondary">
                        Submitted: {formatDate(loan.created_at)}
                      </Typography>

                      <Typography color="text.secondary">
                        Latest Note:{" "}
                        {loan.activity_logs?.length
                          ? loan.activity_logs[
                              loan.activity_logs.length - 1
                            ]?.notes || "No notes"
                          : "No activity yet"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                  spacing={1.5}
                  justifyContent="center"
                  alignItems={{ xs: "flex-start", md: "flex-end" }}
                  sx={{
                    minWidth: 180,
                    height: "100%",
                  }}
                  >
                    <Chip
                      label={`● ${formatStatus(loan.status)}`}
                      color={getStatusColor(loan.status)}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    />

                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                      onClick={() =>
                        router.push(`/dashboard/accounting/loans/${loan.id}`)
                      }
                    >
                      Open Details
                    </Button>

                    {supportingDocument && (
                      <Button
                        variant="outlined"
                        href={downloadLoanDocumentUrl(supportingDocument.id)}
                        target="_blank"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Download PDF
                      </Button>
                    )}

                    {(
                      loan.status === "submitted_for_evaluation" ||
                      loan.status === "pending" ||
                      loan.status === "created"
                    ) && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            setSelectedLoanId(loan.id);
                            setApproveDialogOpen(true);
                          }}
                        >
                          Approve Loan 
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            setSelectedLoanId(loan.id);
                            setRejectDialogOpen(true);
                          }}
                        >
                          Reject Loan
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        })}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Stack>

      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Loan Application</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to approve this loan application?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setApproveDialogOpen(false);
              setSelectedLoanId(null);
            }}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>

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
            {isSubmittingAction ? "Approving..." : "Confirm Approve"}
          </Button>
        </DialogActions>
      </Dialog>

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
            onClick={() => {
              setRejectDialogOpen(false);
              setSelectedLoanId(null);
              setAccountingNotes("");
            }}
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
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

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
  if (status === "rejected") return "error";
  if (
    status === "created" ||
    status === "pending" ||
    status === "documents_generated" ||
    status === "documents_uploaded" ||
    status === "submitted_for_evaluation"
  ) {
    return "warning";
  }

  return "default";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error as {
      response?: { data?: { message?: string } };
    };

    return response.response?.data?.message ?? fallback;
  }

  return fallback;
};

const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        flex: 1,
        borderRadius: 3,
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography color="text.secondary" variant="body2" fontWeight={600}>
          {title}
        </Typography>

        <Typography variant="h5" component="p" fontWeight={700} color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AccountingLoansPage;