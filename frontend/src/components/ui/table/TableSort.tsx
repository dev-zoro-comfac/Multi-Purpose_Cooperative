"use client";

import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import StraightOutlinedIcon from "@mui/icons-material/StraightOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";

type TableSortProps<T> = {
  table: Table<T>;
};

const TableSort = <T,>({ table }: TableSortProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Tooltip title="Sort" arrow>
        <IconButton
          aria-describedby={id}
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <SortOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Popover
        elevation={0}
        slotProps={{
          paper: {
            sx: theme => ({
              border: `1px solid ${theme.palette.divider}`,
            }),
          },
        }}
        sx={{ zIndex: theme => theme.zIndex.appBar - 1 }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableScrollLock
      >
        <List>
          <ListSubheader sx={{ py: 0, my: 0, lineHeight: 2 }}>
            Column Sort
          </ListSubheader>
          {table.getAllLeafColumns().map(column => {
            const canSort = column.getCanSort();
            if (!canSort) {
              return;
            }

            const isSorted = column.getIsSorted();
            const columnDef = column.columnDef;
            const id = columnDef.id;

            const label = columnDef?.meta?.label ?? id;

            return (
              <ListItemButton
                sx={{ py: 0.5 }}
                key={id}
                onClick={column.getToggleSortingHandler()}
              >
                <ListItemIcon>
                  {isSorted ? (
                    isSorted === "desc" ? (
                      <StraightOutlinedIcon
                        sx={{ transform: "rotate(180deg)", fontSize: 16 }}
                        color="primary"
                      />
                    ) : (
                      <StraightOutlinedIcon
                        sx={{ fontSize: 16 }}
                        color="primary"
                      />
                    )
                  ) : (
                    <ImportExportOutlinedIcon
                      color="secondary"
                      fontSize="small"
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}
        </List>
      </Popover>
    </div>
  );
};

export default TableSort;
