import { RolePermission, UserPermission } from "@/constant/permissions";
import { Action } from "@/constant/action";

const DASHBOARD_ROUTE_PREFIX = "/dashboard";

const routes = {
  Users: {
    index: `${DASHBOARD_ROUTE_PREFIX}/users`,
    [UserPermission[Action.ViewMany]]: `${DASHBOARD_ROUTE_PREFIX}/users`,
    [UserPermission[Action.Create]]: `${DASHBOARD_ROUTE_PREFIX}/users/create`,
    [UserPermission[Action.Update]]: `${DASHBOARD_ROUTE_PREFIX}/users/edit`,
  },
  RolesAndPermissions: {
    index: `${DASHBOARD_ROUTE_PREFIX}/roles-and-permissions`,
    [RolePermission[Action.ViewMany]]:
      `${DASHBOARD_ROUTE_PREFIX}/roles-and-permissions`,
    [RolePermission[Action.Create]]:
      `${DASHBOARD_ROUTE_PREFIX}/roles-and-permissions/create`,
    [RolePermission[Action.Update]]:
      `${DASHBOARD_ROUTE_PREFIX}/roles-and-permissions/edit`,
  },
};

export const userRoutes = routes.Users;
export const rolesAndPermissionRoutes = routes.RolesAndPermissions;
