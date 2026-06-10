"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/api/member";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { createLoan } from "@/lib/api/loan";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
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

type Member = {
  id: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  member_no?: string;
};

const emptyForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  address: "",
  borrower_email: "",
  borrower_contact_number: "",
  borrower_age: "",
  borrower_civil_status: "",
  take_home_pay_15: "",
  take_home_pay_30: "",
  member_since: "",
  employer: "",
  position: "",
  length_of_service: "",
  member_id: "",
  loan_type: "regular_member",
  amount_requested: "",
  interest_rate: String(DEFAULT_LOAN_ANNUAL_RATE),
  term_months: String(DEFAULT_LOAN_TERM_MONTHS),
  payment_frequency: DEFAULT_PAYMENT_FREQUENCY,
  preferred_payment_method: DEFAULT_PAYMENT_METHOD,
  computation_method: DEFAULT_COMPUTATION_METHOD,
  total_contribution: "",
  loan_balance: "",
  processing_fee: String(DEFAULT_PROCESSING_FEE),
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

export default function CreateLoanPage() {
  const router = useRouter();

  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  const { data: membersResponse } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const members = (
    membersResponse?.data?.data ??
    membersResponse?.data ??
    []
  ) as Member[];

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const member = (
      authUser as {
        member?: {
        id?: number | string;
      };
      } | null
      )?.member;

    if (!member || form.member_id || members.length === 0) {
      return;
    }

    const matchedMember = members.find(
      (item) => Number(item.id) === Number(member.id)
    );

    if (!matchedMember) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      member_id: String(matchedMember.id),
      first_name: matchedMember.first_name || prev.first_name,
      middle_name: matchedMember.middle_name || prev.middle_name,
      last_name: matchedMember.last_name || prev.last_name,
    }));
  }, [authUser, members, form.member_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "loan_type" && value === "non_member") {
      setForm({
        ...form,
        loan_type: value,
        member_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
      });
      return;
    }

    if (name === "member_id") {
      const selectedMember = members.find(
        (member) => String(member.id) === String(value)
      );

      setForm({
        ...form,
        member_id: value,
        first_name: selectedMember?.first_name || "",
        middle_name: selectedMember?.middle_name || "",
        last_name: selectedMember?.last_name || "",
      });

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

 const computations = useMemo(() => {
  const amount = Number(form.amount_requested || 0);
  const annualRate = Number(form.interest_rate || 0) / 100;
  const selectedMonths = Number(form.term_months || 0);
  const numberOfPaydays = selectedMonths * PAYDAYS_PER_MONTH;

  const periodsPerYear =
    form.payment_frequency === "semi_monthly"
      ? PERIODS_PER_YEAR
      : form.payment_frequency === "weekly"
      ? 52
      : 12;

  const ratePerPeriod = annualRate / periodsPerYear;
  const computationMethod = form.computation_method || "diminishing_balance";
  const flatInterest =
    amount * annualRate * (numberOfPaydays / periodsPerYear);

  const amortizationPerPayday =
    amount > 0 && numberOfPaydays > 0
      ? computationMethod === "diminishing_balance" && ratePerPeriod > 0
        ? (amount * ratePerPeriod) /
          (1 - Math.pow(1 + ratePerPeriod, -numberOfPaydays))
        : (amount + flatInterest) / numberOfPaydays
      : 0;

  let balance = amount;
  let totalInterest = 0;

  const schedule = Array.from(
    { length: numberOfPaydays },
    (_, index) => {
      const interest =
        computationMethod === "diminishing_balance"
          ? balance * ratePerPeriod
          : flatInterest / Math.max(numberOfPaydays, 1);
      const principal = amortizationPerPayday - interest;
      balance = Math.max(balance - principal, 0);
      totalInterest += interest;

      return {
        payday_no: index + 1,
        amortization: amortizationPerPayday,
        interest,
        principal,
        balance,
      };
    }
  );

  const processingFee = Number(form.processing_fee || 0);
  const totalPayable = amount + totalInterest;
  const netProceeds = Math.max(amount - processingFee, 0);

  return {
  interestAmount: totalInterest,
  totalPayable,
  monthlyAmortization: amortizationPerPayday,
  processingFee,
  netProceeds,
  schedule,
  ratePerPeriod,
  periodsPerYear,
  computationMethod,
};
}, [
  form.amount_requested,
  form.interest_rate,
  form.term_months,
  form.payment_frequency,
  form.computation_method,
  form.processing_fee,
]);

  const requiresCoMaker =
    form.loan_type === "non_member" ||
    Number(form.amount_requested || 0) > CO_MAKER_AMOUNT_THRESHOLD;

  const formatPeso = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.first_name.trim()) return showMessage("First name is required.");
    if (!form.last_name.trim()) return showMessage("Last name is required.");
    if (!form.address.trim()) return showMessage("Address is required.");
    if (!form.employer.trim()) return showMessage("Employer is required.");
    if (!form.amount_requested || Number(form.amount_requested) <= 0) {
      return showMessage("Please enter a valid loan amount.");
    }
    if (!form.term_months || Number(form.term_months) <= 0) {
      return showMessage("Please select a valid payment term.");
    }
    if (requiresCoMaker && !form.co_maker_name.trim()) {
      return showMessage(
        "Co-maker name is required for non-member loans or loans above ₱10,000."
      );
    }
    if (requiresCoMaker && !form.co_maker_contact_number.trim()) {
      return showMessage(
        "Co-maker contact number is required for non-member loans or loans above ₱10,000."
      );
    }
    if (!form.purpose.trim()) return showMessage("Loan purpose is required.");

    try {
      setLoading(true);

      const response = await createLoan({
  borrower_name:
    `${form.first_name} ${form.middle_name} ${form.last_name} ${form.suffix}`
      .replace(/\s+/g, " ")
      .trim(),

        borrower_email:
          form.borrower_email || authUser?.email || "",
        borrower_contact_number:
          form.borrower_contact_number,
        borrower_address: form.address,
        borrower_age: form.borrower_age ? Number(form.borrower_age) : null,
        borrower_civil_status: form.borrower_civil_status,
        take_home_pay_15: Number(form.take_home_pay_15 || 0),
        take_home_pay_30: Number(form.take_home_pay_30 || 0),
        member_since: form.member_since || null,
        borrower_employer: form.employer,
        borrower_position: form.position,
        borrower_length_of_service: form.length_of_service,

        member_id: form.member_id ? Number(form.member_id) : null,
        loan_type: form.loan_type,
        amount_requested: Number(form.amount_requested),
        annual_rate: Number(form.interest_rate),
        number_of_paydays: Number(form.term_months) * PAYDAYS_PER_MONTH,
        payment_frequency: form.payment_frequency,
        preferred_payment_method: form.preferred_payment_method,
        computation_method: form.computation_method,

        total_contribution: Number(form.total_contribution || 0),
        outstanding_loan_balance: Number(form.loan_balance || 0),
        purpose: form.purpose,

        co_maker_name: form.co_maker_name,
        co_maker_email: form.co_maker_email,
        co_maker_contact_number: form.co_maker_contact_number,
        co_maker_address: form.co_maker_address,
        co_maker_age: form.co_maker_age ? Number(form.co_maker_age) : null,
        co_maker_civil_status: form.co_maker_civil_status,
        co_maker_employer: form.co_maker_employer,
        co_maker_length_of_service: form.co_maker_length_of_service,

        processing_fee: Number(form.processing_fee || 0),
      });

      const createdLoanId = response.data?.data?.id;

      showMessage("Loan record created and official forms generated.");

      setTimeout(() => {
  const roles = (
    authUser as {
      roles?: string[];
    } | null
  )?.roles ?? [];
  const isBorrowerOnly =
    (roles.includes("member") || roles.includes("non-member")) &&
    !roles.includes("admin") &&
    !roles.includes("accounting");

  if (isBorrowerOnly) {
    router.push(
      createdLoanId
        ? `/dashboard/member/loans/${createdLoanId}`
        : "/dashboard/member"
    );
    return;
  }

  router.push(
    createdLoanId
      ? `/dashboard/accounting/loans/${createdLoanId}`
      : "/dashboard/accounting/loans"
  );
}, 1200);

} catch (error) {
  console.error(error);
  showMessage("Failed to create loan.");
} finally {
  setLoading(false);
}
};

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary">
            Application for Loan
          </Typography>
          <Typography color="text.secondary">
            Accounting form based on the public borrower application, with
            internal member selection and credit committee computation fields.
          </Typography>
        </Box>

        <Alert severity="info">
          Use this page when accounting encodes a walk-in or assisted loan
          application. The computation, co-maker rule, and payment term now
          follow the public application form.
        </Alert>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
         

        <Box mt={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Application for Loan
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Encode the member details, co-maker information, loan purpose, and
            cooperative computation before submitting the application.
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Borrower Information
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              margin="normal"
              label="First Name"
              disabled={!!form.member_id}
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Middle Name"
              disabled={!!form.member_id}
              name="middle_name"
              value={form.middle_name}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Last Name"
              disabled={!!form.member_id}
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Suffix"
              placeholder="Jr., Sr., III"
              name="suffix"
              value={form.suffix}
              onChange={handleChange}
            />
          </Box>

          <TextField
            required
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    gap: 2,
  }}
