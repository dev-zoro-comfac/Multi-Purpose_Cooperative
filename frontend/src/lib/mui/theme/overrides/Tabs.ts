import { MUIComponent } from "@/lib/mui/type";

export const Tabs = (): MUIComponent<"MuiTabs"> => {
  return {
    MuiTabs: {
      styleOverrides: {
        vertical: {
          overflow: "visible",
        },
      },
    },
  };
};
