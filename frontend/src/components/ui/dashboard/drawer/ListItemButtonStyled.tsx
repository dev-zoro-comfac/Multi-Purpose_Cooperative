import { styled } from "@mui/material/styles";
import { ListItemButton, ListItemButtonProps } from "@mui/material";

type CustomListItemButtonProps = ListItemButtonProps & {
  isItem: boolean;
};
export const ListItemButtonStyled = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== "isItem",
})<CustomListItemButtonProps>(({ theme, selected, isItem = false }) => {
  const isSelectedItem = selected && isItem;

  return {
    transition: [
      theme.transitions.create(["background", "color"], {
        easing: theme.transitions.easing.easeIn,
        duration: "50ms",
      }),
    ],
    borderRadius: 0,
    "&:hover": {
      backgroundColor: theme.palette.primary.lighter,
      color: theme.palette.primary.main,
    },
    ...(isSelectedItem
      ? {
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: theme.palette.primary.lighter,
            color: theme.palette.primary.main,
            borderRight: `2px solid ${theme.palette.primary.main}`,
          },
        }
      : {
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: "transparent",
            color: theme.palette.primary.main,
          },
        }),
  };
});
