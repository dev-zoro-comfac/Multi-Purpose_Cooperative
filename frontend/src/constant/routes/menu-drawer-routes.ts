import BadgeIcon from "@mui/icons-material/Badge";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Action } from "@/constant/action";
import { RolePermission, UserPermission } from "@/constant/permissions";
import { rolesAndPermissionRoutes, userRoutes } from "@/constant/routes";

export const primaryMenu = [
  {
    label: "Users",
    path: userRoutes["index"],
    icon: BadgeIcon,
    permissions: [
      UserPermission[Action.ViewMany],
      UserPermission[Action.Create],
      UserPermission[Action.Update],
    ],
    children: [
      {
        label: "List",
        icon: TableRowsIcon,
        path: userRoutes[UserPermission[Action.ViewMany]],
        permissions: [UserPermission[Action.ViewMany]],
      },
      {
        label: "Create",
        icon: AddIcon,
        path: userRoutes[UserPermission[Action.Create]],

        permissions: [UserPermission[Action.Create]],
      },
      {
        label: "Edit",
        icon: EditIcon,
        path: userRoutes[UserPermission[Action.Update]],
        permissions: [UserPermission[Action.Update]],
      },
    ],
  },
  {
    label: "Roles and Permissions",
    path: rolesAndPermissionRoutes["index"],
    icon: BadgeIcon,
    permissions: [
      RolePermission[Action.ViewMany],
      RolePermission[Action.Create],
      RolePermission[Action.Update],
    ],
    children: [
      {
        label: "List",
        icon: TableRowsIcon,
        path: rolesAndPermissionRoutes[RolePermission[Action.ViewMany]],
        permissions: [RolePermission[Action.ViewMany]],
      },
      {
        label: "Create",
        icon: AddIcon,
        path: rolesAndPermissionRoutes[RolePermission[Action.Create]],

        permissions: [RolePermission[Action.Create]],
      },
      {
        label: "Edit",
        icon: EditIcon,
        path: rolesAndPermissionRoutes[RolePermission[Action.Update]],
        permissions: [RolePermission[Action.Update]],
      },
    ],
  },
];

export const secondaryMenu = [
  {
    label: "Profile",
    icon: AccountBoxOutlinedIcon,
    permissions: [
      UserPermission[Action.ViewMany],
      UserPermission[Action.Create],
      UserPermission[Action.Update],
    ],
    children: [
      {
        label: "List",
        icon: TableRowsIcon,
        path: userRoutes[UserPermission[Action.ViewMany]],
        permissions: [UserPermission[Action.ViewMany]],
      },
      {
        label: "Create",
        icon: AddIcon,
        path: userRoutes[UserPermission[Action.Create]],

        permissions: [UserPermission[Action.Create]],
      },
      {
        label: "Edit",
        icon: EditIcon,
        path: userRoutes[UserPermission[Action.Update]],
        permissions: [UserPermission[Action.Update]],
      },
    ],
  },
];
