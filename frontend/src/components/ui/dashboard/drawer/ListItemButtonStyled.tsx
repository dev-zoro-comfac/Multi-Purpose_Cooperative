import { styled } from "@mui/material/styles";
import { ListItemButton, ListItemButtonProps } from "@mui/material";

type CustomListItemButtonProps = ListItemButtonProps & {
  isItem: boolean;
};

export const ListItemButtonStyled = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== "isItem",
})<CustomListItemButtonProps>(
  ({ theme, selected, isItem = false }) => {
    const isSelectedItem = selected && isItem;

    return {
      transition: theme.transitions.create(
        ["background-color", "color", "transform"],
        {
          easing: theme.transitions.easing.easeInOut,
          duration: 180,
        }
      ),

      borderRadius: 12,
      marginBottom: 4,
      color: theme.palette.text.secondary,

      "&:hover": {
        backgroundColor: theme.palette.primary.lighter,
        color: theme.palette.primary.main,
        transform: "translateX(4px)",
      },

      ...(isSelectedItem
        ? {
            "&.Mui-selected, &.Mui-selected:hover": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: theme.shadows[2],

              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.contrastText,
              },

              "& .MuiTypography-root": {
                fontWeight: 700,
              },
            },
          }
        : {
            "&.Mui-selected, &.Mui-selected:hover": {
              backgroundColor: theme.palette.primary.lighter,
              color: theme.palette.primary.main,

              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },

              "& .MuiTypography-root": {
                fontWeight: 600,
              },
            },
          }),
    };
  }
);