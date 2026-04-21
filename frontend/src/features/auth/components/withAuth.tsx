"use client";

import { ComponentType, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthenticatedUser } from "../api/useAuthenticatedUser";
import LoadingWithLogo from "@/components/ui/LoadingWithLogo";
import Error from "@/components/error/Error";

const withAuth = <P extends object>(Component: ComponentType<P>) => {
  return function WithAuth(props: P) {
    const router = useRouter();
    const pathname = usePathname();

    const {
      data: auth,
      isError,
      error,
      isSuccess,
      isFetched,
    } = useAuthenticatedUser();

    const isAuthenticated = useMemo(
      () => !!auth && !!auth.data && !!auth.success && isSuccess,
      [auth, isSuccess]
    );

    useEffect(() => {
      if (isFetched && !isAuthenticated) {
        router.replace(`/?redirectTo=${encodeURIComponent(pathname)}`);
      }
    }, [router, isAuthenticated, isFetched, pathname]);

    if (isAuthenticated && isFetched) {
      return <Component {...props} />;
    }

    if (isError) {
      return <Error message={error?.message} />;
    }

    return <LoadingWithLogo />;
  };
};

export default withAuth;
