"use client";

import { UserPermission } from "@/constant";
import withPermission from "@/features/auth/components/withPermission";
import UsersTable from "@/features/user/components/table/UsersTable";

const UsersPage = () => {
  return <UsersTable />;
};

export default withPermission(UsersPage, {
  requiredPermissions: [UserPermission.ViewMany],
});
