"use client";

import Link from "next/link";
import { Table } from "@tanstack/react-table";
import { Stack, Button, Tooltip, IconButton } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ColumnVisibilitySelector from "@/components/ui/table/ColumnVisibilitySelector";
import UserExportBtn from "@/features/user/components/table/UserExportBtn";
import IncludeTrash from "@/features/user/components/table/UsersIncludeTrash";
import TableSort from "@/components/ui/table/TableSort";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { UserPermission } from "@/constant";
import PermissionGuard from "@/features/auth/components/PermissionGuard";

type PUsersTableTopBar<T> = {
  table: Table<T>;
};

const UsersTableTopBar = <T,>({ table }: PUsersTableTopBar<T>) => {
  return (
    <Stack
      sx={{
        p: 2,
        flexDirection: "row",
      }}
    >
      <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
        <ColumnVisibilitySelector table={table} />
        <TableSort table={table} />
        <IncludeTrash />
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: { sx: "flex-start", md: "flex-end" },
          gap: 1,
          flexGrow: 1,
          alignItems: "center",
        }}
      >
        <PermissionGuard requiredPermissions={[UserPermission.Export]}>
          <UserExportBtn />
        </PermissionGuard>

        <PermissionGuard requiredPermissions={[UserPermission.Import]}>
          <Tooltip title="Import Data" arrow>
            <IconButton
              color="primary"
              component={Link}
              role={undefined}
              tabIndex={-1}
              href="/dashboard/users/import"
            >
              <FileUploadOutlinedIcon />
            </IconButton>
          </Tooltip>
        </PermissionGuard>

        <PermissionGuard requiredPermissions={[UserPermission.Create]}>
          <Tooltip title="Create User" arrow>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              LinkComponent={Link}
              href="users/create"
              size="small"
            >
              Add User
            </Button>
          </Tooltip>
        </PermissionGuard>
      </Stack>
    </Stack>
  );
};
export default UsersTableTopBar;
