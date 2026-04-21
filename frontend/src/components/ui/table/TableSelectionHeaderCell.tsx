"use client";

import { IconButton } from "@mui/material";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";

type PTableSelectionHeaderCell = {
  isAllSelected: boolean;
  isSomeRowSelected: boolean;
  toggleAllSelectionHandler: (event: unknown) => void;
};

const TableSelectionHeaderCell = ({
  isAllSelected,
  isSomeRowSelected,
  toggleAllSelectionHandler,
}: PTableSelectionHeaderCell) => {
  return (
    <IconButton onClick={toggleAllSelectionHandler}>
      {isAllSelected || isSomeRowSelected ? (
        <IndeterminateCheckBoxOutlinedIcon color="primary" fontSize="small" />
      ) : (
        <CheckBoxOutlineBlankOutlinedIcon color="secondary" fontSize="small" />
      )}
    </IconButton>
  );
};
export default TableSelectionHeaderCell;
