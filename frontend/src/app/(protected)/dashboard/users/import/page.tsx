"use client";

import { UserPermission } from "@/constant";
import withPermission from "@/features/auth/components/withPermission";
import ImportUserForm from "@/features/user/components/ImportUserForm";

const UsersImportPage = () => {
  return <ImportUserForm />;
};

export default withPermission(UsersImportPage, {
  requiredPermissions: [UserPermission.Import],
});
