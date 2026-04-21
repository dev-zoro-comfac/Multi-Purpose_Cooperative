import React, { ReactNode } from "react";
import { Box, Modal } from "@mui/material";

type PMyModal = {
  isOpen: boolean;
  closeAction: () => void;
  children: ReactNode;
};

const MyModal = ({ isOpen, children }: PMyModal) => {
  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          p: 4,
          display: "flex",
          flexDirection: "column",
          minHeight: "auto",
          maxHeight: "100vh",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};
export default MyModal;
