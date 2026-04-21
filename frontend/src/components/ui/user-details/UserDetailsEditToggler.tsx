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
          <Typography variant="h6">Edit Mode</Typography>

          <Tooltip title="Enable edit" arrow>
            <Switch checked={isEditing} onChange={toggleEditing} />
          </Tooltip>
        </Stack>
      </Paper>
    </PermissionGuard>
  );
};

export default UserDetailsEditToggler;
