"use client";

import { RolePermission } from "@/constant";
import withPermission from "@/features/auth/components/withPermission";
import RolesTable from "@/features/roles/components/RolesTable";

const RolesPage = () => {
  return <RolesTable />;
};

export default withPermission(RolesPage, {
  requiredPermissions: [
    RolePermission.ViewMany,
    RolePermission.Create,
    RolePermission.Update,
    RolePermission.HardDelete,
  ],
  requireAll: true,
});
