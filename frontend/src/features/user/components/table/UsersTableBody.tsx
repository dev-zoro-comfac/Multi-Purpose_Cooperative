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
    <MuiTableBody component="div">
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
            >
              {cells.map(cell => {
                return (
                  <MuiTableCell
                    component="div"
                    sx={{
                      maxWidth: cell.column.getSize(),
                      width: cell.column.getSize(),
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
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
