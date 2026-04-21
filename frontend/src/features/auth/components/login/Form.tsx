"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormHelperText,
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
        py: { xs: 1, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        borderRadius: "8px",
        width: "100%",
        maxWidth: "540px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
      elevation={0}
    >
      <Logo sx={{ fontSize: 50, m: 1 }} />
      <Stack sx={{ textAlign: "center", mb: 1, pt: 1.5, pb: 1 }}>
        <Stack
          sx={{
            flexDirection: "row",
            gap: 0.7,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            Welcome to
          </Typography>

          <Typography variant="h2" color="primary" fontWeight="bold">
            App
          </Typography>
        </Stack>
        <Typography variant="h5" color="secondary" fontWeight="normal">
          Please sign-in to your account
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
        <FormHeader />

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
          <Stack sx={{ gap: 6 }}>
            {isError && (
              <FormHelperText error>{loginError?.message}</FormHelperText>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{
                width: "100%",
                mt: 1,
                mb: 4,
                p: 1.5,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const FormHeader = () => {
  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="center"
      ></Stack>
    </Stack>
  );
};

type LoginSchemaType = z.infer<typeof LoginSchema>;

type LoginFieldType = {
  id: keyof LoginSchemaType;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
};

export default Form;
