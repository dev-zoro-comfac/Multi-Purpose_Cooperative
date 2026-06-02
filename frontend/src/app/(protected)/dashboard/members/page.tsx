"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "@/lib/axios-instance";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";  

type Member = {
  id: number;
  user_id?: string | null;
  member_no: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  contact_number?: string;
  department?: string;
  position?: string;
  share_capital?: number;
  total_contribution?: number;
  status?: string;
};

const emptyForm = {
  member_no: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  contact_number: "",
  department: "",
  position: "",
  share_capital: "0",
  total_contribution: "0",
  status: "active",
  create_account: "true",
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");
  const [sendingSetupMemberId, setSendingSetupMemberId] = useState<
    number | null
  >(null);
  const { data: authResponse } = useAuthenticatedUser();
const authUser = authResponse?.data;

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const loadMembers = async () => {
    const response = await axiosInstance.get("/members");
    setMembers(response.data?.data ?? response.data ?? []);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const keyword = search.toLowerCase();

    return members.filter((member) =>
      [
        member.member_no,
        member.first_name,
        member.middle_name,
        member.last_name,
        member.email,
        member.department,
        member.position,
        member.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [members, search]);

  const activeMembers = members.filter(
    (member) => member.status === "active" || !member.status
  ).length;

  const totalContribution = members.reduce(
    (sum, member) => sum + Number(member.total_contribution || 0),
    0
  );

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.member_no.trim()) {
      showSnackbar("Member number is required.", "error");
      return;
    }

    if (!form.first_name.trim()) {
      showSnackbar("First name is required.", "error");
      return;
    }

    if (!form.last_name.trim()) {
      showSnackbar("Last name is required.", "error");
      return;
    }

    if (form.create_account === "true" && !form.email.trim()) {
      showSnackbar("Email is required when creating a login account.", "error");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/members", {
        ...form,
        create_account: form.create_account === "true",
        share_capital: Number(form.share_capital || 0),
        total_contribution: Number(form.total_contribution || 0),
      });

      setOpen(false);
      setForm(emptyForm);
      await loadMembers();

      showSnackbar(
        form.create_account === "true"
          ? "Member added and password setup link sent."
          : "Member added successfully."
      );
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to save member.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const handleSendPasswordSetup = async (member: Member) => {
    if (!member.email) {
      showSnackbar("This member does not have an email address.", "error");
      return;
    }

    setSendingSetupMemberId(member.id);

    try {
      const response = await axiosInstance.post(
        `/members/${member.id}/send-password-setup`
      );

      showSnackbar(
        response.data?.message || "Password setup link sent successfully."
      );
    } catch (error) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to send password setup link.",
        "error"
      );
    } finally {
      setSendingSetupMemberId(null);
    }
  };

  if (
  authUser &&
  !(
    authUser.roles.includes("admin") ||
    authUser.roles.includes("accounting")
  )
) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">
        You are not authorized to access this page.
      </Typography>
    </Box>
  );
}

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={1} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h3" fontWeight={700}>
                Members
              </Typography>

              <Typography color="text.secondary"> 
                Manage cooperative member records and contributions.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={openAddDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                alignSelf: { xs: "stretch", md: "center" },
              }}
            >
              Add Member
            </Button>
          </Stack>

          <TextField
            fullWidth
            label="Search members"
            placeholder="Search by member no, name, email, department, or status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              mt: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <SummaryCard title="Total Members" value={members.length} />
        <SummaryCard title="Active Members" value={activeMembers} />
        <SummaryCard
          title="Total Contributions"
          value={formatMoney(totalContribution)}
        />
      </Stack>

      {filteredMembers.length === 0 ? (
        <Card elevation={1} sx={{ borderRadius: 3, textAlign: "center", py: 6 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700}>
              No Members Found
            </Typography>

            <Typography color="text.secondary">
              Try adjusting your search or add a new member.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
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
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {member.first_name?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography variant="h5" fontWeight={700} color="primary">
                        {member.first_name} {member.middle_name}{" "}
                        {member.last_name}
                      </Typography>

                      <Typography color="text.secondary">
                        Member No: {member.member_no}
                      </Typography>

                      <Typography color="text.secondary">
                        {member.department || "No department"} •{" "}
                        {member.position || "No position"}
                      </Typography>

                      <Typography color="text.secondary">
                        {member.email || "No email"} •{" "}
                        {member.contact_number || "No contact number"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    spacing={1}
                    alignItems={{ xs: "flex-start", md: "flex-end" }}
                  >
                    <Chip
                      label={formatStatus(member.status)}
                      color={
                        member.status === "inactive" ? "default" : "success"
                      }
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    />

                    <Chip
                      label={member.user_id ? "Login account" : "No login account"}
                      color={member.user_id ? "primary" : "default"}
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    />

                    <Typography>
                      Share Capital:{" "}
                      <b>{formatMoney(member.share_capital)}</b>
                    </Typography>

                    <Typography>
                      Contribution:{" "}
                      <b>{formatMoney(member.total_contribution)}</b>
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      disabled={
                        !member.email ||
                        !member.user_id ||
                        sendingSetupMemberId === member.id
                      }
                      onClick={() => handleSendPasswordSetup(member)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {!member.user_id
                        ? "No login account"
                        : sendingSetupMemberId === member.id
                          ? "Sending..."
                          : "Send setup link"}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle fontWeight={700}>Add Member</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              required
              label="Member No"
              value={form.member_no}
              onChange={(e) => handleChange("member_no", e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>

            <TextField
              required
              label="First Name"
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              fullWidth
            />

            <TextField
              label="Middle Name"
              value={form.middle_name}
              onChange={(e) => handleChange("middle_name", e.target.value)}
              fullWidth
            />

            <TextField
              required
              label="Last Name"
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />

            <TextField
              label="Contact Number"
              value={form.contact_number}
              onChange={(e) => handleChange("contact_number", e.target.value)}
              fullWidth
            />

            <TextField
              label="Department"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              fullWidth
            />

            <TextField
              label="Position"
              value={form.position}
              onChange={(e) => handleChange("position", e.target.value)}
              fullWidth
            />

            <TextField
              label="Share Capital"
              type="number"
              value={form.share_capital}
              onChange={(e) => handleChange("share_capital", e.target.value)}
              fullWidth
            />

            <TextField
              label="Total Contribution"
              type="number"
              value={form.total_contribution}
              onChange={(e) =>
                handleChange("total_contribution", e.target.value)
              }
              fullWidth
            />

            <TextField
              select
              label="Create Login Account?"
              value={form.create_account}
              onChange={(e) =>
                handleChange("create_account", e.target.value)
              }
              helperText={
                form.create_account === "true"
                  ? "After saving, a password setup link will be sent to the member email."
                  : "You can create a login account later if needed."
              }
              fullWidth
            >
              <MenuItem value="true">Yes, create account</MenuItem>
              <MenuItem value="false">No, member record only</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Saving..." : "Save Member"}
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
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <Card elevation={2} sx={{ flex: 1, borderRadius: 3 }}>
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

const formatMoney = (value?: string | number | null) => {
  return `₱${Number(value || 0).toLocaleString()}`;
};

const formatStatus = (status?: string | null) => {
  if (!status) return "Active";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};