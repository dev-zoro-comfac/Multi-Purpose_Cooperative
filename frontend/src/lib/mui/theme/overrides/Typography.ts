import { MUIComponent } from "@/lib/mui/type";

export const Typography = (): MUIComponent<"MuiTypography"> => {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 12,
        },
      },
    },
  };
};
