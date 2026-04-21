"use client";

import { IconButton } from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";

type PTableSelectionCell = {
  isSelected: boolean;
  toggleSelecthandler: (event: unknown) => void;
};

const TableSelectionCell = ({
  isSelected,
  toggleSelecthandler,
}: PTableSelectionCell) => {
  return (
    <IconButton onClick={toggleSelecthandler} sx={{ display: "block" }}>
      {isSelected ? (
        <CheckBoxOutlinedIcon color="primary" fontSize="small" />
      ) : (
        <CheckBoxOutlineBlankOutlinedIcon color="secondary" fontSize="small" />
      )}
    </IconButton>
  );
};

export default TableSelectionCell;
