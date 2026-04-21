import { Theme } from "@mui/material/styles";
import { ValidColor } from "./type";

type GetColorArgType = { theme: Theme; color: ValidColor };

export const getColor = ({ color, theme }: GetColorArgType) => {
  switch (color) {
    case "secondary":
      return theme.palette.secondary;
    case "error":
      return theme.palette.error;
    case "warning":
      return theme.palette.warning;
    case "info":
      return theme.palette.info;
    case "success":
      return theme.palette.success;
    default:
      return theme.palette.primary;
  }
};

type GetShadowArgType = {
  theme: Theme;
  shadow: string;
};

export const getShadow = ({ theme, shadow }: GetShadowArgType) => {
  switch (shadow) {
    case "secondary":
      return theme.customShadows?.secondary;
    case "error":
      return theme.customShadows?.error;
    case "warning":
      return theme.customShadows?.warning;
    case "info":
      return theme.customShadows?.info;
    case "success":
      return theme.customShadows?.success;
    case "primaryButton":
      return theme.customShadows?.primaryButton;
    case "secondaryButton":
      return theme.customShadows?.secondaryButton;
    case "errorButton":
      return theme.customShadows?.errorButton;
    case "warningButton":
      return theme.customShadows?.warningButton;
    case "infoButton":
      return theme.customShadows?.infoButton;
    case "successButton":
      return theme.customShadows?.successButton;
    default:
      return theme.customShadows?.primary;
  }
};
