"use client";

import { RouteLayout } from "@/types/layout-type";
import { Container } from "@mui/material";

const UserLayout = ({ children }: RouteLayout) => {
  return <Container maxWidth="xl">{children}</Container>;
};

export default UserLayout;