>
  <TextField
    fullWidth
    margin="normal"
    label="Email Address"
    name="borrower_email"
    value={form.borrower_email}
    onChange={handleChange}
  />

  <TextField
    fullWidth
    margin="normal"
    label="Contact Number"
    name="borrower_contact_number"
    value={form.borrower_contact_number}
    onChange={handleChange}
  />
</Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Age"
              name="borrower_age"
              value={form.borrower_age}
              onChange={handleChange}
            />

            <TextField
              select
              fullWidth
              margin="normal"
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

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Take Home Pay - 15th"
              name="take_home_pay_15"
              value={form.take_home_pay_15}
              onChange={handleChange}
            />

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Take Home Pay - 30th"
              name="take_home_pay_30"
              value={form.take_home_pay_30}
              onChange={handleChange}
            />

            <TextField
              type="date"
              fullWidth
              margin="normal"
              label="Coop Member Since"
              name="member_since"
              value={form.member_since}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="ID Number"
              value={form.member_id || "For manual verification"}
              InputProps={{ readOnly: true }}
              helperText="Uses the selected member record when available."
            />
          </Box>

          <Box display="flex" alignItems="center" gap={1} mt={3} mb={1}>
            <WorkIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Employment Information
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              margin="normal"
              label="Employer"
              name="employer"
              value={form.employer}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Length of Service"
              name="length_of_service"
              value={form.length_of_service}
              onChange={handleChange}
