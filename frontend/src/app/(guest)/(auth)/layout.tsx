"use client";

import { RouteLayout } from "@/types/layout-type";
import { Fragment } from "react";

const AuthLayout = ({ children }: RouteLayout) => {
  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;
