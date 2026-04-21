"use client";

import { useEffect } from "react";
import { Theme } from "@mui/material/styles";
import { Box, Drawer as MuiDrawer, Stack, useMediaQuery } from "@mui/material";
import DrawerContent from "./DrawerContent";
import DrawerHeader from "./DrawerHeader";
import DrawerFooter from "./DrawerFooter";
import useDrawerStore from "@/stores/useDrawerStore";

export const drawerWidth = 260;

const Drawer = () => {
  const { open, closeDrawer, setClosing } = useDrawerStore();
  const isDesktopScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("lg")
  );

  useEffect(() => {
    if (!isDesktopScreen && open) {
      closeDrawer();
    }
  }, [isDesktopScreen]);

  return (
    <MuiDrawer
      variant={isDesktopScreen ? "persistent" : "temporary"}
      open={open}
      onClose={closeDrawer}
      onTransitionEnd={() => setClosing(false)}
      ModalProps={!isDesktopScreen ? { keepMounted: true } : undefined}
      sx={{
        position: "relative",
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "block" },
        zIndex: theme => (!open && isDesktopScreen ? -99 : theme.zIndex.drawer),
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowY: "hidden",
          "&:hover": {
            overflowY: "auto",
          },
        },
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <DrawerHeader />
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "hidden",
            "&:hover": {
              overflowY: "auto",
            },
          }}
        >
          <DrawerContent />
        </Box>
        <DrawerFooter />
      </Stack>
    </MuiDrawer>
  );
};
export default Drawer;
