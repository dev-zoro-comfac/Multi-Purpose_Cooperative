import { MUIComponent } from "@/lib/mui/type";
import { Theme } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsSizeOverrides {
    xs: true;
  }
}

export default function Button(theme: Theme): MUIComponent<"MuiButton"> {
  return {
    MuiButton: {
      variants: [
        {
          props: { size: "xs" },
          style: {
            minWidth: 56,
            fontSize: "0.625rem",
            padding: "2px 8px",
          },
        },
      ],
      defaultProps: {
        disableElevation: true,
        size: "small",
      },
      styleOverrides: {
        disabled: {
          backgroundColor: theme.palette.grey[200],
        },
        root: {
          "&.Mui-disabled": {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary[600],
          },
          fontWeight: 400,
          "&::after": {
            content: '""',
            display: "block",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            borderRadius: 4,
            opacity: 0,
            transition: "all 0.5s",
          },

          "&:active::after": {
            position: "absolute",
            borderRadius: 4,
            left: 0,
            top: 0,
            opacity: 1,
            transition: "0s",
          },
        },
        text: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  };
}
