"use client";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Autocomplete,
  FormLabel,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "@/lib/zod/schemas/user";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { usePostUserMutation } from "../api/usePostUserMutation";
import { Gender } from "@/constant";
import { enqueueSnackbar } from "notistack";
import RoleAutocomplete from "./RoleAutocomplete";

export default function CreateUserForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      roles: [],
      contact_number: "",
    },
  });

  const { mutate: postUser, isPending: isPosting } = usePostUserMutation();

  const onSubmit = (data: z.infer<typeof CreateUserSchema>) => {
    if (isDirty && !isPosting) {
      postUser(data, {
        onSuccess: response => {
          const message = response?.message || "User created successfully";
          enqueueSnackbar(message, { variant: "success" });
          reset();
        },
        onError: error => {
          const message = error?.message || "Failed to create user";
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      });
    }
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h3">Add New User</Typography>
        <Typography variant="body1">
          Please provide the required information in the spaces provided below
        </Typography>
      </Box>
      <Paper
        sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}` }}
        elevation={0}
      >
        <Stack>
          <Typography variant="h5">Personal Information</Typography>
        </Stack>
        <Divider />
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel sx={{ fontSize: 12 }} htmlFor="first_name">
                First Name*
              </FormLabel>
              <TextField
                id="first_name"
                {...register("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                disabled={isSubmitting || isPosting}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel sx={{ fontSize: 12 }} htmlFor="middle_name">
                Middle Name (optional)
              </FormLabel>
              <TextField
                id="middle_name"
                {...register("middle_name")}
                error={!!errors.middle_name}
                helperText={errors.middle_name?.message}
                disabled={isSubmitting || isPosting}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel sx={{ fontSize: 12 }} htmlFor="last_name">
                Last Name*
              </FormLabel>
              <TextField
                id="last_name"
                {...register("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                disabled={isSubmitting || isPosting}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel sx={{ fontSize: 12 }} htmlFor="contact_number">
                Contact Number (optional)
              </FormLabel>
              <TextField
                id="contact_number"
                {...register("contact_number")}
                error={!!errors.contact_number}
                helperText={errors.contact_number?.message}
                disabled={isSubmitting || isPosting}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel sx={{ fontSize: 12 }} htmlFor="gender">
                Gender (optional)
              </FormLabel>
              <Controller
                control={control}
                name="gender"
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    id="gender"
                    {...field}
                    options={Object.values(Gender)}
                    value={field.value || ""}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    disablePortal
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "34px",
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box>
            <Typography variant="h5">Account Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel sx={{ fontSize: 12 }} htmlFor="email">
                  Email*
                </FormLabel>
                <TextField
                  id="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting || isPosting}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel sx={{ fontSize: 12 }} htmlFor="roles">
                  Roles*
                </FormLabel>
                <RoleAutocomplete control={control} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel sx={{ fontSize: 12 }} htmlFor="password">
                  Password*
                </FormLabel>
                <TextField
                  id="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isSubmitting || isPosting}
                  fullWidth
                  type="password"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel
                  sx={{ fontSize: 12 }}
                  htmlFor="password_confirmation"
                >
                  Confirm Password*
                </FormLabel>
                <TextField
                  id="password_confirmation"
                  {...register("password_confirmation")}
                  error={!!errors.password_confirmation}
                  helperText={errors.password_confirmation?.message}
                  disabled={isSubmitting || isPosting}
                  fullWidth
                  type="password"
                />
              </Grid>
            </Grid>
          </Box>

          <Stack
            sx={{
              mt: 2,
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (isDirty) {
                  reset();
                }
              }}
              disabled={!isDirty}
            >
              Clear form
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!isDirty || isSubmitting || isPosting}
            >
              {isPosting ? "Submitting..." : "Add New User"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
