import { Box, BoxProps } from "@mui/material";

const Logo = ({ sx, ...rest }: BoxProps) => {
  return (
    <Box
      component="img"
      src="/images/cornersteel-logo.png"
      alt="Cornersteel Cooperative"
      {...rest}
      sx={[
        {
          width: "1em",
          height: "1em",
          display: "block",
          objectFit: "contain",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default Logo;
