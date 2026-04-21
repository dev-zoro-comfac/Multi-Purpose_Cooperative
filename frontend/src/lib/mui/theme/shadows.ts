import { alpha, Theme } from "@mui/material/styles";

export const customShadows = (theme: Theme) => {
  return {
    button: `0 2px #0000000b`,
    text: `0 -1px 0 rgb(0 0 0 / 12%)`,
    z1: `0px 2px 8px ${alpha(theme.palette.grey["900"], 0.15)}`,
    z2: `0px 4px 16px ${alpha(theme.palette.grey["900"], 0.2)}`,
    z3: `0px 6px 24px ${alpha(theme.palette.grey["900"], 0.25)}`,
    z4: `0px 8px 32px ${alpha(theme.palette.grey["900"], 0.3)}`,
    card: `0px 1px 4px ${alpha(theme.palette.grey["900"], 0.1)}`,
    modal: `0px 12px 48px ${alpha(theme.palette.grey["900"], 0.4)}`,
    tooltip: `0px 4px 8px ${alpha(theme.palette.grey["900"], 0.2)}`,

    primary: `0px 4px 10px ${alpha(theme.palette.primary.main, 0.5)}`,
    secondary: `0px 4px 10px ${alpha(theme.palette.secondary.main, 0.5)}`,
    error: `0px 4px 10px ${alpha(theme.palette.error.main, 0.5)}`,
    warning: `0px 4px 10px ${alpha(theme.palette.warning.main, 0.5)}`,
    info: `0px 4px 10px ${alpha(theme.palette.info.main, 0.5)}`,
    success: `0px 4px 10px ${alpha(theme.palette.success.main, 0.5)}`,

    primaryButton: `0px 3px 6px ${alpha(theme.palette.primary.main, 0.5)}`,
    secondaryButton: `0px 3px 6px ${alpha(theme.palette.secondary.main, 0.5)}`,
    errorButton: `0px 3px 6px ${alpha(theme.palette.error.main, 0.5)}`,
    warningButton: `0px 3px 6px ${alpha(theme.palette.warning.main, 0.5)}`,
    infoButton: `0px 3px 6px ${alpha(theme.palette.info.main, 0.5)}`,
    successButton: `0px 3px 6px ${alpha(theme.palette.success.main, 0.5)}`,
  };
};
