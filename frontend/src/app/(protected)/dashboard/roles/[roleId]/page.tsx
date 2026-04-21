"use client";

import { useParams } from "next/navigation";
import { useGetRoleQuery } from "@/features/roles/api/useGetRoleQuery";
import RoleLoadingSkeleton from "@/features/roles/RoleLoadingSkeleton";
import EditRoleForm from "@/features/roles/components/EditRoleForm";
import Error from "@/components/error/Error";
import withPermission from "@/features/auth/components/withPermission";
import { RolePermission } from "@/constant";

const RolePage = () => {
  const { roleId } = useParams();

  const {
    data: role,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRoleQuery((roleId as string) || "");

  if (!roleId) {
    return <Error message="Role ID is missing or invalid." />;
  }

  if (isFetching) {
    return <RoleLoadingSkeleton />;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

  if (isSuccess) {
    return <EditRoleForm role={role.data} />;
  }

  return null;
};

export default withPermission(RolePage, {
  requiredPermissions: [RolePermission.ViewOne, RolePermission.Update],
  requireAll: true,
});
