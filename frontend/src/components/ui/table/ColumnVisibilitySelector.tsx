"use client";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Popover,
  Tooltip,
} from "@mui/material";
import { Table } from "@tanstack/react-table";
import { MouseEvent, useState } from "react";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

type ColumnVisibilitySelector<T> = {
  table: Table<T>;
};

const ColumnVisibilitySelector = <T,>({
  table,
}: ColumnVisibilitySelector<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const visibleColumns = table
    .getAllLeafColumns()
    .filter(column => column.columnDef.enableHiding ?? true);
  return (
    <div>
      <Tooltip title="Column Visibility" arrow>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <ListAltOutlinedIcon />
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
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        disableScrollLock
      >
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel sx={{ fontSize: 12 }} component="legend">
            Column Visibility
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                />
              }
              label="Toggle All"
            />
            {visibleColumns.map(column => {
              const columnDef = column.columnDef;
              const label = columnDef?.meta?.label ?? column.id;

              return (
                <FormControlLabel
                  key={column.id}
                  control={
                    <Checkbox
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                  }
                  label={label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </div>
  );
};

export default ColumnVisibilitySelector;
