import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type MuiIconType = OverridableComponent<
  SvgIconTypeMap<object, "svg">
> & {
  muiName: string;
};
