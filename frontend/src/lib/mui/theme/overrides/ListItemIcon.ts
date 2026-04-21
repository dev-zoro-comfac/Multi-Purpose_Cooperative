import { MUIComponent } from "@/lib/mui/type";

export const ListItemIcon = (): MUIComponent<"MuiListItemIcon"> => {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 24,
        },
      },
    },
  };
};
