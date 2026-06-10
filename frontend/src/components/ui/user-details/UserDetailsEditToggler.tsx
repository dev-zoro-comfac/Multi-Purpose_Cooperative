"use client";

import { Stack, Typography, Paper, Switch, Tooltip } from "@mui/material";
import { useEditingStore } from "../../../features/user/store/useUserStore";
import PermissionGuard from "@/features/auth/components/PermissionGuard";
import { UserPermission } from "@/constant";

const UserDetailsEditToggler = () => {
  const isEditing = useEditingStore(state => state.isEditing);
  const toggleEditing = useEditingStore(state => state.toggleEditing);

  return (
    <PermissionGuard requiredPermissions={[UserPermission.Update]}>
      <Paper
        sx={{
          border: theme => `1px solid ${theme.palette.divider}`,
          px: 1.5,
          py: 0.5,
        }}
        elevation={0}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack>
            <Typography variant="h6" fontWeight={700}>
              Edit Profile
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Keep your contact and cooperative account details updated.
            </Typography>
          </Stack>

          <Tooltip title={isEditing ? "Disable editing" : "Enable editing"} arrow>
            <Switch checked={isEditing} onChange={toggleEditing} />
          </Tooltip>
        </Stack>
      </Paper>
    </PermissionGuard>
  );
};

export default UserDetailsEditToggler;
