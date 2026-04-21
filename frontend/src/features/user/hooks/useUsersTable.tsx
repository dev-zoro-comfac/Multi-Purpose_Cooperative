import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { TUser } from "@/lib/zod/schemas/user";
import { emptyUsersPaginatedResponse } from "@/features/user/api/useGetUsersQuery";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";
import { useGetUsersListQuery } from "../api/useGetUsersListQuery";
import TableSelectionCell from "@/components/ui/table/TableSelectionCell";
import UsersTableActions from "../components/table/UsersTableActions";
import TableSelectionHeaderCell from "@/components/ui/table/TableSelectionHeaderCell";
import { Typography } from "@mui/material";
import { UserPermission } from "@/constant";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";

const columnHelper = createColumnHelper<TUser>();

export const useUsersTable = () => {
  const {
    data: {
      data: { data: users, ...pagination },
    } = emptyUsersPaginatedResponse,
  } = useGetUsersListQuery();

  const renderCell = <T,>(
    value: T | null | undefined,
    formatter: (value: T) => React.ReactNode = v => v as React.ReactNode
  ): React.ReactNode => {
    if (!value && value !== 0 && value !== "") {
      return (
        <Typography
          component="span"
          color="secondary"
          fontStyle="italic"
          fontSize="small"
        >
          No data
        </Typography>
      );
    }
    return formatter(value);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "Selection",
        size: 60,
        header: ({ table }) => {
          const isAllSelected = table.getIsAllRowsSelected();
          const isSomeRowSelected = table.getIsSomeRowsSelected();
          const toggleAllSelectionHandler =
            table.getToggleAllRowsSelectedHandler();

          return (
            <TableSelectionHeaderCell
              isAllSelected={isAllSelected}
              isSomeRowSelected={isSomeRowSelected}
              toggleAllSelectionHandler={toggleAllSelectionHandler}
            />
          );
        },
        cell: ({ cell }) => {
          const row = cell.row;
          const isSelected = row.getIsSelected();
          const toggleSelecthandler = row.getToggleSelectedHandler();

          return (
            <TableSelectionCell
              toggleSelecthandler={toggleSelecthandler}
              isSelected={isSelected}
            />
          );
        },
        enableHiding: true,
        enableSorting: false,
        enablePinning: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      }),

      columnHelper.accessor("email", {
        id: "email",
        header: "Email",
        size: 260,
        meta: { label: "Email" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("profile.first_name", {
        id: "first_name",
        header: "First Name",
        size: 200,
        meta: { label: "First Name" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("profile.middle_name", {
        id: "middle_name",
        header: "Middle Name",
        size: 200,
        meta: { label: "Middle Name" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("profile.last_name", {
        id: "last_name",
        header: "Last Name",
        size: 200,
        meta: { label: "Last Name" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("profile.contact_number", {
        id: "contact_number",
        header: "Contact Number",
        size: 200,
        meta: { label: "Contact Number" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("created_at", {
        id: "created_on",
        header: "Created On",
        size: 240,
        meta: {
          label: "Created on",
          allowed: [UserPermission.ViewProtectedData],
        },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("updated_at", {
        id: "updated_on",
        header: "Updated",
        size: 150,
        meta: {
          label: "Updated at",
          allowed: [UserPermission.ViewProtectedData],
        },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("id", {
        meta: { label: "Actions", allowed: [UserPermission.ViewProtectedData] },
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableResizing: false,
        size: 100,
        enablePinning: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({ cell }) => {
          return <UsersTableActions cell={cell} />;
        },
      }),
    ],
    []
  );

  const { data: user } = useAuthenticatedUser();

  const userPermissions = user?.data?.permissions ?? [];

  const filteredColumns = columns.filter(column => {
    return column.meta?.allowed
      ? column.meta.allowed.some(permission =>
          userPermissions.includes(permission)
        )
      : true;
  });

  const sorting = useUsersTableStore(state => state.sorting);
  const setSorting = useUsersTableStore(state => state.setSorting);

  const table = useReactTable({
    data: users,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    enableRowSelection: true,
    state: {
      sorting: sorting,
    },
    onSortingChange: setSorting,
  });

  return { table, pagination };
};
