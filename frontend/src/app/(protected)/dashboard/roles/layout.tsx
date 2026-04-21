"use client";

import { RouteLayout } from "@/types/layout-type";
import { Container } from "@mui/material";

const RoleLayout = ({ children }: RouteLayout) => {
  return <Container maxWidth="xl">{children}</Container>;
};

export default RoleLayout;
