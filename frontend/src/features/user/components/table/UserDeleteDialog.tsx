"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDeleteUserMutation } from "@/features/user/api/useDeleteUserMutation";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";

const UserDeleteDialog = () => {
  const pendingDeletion = useUsersTableStore(state => state.pendingDeletion);
  const resetPendingDeletion = useUsersTableStore(
    state => state.resetPendingDeletion
  );

  const { mutate: deleteUser, isPending: isDeleteUserPending } =
    useDeleteUserMutation();

  const handleClose = () => {
    resetPendingDeletion();
  };

  const handleDelete = () => {
    if (pendingDeletion) {
      deleteUser(pendingDeletion, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Dialog open={!!pendingDeletion} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center", paddingBottom: 0 }}>
        <DeleteOutlineOutlinedIcon
          sx={{ fontSize: "48px", color: "error.main", marginBottom: "8px" }}
        />
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", padding: "0 24px 16px 24px" }}>
        <Typography variant="h6" gutterBottom>
          <Typography component="span" variant="h6">
            Are you sure you want to delete user with ID of ${pendingDeletion}?
          </Typography>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
        <Button
          color="success"
          onClick={handleClose}
          variant="outlined"
          disabled={isDeleteUserPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleteUserPending}
          color="error"
          variant="contained"
          sx={{ marginLeft: "8px" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDeleteDialog;
