"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { LoginSchema } from "@/lib/zod/schemas";
import { useLoginMutation } from "../../api/useLoginMutation";
import { HTMLInputTypeAttribute } from "react";
import Logo from "@/components/ui/Logo";

const loginFields: LoginFieldType[] = [
  {
    id: "email",
    placeholder: "Email",
  },
  {
    id: "password",
    placeholder: "Password",
    type: "password",
  },
];

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const {
    mutate: login,
    error: loginError,
    isError,
    isPending,
  } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    login(data);
  };

  return (
    <Paper
      sx={{
        py: { xs: 3, md: 4.5 },
        px: { xs: 2.5, sm: 3.5, md: 4.5 },
        borderRadius: 4,
        width: "100%",
        maxWidth: "540px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: theme => `1px solid ${theme.palette.divider}`,
        boxShadow: "0 24px 70px rgba(15, 77, 51, 0.12)",
      }}
      elevation={0}
    >
      <Logo sx={{ width: 64, height: 64, mb: 1 }} />
      <Stack sx={{ textAlign: "center", mb: 2, pt: 1, pb: 1 }}>
        <Typography variant="h2" color="primary" fontWeight="bold">
          Cornersteel Cooperative
        </Typography>
        <Typography variant="h5" color="secondary" fontWeight={500}>
          Sign in to manage your cooperative account.
        </Typography>
      </Stack>
      <Stack
        sx={{
          gap: 2,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Stack sx={{ gap: 2 }}>
            {loginFields.map(({ id, placeholder, type = "text" }) => {
              const isPasswordField = id === "password";

              return (
                <TextField
                  key={id}
                  placeholder={placeholder}
                  type={isPasswordField && showPassword ? "text" : type}
                  variant="outlined"
                  fullWidth
                  {...register(id)}
                  error={!!errors[id]}
                  helperText={errors[id]?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {id === "email" ? (
                            <MailOutlineIcon />
                          ) : (
                            <HttpsOutlinedIcon />
                          )}
                        </InputAdornment>
                      ),
                      endAdornment: isPasswordField ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              );
            })}
          </Stack>
          <Stack sx={{ gap: 2 }}>
            {isError && (
              <Alert severity="error" variant="outlined">
                {loginError?.message ||
                  "Unable to sign in. Please check your email and password."}
              </Alert>
            )}

            <Button
              component={NextLink}
              href="/reset-password"
              variant="text"
              sx={{
                alignSelf: "flex-end",
                textTransform: "none",
                fontWeight: 700,
                px: 0,
              }}
            >
              Forgot password?
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{
                width: "100%",
                mt: 1,
                p: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {isPending ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="center"
          >
            <Button
              component={NextLink}
              href="/"
              variant="text"
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Back to Home
            </Button>
            <Button
              component={NextLink}
              href="/apply-loan"
              variant="outlined"
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
            >
              Apply for Loan
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

type LoginSchemaType = z.infer<typeof LoginSchema>;

type LoginFieldType = {
  id: keyof LoginSchemaType;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
};

export default Form;
