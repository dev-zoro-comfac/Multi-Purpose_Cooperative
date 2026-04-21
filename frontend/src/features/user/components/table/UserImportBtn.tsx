"use client";

import { enqueueSnackbar } from "notistack";
import { IconButton, styled, Tooltip } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useUsersImportMutation } from "@/features/user/api/useImportUserMutation";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UserImportBtn = () => {
  const { mutate: userImport, isPending: isImportPending } =
    useUsersImportMutation();

  const handleUpload = (file: File | null) => {
    if (!file) return;

    userImport(
      { users: file },
      {
        onSuccess: response => {
          const message = response?.message || "User imported successfully";
          enqueueSnackbar(message, { variant: "success" });
        },
        onError: response => {
          const message = response?.message || "Import failed";
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      }
    );
  };
  return (
    <Tooltip title="Import Data" arrow>
      <IconButton
        color="primary"
        component="label"
        role={undefined}
        tabIndex={-1}
        disabled={isImportPending}
      >
        <VisuallyHiddenInput
          disabled={isImportPending}
          type="file"
          onChange={event => {
            if (event.target.files) {
              handleUpload(event.target.files?.[0]);
            }
          }}
        />
        <FileUploadOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default UserImportBtn;
