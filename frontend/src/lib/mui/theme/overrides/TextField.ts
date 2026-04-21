import { MUIComponent } from "@/lib/mui/type";

declare module "@mui/material/TextField" {
  interface TextFieldPropsSizeOverrides {
    xs: true;
  }
}

export default function TextField(): MUIComponent<"MuiTextField"> {
  return {
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
  };
}
