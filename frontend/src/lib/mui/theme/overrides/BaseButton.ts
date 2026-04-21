import { MUIComponent } from "@/lib/mui/type";

export default function BaseButton(): MUIComponent<"MuiButtonBase"> {
  return {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
  };
}
