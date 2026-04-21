"use client";

import { useExportUsers } from "@/features/user/api/useExportUser";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const UserExportBtn = () => {
  const { refetch: exportUser, isFetching: isExportFetching } =
    useExportUsers();

  return (
    <Tooltip title="Export Data" arrow>
      <IconButton
        color="primary"
        onClick={() => exportUser()}
        disabled={isExportFetching}
      >
        <FileDownloadOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default UserExportBtn;
