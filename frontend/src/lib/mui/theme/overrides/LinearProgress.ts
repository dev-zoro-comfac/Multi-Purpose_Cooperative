import { MUIComponent } from "@/lib/mui/type";

export const LinearProgress = (): MUIComponent<"MuiLinearProgress"> => {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 100,
        },
        bar: {
          borderRadius: 100,
        },
      },
    },
  };
};
