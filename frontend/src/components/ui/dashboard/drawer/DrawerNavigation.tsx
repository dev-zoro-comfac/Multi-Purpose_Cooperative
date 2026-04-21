"use client";

import DrawerNavigationGroup from "./DrawerNavigationGroup";
import { Box } from "@mui/material";
import { useGetFilteredMenu } from "@/components/ui/dashboard/drawer/useGetFilteredMenu";

const DrawerNavigation = () => {
  const filteredMenu = useGetFilteredMenu();

  return (
    <Box sx={{ pb: theme => theme.mixins.toolbar }}>
      {filteredMenu.map(item => (
        <DrawerNavigationGroup key={item.id} item={item} />
      ))}
    </Box>
  );
};
export default DrawerNavigation;
