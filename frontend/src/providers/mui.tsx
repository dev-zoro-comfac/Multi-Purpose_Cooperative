"use client";

import { ReactNode } from "react";
import {
  CssBaseline,
  GlobalStyles as MuiGlobalStyles,
  ThemeProvider,
} from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import theme from "@/lib/mui/theme";

const GlobalStyles = () => {
  return (
    <MuiGlobalStyles
      styles={{
        "::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "10px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
        "::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    />
  );
};

const MaterialUiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
export default MaterialUiProvider;
