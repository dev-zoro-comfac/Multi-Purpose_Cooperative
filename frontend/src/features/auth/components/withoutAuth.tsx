"use client";

import { ComponentType, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingWithLogo from "@/components/ui/LoadingWithLogo";
import { useAuthenticatedUser } from "../api/useAuthenticatedUser";
import Error from "@/components/error/Error";

const DEFAULT_LOGIN_REDIRECT_URL = "/dashboard";

const withoutAuth = <P extends object>(Component: ComponentType<P>) => {
  return function WithoutAuth(props: P) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const {
      data: auth,
      isError,
      error,
      isSuccess,
      isLoading,
      isFetching,
    } = useAuthenticatedUser();

    const isAuthenticated = useMemo(
      () => !!auth && !!auth.data && !!auth.success && isSuccess,
      [auth, isSuccess]
    );

    useEffect(() => {
      if (isAuthenticated) {
        router.replace(
          searchParams.get("redirectTo") ?? DEFAULT_LOGIN_REDIRECT_URL
        );
      }
    }, [isSuccess, isAuthenticated, router, searchParams]);

    if (isError) {
      return <Error message={error?.message} />;
    }

    return isLoading || isFetching || isAuthenticated ? (
      <LoadingWithLogo />
    ) : (
      <Component {...props} />
    );
  };
};

export default withoutAuth;
