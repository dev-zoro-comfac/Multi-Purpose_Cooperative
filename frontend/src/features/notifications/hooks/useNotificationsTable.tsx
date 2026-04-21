import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Typography } from "@mui/material";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { useNotificationsTableStore } from "../store/useNotificationsTableStore";
import { TBaseNotification } from "@/lib/zod/schemas/base";
import { useGetNotificationsListQuery } from "../api/useGetNotificationsListQuery";
import { emptyNotificationsPaginatedResponse } from "../api/useGetNotificationsQuery";

const columnHelper = createColumnHelper<TBaseNotification>();

export const useNotificationsTable = () => {
  const {
    data: {
      data: { data: notifications, ...pagination },
    } = emptyNotificationsPaginatedResponse,
  } = useGetNotificationsListQuery();

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
        id: "id",
        header: "Notification ID",
        size: 260,
        meta: { label: "Notification ID" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("read_at", {
        id: "read_at",
        header: "Read At",
        size: 200,
        meta: { label: "Read At" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("data.message", {
        id: "message",
        header: "Message",
        size: 200,
        meta: { label: "Message" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("read_on", {
        id: "read_on",
        header: "Read On",
        size: 200,
        meta: { label: "Read On" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),
      columnHelper.accessor("created_at", {
        id: "created_at",
        header: "Created At",
        size: 200,
        meta: { label: "Created At" },
        cell: ({ getValue }) => renderCell(getValue()),
      }),

      // columnHelper.accessor("data.id", {
      //   meta: { label: "Actions" },
      //   id: "actions",
      //   header: "Actions",
      //   enableSorting: false,
      //   enableResizing: false,
      //   size: 100,
      //   enablePinning: false,
      //   enableColumnFilter: false,
      //   enableGlobalFilter: false,
      //   cell: ({ cell }) => {
      //     return <UsersTableActions cell={cell} />;
      //   },
      // }),
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

  const sorting = useNotificationsTableStore(state => state.sorting);
  const setSorting = useNotificationsTableStore(state => state.setSorting);

  const table = useReactTable({
    data: notifications,
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
