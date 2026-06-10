"use client";

import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  downloadAmortizationSchedule,
  getLoan,
  downloadLoanDocument,
  generateLoanDocuments,
  uploadLoanDocument,
  submitLoanForEvaluation,
} from "@/lib/api/loan";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useRouter } from "next/navigation";

type ActivityLog = {
  id: number | string;
  notes?: string | null;
};

type LoanDocument = {
  id: number | string;
  document_type?: string | null;
  file_name?: string | null;
  status?: string | null;
  is_signed?: boolean | null;
};

type LoanAmortization = {
  id: number | string;
  payday_no?: number | string | null;
  amortization?: string | number | null;
  interest?: string | number | null;
  principal?: string | number | null;
  balance?: string | number | null;
};

const MemberLoanDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const loanId = params?.id as string;

  const { data: loanResponse, refetch } = useQuery({
    queryKey: ["member-loan", loanId],
    queryFn: () => getLoan(loanId),
    enabled: !!loanId,
  });

  const loan = loanResponse?.data?.data;
  const activityLogs: ActivityLog[] = loan?.activity_logs ?? [];
  const amortizations: LoanAmortization[] = loan?.amortizations ?? [];
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

const handleUpload = async (
  documentType: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("document_type", documentType);
  formData.append("file", file);

  try {
    await uploadLoanDocument(loanId, formData);

    await refetch();
  } catch (error) {
    console.error(error);
    alert("Failed to upload document.");
  }
};

const handleGenerateDocuments = async () => {
  try {
    await generateLoanDocuments(loanId);
    await refetch();
  } catch (error) {
    console.error(error);
    alert("Failed to generate loan documents.");
  }
};

const handleDownloadDocument = async (document: LoanDocument) => {
  try {
    await downloadLoanDocument(
      Number(document.id),
      document.file_name || "loan-document.pdf"
    );
  } catch (error) {
    console.error(error);
    alert("Unable to download document. Please make sure you are logged in.");
  }
};

const handleDownloadAmortizationSchedule = () => {
  downloadAmortizationSchedule({
    applicationNo: loan.application_no || `loan-${loan.id}`,
    borrowerName: loan.borrower_name,
    schedule: amortizations,
  });
};

