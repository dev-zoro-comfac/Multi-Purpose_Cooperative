import { MUIComponent } from "@/lib/mui/type";
import { alpha, Theme } from "@mui/material/styles";

export const Tab = (theme: Theme): MUIComponent<"MuiTab"> => {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 46,
          color: theme.palette.text.primary,
          borderRadius: 4,
          "&:hover": {
            backgroundColor: alpha(
              theme.palette.primary.lighter as string,
              0.6
            ),
            color: theme.palette.primary.main,
          },
          "&:focus-visible": {
            borderRadius: 4,
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: -3,
          },
        },
      },
    },
  };
};
