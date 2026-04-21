import { Container } from "@mui/material";
import { RouteLayout } from "@/types/layout-type";

const NotificationLayout = ({ children }: RouteLayout) => {
  return <Container maxWidth="lg">{children}</Container>;
};

export default NotificationLayout;
