"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  TRole,
  TEditRoleSchema,
  editRoleSchema,
} from "@/lib/zod/schemas/roles-and-permissions";
import { useGetPermissionsQuery } from "../api/useGetPermissionsQuery";
import { useUpdateRoleMutation } from "../api/useUpdateRoleMutation";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { groupBy } from "lodash";
import PermissionGuard from "@/features/auth/components/PermissionGuard";
import { RolePermission } from "@/constant";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

type EditRoleFormProps = {
  role: TRole;
};

export default function EditRoleForm({ role }: EditRoleFormProps) {
  const { data: permissionsData } = useGetPermissionsQuery();
  const permissionsList = permissionsData?.data || [];

  const { mutate: updateRole, isPending } = useUpdateRoleMutation();

  const categorizedPermissions = groupBy(permissionsList, "category");

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TEditRoleSchema>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: role.name,
      permissions: role?.permissions?.map(permission => permission.name) || [],
    },
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        permissions:
          role?.permissions?.map(permission => permission.name) || [],
      });
    }
  }, [role]);

  const submitAction = (data: TEditRoleSchema) => {
    updateRole(
      { roleUpdateData: data, id: role.id },
      {
        onSuccess: response => {
          const message = response?.message || "Role updated successfully";
          enqueueSnackbar(message, { variant: "success" });
        },
        onError: error => {
          const message = error?.message || "Failed to update role";
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      }
    );
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Stack flexDirection="row" sx={{ gap: 1 }}>
          <Typography variant="h3">Update permission for</Typography>
          <Typography variant="h3" color="primary">
            {role.name}
          </Typography>
        </Stack>

        <Typography variant="body1">
          Select the appropriate permissions for this role by checking the
          options below.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(submitAction)}>
        <Paper
          sx={{
            px: 3,
            py: 2,
            border: theme => `1px solid ${theme.palette.divider}`,
            mb: 3,
          }}
          elevation={0}
        >
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Stack flexDirection="row" sx={{ gap: 1 }}>
                <Typography variant="h3" fontWeight="normal">
                  Role:
                </Typography>
                <Typography variant="h3" color="primary">
                  {role.name}
                </Typography>
              </Stack>
              <Typography variant="h6">
                Edit permission of this role below.
              </Typography>
              {errors.permissions && (
                <Typography color="error">
                  {errors.permissions.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ alignContent: "center" }}>
              <PermissionGuard requiredPermissions={[RolePermission.Update]}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isPending}
                  startIcon={<SaveOutlinedIcon fontSize="small" />}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </PermissionGuard>
            </Box>
          </Stack>
        </Paper>
        <Paper
          sx={{
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
          elevation={0}
        >
          <FormGroup>
            <Grid container spacing={2}>
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <>
                    {Object.entries(categorizedPermissions).map(
                      ([category, permissions]) => (
                        <Grid key={category} size={{ xs: 12 }}>
                          <Box
                            sx={{
                              backgroundColor: theme =>
                                theme.palette.secondary.lighter,
                              padding: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                px: 2,
                                textTransform: "uppercase",
                                fontWeight: "normal",
                              }}
                            >
                              {category}
                            </Typography>
                          </Box>
                          <Grid container sx={{ mt: 3, mb: 2 }}>
                            {permissions.map(permission => (
                              <Grid
                                key={permission.id}
                                size={{ xs: 12, md: 3, sm: 6 }}
                                sx={{ px: 4 }}
                              >
                                <FormControlLabel
                                  key={permission.name}
                                  control={
                                    <Checkbox
                                      checked={field.value.includes(
                                        permission.name
                                      )}
                                      onChange={e => {
                                        const checked = e.target.checked;
                                        const value = field.value;
                                        if (checked) {
                                          field.onChange([
                                            ...value,
                                            permission.name,
                                          ]);
                                        } else {
                                          field.onChange(
                                            value.filter(
                                              name => name !== permission.name
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  }
                                  label={permission.name}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      )
                    )}
                  </>
                )}
              />
              {errors.permissions && (
                <FormHelperText error>
                  {errors.permissions.message}
                </FormHelperText>
              )}
            </Grid>
          </FormGroup>
        </Paper>
      </form>
    </Stack>
  );
}
