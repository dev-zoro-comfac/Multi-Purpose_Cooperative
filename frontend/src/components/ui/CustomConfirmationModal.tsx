import { Box, Modal, Typography, Button, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import IconButton, {
  IconButtonPropsColorOverrides,
} from "@mui/material/IconButton";

type PCustomConfirmationModal = {
  title: string;
  description?: string;
  action: () => void;
  icon?: React.ReactNode;
  tooltipText?: string;
  ButtonColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | keyof IconButtonPropsColorOverrides
    | undefined;
  isDisabled?: boolean;
  textColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
};

const CustomConfirmationModal = ({
  title,
  action,
  description,
  icon,
  tooltipText,
  ButtonColor,
  isDisabled = false,

  textColor,
}: PCustomConfirmationModal) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <Stack>
      <Tooltip title={tooltipText} arrow>
        <span>
          <IconButton
            onClick={handleOpen}
            disabled={isDisabled}
            sx={theme => ({
              color:
                textColor && textColor !== "inherit"
                  ? theme.palette[textColor].light
                  : undefined,
              borderColor:
                ButtonColor && ButtonColor !== "inherit"
                  ? theme.palette[ButtonColor].light
                  : undefined,
            })}
          >
            {icon}
          </IconButton>
        </span>
      </Tooltip>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            gutterBottom
          >
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mb: 3 }}>
            {description}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              disabled={isDisabled}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={action}>
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
};

export default CustomConfirmationModal;
