"use client";

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnSort,
} from "@tanstack/react-table";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  Modal,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import SwitchLeftOutlinedIcon from "@mui/icons-material/SwitchLeftOutlined";
import SwitchRightOutlinedIcon from "@mui/icons-material/SwitchRightOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { enqueueSnackbar } from "notistack";
import {
  createRoleSchema,
  TCreateRoleSchema,
  TRole,
} from "@/lib/zod/schemas/roles-and-permissions";
import { useDeleteRoleMutation } from "../api/useDeleteRoleMutation";
import EditRoleForm from "./EditRoleForm";
import { useGetRolesQuery } from "../api/useGetRolesQuery";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { usePostRoleMutation } from "../api/usePostRoleMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const RolesTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [roleToDelete, setRoleToDelete] = useState<TRole | null>(null);

  const [roleToEdit, setRoleToEdit] = useState<TRole | null>(null);

  const { data: { data: roles = [] } = { data: [] } } = useGetRolesQuery();

  const { mutate: deleteRole, isPending: isDeletePending } =
    useDeleteRoleMutation();

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize: pageSize,
      },
    },
    onSortingChange: setSorting,
  });

  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => {
    setPageIndex(page);
  };

  const handleGoToPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setPageIndex(DEFAULT_PAGE_INDEX);
      return;
    }

    const inputPage = Number(value);

    if (!isNaN(inputPage)) {
      setPageIndex(
        Math.max(MINIMUM_PAGE_INDEX, Math.min(inputPage, table.getPageCount()))
      );
    }
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setPageIndex(DEFAULT_PAGE_INDEX);
      setPageSize(DEFAULT_PAGE_SIZE);

      return;
    }

    const inputPageSize = Number(value);

    if (!isNaN(inputPageSize)) {
      setPageIndex(DEFAULT_PAGE_INDEX);
      setPageSize(
        Math.max(MINIMUM_PAGE_SIZE, Math.min(inputPageSize, MAXIMUM_PAGE_SIZE))
      );
    }
  };

  const handleCloseEditRoleFormModal = () => {
    setRoleToEdit(null);
    setIsEditFormModalOpen(false);
  };

  const handleOpenDeleteRoleDialog = (role: TRole) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteRoleDialog = () => {
    setRoleToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleRoleDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete.id, {
        onSuccess: response => {
          const message = response?.message || "Role  deleted successfully";
          enqueueSnackbar(message, { variant: "success" });
          handleCloseDeleteRoleDialog();
        },
        onError: response => {
          const message = response?.message || "Failed to delete role type";
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TCreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: TCreateRoleSchema) => {
    addRole(data, {
      onSuccess: response => {
        const message = response?.message || "Role created successfully";
        enqueueSnackbar(message, { variant: "success" });
        reset();
      },
      onError: response => {
        const message = response?.message || "Failed to create role";
        enqueueSnackbar(message, { variant: "error", autoHideDuration: null });
      },
    });
  };

  const {
    mutate: addRole,
    isError,
    error,
    isPending: isAddingRole,
  } = usePostRoleMutation();

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography variant="h3">List of all Roles</Typography>
      <Paper
        sx={{
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Stack
          sx={{
            px: 2,
            py: 3,
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="left"
            spacing={2}
          >
            <Box>
              <TextField
                fullWidth
                value={globalFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGlobalFilter(e.target.value)
                }
                placeholder="Search..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: <SearchOutlinedIcon color="secondary" />,
                  },
                }}
              />
            </Box>
            <Stack
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <TextField
                fullWidth
                placeholder="Role Name"
                {...register("name")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                size="small"
              />
              {isError && (
                <FormHelperText error>{error.message}</FormHelperText>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isAddingRole}
                startIcon={<AddOutlinedIcon />}
                fullWidth
              >
                Add Role
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead
              sx={theme => ({
                backgroundColor: theme.palette.primary.lighter,
              })}
            >
              {table.getHeaderGroups().map(headerGroup => {
                return (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, headerIndex) => {
                      const isFirstHeader = headerIndex === 0;
                      const isLastHeader =
                        headerIndex === headerGroup.headers.length - 1;

                      if (isLastHeader) {
                        return (
                          <TableCell
                            key={header.id}
                            sx={{
                              textAlign: "center",
                              pr: 4,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={theme => ({
                                fontSize: "0.75rem",
                                color: theme.palette.primary.dark,
                              })}
                            >
                              Actions
                            </Typography>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          sx={{
                            cursor: "pointer",
                            pl: isFirstHeader ? 4 : 2,
                          }}
                        >
                          <Stack
                            sx={{
                              flexDirection: {
                                xs: "column",
                                md: "row",
                                gap: 4,
                                alignItems: "center",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={theme => ({
                                fontSize: "0.8rem",
                                color: theme.palette.primary.dark,
                                fontWeight: "bold",
                              })}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Typography>
                            {header.column.getIsSorted() === "asc" ? (
                              <SwitchRightOutlinedIcon
                                color="secondary"
                                sx={{
                                  transform: "rotate(90deg)",
                                  fontSize: 16,
                                }}
                              />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <SwitchLeftOutlinedIcon
                                color="secondary"
                                sx={{
                                  transform: "rotate(90deg)",
                                  fontSize: 16,
                                }}
                              />
                            ) : null}
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const isFirstCell = cellIndex === 0;
                      const isLastCell =
                        cellIndex === row.getVisibleCells().length - 1;

                      if (isLastCell) {
                        return (
                          <TableCell
                            key={cell.id}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              pr: 4,
                            }}
                          >
                            <Link href={`roles/${row.original.id}`} passHref>
                              <Tooltip title="Edit Permissions" arrow>
                                <IconButton>
                                  <RemoveRedEyeOutlinedIcon
                                    sx={{ width: "18px" }}
                                    color="primary"
                                  />
                                </IconButton>
                              </Tooltip>
                            </Link>

                            <IconButton
                              onClick={() => {
                                handleOpenDeleteRoleDialog(row.original);
                              }}
                            >
                              <DeleteOutlineOutlinedIcon
                                sx={{ width: "18px" }}
                                color="error"
                              />
                            </IconButton>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          sx={{
                            pl: isFirstCell ? 4 : 2,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          sx={{
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
            p: 2,
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              gap: 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
              <Typography variant="subtitle2" color="secondary">
                Rows per page
              </Typography>
              <TextField
                hiddenLabel
                type="number"
                value={pageSize}
                onChange={handleRowsPerPageChange}
                size="small"
                slotProps={{ htmlInput: { sx: { py: 0.75 } } }}
                sx={{ width: theme => theme.spacing(10) }}
              />
            </Stack>
            <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
              <Typography variant="subtitle2" color="secondary">
                Go to
              </Typography>
              <TextField
                hiddenLabel
                type="number"
                value={pageIndex}
                onChange={handleGoToPageChange}
                size="small"
                slotProps={{ htmlInput: { sx: { py: 0.75 } } }}
                sx={{ width: theme => theme.spacing(8) }}
              />
            </Stack>
          </Stack>
          <Pagination
            color="primary"
            onChange={handlePageChange}
            count={table.getPageCount()}
            page={pageIndex}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Paper>

      <Modal
        open={isEditFormModalOpen}
        onClose={handleCloseEditRoleFormModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 800,
            p: 4,
            display: "flex",
            flexDirection: "column",
            minHeight: "auto",
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          {roleToEdit && <EditRoleForm role={roleToEdit} />}
        </Box>
      </Modal>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteRoleDialog}>
        <DialogTitle sx={{ textAlign: "center", paddingBottom: 0 }}>
          <DeleteOutlineOutlinedIcon
            sx={{ fontSize: "48px", color: "error.main", marginBottom: "8px" }}
          />
        </DialogTitle>
        <DialogContent
          sx={{ textAlign: "center", padding: "0 24px 16px 24px" }}
        >
          <Typography variant="h6" gutterBottom>
            <Typography component="span" variant="h6">
              Are you sure you want to delete?
            </Typography>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ px: 1, textTransform: "uppercase" }}
            ></Typography>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            By deleting {roleToDelete?.name} all information will also be
            deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button
            color="success"
            onClick={handleCloseDeleteRoleDialog}
            variant="outlined"
            disabled={isDeletePending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRoleDelete}
            disabled={isDeletePending}
            color="error"
            variant="contained"
            sx={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

const columns: ColumnDef<TRole>[] = [
  {
    header: "Role ",
    accessorKey: "name",
  },

  {
    header: "Date Created",
    accessorKey: "created_at",
    cell: ({ row }) =>
      dayjs(row.original.created_at).format("MMMM D, YYYY h:mm A"),
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    cell: ({ row }) =>
      dayjs(row.original.updated_at).format("MMMM D, YYYY h:mm A"),
  },

  {
    header: "Actions",
    accessorKey: "id",
  },
];

const MINIMUM_PAGE_INDEX = 1;
const MAXIMUM_PAGE_SIZE = 250;
const MINIMUM_PAGE_SIZE = 1;
const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_PAGE_SIZE = 10;

export default RolesTable;
