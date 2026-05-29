"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/api/member";
import {
  Alert,
  Box,
  Button,
  Container,
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
  employer: "",
  position: "",
  length_of_service: "",
  member_id: "",
  loan_type: "regular_member",
  amount_requested: "",
  interest_rate: "12",
  term_months: "",
  payment_frequency: "monthly",
  total_contribution: "",
  loan_balance: "",
  purpose: "",

  co_maker_name: "",
co_maker_email: "",
co_maker_contact_number: "",
co_maker_address: "",
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
  const numberOfPaydays = Number(form.term_months || 0);

  const periodsPerYear =
    form.payment_frequency === "semi_monthly"
      ? 24
      : form.payment_frequency === "weekly"
      ? 52
      : 12;

  const ratePerPeriod = annualRate / periodsPerYear;

  const amortizationPerPayday =
    amount > 0 && numberOfPaydays > 0
      ? ratePerPeriod > 0
        ? (amount * ratePerPeriod) /
          (1 - Math.pow(1 + ratePerPeriod, -numberOfPaydays))
        : amount / numberOfPaydays
      : 0;

  let balance = amount;
  let totalInterest = 0;

  const schedule = Array.from(
    { length: numberOfPaydays },
    (_, index) => {
      const interest = balance * ratePerPeriod;
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

  const totalPayable = amount + totalInterest;

  return {
  interestAmount: totalInterest,
  totalPayable,
  monthlyAmortization: amortizationPerPayday,
  schedule,
  ratePerPeriod,
  periodsPerYear,
};
}, [
  form.amount_requested,
  form.interest_rate,
  form.term_months,
  form.payment_frequency,
]);

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
      return showMessage("Please enter a valid loan term.");
    }
    if (!form.purpose.trim()) return showMessage("Loan purpose is required.");

    try {
      setLoading(true);

      await createLoan({
  borrower_name:
    `${form.first_name} ${form.middle_name} ${form.last_name} ${form.suffix}`
      .replace(/\s+/g, " ")
      .trim(),

        borrower_email:
          form.borrower_email || authUser?.email || "",
        borrower_contact_number:
          form.borrower_contact_number,
        borrower_address: form.address,
        borrower_employer: form.employer,
        borrower_position: form.position,
        borrower_length_of_service: form.length_of_service,

        member_id: form.member_id ? Number(form.member_id) : null,
        loan_type: form.loan_type,
        amount_requested: Number(form.amount_requested),
        annual_rate: Number(form.interest_rate),
        number_of_paydays: Number(form.term_months),
        payment_frequency: form.payment_frequency,

        total_contribution: Number(form.total_contribution || 0),
        outstanding_loan_balance: Number(form.loan_balance || 0),
        purpose: form.purpose,

        co_maker_name: form.co_maker_name,
        co_maker_email: form.co_maker_email,
        co_maker_contact_number: form.co_maker_contact_number,
        co_maker_address: form.co_maker_address,
        co_maker_employer: form.co_maker_employer,
        co_maker_length_of_service: form.co_maker_length_of_service,

        processing_fee: 50,
      });

      showMessage("Loan application created successfully.");

      setTimeout(() => {
  const roles = (
    authUser as {
      roles?: string[];
    } | null
  )?.roles ?? [];

  if (
    roles.includes("member") ||
    roles.includes("non_member")
  ) {
    router.push("/dashboard/member");
    return;
  }

  router.push("/dashboard/accounting/loans");
}, 1200);

} catch (error) {
  console.error(error);
  showMessage("Failed to create loan.");
} finally {
  setLoading(false);
}
};

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
         

        <Box mt={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Create Loan Application
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Fill out the required borrower and loan information.
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Personal Information
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
    label="Co-maker Name"
    name="co_maker_name"
    value={form.co_maker_name || ""}
    onChange={handleChange}
  />

  <TextField
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
    Loan Information
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
                label="Member (optional)"
                helperText="Select an existing member or leave blank."
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
              label="Amount Requested"
              name="amount_requested"
              value={form.amount_requested}
              onChange={handleChange}
            />

            <TextField
              required
              type="number"
              fullWidth
              margin="normal"
              label="Term (Months)"
              name="term_months"
              value={form.term_months}
              onChange={handleChange}
            />

            <TextField
              select
              fullWidth
              margin="normal"
              label="Payment Frequency"
              name="payment_frequency"
              value={form.payment_frequency}
              onChange={handleChange}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="semi_monthly">Semi-Monthly</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </TextField>

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Interest Rate (%)"
              name="interest_rate"
              value={form.interest_rate}
              onChange={handleChange}
            />

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Total Contribution"
              name="total_contribution"
              value={form.total_contribution}
              onChange={handleChange}
            />

            <TextField
              type="number"
              fullWidth
              margin="normal"
              label="Outstanding Loan Balance"
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
              Loan Computation
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <ComputationCard
                label="Add Interest"
                value={formatPeso(computations.interestAmount)}
                color="primary.main"
              />

              <ComputationCard
                label="Total Payable"
                value={formatPeso(computations.totalPayable)}
                color="success.main"
              />

              <ComputationCard
                label="Amortization Per Payment"
                value={formatPeso(computations.monthlyAmortization)}
                color="warning.main"
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
  <Typography
    variant="h6"
    fontWeight={700}
    gutterBottom
  >
    Amortization Schedule Preview
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
    Loan Summary
  </Typography>

  <Stack spacing={1}>
    <Typography>
      <b>Total Loan Amount:</b>{" "}
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
      <b>Payment Frequency:</b>{" "}
      {form.payment_frequency.replaceAll("_", " ")}
    </Typography>

    <Typography>
      <b>Rate Per Payment:</b>{" "}
      {(computations.ratePerPeriod * 100).toFixed(2)}%
    </Typography>

    <Typography>
      <b>Number of Payments:</b>{" "}
      {form.term_months || 0}
    </Typography>
  </Stack>
</Box>
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
    roles.includes("non_member")
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