"use client";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { RouteLayout } from "@/types/layout-type";
import Header from "@/components/ui/dashboard/Header";
import Drawer from "@/components/ui/dashboard/drawer/Drawer";
import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import Main from "@/components/ui/dashboard/Main";
import CustomBreadcrumbs from "@/components/ui/CustomBreadcrumbs";
import useDrawerStore from "@/stores/useDrawerStore";

const DashboardLayout = ({ children }: RouteLayout) => {
  const { open } = useDrawerStore();

  const isDesktopScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("lg")
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Drawer />
      <Main open={open || !isDesktopScreen}>
        <Toolbar />
        <CustomBreadcrumbs />
        <Box>{children}</Box>
      </Main>
    </Box>
  );
};

export default DashboardLayout;
