import { Stack, Toolbar } from "@mui/material";
import LogoWithText from "@/components/ui/LogoWithText";

const DrawerHeader = () => {
  return (
    <Toolbar
      sx={theme => ({
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: theme.palette.common.white,
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingRight: 2,
      })}
    >
      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <LogoWithText />
      </Stack>
    </Toolbar>
  );
};

export default DrawerHeader;
