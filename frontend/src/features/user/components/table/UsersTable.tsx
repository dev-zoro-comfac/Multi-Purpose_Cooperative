"use client";

import { Paper, Stack, Typography } from "@mui/material";
import UserDeleteDialog from "@/features/user/components/table/UserDeleteDialog";
import UserRestoreDialog from "@/features/user/components/table/UserRestoreDialog";
import { useUsersTable } from "@/features/user/hooks/useUsersTable";
import {
  TableContainer as MuiTableContainer,
  Table as MuiTable,
} from "@mui/material";
import BottomBar from "@/features/user/components/table/UsersTableBottomBar";
import TopBar from "@/features/user/components/table/UsersTableTopBar";
import UsersTableHeader from "@/features/user/components/table/UsersTableHeader";
import UsersTableBody from "@/features/user/components/table/UsersTableBody";
import UsersTableLoadingIndicator from "@/features/user/components/table/UsersTableLoadingIndicator";

const UsersTable = () => {
  const { table, pagination } = useUsersTable();

  return (
    <Stack sx={{ gap: 3 }}>
    <UsersTableLoadingIndicator />

    <Stack sx={{ gap: 0.5 }}>
      <Typography variant="h3" fontWeight={700}>
        User Accounts
      </Typography>

    <Typography color="text.secondary">
        Manage cooperative staff, accounting users, and member portal accounts.
      </Typography>
    </Stack>
      <Paper
        sx={theme => ({
          border: `1px solid ${theme.palette.divider}`,
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        })}
        elevation={0}
      >
        <TopBar table={table} />
        <MuiTableContainer
          sx={{ overflow: "auto", position: "relative", height: 715 }}
        >
          <MuiTable
            sx={{
              display: "grid",
              minWidth: table.getTotalSize(),
            }}
            component="div"
          >
            <UsersTableHeader table={table} />
            <UsersTableBody table={table} />
          </MuiTable>
        </MuiTableContainer>
        <BottomBar pagination={pagination} />
      </Paper>
      <UserDeleteDialog />
      <UserRestoreDialog />
    </Stack>
  );
};

export default UsersTable;
