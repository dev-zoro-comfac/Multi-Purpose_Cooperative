import { createTheme } from "@mui/material/styles";

import { paletteOptions } from "./palette";
import { typographyOptions } from "./typography";
import { customShadows } from "./shadows";
import componentOverrides from "./overrides";

import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customShadows?: ReturnType<typeof customShadows>;
  }
  interface ThemeOptions {
    customShadows?: ReturnType<typeof customShadows>;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1266,
      xl: 1440,
    },
  },
  direction: "ltr",
  mixins: {
    toolbar: {
      minHeight: 60,
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
  palette: paletteOptions,
  typography: typographyOptions,
});

theme.customShadows = customShadows(theme);
theme.components = componentOverrides(theme);

export default theme;
