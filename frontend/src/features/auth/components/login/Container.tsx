"use client";

import { Container as MuiContainer } from "@mui/material";
import Form from "./Form";

const Container = () => {
  return (
    <MuiContainer
      maxWidth={false}
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "max(100vh, 600px)",
        overflow: "auto",
        background:
          "radial-gradient(circle at 20% 15%, rgba(31, 111, 74, 0.16), transparent 28%), radial-gradient(circle at 80% 85%, rgba(31, 111, 74, 0.12), transparent 30%), #f7faf8",
      }}
    >
      <Form />
    </MuiContainer>
  );
};
export default Container;
