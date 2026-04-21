"use client";

import withPermission from "@/features/auth/components/withPermission";
import CreateUserForm from "@/features/user/components/CreateUserForm";
import { UserPermission } from "@/constant";

const CreateUserPage = () => {
  return <CreateUserForm />;
};

export default withPermission(CreateUserPage, {
  requiredPermissions: [UserPermission.Create],
});
