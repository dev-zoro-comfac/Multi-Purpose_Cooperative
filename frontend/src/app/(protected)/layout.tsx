"use client";

import { Fragment } from "react";
import withAuth from "@/features/auth/components/withAuth";
import { RouteLayout } from "@/types/layout-type";
import SocketListeners from "@/providers/socket";

const ProtectedRoutes = ({ children }: RouteLayout) => {
  return (
    <Fragment>
      <SocketListeners />
      {children}
    </Fragment>
  );
};

export default withAuth(ProtectedRoutes);
