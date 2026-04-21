"use client";

import LoginContainer from "@/features/auth/components/login/Container";
import withoutAuth from "@/features/auth/components/withoutAuth";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box>
      <LoginContainer />
    </Box>
  );
};

export default withoutAuth(Home);
