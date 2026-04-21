"use client";

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  TableCell as MuiTableCell,
  TextField,
  Typography,
} from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { Fragment, useState } from "react";
import { flexRender, Header } from "@tanstack/react-table";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";

type PUserTableHead<T> = {
  header: Header<T, unknown>;
};

const UserTableHead = <T,>({ header }: PUserTableHead<T>) => {
  const columnFilters = useUsersTableStore(state => state.columnFilters);
  const setColumnFilters = useUsersTableStore(state => state.setColumnFilters);
  const resetPageIndex = useUsersTableStore(state => state.resetPageIndex);

  const canPin = header.getContext().column.getCanPin();
  const canFilter = header.getContext().column.getCanFilter();
  const isPinned = header.column.getIsPinned();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [filterValue, setFilterValue] = useState(
    columnFilters.find(item => item.id === header.column.id)?.value ?? ""
  );

  const handleFilterDebounced = useDebouncedCallback((value: string) => {
    setColumnFilters(prev => {
      const newFilters = prev.filter(f => f.id !== header.column.id);
      if (value) {
        newFilters.push({ id: header.column.id, value });
      }
      return newFilters;
    });

    resetPageIndex();
  }, 1000);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFilterValue(newValue);
    handleFilterDebounced(newValue);
  };

  return (
    <MuiTableCell sx={{ width: header.getSize() }} component="div">
      {header.isPlaceholder ? null : (
        <Stack
          sx={{
            width: "100%",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: {
                xs: "row",
              },
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Typography>
            </Stack>
            {canPin && (
              <Fragment>
                <IconButton
                  onClick={event => setAnchorEl(event.currentTarget)}
                  size="small"
                >
                  <MoreVertOutlinedIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuList dense>
                    {isPinned !== "right" && (
                      <MenuItem onClick={() => header.column.pin("right")}>
                        <ListItemIcon>
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Pin to Right</ListItemText>
                      </MenuItem>
                    )}
                    {isPinned !== "left" && (
                      <MenuItem onClick={() => header.column.pin("left")}>
                        <ListItemIcon>
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Pin to Left</ListItemText>
                      </MenuItem>
                    )}
                    {isPinned && (
                      <MenuItem onClick={() => header.column.pin(false)}>
                        <ListItemIcon>
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Unpin</ListItemText>
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </Fragment>
            )}
          </Stack>
          {canFilter && (
            <TextField
              onChange={handleFilterChange}
              value={filterValue}
              size="small"
              placeholder="Search..."
              fullWidth
            />
          )}
        </Stack>
      )}
    </MuiTableCell>
  );
};

export default UserTableHead;