const handleSubmitForEvaluation = async () => {
  try {
    await submitLoanForEvaluation(loanId);

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert(
      "Please upload all required signed documents first."
    );
  }
};

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Member Loan Ledger
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Review your loan application, cooperative computation, documents, and
        status history.
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryBox
            label="Principal Applied"
            value={`₱${Number(loan.amount_requested || 0).toLocaleString()}`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryBox
            label="Total Payable"
            value={`₱${Number(loan.total_amount_payable || 0).toLocaleString()}`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryBox
            label="Amortization Per Payday"
            value={`₱${Number(loan.amortization_per_payday || 0).toLocaleString()}`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryBox
            label="Net Proceeds"
            value={`₱${Number(loan.net_proceeds || 0).toLocaleString()}`}
          />
        </Grid>
      </Grid>

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={700}>
              Application Record
            </Typography>

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
                Principal Applied
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
                Amortization Per Payday
              </Typography>
              <Typography fontWeight={700}>
                ₱{Number(loan.amortization_per_payday || 0).toLocaleString()}
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
  <Typography variant="h6" fontWeight={900}>
    Borrower Information
  </Typography>

  <Stack spacing={1} sx={{ mt: 1 }}>
    <Typography>
      <b>Name:</b> {loan.borrower_name || "—"}
    </Typography>

    <Typography>
      <b>Email:</b> {loan.borrower_email || "—"}
    </Typography>

    <Typography>
      <b>Contact Number:</b> {loan.borrower_contact_number || "—"}
    </Typography>

    <Typography>
      <b>Age:</b> {loan.borrower_age || "—"}
    </Typography>

    <Typography>
      <b>Civil Status:</b> {formatStatus(loan.borrower_civil_status)}
    </Typography>

    <Typography>
      <b>Address:</b> {loan.borrower_address || "—"}
    </Typography>

    <Typography>
      <b>Employer:</b> {loan.borrower_employer || "—"}
    </Typography>

    <Typography>
      <b>Position:</b> {loan.borrower_position || "—"}
    </Typography>

    <Typography>
      <b>Length of Service:</b> {loan.borrower_length_of_service || "—"}
    </Typography>

    <Typography>
      <b>Take Home Pay:</b> {formatMoney(loan.take_home_pay_15)} /{" "}
      {formatMoney(loan.take_home_pay_30)}
    </Typography>

    <Typography>
      <b>Coop Member Since:</b> {formatDate(loan.member_since)}
    </Typography>
  </Stack>
</Box>

<Box>
  <Typography variant="h6" fontWeight={700}>
    Co-maker Information
  </Typography>

  <Stack spacing={1} sx={{ mt: 1 }}>
    <Typography>
      <b>Name:</b> {loan.co_maker_name || "—"}
    </Typography>

    <Typography>
      <b>Email:</b> {loan.co_maker_email || "—"}
    </Typography>

    <Typography>
      <b>Contact Number:</b> {loan.co_maker_contact_number || "—"}
    </Typography>

    <Typography>
      <b>Address:</b> {loan.co_maker_address || "—"}
    </Typography>

    <Typography>
      <b>Age:</b> {loan.co_maker_age || "—"}
    </Typography>

    <Typography>
      <b>Civil Status:</b> {formatStatus(loan.co_maker_civil_status)}
    </Typography>

    <Typography>
      <b>Employer:</b> {loan.co_maker_employer || "—"}
    </Typography>

    <Typography>
      <b>Length of Service:</b> {loan.co_maker_length_of_service || "—"}
    </Typography>
  </Stack>
</Box>

<Box>
  <Typography variant="h6" fontWeight={900}>
    Credit Committee Computation
  </Typography>

  <Stack spacing={1} sx={{ mt: 1 }}>
    <Typography>
      <b>Loan Type:</b> {formatStatus(loan.loan_type)}
    </Typography>

    <Typography>
      <b>Payment Frequency:</b> {formatStatus(loan.payment_frequency)}
    </Typography>

    <Typography>
      <b>Preferred Payment Method:</b>{" "}
      {formatStatus(loan.preferred_payment_method)}
    </Typography>

    <Typography>
      <b>Computation Method:</b> {formatStatus(loan.computation_method)}
    </Typography>

    <Typography>
      <b>Interest Rate:</b> {loan.annual_rate || 0}%
    </Typography>

    <Typography>
      <b>Number of Paydays:</b> {loan.number_of_paydays || "—"}
    </Typography>

    <Typography>
      <b>Total Contribution as of Date:</b>{" "}
      {formatMoney(loan.total_contribution)}
    </Typography>

    <Typography>
      <b>Outstanding Cooperative Loan as of Date:</b>{" "}
      {formatMoney(loan.outstanding_loan_balance)}
    </Typography>

    <Typography>
      <b>Amount of Loan Approved:</b>{" "}
      {formatMoney(loan.amount_requested)}
    </Typography>

    <Typography>
      <b>Processing Fee:</b> {formatMoney(loan.processing_fee)}
    </Typography>

    <Typography>
      <b>Net Proceeds:</b> {formatMoney(loan.net_proceeds)}
    </Typography>
  </Stack>
</Box>

          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mt: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h5" fontWeight={700}>
              Amortization Schedule
            </Typography>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled={amortizations.length === 0}
              onClick={handleDownloadAmortizationSchedule}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Download Schedule
            </Button>
          </Stack>

          <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
            For diminishing balance, your deduction can stay the same every pay
            period, but the interest portion decreases as the remaining balance
            goes down. The principal portion changes every payday.
          </Alert>

          {amortizations.length === 0 ? (
            <EmptyState message="No amortization schedule available yet." />
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
                    <TableHeader>Deduction / Amortization</TableHeader>
                    <TableHeader>Interest Portion</TableHeader>
                    <TableHeader>Principal Portion</TableHeader>
                    <TableHeader>Remaining Balance</TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {amortizations.map((row: LoanAmortization) => (
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
                      <TableCell>{formatMoney(row.balance)}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mt: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Payment Agreement / Promissory Note
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Simple preview of the cooperative form contents before printing and
            wet-signature upload.
          </Typography>

          <Stack spacing={1.25}>
            {loan.preferred_payment_method === "salary_deduction" ? (
              <Typography>
                I, <b>{loan.borrower_name || "Borrower Name"}</b>, authorize the
                cooperative to deduct{" "}
                <b>{formatMoney(loan.amortization_per_payday)}</b> every{" "}
                {formatStatus(loan.payment_frequency).toLowerCase()} pay day
                until the loan is fully paid.
              </Typography>
            ) : (
              <Typography>
                I, <b>{loan.borrower_name || "Borrower Name"}</b>, selected{" "}
                <b>{formatStatus(loan.preferred_payment_method)}</b>. Accounting
                will verify actual payments through office receipt or proof of
                online transfer.
              </Typography>
            )}

            <Typography>
              Total loan amount payable is{" "}
              <b>{formatMoney(loan.total_amount_payable)}</b>. Co-maker{" "}
              <b>{loan.co_maker_name || "Co-maker Name"}</b> acknowledges the
              loan obligation as part of the cooperative approval process.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                mt: 2,
              }}
            >
              <SignatureLine label="Borrower Signature" />
              <SignatureLine label="Co-maker Signature" />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mt: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Documents and Signed Forms
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Generate the official cooperative forms, download and print them,
            have the borrower and co-maker sign with wet signatures, then upload
            the signed PDF copies for accounting evaluation.
          </Typography>

          {loan.preferred_payment_method !== "salary_deduction" && (
            <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
              Authorization to Deduct is only needed for salary deduction.
              Your selected method is {formatStatus(loan.preferred_payment_method)}, so
              accounting will verify payment through office payment or proof of transfer.
            </Alert>
          )}

          {documents.length === 0 ? (
            <Box>
              <EmptyState message="No official loan documents generated yet." />

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                onClick={handleGenerateDocuments}
              >
                Generate Official Forms
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              <Box>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                  onClick={handleGenerateDocuments}
                >
                  Regenerate Blank Official Forms
                </Button>
              </Box>

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

                  <Typography variant="body2" color="text.secondary">
                    {document.file_name || "Official cooperative loan form"}
                  </Typography>

                  <Chip
                    label={
                      document.is_signed
                        ? "Signed PDF uploaded"
                        : "Needs wet signature"
                    }
                    color={document.is_signed ? "success" : "warning"}
                    size="small"
                    sx={{ mt: 1, fontWeight: 700 }}
                  />

                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
  <Button
    variant="outlined"
    onClick={() => handleDownloadDocument(document)}
    sx={{
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 600,
    }}
  >
    Download
  </Button>

  <Button
    component="label"
    variant="contained"
    sx={{
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 600,
    }}
  >
    Upload Signed PDF

    <input
      hidden
      type="file"
      accept="application/pdf"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        handleUpload(
          String(document.document_type),
          file
        );
      }}
    />
  </Button>
</Stack>

                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {["documents_generated", "documents_uploaded"].includes(loan.status) && (
  <Card
    elevation={2}
    sx={{
      borderRadius: 3,
      mt: 3,
      border: theme => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Submit Requirements
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Submit your signed documents to send this loan application for
        accounting evaluation.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSubmitForEvaluation}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 700,
        }}
      >
        Submit For Evaluation
      </Button>
    </CardContent>
  </Card>
)}

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mt: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Activity Timeline
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
      <EmptyState message="No activity timeline available yet." />
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

const formatMoney = (value?: string | number | null) =>
  `₱${Number(value || 0).toLocaleString()}`;

const TableHeader = ({ children }: { children: ReactNode }) => (
  <th
    style={{
      padding: 12,
      textAlign: "left",
      background: "#f5f7f6",
      borderBottom: "1px solid #dfe6e2",
      color: "#4a5f55",
      fontSize: 13,
    }}
  >
    {children}
  </th>
);

const TableCell = ({ children }: { children: ReactNode }) => (
  <td
    style={{
      padding: 12,
      borderBottom: "1px solid #eef1ef",
      fontSize: 14,
    }}
  >
    {children}
  </td>
);

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SignatureLine = ({ label }: { label: string }) => (
  <Box>
    <Box
      sx={{
        borderBottom: "1px solid",
        borderColor: "text.primary",
        height: 36,
      }}
    />

    <Typography
      variant="body2"
      color="text.secondary"
      textAlign="center"
      sx={{ mt: 1 }}
    >
      {label}
    </Typography>
  </Box>
);

const SummaryBox = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography color="text.secondary" fontWeight={600}>
          {label}
        </Typography>

        <Typography variant="h5" fontWeight={700} color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: "background.default",
      border: theme => `1px dashed ${theme.palette.divider}`,
    }}
  >
    <Typography color="text.secondary">{message}</Typography>
  </Box>
);

export default MemberLoanDetailsPage;