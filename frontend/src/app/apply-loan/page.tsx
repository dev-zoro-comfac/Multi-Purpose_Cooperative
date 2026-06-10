"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "@/components/ui/Logo";
import {
  CO_MAKER_AMOUNT_THRESHOLD,
  DEFAULT_COMPUTATION_METHOD,
  DEFAULT_LOAN_ANNUAL_RATE,
  DEFAULT_LOAN_TERM_MONTHS,
  DEFAULT_PAYMENT_FREQUENCY,
  DEFAULT_PAYMENT_METHOD,
  DEFAULT_PROCESSING_FEE,
  PAYDAYS_PER_MONTH,
  PERIODS_PER_YEAR,
} from "@/constant/loan";
import { submitPublicLoanApplication } from "@/lib/api/loan";

const emptyForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  borrower_email: "",
  borrower_contact_number: "",
  borrower_address: "",
  borrower_age: "",
  borrower_civil_status: "",
  declared_member_status: "new_applicant",
  declared_member_no: "",
  member_since: "",
  take_home_pay_15: "",
  take_home_pay_30: "",
  borrower_employer: "",
  borrower_position: "",
  borrower_length_of_service: "",
  amount_requested: "",
  loan_term_months: String(DEFAULT_LOAN_TERM_MONTHS),
  preferred_payment_method: DEFAULT_PAYMENT_METHOD,
  purpose: "",
  co_maker_name: "",
  co_maker_email: "",
  co_maker_contact_number: "",
  co_maker_address: "",
  co_maker_age: "",
  co_maker_civil_status: "",
  co_maker_employer: "",
  co_maker_length_of_service: "",
};

const PublicLoanApplicationPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const loanPreview = useMemo(() => {
    const amount = Number(form.amount_requested || 0);
    const months = Number(form.loan_term_months || DEFAULT_LOAN_TERM_MONTHS);
    const numberOfPaydays = months * PAYDAYS_PER_MONTH;
    const ratePerPayday = (DEFAULT_LOAN_ANNUAL_RATE / 100) / PERIODS_PER_YEAR;

    if (amount <= 0 || numberOfPaydays <= 0) {
      return {
        amount,
        semiMonthlyPayment: 0,
        totalInterest: 0,
        totalPayable: 0,
        netProceeds: 0,
        numberOfPaydays,
      };
    }

    const semiMonthlyPayment =
      (amount * ratePerPayday) /
      (1 - Math.pow(1 + ratePerPayday, -numberOfPaydays));
    const totalPayable = semiMonthlyPayment * numberOfPaydays;
    const totalInterest = totalPayable - amount;

    return {
      amount,
      semiMonthlyPayment,
      totalInterest,
      totalPayable,
      netProceeds: Math.max(amount - DEFAULT_PROCESSING_FEE, 0),
      numberOfPaydays,
    };
  }, [form.amount_requested, form.loan_term_months]);

  const requiresCoMaker =
    form.declared_member_status === "new_applicant" ||
    Number(form.amount_requested || 0) > CO_MAKER_AMOUNT_THRESHOLD;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (isSubmitted) {
      setIsSubmitted(false);
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.first_name.trim()) {
      return showMessage("First name is required.", "error");
    }
    if (!form.last_name.trim()) {
      return showMessage("Last name is required.", "error");
    }
    if (!form.borrower_email.trim()) {
      return showMessage("Email address is required.", "error");
    }
    if (!form.borrower_contact_number.trim()) {
      return showMessage("Contact number is required.", "error");
    }
    if (!form.borrower_address.trim()) {
      return showMessage("Address is required.", "error");
    }
    if (!form.borrower_age || Number(form.borrower_age) < 18) {
      return showMessage("Borrower age must be at least 18.", "error");
    }
    if (!form.borrower_civil_status.trim()) {
      return showMessage("Civil status is required.", "error");
    }
    if (
      form.declared_member_status === "member" &&
      !form.declared_member_no.trim()
    ) {
      return showMessage("Please enter your member number for verification.", "error");
    }
    if (!form.borrower_employer.trim()) {
      return showMessage("Employer is required.", "error");
    }
    if (!form.take_home_pay_15 || Number(form.take_home_pay_15) < 0) {
      return showMessage("Take Home Pay - 15th is required.", "error");
    }
    if (!form.take_home_pay_30 || Number(form.take_home_pay_30) < 0) {
      return showMessage("Take Home Pay - 30th is required.", "error");
    }
    if (!form.amount_requested || Number(form.amount_requested) <= 0) {
      return showMessage("Please enter a valid loan amount.", "error");
    }
    if (!form.loan_term_months || Number(form.loan_term_months) <= 0) {
      return showMessage("Please choose your preferred payment term.", "error");
    }
    if (!form.purpose.trim()) {
      return showMessage("Loan purpose is required.", "error");
    }
    if (requiresCoMaker && !form.co_maker_name.trim()) {
      return showMessage(
        "Co-maker name is required for new applicants or loans above PHP 10,000.",
        "error"
      );
    }
    if (requiresCoMaker && !form.co_maker_contact_number.trim()) {
      return showMessage("Co-maker contact number is required.", "error");
    }

    try {
      setIsSubmitting(true);
      const borrowerName = [
        form.first_name,
        form.middle_name,
        form.last_name,
        form.suffix,
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      await submitPublicLoanApplication({
        ...form,
        borrower_name: borrowerName,
        loan_type:
          form.declared_member_status === "member"
            ? "regular_member"
            : "non_member",
        amount_requested: Number(form.amount_requested),
        borrower_age: form.borrower_age ? Number(form.borrower_age) : null,
        co_maker_age: form.co_maker_age ? Number(form.co_maker_age) : null,
        take_home_pay_15: Number(form.take_home_pay_15 || 0),
        take_home_pay_30: Number(form.take_home_pay_30 || 0),
        member_since: form.member_since || null,
        annual_rate: DEFAULT_LOAN_ANNUAL_RATE,
        number_of_paydays: Number(form.loan_term_months) * PAYDAYS_PER_MONTH,
        payment_frequency: DEFAULT_PAYMENT_FREQUENCY,
        preferred_payment_method: form.preferred_payment_method,
        computation_method: DEFAULT_COMPUTATION_METHOD,
        processing_fee: DEFAULT_PROCESSING_FEE,
        total_contribution: 0,
        outstanding_loan_balance: 0,
      });

      setForm(emptyForm);
      setIsSubmitted(true);
      showMessage(
        "Application submitted. Accounting will review it and contact you."
      );
    } catch (error) {
      console.error(error);
      showMessage("Failed to submit application. Please check your details.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fb", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Logo sx={{ width: 52, height: 44 }} />
              <Box>
                <Typography variant="h5" fontWeight={800} color="primary">
                  Public Loan Application
                </Typography>
                <Typography color="text.secondary">
                  Cornersteel Cooperative
                </Typography>
              </Box>
            </Stack>

            <Button
              component={NextLink}
              href="/"
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
            >
              Back to Home
            </Button>
          </Stack>

          <Alert severity="info">
            Use this form for first-time or walk-in borrowers. Accounting will
            review your application before creating a portal account.
          </Alert>

          {isSubmitted && (
            <Alert severity="success" variant="outlined">
              Application submitted successfully. Please wait for accounting
              review. If approved, the cooperative may create your portal account
              and contact you for the next steps.
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        Borrower Information
                      </Typography>
                      <Typography color="text.secondary">
                        Enter your basic details for accounting review.
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="First Name"
                          name="first_name"
                          value={form.first_name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Middle Name"
                          name="middle_name"
                          value={form.middle_name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          value={form.last_name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Suffix"
                          placeholder="Jr., Sr., III"
                          name="suffix"
                          value={form.suffix}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          fullWidth
                          type="email"
                          label="Email Address"
                          name="borrower_email"
                          value={form.borrower_email}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Contact Number"
                          name="borrower_contact_number"
                          value={form.borrower_contact_number}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          type="number"
                          fullWidth
                          label="Age"
                          name="borrower_age"
                          value={form.borrower_age}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          select
                          fullWidth
                          label="Civil Status"
                          name="borrower_civil_status"
                          value={form.borrower_civil_status}
                          onChange={handleChange}
                        >
                          <MenuItem value="">Select civil status</MenuItem>
                          <MenuItem value="single">Single</MenuItem>
                          <MenuItem value="married">Married</MenuItem>
                          <MenuItem value="widowed">Widowed</MenuItem>
                          <MenuItem value="separated">Separated</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          fullWidth
                          label="Are you already a cooperative member?"
                          name="declared_member_status"
                          value={form.declared_member_status}
                          onChange={handleChange}
                          helperText="Accounting will verify this information."
                        >
                          <MenuItem value="member">
                            Yes, I am already a member
                          </MenuItem>
                          <MenuItem value="new_applicant">
                            No, I am a new applicant
                          </MenuItem>
                        </TextField>
                      </Grid>
                      {form.declared_member_status === "member" && (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            required
                            fullWidth
                            label="Member Number"
                            name="declared_member_no"
                            value={form.declared_member_no}
                            onChange={handleChange}
                            helperText="Enter your existing cooperative member number."
                          />
                        </Grid>
                      )}
                      {form.declared_member_status === "member" && (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            type="date"
                            fullWidth
                            label="Coop Member Since"
                            name="member_since"
                            value={form.member_since}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      )}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          required
                          fullWidth
                          label="Home Address"
                          name="borrower_address"
                          value={form.borrower_address}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <Box>
                      <Typography variant="h5" fontWeight={800}>
                        Employment and Loan Details
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Employer"
                          name="borrower_employer"
                          value={form.borrower_employer}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Position"
                          name="borrower_position"
                          value={form.borrower_position}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Length of Service"
                          name="borrower_length_of_service"
                          value={form.borrower_length_of_service}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          type="number"
                          fullWidth
                          label="Take Home Pay - 15th"
                          name="take_home_pay_15"
                          value={form.take_home_pay_15}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          type="number"
                          fullWidth
                          label="Take Home Pay - 30th"
                          name="take_home_pay_30"
                          value={form.take_home_pay_30}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          type="number"
                          fullWidth
                          label="Loan Amount Requested"
                          name="amount_requested"
                          value={form.amount_requested}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          required
                          fullWidth
                          label="Preferred Payment Term"
                          name="loan_term_months"
                          value={form.loan_term_months}
                          onChange={handleChange}
                          helperText="The cooperative computes this as two payments per month."
                        >
                          <MenuItem value="3">3 months</MenuItem>
                          <MenuItem value="6">6 months</MenuItem>
                          <MenuItem value="9">9 months</MenuItem>
                          <MenuItem value="12">12 months</MenuItem>
                          <MenuItem value="18">18 months</MenuItem>
                          <MenuItem value="24">24 months</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          required
                          fullWidth
                          label="Preferred Payment Method"
                          name="preferred_payment_method"
                          value={form.preferred_payment_method}
                          onChange={handleChange}
                          helperText="Accounting will verify and confirm this payment method."
                        >
                          <MenuItem value="salary_deduction">
                            Salary Deduction
                          </MenuItem>
                          <MenuItem value="cash">Cash / Manual Payment</MenuItem>
                          <MenuItem value="online_transfer">
                            Online Transfer
                          </MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          required
                          fullWidth
                          multiline
                          minRows={3}
                          label="Purpose of Loan"
                          name="purpose"
                          value={form.purpose}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <Box>
                      <Typography variant="h5" fontWeight={800}>
                        Co-maker Information
                      </Typography>
                      <Typography color="text.secondary">
                        {requiresCoMaker
                          ? "Required for new applicants or loans above PHP 10,000."
                          : "Optional for existing members with loans of PHP 10,000 or below."}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required={requiresCoMaker}
                          fullWidth
                          label="Co-maker Name"
                          name="co_maker_name"
                          value={form.co_maker_name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Co-maker Email"
                          name="co_maker_email"
                          value={form.co_maker_email}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required={requiresCoMaker}
                          fullWidth
                          label="Co-maker Contact Number"
                          name="co_maker_contact_number"
                          value={form.co_maker_contact_number}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          type="number"
                          fullWidth
                          label="Co-maker Age"
                          name="co_maker_age"
                          value={form.co_maker_age}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          fullWidth
                          label="Co-maker Civil Status"
                          name="co_maker_civil_status"
                          value={form.co_maker_civil_status}
                          onChange={handleChange}
                        >
                          <MenuItem value="">Select civil status</MenuItem>
                          <MenuItem value="single">Single</MenuItem>
                          <MenuItem value="married">Married</MenuItem>
                          <MenuItem value="widowed">Widowed</MenuItem>
                          <MenuItem value="separated">Separated</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Co-maker Address"
                          name="co_maker_address"
                          value={form.co_maker_address}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Co-maker Employer"
                          name="co_maker_employer"
                          value={form.co_maker_employer}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Co-maker Length of Service"
                          name="co_maker_length_of_service"
                          value={form.co_maker_length_of_service}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 800,
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 4, position: { md: "sticky" }, top: 24 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    Application Preview
                  </Typography>
                  <Stack spacing={1.25}>
                    <Typography>
                      <b>Applicant Type:</b>{" "}
                      {form.declared_member_status === "member"
                        ? "Existing member for verification"
                        : "New applicant / non-member"}
                    </Typography>
                    {form.declared_member_status === "member" && (
                      <Typography>
                        <b>Member Number:</b>{" "}
                        {form.declared_member_no || "For verification"}
                      </Typography>
                    )}
                    <Typography>
                      <b>Loan Type:</b>{" "}
                      {form.declared_member_status === "member"
                        ? "Regular member loan"
                        : "Public non-member application"}
                    </Typography>
                    <Typography>
                      <b>Preferred Term:</b> {form.loan_term_months} months
                    </Typography>
                    <Typography>
                      <b>Estimated Semi-Monthly Payment:</b> ₱
                      {loanPreview.semiMonthlyPayment.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography>
                      <b>Number of Payments:</b>{" "}
                      {loanPreview.numberOfPaydays}
                    </Typography>
                    <Typography>
                      <b>Total Interest:</b> ₱
                      {loanPreview.totalInterest.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography>
                      <b>Total Amount Payable:</b> ₱
                      {loanPreview.totalPayable.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography>
                      <b>Net Proceeds:</b> ₱
                      {loanPreview.netProceeds.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography>
                      <b>Default Computation:</b> {DEFAULT_LOAN_ANNUAL_RATE}%{" "}
                      Diminishing Balance
                    </Typography>
                    <Typography>
                      <b>Payment Schedule:</b> Semi-monthly, usually every 15th
                      and 30th
                    </Typography>
                    <Typography>
                      <b>Payment Method:</b>{" "}
                      {formatPaymentMethod(form.preferred_payment_method)}
                    </Typography>
                    <Typography>
                      <b>Co-maker Requirement:</b>{" "}
                      {requiresCoMaker
                        ? "Required for this application"
                        : "Optional based on current details"}
                    </Typography>
                    <Typography color="text.secondary">
                      Final amount, requirements, and account setup will be
                      confirmed by accounting.
                    </Typography>
                    <Alert severity="warning" variant="outlined">
                      Before submitting, make sure your contact details are
                      correct. Accounting will verify the information, final
                      computation, document requirements, and wet-signed forms.
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const formatPaymentMethod = (value: string) => {
  const labels: Record<string, string> = {
    salary_deduction: "Salary Deduction",
    cash: "Cash / Manual Payment",
    online_transfer: "Online Transfer",
  };

  return labels[value] || "For accounting confirmation";
};

export default PublicLoanApplicationPage;
