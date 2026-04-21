"use client";

import { IconButton, Stack, Tooltip } from "@mui/material";
import { Fragment } from "react";
import { Cell } from "@tanstack/react-table";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";
import { TUser } from "@/lib/zod/schemas/user";
import Link from "next/link";
import PermissionGuard from "@/features/auth/components/PermissionGuard";
import { UserPermission } from "@/constant";

type PCell = {
  cell: Cell<TUser, unknown>;
};

const UsersTableActions = ({ cell }: PCell) => {
  const isDeleted = Boolean(cell.row.original.deleted_at);
  const id = cell.row.original.id;

  const setPendingDeletion = useUsersTableStore(
    state => state.setPendingDeletion
  );

  const setPendingRestore = useUsersTableStore(
    state => state.setPendingRestore
  );

  return (
    <Stack sx={{ flexDirection: "row" }}>
      {!isDeleted ? (
        <Fragment>
          <PermissionGuard requiredPermissions={[UserPermission.ViewAny]}>
            <Tooltip title="View Details" arrow>
              <IconButton component={Link} href={`/dashboard/users/${id}`}>
                <RemoveRedEyeOutlinedIcon color="info" fontSize="small" />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
          <PermissionGuard requiredPermissions={[UserPermission.SoftDelete]}>
            <Tooltip title="Archive User" arrow>
              <IconButton onClick={() => setPendingDeletion(id)}>
                <DeleteOutlinedIcon color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
        </Fragment>
      ) : (
        <Tooltip title="Restore User" arrow>
          <PermissionGuard requiredPermissions={[UserPermission.Restore]}>
            <IconButton onClick={() => setPendingRestore(id)}>
              <RestoreOutlinedIcon color="success" fontSize="small" />
            </IconButton>
          </PermissionGuard>
        </Tooltip>
      )}
    </Stack>
  );
};

export default UsersTableActions;
