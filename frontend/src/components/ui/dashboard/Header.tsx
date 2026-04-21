"use client";

import {
  IconButton,
  Toolbar,
  useMediaQuery,
  Button,
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  Tooltip,
  Link as MuiLink,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Logout from "@mui/icons-material/Logout";
import { Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import AppBarStyled from "./AppBarStyled";
import LogoWithText from "../LogoWithText";
import useDrawerStore from "@/stores/useDrawerStore";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { useLogoutMutation } from "@/features/auth/api/useLogoutMutation";
import NextLink from "next/link";
import { getNameInitials } from "@/utils";
import Watermark from "@/components/TestWatermark";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import { useReadNotificationsMutation } from "@/features/notifications/api/usePostReadNotificationMutation";
import { useDeleteNotificationMutation } from "@/features/notifications/api/useDeleteNotificationMutation";
import { useGetNotification } from "@/features/notifications/api/useGetNotificationQuery";

const Header = () => {
  const { open, toggle } = useDrawerStore();
  const { data } = useAuthenticatedUser();
  const { data: notificationData } = useGetNotification();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();
  const { mutate: logout } = useLogoutMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
  const [activeNotifId, setActiveNotifId] = useState<string | null>(null);
  const [, setHasUnreadNotifications] = useState(false);

  const isNotifOpen = Boolean(notifAnchorEl);
  const menuOpen = Boolean(anchorEl);
  const isMoreOpen = Boolean(moreAnchorEl);
  const isDesktopScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("lg")
  );

  useEffect(() => {
    const hasUnread =
      notificationData?.data?.some(notif => !notif.read_at) ?? false;
    if (hasUnread) {
      setHasUnreadNotifications(true);
    }
  }, [notificationData]);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    logout();
    setOpenDialog(false);
  };

  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
    setHasUnreadNotifications(false);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMoreClick = (
    event: React.MouseEvent<HTMLElement>,
    notifId: string
  ) => {
    setMoreAnchorEl(event.currentTarget);
    setActiveNotifId(notifId);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
    setActiveNotifId(null);
  };

  const { mutate: markAsRead } = useReadNotificationsMutation();
  const handleMarkAsRead = (notifId: string) => {
    markAsRead({
      notificationUpdateData: { read_at: dayjs().toISOString() },
      id: notifId,
    });
    handleMoreClose();
  };

  const handleDeleteNotification = (notifId: string) => {
    deleteNotification(notifId);
    handleMoreClose();
  };

  return (
    <AppBarStyled
      position="fixed"
      open={open && isDesktopScreen}
      color="inherit"
      elevation={0}
    >
      <Toolbar
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {!open && <LogoWithText />}
        <Watermark />

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Notifications" arrow>
          <Box sx={{ position: "relative" }}>
            <Button
              onClick={handleNotifClick}
              sx={{ minWidth: "unset", width: "auto" }}
            >
              <NotificationsNoneIcon sx={{ margin: 0, padding: 0 }} />

              {(notificationData?.summary?.unread_count ?? 0) > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -1,
                    right: 1,
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    color: "white",
                    fontSize: "0.50rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {notificationData?.summary?.unread_count ?? 0}
                </Box>
              )}
            </Button>
          </Box>
        </Tooltip>

        <Popover
          open={isNotifOpen}
          anchorEl={notifAnchorEl}
          onClose={handleNotifClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                border: theme => `1px solid ${theme.palette.divider}`,
                width: 370,
                height: 420,
                overflowY: "auto",
                p: 0,
              },
            },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 2,
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            <MuiLink href="/dashboard/notifications" component={NextLink}>
              <Button
                fullWidth
                sx={{
                  justifyContent: "center",
                  textTransform: "none",
                  px: 2,
                  borderRadius: 0,
                }}
              >
                <Typography variant="subtitle1" fontWeight={400}>
                  See all
                </Typography>
              </Button>
            </MuiLink>
          </Stack>

          <Divider />

          <Stack
            spacing={0}
            sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "340px" }}
          >
            <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
              Unread Notifications
            </Typography>

            {(notificationData?.data ?? []).filter(notif => !notif.read_at)
              .length > 0 ? (
              (notificationData?.data ?? [])
                .filter(notif => !notif.read_at)
                .map(notif => (
                  <Box
                    key={notif.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme => theme.palette.action.hover,
                      },
                      borderBottom: theme =>
                        `1px solid ${theme.palette.divider}`,
                      width: "100%",
                      height: 80,
                      backgroundColor: notif.read_at
                        ? "transparent"
                        : theme => theme.palette.secondary.lighter,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ px: 2, py: 1, height: "100%", width: "100%" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "90%",
                          gap: 2,
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: "20%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={theme => ({
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              border: `1px solid ${
                                !Array.isArray(notif.data?.data) &&
                                notif.data?.data?.download_link
                                  ? theme.palette.primary.light
                                  : notif.data.success
                                    ? theme.palette.success.light
                                    : theme.palette.error.light
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            })}
                          >
                            {!Array.isArray(notif.data?.data) &&
                            notif.data?.data?.download_link ? (
                              <MuiLink
                                component={NextLink}
                                href={notif.data.data.download_link ?? ""}
                                rel="noopener noreferrer"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: theme => theme.palette.primary.light,
                                }}
                              >
                                <DownloadIcon />
                              </MuiLink>
                            ) : notif.data.success ? (
                              <CheckIcon
                                sx={{
                                  color: theme => theme.palette.success.light,
                                  strokeWidth: 2,
                                }}
                              />
                            ) : (
                              <ErrorOutlineIcon
                                sx={{
                                  color: theme => theme.palette.error.light,
                                  strokeWidth: 2,
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        {notif.data.success &&
                        typeof notif.data.data === "object" &&
                        !Array.isArray(notif.data.data) &&
                        notif?.data?.data &&
                        "download_link" in notif.data.data ? (
                          <MuiLink
                            component={NextLink}
                            href={notif.data.data.download_link ?? "#"}
                            color="inherit"
                            underline="none"
                            sx={{ textDecoration: "none" }}
                          >
                            <Stack>
                              <Typography fontWeight={500}>
                                {notif.data.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#8c8c8c" }}
                              >
                                {dayjs(notif.created_at).format(
                                  "MMM D, YYYY h:mm A"
                                )}
                              </Typography>
                            </Stack>
                          </MuiLink>
                        ) : (
                          <Stack
                            sx={{
                              width: "75%",
                              height: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              fontWeight={500}
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.2,
                              }}
                            >
                              {notif.data.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#8c8c8c" }}
                            >
                              {dayjs(notif.created_at).format(
                                "MMM D, YYYY h:mm A"
                              )}
                            </Typography>
                          </Stack>
                        )}
                      </Box>

                      <IconButton
                        onClick={e => handleMoreClick(e, notif.id)}
                        disableRipple
                        disableFocusRipple
                        sx={{
                          "&:hover": { backgroundColor: "transparent" },
                          height: "100%",
                          width: "10%",
                        }}
                      >
                        <Tooltip title="More">
                          <MoreVertIcon
                            sx={{
                              color: theme => theme.palette.secondary.main,
                              "&:hover": {
                                color: theme => theme.palette.secondary[600],
                              },
                            }}
                          />
                        </Tooltip>
                      </IconButton>
                    </Stack>
                  </Box>
                ))
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  No Unread Notifications
                </Typography>
              </Box>
            )}
          </Stack>

          <Divider />

          <Stack
            spacing={0}
            sx={{
              maxHeight: "340px",
            }}
          >
            <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
              Viewed Notifications
            </Typography>

            {notificationData?.data
              ?.filter(notif => notif.read_at)
              .map(notif => (
                <Box
                  key={notif.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme => theme.palette.action.hover,
                    },
                    borderBottom: theme => `1px solid ${theme.palette.divider}`,
                    width: "100%",
                    height: 80,
                    backgroundColor: notif.read_at
                      ? "transparent"
                      : theme => theme.palette.secondary.lighter,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 2, py: 1, height: "100%", width: "100%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "90%",
                        gap: 2,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: "20%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={theme => ({
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            border: `1px solid ${
                              !Array.isArray(notif.data?.data) &&
                              notif.data?.data?.download_link
                                ? theme.palette.primary.light
                                : notif.data.success
                                  ? theme.palette.success.light
                                  : theme.palette.error.light
                            }`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          })}
                        >
                          {!Array.isArray(notif.data?.data) &&
                          notif.data?.data?.download_link ? (
                            <MuiLink
                              component={NextLink}
                              href={notif.data.data.download_link ?? ""}
                              rel="noopener noreferrer"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: theme => theme.palette.primary.light,
                              }}
                            >
                              <DownloadIcon />
                            </MuiLink>
                          ) : notif.data.success ? (
                            <CheckIcon
                              sx={{
                                color: theme => theme.palette.success.light,
                                strokeWidth: 2,
                              }}
                            />
                          ) : (
                            <ErrorOutlineIcon
                              sx={{
                                color: theme => theme.palette.error.light,
                                strokeWidth: 2,
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      {notif.data.success &&
                      typeof notif.data.data === "object" &&
                      !Array.isArray(notif.data.data) &&
                      notif?.data?.data &&
                      "download_link" in notif.data.data ? (
                        <MuiLink
                          component={NextLink}
                          href={notif.data.data.download_link ?? "#"}
                          color="inherit"
                          underline="none"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack>
                            <Typography fontWeight={500}>
                              {notif.data.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#8c8c8c" }}
                            >
                              {dayjs(notif.created_at).format(
                                "MMM D, YYYY h:mm A"
                              )}
                            </Typography>
                          </Stack>
                        </MuiLink>
                      ) : (
                        <Stack
                          sx={{
                            width: "75%",
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            fontWeight={500}
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.2,
                            }}
                          >
                            {notif.data.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#8c8c8c" }}
                          >
                            {dayjs(notif.created_at).format(
                              "MMM D, YYYY h:mm A"
                            )}
                          </Typography>
                        </Stack>
                      )}
                    </Box>

                    <IconButton
                      onClick={e => handleMoreClick(e, notif.id)}
                      disableRipple
                      disableFocusRipple
                      sx={{
                        "&:hover": { backgroundColor: "transparent" },
                        height: "100%",
                        width: "10%",
                      }}
                    >
                      <Tooltip title="More">
                        <MoreVertIcon
                          sx={{
                            color: theme => theme.palette.secondary.main,
                            "&:hover": {
                              color: theme => theme.palette.secondary[600],
                            },
                          }}
                        />
                      </Tooltip>
                    </IconButton>
                  </Stack>
                </Box>
              ))}
          </Stack>
        </Popover>

        <Popover
          open={isMoreOpen}
          anchorEl={moreAnchorEl}
          onClose={handleMoreClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          {activeNotifId !== null && (
            <Box key={activeNotifId}>
              {!notificationData?.data?.find(
                notif => notif.id === activeNotifId
              )?.read_at && (
                <MenuItem
                  onClick={() => {
                    handleMarkAsRead(activeNotifId);
                    handleMoreClose();
                  }}
                >
                  Mark as read
                </MenuItem>
              )}

              <MenuItem
                onClick={() => {
                  handleDeleteNotification(activeNotifId);
                  handleMoreClose();
                }}
              >
                Delete
              </MenuItem>
            </Box>
          )}
        </Popover>

        <Button
          onClick={handleProfileClick}
          sx={{ gap: 1, marginLeft: "6px", padding: "6px", minWidth: "unset" }}
          variant="text"
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: "0.700rem",
              bgcolor: theme => theme.palette.primary.dark,
            }}
            alt=""
            src=""
          >
            {getNameInitials(data?.data?.name)}
          </Avatar>
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {data?.data?.name ?? ""}
          </Typography>
        </Button>

        <Menu
          elevation={0}
          anchorEl={anchorEl}
          id="account-menu"
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                border: theme => `1px solid ${theme.palette.divider}`,
                width: 250,
                overflow: "visible",
                filter: "none",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  fontSize: "0.700rem",
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                  border: theme => `1px solid ${theme.palette.divider}`,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MuiLink
            href="/dashboard/profile"
            style={{ textDecoration: "none", color: "inherit" }}
            component={NextLink}
          >
            <MenuItem onClick={handleMenuClose}>
              <Stack flexDirection="row" sx={{ gap: 0.7 }}>
                <Avatar />
                Visit Profile
              </Stack>
            </MenuItem>
          </MuiLink>

          <Divider />
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </Menu>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { width: "100%", maxWidth: "400px", p: 2 } }}
        >
          <DialogTitle variant="h4" sx={{ textAlign: "center" }}>
            Confirm Logout
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Are you sure you want to log out? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ gap: 1, px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              variant="outlined"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              color="error"
              variant="contained"
              fullWidth
            >
              Log Out
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBarStyled>
  );
};

export default Header;
