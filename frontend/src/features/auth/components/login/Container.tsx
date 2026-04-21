"use client";

import { Container as MuiContainer } from "@mui/material";
import Form from "./Form";

const Container = () => {
  return (
    <MuiContainer
      maxWidth="lg"
      sx={{
        p: { xs: 2, md: 4, lg: 8 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 4, sm: 6 },
        height: "100vh",
        minHeight: "600px",
        overflow: "auto",
      }}
    >
      <Form />
    </MuiContainer>
  );
};
export default Container;
