import { purple, contrastText, cyan, gold, green, grey, red } from "./color";
import { PaletteOptions } from "@mui/material/styles";

import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Color {
    0?: string;
    A50?: string;
    A300?: string;
    A800?: string;
    lighter?: string;
    darker?: string;
  }
  interface PaletteColor {
    0?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    A50?: string;
    A100?: string;
    A200?: string;
    A300?: string;
    A400?: string;
    A800?: string;
    lighter?: string;
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    0?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    A50?: string;
    A100?: string;
    A200?: string;
    A300?: string;
    A400?: string;
    A800?: string;
    lighter?: string;
    darker?: string;
  }
}

export const paletteOptions: PaletteOptions = {
  mode: "light",
  common: {
    black: "#000",
    white: "#fff",
  },
  primary: {
    lighter: purple[0],
    100: purple[1],
    200: purple[2],
    light: purple[3],
    400: purple[4],
    main: purple[5],
    dark: purple[6],
    700: purple[7],
    darker: purple[8],
    900: purple[9],
    contrastText,
  },
  secondary: {
    lighter: grey[2],
    100: grey[2],
    200: grey[3],
    light: grey[4],
    400: grey[5],
    main: grey[6],
    600: grey[7],
    dark: grey[8],
    800: grey[9],
    darker: grey[10],
    A100: grey[0],
    A200: grey[13],
    A400: grey[14],
    contrastText: grey[0],
  },
  error: {
    lighter: red[0],
    100: red[1],
    200: red[2],
    light: red[3],
    400: red[4],
    main: red[5],
    600: red[6],
    dark: red[7],
    800: red[8],
    darker: red[9],
    A100: red[0],
    A200: red[10],
    A400: red[11],
    contrastText: grey[0],
  },
  warning: {
    lighter: gold[0],
    100: gold[1],
    200: gold[2],
    light: gold[3],
    400: gold[4],
    main: gold[5],
    600: gold[6],
    dark: gold[7],
    800: gold[8],
    darker: gold[9],
    A100: gold[0],
    A200: gold[10],
    A400: gold[11],
    contrastText: grey[2],
  },
  info: {
    lighter: cyan[0],
    100: cyan[1],
    200: cyan[2],
    light: cyan[3],
    400: cyan[4],
    main: cyan[5],
    600: cyan[6],
    dark: cyan[7],
    800: cyan[8],
    darker: cyan[9],
    A100: cyan[0],
    A200: cyan[10],
    A400: cyan[11],
    contrastText: grey[0],
  },
  success: {
    lighter: green[0],
    100: green[1],
    200: green[2],
    light: green[3],
    400: green[4],
    main: green[5],
    600: green[6],
    dark: green[7],
    800: green[8],
    darker: green[9],
    A100: green[0],
    A200: green[10],
    A400: green[11],
    contrastText: grey[0],
  },
  grey: {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  },
  text: {
    primary: grey[8],
    secondary: grey[6],
    disabled: grey[5],
  },
  action: {
    disabled: grey[4],
  },
  divider: grey[3],
  background: {
    paper: grey[0],
    default: grey[15],
  },
};
