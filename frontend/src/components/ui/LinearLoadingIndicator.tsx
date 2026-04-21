import { LinearProgress } from "@mui/material";

const LinearLoadingIndicator = ({ show }: { show: boolean }) => {
  if (!show) {
    return null;
  }

  return (
    <LinearProgress
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 4,
        zIndex: theme => theme.zIndex.modal + 1,
      }}
    />
  );
};

export default LinearLoadingIndicator;
