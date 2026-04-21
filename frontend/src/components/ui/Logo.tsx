import { SvgIcon, SvgIconProps } from "@mui/material";
import LogoSvg from "@/assets/icons/logo.svg";

const Logo = ({ ...rest }: SvgIconProps) => {
  return (
    <SvgIcon {...rest}>
      <LogoSvg />
    </SvgIcon>
  );
};

export default Logo;
