"use client";

import {
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
} from "@mui/material";
import { flexRender, Table } from "@tanstack/react-table";
import { FixedSizeList as List } from "react-window";
import { TUser } from "@/lib/zod/schemas/user";

type TableBodyProps = {
  table: Table<TUser>;
};

const UsersTableBody = ({ table }: TableBodyProps) => {
  const rows = table.getRowModel().rows;

  return (
    <MuiTableBody component="div" sx={{ display: "block" }}>
      <List height={600} itemCount={rows.length} itemSize={60} width={"100%"}>
        {({ index, style }) => {
          const row = rows[index];
          const cells = row.getVisibleCells();

          return (
            <MuiTableRow
              component="div"
              key={row.id}
              selected={row.getIsSelected()}
              style={style}
              sx={{
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                display: "flex",
                width: table.getTotalSize(),
                minWidth: "100%",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {cells.map(cell => {
                const columnSize = cell.column.getSize();

                return (
                  <MuiTableCell
                    component="div"
                    sx={{
                      flex: `0 0 ${columnSize}px`,
                      maxWidth: columnSize,
                      width: columnSize,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                    }}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </MuiTableCell>
                );
              })}
            </MuiTableRow>
          );
        }}
      </List>
    </MuiTableBody>
  );
};

export default UsersTableBody;
