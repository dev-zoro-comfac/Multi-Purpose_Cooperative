import { MUIComponent } from "@/lib/mui/type";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

import { Theme } from "@mui/material/styles";

export const Checkbox = (theme: Theme): MUIComponent<"MuiCheckbox"> => {
  const { palette } = theme;

  return {
    MuiCheckbox: {
      defaultProps: {
        size: "small",
        icon: <CheckBoxOutlineBlankOutlinedIcon className="icon" />,
        checkedIcon: <CheckBoxOutlinedIcon className="icon" />,
        indeterminateIcon: (
          <IndeterminateCheckBoxOutlinedIcon className="icon" />
        ),
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: palette.secondary[300],
        },
      },
    },
  };
};
