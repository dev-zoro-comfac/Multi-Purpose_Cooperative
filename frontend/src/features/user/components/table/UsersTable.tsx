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
      <Typography variant="h3">List of all Users</Typography>
      <Paper
        sx={theme => ({
          border: `1px solid ${theme.palette.divider}`,
          width: "100%",
          overflow: "hidden",
        })}
        elevation={0}
      >
        <TopBar table={table} />
        <MuiTableContainer
          sx={{ overflow: "auto", position: "relative", height: 715 }}
        >
          <MuiTable sx={{ display: "grid" }} component="div">
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
