"use client";
import {
  MaterialDesignContent,
  SnackbarKey,
  SnackbarProvider,
  useSnackbar,
} from "notistack";
import { IconButton, SnackbarOrigin, styled } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const MAX_SNACK = 2;
const AUTO_HIDE_DURATION = 4000;
const POSITION: SnackbarOrigin = {
  vertical: "top",
  horizontal: "center",
};

const StyledMaterialDesignContent = styled(MaterialDesignContent)(
  ({ theme }) => ({
    "&.notistack-MuiContent-success": {
      backgroundColor: "white",
      color: theme.palette.success.main,
      borderBottom: `3px solid ${theme.palette.success.main}`,
      boxShadow: theme.shadows[2],
    },
    "&.notistack-MuiContent-error": {
      backgroundColor: "white",
      color: theme.palette.error.main,
      borderBottom: `3px solid ${theme.palette.error.main}`,
      boxShadow: theme.shadows[3],
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: "white",
      color: theme.palette.info.main,
      borderBottom: `3px solid ${theme.palette.info.main}`,
      boxShadow: theme.shadows[2],
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
      borderBottom: `3px solid ${theme.palette.warning.main}`,
      boxShadow: theme.shadows[2],
    },
  })
);

const SnackbarCloseButton = ({ snackbarKey }: { snackbarKey: SnackbarKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)} size="small">
      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
    </IconButton>
  );
};

const NotistackProvider = ({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) => {
  return (
    <SnackbarProvider
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}
      maxSnack={MAX_SNACK}
      autoHideDuration={AUTO_HIDE_DURATION}
      anchorOrigin={POSITION}
      action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotistackProvider;
