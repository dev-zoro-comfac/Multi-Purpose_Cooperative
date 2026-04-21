"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  Breadcrumbs,
  Container,
  Link as MuiLink,
  Typography,
} from "@mui/material";

export default function CustomBreadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      breadcrumb: string;
      href: string;
    }[]
  >([]);

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/").slice(2);
      const pathArray = segments.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/dashboard/" + segments.slice(0, i + 1).join("/"),
        };
      });
      setBreadcrumbs(pathArray);
    }
  }, [pathname]);

  return (
    <Container maxWidth="xl">
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink
          href="/dashboard"
          component={NextLink}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 0.75,
            textTransform: "capitalize",
            color:
              "/dashboard" === pathname ? "common.black" : "secondary.main",
          }}
        >
          <HomeOutlinedIcon
            sx={{
              color:
                "/dashboard" === pathname ? "common.black" : "secondary.main",
            }}
          />
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: "/dashboard" === pathname ? "bold" : "normal" }}
          >
            Home
          </Typography>
        </MuiLink>

        {breadcrumbs.map((item, i) => {
          const { breadcrumb, href } = item;
          const isSelected = href === pathname;

          return (
            <MuiLink href={href} key={href + i} component={NextLink}>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "common.black" : "secondary.main",
                }}
              >
                {breadcrumb}
              </Typography>
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Container>
  );
}
