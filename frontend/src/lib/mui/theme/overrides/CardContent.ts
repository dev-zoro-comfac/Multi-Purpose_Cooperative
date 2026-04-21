import { MUIComponent } from "@/lib/mui/type";

export const CardContent = (): MUIComponent<"MuiCardContent"> => {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          "&:last-child": {
            paddingBottom: 20,
          },
        },
      },
    },
  };
};
