import {
  Collapse,
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Fragment, useState } from "react";
import { MenuGroup } from "@/constant/drawer-menu";
import { ListItemButtonStyled } from "./ListItemButtonStyled";
import { usePathname, useRouter } from "next/navigation";

type DrawerNavigationGroupProps = {
  item: MenuGroup;
};

const DrawerNavigationGroup = ({ item }: DrawerNavigationGroupProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentlyOpened, setCurrentlyOpened] = useState(-1);

  const handleNestedLinkToggle = (index: number) => {
    setCurrentlyOpened(prevIndex => (prevIndex === index ? -1 : index));
  };

  return (
    <List>
      <ListSubheader sx={{ position: "static", pl: 3, mb: 1.5 }}>
        <Typography variant="subtitle2" color="textSecondary">
          {item?.title}
        </Typography>
      </ListSubheader>

      {item.children &&
        item.children.length > 0 &&
        item.children.map((child, index) => {
          const url = child.url;
          const Icon = child.icon;
          const isCollapsed = child.type === "collapse";
          const isItem = child.type === "item";
          const checkForEndsWith = child.isUrlCheckedEndsWith;

          const isSelected = checkForEndsWith
            ? pathname.endsWith(url)
            : pathname.startsWith(url);

          return (
            <Fragment key={child.id}>
              <ListItemButtonStyled
                sx={{ pl: 3 }}
                onClick={() => {
                  if (isCollapsed) {
                    handleNestedLinkToggle(index);
                  } else {
                    if (child.url) {
                      router.push(child.url);
                    }
                  }
                }}
                selected={isSelected}
                isItem={isItem}
              >
                <ListItemIcon sx={{ width: "34px", color: "inherit" }}>
                  <Icon fontSize="small" sx={{ color: "inherit" }} />
                </ListItemIcon>
                <ListItemText primary={child?.title} />
                {isCollapsed &&
                  (currentlyOpened === index ? (
                    <ExpandLess
                      sx={{
                        color: "inherit",
                        fontSize: theme => theme.spacing(2),
                      }}
                    />
                  ) : (
                    <ExpandMore
                      sx={{
                        color: "inherit",
                        fontSize: theme => theme.spacing(2),
                      }}
                    />
                  ))}
              </ListItemButtonStyled>
              {isCollapsed && (
                <Collapse
                  in={currentlyOpened === index}
                  timeout="auto"
                  unmountOnExit
                >
                  {child.children &&
                    child.children.length > 0 &&
                    child.children.map(innerChild => {
                      return (
                        <ListItemButtonStyled
                          sx={{ pl: 3 }}
                          key={innerChild.id}
                          onClick={() => {
                            if (innerChild.url) {
                              router.push(innerChild.url);
                            }
                          }}
                          selected={
                            innerChild.url ? pathname === innerChild.url : false
                          }
                          isItem={true}
                        >
                          <ListItemText
                            primary={innerChild.title}
                            sx={{ pl: "34px" }}
                          />
                        </ListItemButtonStyled>
                      );
                    })}
                </Collapse>
              )}
            </Fragment>
          );
        })}
    </List>
  );
};

export default DrawerNavigationGroup;
