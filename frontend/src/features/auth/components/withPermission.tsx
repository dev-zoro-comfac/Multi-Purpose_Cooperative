import { ComponentType, useMemo } from "react";
import { emptyAuth, useAuthenticatedUser } from "../api/useAuthenticatedUser";
import NotFoundError from "@/components/error/NotFoundError";

interface WithPermissionOptions {
  requiredPermissions: string[];
  requireAll?: boolean;
}

const withPermission = <P extends object>(
  Component: ComponentType<P>,
  { requiredPermissions, requireAll = false }: WithPermissionOptions
) => {
  return function WithPermission(props: P) {
    const { data: { data: auth } = { data: emptyAuth } } =
      useAuthenticatedUser();

    const permissions = auth?.permissions || [];

    const hasRequiredPermissions = useMemo(() => {
      if (requireAll) {
        return requiredPermissions.every(perm =>
          permissions.some(p => p === perm)
        );
      } else {
        return requiredPermissions.some(perm =>
          permissions.some(p => p === perm)
        );
      }
    }, [permissions, requiredPermissions, requireAll]);

    if (!hasRequiredPermissions) {
      return <NotFoundError />;
    }

    if (hasRequiredPermissions) {
      return <Component {...props} />;
    }

    return null;
  };
};

export default withPermission;
