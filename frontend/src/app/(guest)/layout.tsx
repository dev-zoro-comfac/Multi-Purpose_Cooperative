"use client";

import { Fragment } from "react";
import withoutAuth from "@/features/auth/components/withoutAuth";
import { RouteLayout } from "@/types/layout-type";

const GuestRoutes = ({ children }: RouteLayout) => {
  return <Fragment>{children}</Fragment>;
};

export default withoutAuth(GuestRoutes);
