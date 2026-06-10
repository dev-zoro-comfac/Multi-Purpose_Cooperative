"use client";

import {
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  FormLabel,
  FormControl,
  Paper,
  Chip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditUserAccountSchema,
  TEditUserAccountSchema,
  TUser,
} from "@/lib/zod/schemas/user";
import { useUpdateUsersMutation } from "../../../features/user/api/useUpdateUserMutation";
import { enqueueSnackbar } from "notistack";
import { useEditingStore } from "../../../features/user/store/useUserStore";
import PermissionGuard from "@/features/auth/components/PermissionGuard";
import { UserPermission } from "@/constant";
import EditRoleAutocomplete from "@/features/user/components/EditRoleAutocomplete";
import { getDirtyFields } from "@/utils";
import { useEffect } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

type ViewUserDetailsProps = {
  user: TUser;
};

const AccountUserInformation = ({ user }: ViewUserDetailsProps) => {
  const isEditing = useEditingStore(state => state.isEditing);
  const toggleEditing = useEditingStore(state => state.toggleEditing);
  const roleNames = user?.roles?.map(role => role.name).filter(Boolean) ?? [];

  const { mutate: updateUser, isPending } = useUpdateUsersMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<TEditUserAccountSchema>({
    resolver: zodResolver(EditUserAccountSchema),
    defaultValues: {
      email: user?.email ?? "",
      roles: user?.roles?.map(role => role.name) || [],
    },
    mode: "all",
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user?.email ?? "",
        roles: user?.roles?.map(role => role.name) || [],
      });
    }
  }, [user]);

  const onSubmit = (data: TEditUserAccountSchema) => {
    const dirtyData = getDirtyFields(data, dirtyFields);

    updateUser(
      { id: user?.id, userUpdateData: dirtyData },
      {
        onSuccess: (response: { message: string }) => {
          const message = response?.message || "TUser updated successfully";
          enqueueSnackbar(message, { variant: "success" });
          toggleEditing();
        },
        onError: (error: { message: string }) => {
          const message = error?.message || "Failed to update user";
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      }
    );
  };

  return (
    <Paper
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: "hidden",
      }}
      elevation={0}
    >
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{
            p: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: { xs: 2, md: 1 },
          }}
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>
              Cooperative Account Information
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Login account, assigned cooperative role, and current account
              standing.
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ p: 3, gap: 3 }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              <FormControl>
                <FormLabel sx={{ fontSize: 12 }} htmlFor="email">
                  Login Email
                </FormLabel>
                <TextField
                  id="email"
                  {...register("email")}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{ input: { readOnly: !isEditing } }}
                />
              </FormControl>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              <FormControl>
                <FormLabel sx={{ fontSize: 12 }} htmlFor="roles">
                  Cooperative Role
                </FormLabel>
                {isEditing ? (
                  <EditRoleAutocomplete control={control} />
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      minHeight: 56,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                      bgcolor: "background.default",
                    }}
                  >
                    {roleNames.length ? (
                      roleNames.map(role => (
                        <Chip
                          key={role}
                          label={formatLabel(role)}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        No roles assigned
                      </Typography>
                    )}
                  </Paper>
                )}
              </FormControl>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: 12 }}>Account ID</FormLabel>
              <TextField
                fullWidth
                value={user?.id ? `USER-${String(user.id).padStart(5, "0")}` : "—"}
                slotProps={{ input: { readOnly: true } }}
                helperText="Internal cooperative login account reference."
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: 12 }}>Account Status</FormLabel>
              <Paper
                variant="outlined"
                sx={{
                  px: 1.5,
                  py: 1.25,
                  minHeight: 56,
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "background.default",
                }}
              >
                <Chip
                  label={user?.deleted_at ? "Inactive Account" : "Active Account"}
                  color={user?.deleted_at ? "default" : "success"}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Paper>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              Some account information, such as cooperative role and account
              status, may only be changed by an administrator.
            </Typography>
          </Grid>
        </Grid>
        <Stack sx={{ p: 2 }}>
          {isEditing && (
            <PermissionGuard requiredPermissions={[UserPermission.Update]}>
              <Button
                sx={{ alignSelf: "end" }}
                size="small"
                variant="outlined"
                type="submit"
                color="primary"
                disabled={!isDirty || isPending}
                startIcon={<SaveOutlinedIcon fontSize="small" />}
              >
                Save Changes
              </Button>
            </PermissionGuard>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

const formatLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, char => char.toUpperCase());

export default AccountUserInformation;
