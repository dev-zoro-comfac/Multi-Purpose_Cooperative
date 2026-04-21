"use client";

import { IconButton, Tooltip } from "@mui/material";
import FolderDeleteOutlinedIcon from "@mui/icons-material/FolderDeleteOutlined";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";

const UsersIncludeTrash = () => {
  const setTrashOnlyInStore = useUsersTableStore(state => state.setTrashOnly);
  const [trashOnly, setTrashOnly] = useState(false);
  const [debouncedTrashOnly] = useDebounce(trashOnly, 500);

  const handleToggleTrashOnly = () => {
    setTrashOnly(prev => !prev);
  };

  useEffect(() => {
    setTrashOnlyInStore(trashOnly);
  }, [debouncedTrashOnly]);

  return (
    <Tooltip title="Deleted Users only" arrow>
      <IconButton
        onClick={() => handleToggleTrashOnly()}
        color={trashOnly ? "primary" : "secondary"}
      >
        <FolderDeleteOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};
export default UsersIncludeTrash;