/>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={3} mb={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
            Co-maker Information
  </Typography>
</Box>

        <Alert
          severity={requiresCoMaker ? "warning" : "info"}
          sx={{ mb: 2 }}
        >
          {requiresCoMaker
            ? "Co-maker is required for non-member loans or loans above ₱10,000."
            : "Co-maker is optional for small member loans. It may be required for larger or non-member loans."}
        </Alert>

        <Box
           sx={{
             display: "grid",
             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
             gap: 2,
  }}
>
  <TextField
    required={requiresCoMaker}
    fullWidth
    margin="normal"
    label="Co-maker Name"
    name="co_maker_name"
    value={form.co_maker_name || ""}
    onChange={handleChange}
  />

  <TextField
    required={requiresCoMaker}
    fullWidth
    margin="normal"
    label="Co-maker Email"
    name="co_maker_email"
    value={form.co_maker_email || ""}
    onChange={handleChange}
  />

  <TextField
    fullWidth
    margin="normal"
    label="Co-maker Contact Number"
    name="co_maker_contact_number"
    value={form.co_maker_contact_number || ""}
    onChange={handleChange}
  />

  <TextField
    fullWidth
    margin="normal"
    label="Co-maker Address"
    name="co_maker_address"
    value={form.co_maker_address || ""}
    onChange={handleChange}
  />

  <TextField
    type="number"
    fullWidth
    margin="normal"
    label="Co-maker Age"
    name="co_maker_age"
    value={form.co_maker_age || ""}
    onChange={handleChange}
  />

  <TextField
    select
    fullWidth
    margin="normal"
    label="Co-maker Civil Status"
    name="co_maker_civil_status"
    value={form.co_maker_civil_status || ""}
    onChange={handleChange}
  >
    <MenuItem value="">Select civil status</MenuItem>
    <MenuItem value="single">Single</MenuItem>
    <MenuItem value="married">Married</MenuItem>
    <MenuItem value="widowed">Widowed</MenuItem>
    <MenuItem value="separated">Separated</MenuItem>
  </TextField>

  <TextField
    fullWidth
    margin="normal"
    label="Co-maker Employer"
    name="co_maker_employer"
    value={form.co_maker_employer || ""}
    onChange={handleChange}
  />

  <TextField
    fullWidth
    margin="normal"
    label="Co-maker Length of Service"
    name="co_maker_length_of_service"
    value={form.co_maker_length_of_service || ""}
    onChange={handleChange}
  />
</Box>

<Box display="flex" alignItems="center" gap={1} mt={3} mb={1}>
  <AccountBalanceIcon color="primary" />
  <Typography variant="h6" fontWeight={700}>
    Credit Committee Computation
  </Typography>
</Box>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Loan Type"
            name="loan_type"
            value={form.loan_type}
            onChange={handleChange}
          >
            <MenuItem value="regular_member">Regular Member</MenuItem>
            <MenuItem value="non_member">Non-Member</MenuItem>
            <MenuItem value="appliance_loan">Appliance Loan</MenuItem>
            <MenuItem value="emergency_loan">Emergency Loan</MenuItem>
          </TextField>

          {form.loan_type !== "non_member" && (
            <>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Registered Member (optional)"
                helperText="Select an existing cooperative member or leave blank for non-member loans."
                name="member_id"
                value={form.member_id}
                onChange={handleChange}
              >
                <MenuItem value="">No member selected</MenuItem>

                {members.map((member) => (
                  <MenuItem key={member.id} value={String(member.id)}>
                    {member.member_no ? `${member.member_no} - ` : ""}
                    {[member.first_name, member.middle_name, member.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </MenuItem>
                ))}
              </TextField>

              {form.member_id && (
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Selected Member
                  </Typography>

                  <Typography fontWeight={600}>
                    {[form.first_name, form.middle_name, form.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </Typography>

                  <Button
                    size="small"
                    sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
                    onClick={() =>
                      setForm({
                        ...form,
                        member_id: "",
                        first_name: "",
                        middle_name: "",
                        last_name: "",
                      })
                    }
                  >
                    Clear selected member
                  </Button>
                </Box>
              )}
            </>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              required
              type="number"
              fullWidth
              margin="normal"
              label="Amount of Loan Application"
              name="amount_requested"
              value={form.amount_requested}
              onChange={handleChange}
            />

            <TextField
              select
              required
              fullWidth
              margin="normal"
              label="Preferred Payment Term"
              name="term_months"
              value={form.term_months}
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

            <TextField
              select
              fullWidth
              margin="normal"
              label="Interest Option Selected"
              name="payment_frequency"
              value={form.payment_frequency}
              onChange={handleChange}
            >
              <MenuItem value="semi_monthly">Semi-Monthly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              margin="normal"
              label="Preferred Payment Method"
              name="preferred_payment_method"
              value={form.preferred_payment_method}
              onChange={handleChange}
              helperText="Records the borrower's preferred way of paying. Accounting verifies actual payments."
            >
              <MenuItem value="salary_deduction">Salary Deduction</MenuItem>
              <MenuItem value="cash">Cash / Manual Payment</MenuItem>
              <MenuItem value="online_transfer">Online Transfer</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              margin="normal"
              label="Computation Method"
              name="computation_method"
              value={form.computation_method}
              onChange={handleChange}
              helperText={getComputationMethodDescription(form.computation_method)}
            >
              <MenuItem value="diminishing_balance">
                Diminishing Balance
              </MenuItem>
              <MenuItem value="add_on_rate">Add-On Rate</MenuItem>
              <MenuItem value="simple_interest">Simple Interest</MenuItem>
            </TextField>

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Annual Interest Rate (%)"
              name="interest_rate"
              value={form.interest_rate}
              onChange={handleChange}
            />

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Processing Fee"
              name="processing_fee"
              value={form.processing_fee}
              onChange={handleChange}
            />

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Total Contribution as of Date"
              name="total_contribution"
              value={form.total_contribution}
              onChange={handleChange}
            />

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Outstanding Cooperative Loan as of Date"
              name="loan_balance"
              value={form.loan_balance}
              onChange={handleChange}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={3}>
              Credit Committee Computation Preview
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <ComputationCard
                label="Total Interest"
                value={formatPeso(computations.interestAmount)}
                color="primary.main"
              />

              <ComputationCard
                label="Total Payable"
                value={formatPeso(computations.totalPayable)}
                color="success.main"
              />

              <ComputationCard
                label="Amortization Per Pay Day"
                value={formatPeso(computations.monthlyAmortization)}
                color="warning.main"
              />

              <ComputationCard
                label="Net Proceeds"
                value={formatPeso(computations.netProceeds)}
                color="info.main"
              />

              <ComputationCard
                label="Amount of Loan Approved"
                value={formatPeso(Number(form.amount_requested || 0))}
                color="success.dark"
              />

              <ComputationCard
                label="Maximum Loan if Disapproved"
                value={formatPeso(Math.max(Number(form.total_contribution || 0) * 2 - Number(form.loan_balance || 0), 0))}
                color="text.primary"
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
  <Typography
    variant="h6"
    fontWeight={700}
    gutterBottom
  >
    Payment Schedule Preview
  </Typography>

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
      <thead
        style={{
          background: "#f5f5f5",
        }}
      >
        <tr>
          <th style={{ padding: 12 }}>#</th>
          <th style={{ padding: 12 }}>Payment</th>
          <th style={{ padding: 12 }}>Principal</th>
          <th style={{ padding: 12 }}>Interest</th>
          <th style={{ padding: 12 }}>Balance</th>
        </tr>
      </thead>

      <tbody>
        {computations.schedule.map((row) => (
          <tr
            key={row.payday_no}
            style={{
            borderTop: "1px solid #e0e0e0",
            background:
            row.payday_no % 2 === 0
            ? "#fafafa"
            : "#ffffff",
          }}
          >
            <td style={{ padding: 12, textAlign: "center" }}>
              {row.payday_no}
            </td>

            <td style={{ padding: 12 }}>
              {formatPeso(row.amortization)}
            </td>

            <td style={{ padding: 12 }}>
              {formatPeso(row.principal)}
            </td>

            <td style={{ padding: 12 }}>
              {formatPeso(row.interest)}
            </td>

            <td
  style={{
    padding: 12,
    fontWeight:
      row.payday_no === computations.schedule.length
        ? 700
        : 400,
    color:
      row.payday_no === computations.schedule.length
        ? "#2e7d32"
        : "inherit",
  }}
>
  {formatPeso(row.balance)}
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Box>
  <Box
  sx={{
    mt: 3,
    p: 3,
    borderRadius: 3,
    bgcolor: "#f8fafc",
    border: "1px solid",
    borderColor: "divider",
  }}
>
  <Typography variant="h6" fontWeight={700} gutterBottom>
    Loan Computation Summary
  </Typography>

  <Stack spacing={1}>
    <Typography>
      <b>Principal Applied:</b>{" "}
      {formatPeso(Number(form.amount_requested || 0))}
    </Typography>

    <Typography>
      <b>Total Interest:</b>{" "}
      {formatPeso(computations.interestAmount)}
    </Typography>

    <Typography>
      <b>Total Amount Payable:</b>{" "}
      {formatPeso(computations.totalPayable)}
    </Typography>

    <Typography>
      <b>Processing Fee:</b>{" "}
      {formatPeso(computations.processingFee)}
    </Typography>

    <Typography>
      <b>Net Proceeds:</b>{" "}
      {formatPeso(computations.netProceeds)}
    </Typography>

    <Typography>
      <b>Computation Method:</b>{" "}
      {formatStatus(form.computation_method)}
    </Typography>

    <Typography>
      <b>Payment Frequency:</b>{" "}
      {form.payment_frequency.replaceAll("_", " ")}
    </Typography>

    <Typography>
      <b>Preferred Payment Method:</b>{" "}
      {formatStatus(form.preferred_payment_method)}
    </Typography>

    <Typography>
      <b>Rate Per Payment:</b>{" "}
      {(computations.ratePerPeriod * 100).toFixed(2)}%
    </Typography>

    <Typography>
      <b>Payment Term:</b> {form.term_months || 0} months /{" "}
      {Number(form.term_months || 0) * PAYDAYS_PER_MONTH} paydays
    </Typography>
  </Stack>
</Box>
</Box>

<Box
  sx={{
    mt: 3,
    p: 3,
    borderRadius: 3,
    bgcolor: "#fff7ed",
    border: "1px solid",
    borderColor: "warning.light",
  }}
>
  <Typography variant="h6" fontWeight={700} gutterBottom>
    Payment Agreement / Promissory Note Preview
  </Typography>

  <Typography color="text.secondary" sx={{ mb: 2 }}>
    This simple preview follows the printed cooperative form. The generated PDF
    will still be downloaded, printed, signed, and uploaded as a wet-signed copy.
  </Typography>

  <Stack spacing={1.25}>
    {form.preferred_payment_method === "salary_deduction" ? (
      <Typography>
        I,{" "}
        <b>
          {[form.first_name, form.middle_name, form.last_name, form.suffix]
            .filter(Boolean)
            .join(" ") || "Borrower Name"}
        </b>
        , authorize the cooperative to deduct{" "}
        <b>{formatPeso(computations.monthlyAmortization)}</b> every{" "}
        {form.payment_frequency.replaceAll("_", " ")} pay day until the loan is
        fully paid.
      </Typography>
    ) : (
      <Typography>
        I,{" "}
        <b>
          {[form.first_name, form.middle_name, form.last_name, form.suffix]
            .filter(Boolean)
            .join(" ") || "Borrower Name"}
        </b>
        , selected <b>{formatStatus(form.preferred_payment_method)}</b>.
        Accounting will verify payment through office receipt or proof of
        transfer.
      </Typography>
    )}

    <Typography>
      Total loan amount payable is{" "}
      <b>{formatPeso(computations.totalPayable)}</b>, with co-maker{" "}
      <b>{form.co_maker_name || "Co-maker Name"}</b> acknowledging the obligation
      as required by the cooperative loan process.
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
</Box>

          <TextField
            required
            fullWidth
            multiline
            minRows={3}
            margin="normal"
            label="Loan Purpose"
            placeholder="Example: Business capital, emergency expense, tuition, appliance purchase..."
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 4,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              size="medium"
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
              onClick={() => {
  const roles = (
    authUser as {
      roles?: string[];
    } | null
    )?.roles ?? [];

  if (
    roles.includes("member") ||
    roles.includes("non-member")
  ) {
    router.push("/dashboard/member");
    return;
  }

  router.push("/dashboard/accounting/loans");
}}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating Loan..." : "Create Loan Application"}
            </Button>
          </Box>
        </Box>
      </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              position: { md: "sticky" },
              top: 96,
              border: theme => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Application Preview
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Quick check before creating the loan record and generated forms.
            </Typography>

            <Stack spacing={1.25}>
              <Typography>
                <b>Borrower:</b>{" "}
                {[form.first_name, form.middle_name, form.last_name, form.suffix]
                  .filter(Boolean)
                  .join(" ") || "Not encoded yet"}
              </Typography>

              <Typography>
                <b>Loan Amount:</b>{" "}
                {formatPeso(Number(form.amount_requested || 0))}
              </Typography>

              <Typography>
                <b>Payment Term:</b> {form.term_months || 0} months /{" "}
                {Number(form.term_months || 0) * PAYDAYS_PER_MONTH} paydays
              </Typography>

              <Typography>
                <b>Amortization Per Payday:</b>{" "}
                {formatPeso(computations.monthlyAmortization)}
              </Typography>

              <Typography>
                <b>Total Interest:</b>{" "}
                {formatPeso(computations.interestAmount)}
              </Typography>

              <Typography>
                <b>Total Payable:</b>{" "}
                {formatPeso(computations.totalPayable)}
              </Typography>

              <Typography>
                <b>Net Proceeds:</b>{" "}
                {formatPeso(computations.netProceeds)}
              </Typography>

              <Typography>
                <b>Payment Method:</b>{" "}
                {formatStatus(form.preferred_payment_method)}
              </Typography>

              <Alert
                severity={requiresCoMaker ? "warning" : "info"}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                {requiresCoMaker
                  ? "Co-maker is required for this application."
                  : "Co-maker is optional for this application."}
              </Alert>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

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
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

const ComputationCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "white",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="h6" fontWeight={700} color={color}>
        {value}
      </Typography>
    </Paper>
  );
};

const formatStatus = (status?: string | null) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getComputationMethodDescription = (method: string) => {
  const descriptions: Record<string, string> = {
    diminishing_balance:
      "Interest is computed on the remaining balance. This is the default cooperative method.",
    add_on_rate:
      "Total interest is added to the principal, then divided equally per payment.",
    simple_interest:
      "Interest is based on the original principal, rate, and loan term.",
  };

  return descriptions[method] || descriptions.diminishing_balance;
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