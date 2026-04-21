import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { SvgIconProps } from "@mui/material";
import { ComponentType } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { RolePermission, UserPermission } from "@/constant/permissions";

type MenuGroupItemChildren = {
  id: string;
  title: string;
  url: string;
  requiredPermission?: string[];
  matchExactPermission?: boolean;
};

type MenuGroupItem = {
  id: string;
  title: string;
  icon: ComponentType<SvgIconProps>;
  type: "collapse" | "item";
  url: string;
  target?: boolean;
  requiredPermission?: string[];
  children?: MenuGroupItemChildren[];
  isUrlCheckedEndsWith?: boolean;
  matchExactPermission?: boolean;
  description?: string;
};

export type MenuGroup = {
  id: string;
  title: string;
  type: "group";
  children: MenuGroupItem[];
  description?: string;
};

const dashboard: MenuGroup = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "home",
      title: "Home",
      type: "item",
      url: "/dashboard",
      icon: HomeOutlinedIcon,
      isUrlCheckedEndsWith: true,
      description: "Default page",
    },
    {
      id: "user",
      title: "Users",
      type: "collapse",
      url: "/dashboard/users",
      icon: PeopleOutlinedIcon,
      description: "You can manage and view the users table here",
      children: [
        {
          id: "user-list",
          title: "List",
          url: "/dashboard/users",
          requiredPermission: [UserPermission.ViewMany],
        },
        {
          id: "user-create",
          title: "Create",
          url: "/dashboard/users/create",
          requiredPermission: [UserPermission.Create],
        },
        {
          id: "user-import",
          title: "Import",
          url: "/dashboard/users/import",
          requiredPermission: [UserPermission.Import],
        },
      ],
    },
  ],
};

const manage: MenuGroup = {
  id: "manage",
  title: "Manage",
  type: "group",
  children: [
    {
      id: "roles-and-permissions",
      title: "Roles and Permissions",
      url: "/dashboard/roles",
      type: "item",
      icon: AdminPanelSettingsOutlinedIcon,
      requiredPermission: [
        RolePermission.ViewMany,
        RolePermission.Create,
        RolePermission.Update,
        RolePermission.HardDelete,
      ],
      matchExactPermission: true,
      description: "You can manage and view the roles table here",
    },
  ],
};

const account: MenuGroup = {
  id: "Account",
  title: "Account",
  type: "group",
  children: [
    {
      id: "profile",
      title: "Profile",
      type: "item",
      url: "/dashboard/profile",
      icon: PersonOutlineOutlinedIcon,
      description: "You can view your account details here",
    },
  ],
};

type Menu = MenuGroup[];

export const menu: Menu = [dashboard, manage, account];
