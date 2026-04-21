"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useRestoreUserMutation } from "@/features/user/api/useRestoreUserMutation";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";
import { enqueueSnackbar } from "notistack";

const UserRestoreDialog = () => {
  const pendingRestore = useUsersTableStore(state => state.pendingRestore);
  const resetPendingRestore = useUsersTableStore(
    state => state.resetPendingRestore
  );

  const { mutate: restoreUser, isPending: isRestoreUserPending } =
    useRestoreUserMutation();

  const handleClose = () => {
    resetPendingRestore();
  };

  const handleRestore = () => {
    if (pendingRestore) {
      restoreUser(pendingRestore, {
        onSuccess: (response: { message: string }) => {
          const message = response?.message || "User restored successfully";
          enqueueSnackbar(message, { variant: "success" });
          handleClose();
        },
        onError: (error: { message: string }) => {
          const message = error?.message || "Failed to restore User";
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      });
    }
  };

  return (
    <Dialog open={!!pendingRestore} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center", paddingBottom: 0 }}>
        <RestoreOutlinedIcon
          color="success"
          sx={{ fontSize: "48px", marginBottom: "8px" }}
        />
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", padding: "0 24px 16px 24px" }}>
        <Typography variant="h6" gutterBottom>
          <Typography component="span" variant="h6">
            Are you sure you want to restore this user?
          </Typography>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
        <Button
          color="error"
          onClick={handleClose}
          variant="outlined"
          disabled={isRestoreUserPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleRestore}
          disabled={isRestoreUserPending}
          color="success"
          variant="contained"
          sx={{ marginLeft: "8px" }}
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserRestoreDialog;
