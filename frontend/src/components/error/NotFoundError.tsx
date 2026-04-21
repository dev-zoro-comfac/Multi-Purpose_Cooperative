"use client";
import { Box, Typography, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type PNotFoundError = {
  fullScreen?: boolean;
};

const NotFoundError = ({ fullScreen }: PNotFoundError) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: fullScreen ? "100vh" : "540px",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography sx={{ fontWeight: 700, mb: -3 }} fontSize={150}>
          Oops!
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: theme => theme.palette.secondary[400],
          }}
        >
          We couldn&#39;t find the page you are looking for
        </Typography>
        <Link href="/" underline="none" sx={{ mt: 2, display: "inline-block" }}>
          <Typography
            variant="button"
            color="primary"
            sx={{
              px: 3,
              py: 1,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArrowBackIcon /> go home
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default NotFoundError;
