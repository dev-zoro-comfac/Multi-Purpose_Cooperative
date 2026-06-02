"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "@/lib/axios-instance";
import Logo from "@/components/ui/Logo";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const emailFromLink = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromLink);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMissingLinkData = useMemo(
    () => !token || !emailFromLink,
    [token, emailFromLink]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("auth/spa/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(response.data?.message ?? "Password has been set.");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reset password. Please request a new setup link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3, md: 4 },
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          <Stack alignItems="center" spacing={1}>
            <Logo sx={{ fontSize: 48 }} />
            <Typography variant="h3" fontWeight="bold">
              Set Your Password
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Enter a new password for your cooperative account.
            </Typography>
          </Stack>

          {isMissingLinkData && (
            <Alert severity="error">
              This setup link is missing required information. Please request a
              new password setup email.
            </Alert>
          )}

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            disabled={!!emailFromLink || isSubmitting}
            required
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            disabled={isMissingLinkData || isSubmitting}
            helperText="Use at least 8 characters with letters, numbers, and symbols."
            required
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={passwordConfirmation}
            onChange={event => setPasswordConfirmation(event.target.value)}
            disabled={isMissingLinkData || isSubmitting}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isMissingLinkData || isSubmitting}
            sx={{ py: 1.25, fontWeight: "bold" }}
          >
            {isSubmitting ? "Saving..." : "Set Password"}
          </Button>

          <Button onClick={() => router.push("/")} disabled={isSubmitting}>
            Back to Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
