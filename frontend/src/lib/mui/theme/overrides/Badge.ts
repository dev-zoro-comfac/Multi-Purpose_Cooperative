import { Theme } from "@mui/material/styles";
import { ValidColor } from "../../type";
import { getColor } from "@/lib/mui/utils";

type GetBadgeColorStyleArgType = {
  color: ValidColor;
  theme: Theme;
};

function getBadgeColorStyle({ color, theme }: GetBadgeColorStyleArgType) {
  const colors = getColor({ color, theme });

  return {
    color: colors?.main,
    backgroundColor: colors?.lighter,
  };
}

export default function Badge(theme: Theme) {
  const defaultLightBadge = getBadgeColorStyle({ color: "primary", theme });

  return {
    MuiBadge: {
      styleOverrides: {
        standard: {
          minWidth: theme.spacing(2),
          height: theme.spacing(2),
          padding: theme.spacing(0.5),
        },
        light: {
          ...defaultLightBadge,
          "&.MuiBadge-colorPrimary": getBadgeColorStyle({
            color: "primary",
            theme,
          }),
          "&.MuiBadge-colorSecondary": getBadgeColorStyle({
            color: "error",
            theme,
          }),
          "&.MuiBadge-colorError": getBadgeColorStyle({
            color: "error",
            theme,
          }),
          "&.MuiBadge-colorInfo": getBadgeColorStyle({ color: "info", theme }),
          "&.MuiBadge-colorSuccess": getBadgeColorStyle({
            color: "success",
            theme,
          }),
          "&.MuiBadge-colorWarning": getBadgeColorStyle({
            color: "warning",
            theme,
          }),
        },
      },
    },
  };
}
