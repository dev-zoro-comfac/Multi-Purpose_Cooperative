import { MUIComponent } from "@/lib/mui/type";

export const Link = (): MUIComponent<"MuiLink"> => {
  return {
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
  };
};
