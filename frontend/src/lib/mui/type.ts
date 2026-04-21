import { PaletteOptions, PaletteColorOptions, Components } from "@mui/material";
export type PaletteColorKeys = {
  [K in keyof PaletteOptions]: PaletteOptions[K] extends PaletteColorOptions
    ? K
    : never;
}[keyof PaletteOptions];

export type ValidColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

export type MUIComponent<T extends keyof Components> = {
  [K in T]: Components[K];
};
