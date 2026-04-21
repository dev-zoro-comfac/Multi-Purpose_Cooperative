import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useLogoutMutation } from "../api/useLogoutMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
    logout();
    setOpenDialog(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} aria-label="log out" color="error">
        <ExitToAppOutlinedIcon />
      </IconButton>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            p: 2,
          },
        }}
      >
        <DialogTitle variant="h4" sx={{ textAlign: "center" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Are you sure you want to log out? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1, px: 3, pb: 3 }}>
          <Button color="primary" variant="outlined" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            fullWidth
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;
