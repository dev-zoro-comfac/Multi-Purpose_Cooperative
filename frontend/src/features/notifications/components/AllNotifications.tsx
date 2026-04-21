"use client";

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Paper,
  Link as MuiLink,
  Grid,
  Menu,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useReadNotificationsMutation } from "@/features/notifications/api/usePostReadNotificationMutation";
import { useDeleteNotificationMutation } from "@/features/notifications/api/useDeleteNotificationMutation";
import NextLink from "next/link";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import MarkChatReadOutlinedIcon from "@mui/icons-material/MarkChatReadOutlined";
import SkeletonAllNotification from "./SkeletonAllNotification";
import { useGetNotification } from "../api/useGetNotificationQuery";

const AllNotifications = () => {
  const { data: notificationData, isLoading } = useGetNotification();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();
  const { mutate: markAsRead } = useReadNotificationsMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuNotifId, setMenuNotifId] = useState<string | null>(null);

  const handleMarkAsRead = (notifId: string) => {
    markAsRead({
      notificationUpdateData: { read_at: dayjs().toISOString() },
      id: notifId,
    });
  };

  const handleDeleteNotification = (notifId: string) => {
    deleteNotification(notifId);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    notifId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuNotifId(notifId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuNotifId(null);
  };

  return (
    <Stack gap={2}>
      <Typography variant="h3" fontWeight="bold">
        All Notifications
      </Typography>

      <Stack spacing={0} sx={{ flexGrow: 1, overflowY: "auto" }}>
        {isLoading ? (
          <SkeletonAllNotification />
        ) : (notificationData?.data ?? []).length > 0 ? (
          (notificationData?.data ?? []).map(notif => (
            <Paper
              key={notif.id}
              sx={theme => ({
                my: 0.25,
                border: `2px solid ${
                  notif.read_at
                    ? theme.palette.divider
                    : theme.palette.primary[100]
                }`,
              })}
              elevation={0}
            >
              <Box>
                <Grid
                  container
                  alignItems="center"
                  sx={{ px: 2, py: 1, height: "100%", width: "100%", my: 1 }}
                >
                  <Grid
                    size={{ xs: 2, sm: 1 }}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={3}>
                      {/* <Box
                        sx={theme => ({
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: notif.read_at
                            ? theme.palette.secondary.main
                            : theme.palette.error.main,
                        })}
                      /> */}
                      <Box
                        sx={theme => ({
                          width: 32,
                          height: 32,
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
                            <DownloadIcon fontSize="small" />
                          </MuiLink>
                        ) : notif.data.success ? (
                          <CheckIcon
                            fontSize="small"
                            sx={{
                              color: theme => theme.palette.success.light,
                              strokeWidth: 2,
                            }}
                          />
                        ) : (
                          <ErrorOutlineIcon
                            fontSize="small"
                            sx={{
                              color: theme => theme.palette.error.light,
                              strokeWidth: 2,
                            }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 5, sm: 8 }} sx={{ pl: 2 }}>
                    {typeof notif.data?.data === "object" &&
                    !Array.isArray(notif.data.data) &&
                    notif.data?.data?.download_link ? (
                      <Box
                        component={NextLink}
                        href={notif.data.data.download_link ?? ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={theme => ({
                          textDecoration: "none",
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          px: 1,
                          py: 0.25,
                          mb: 0.5,
                          borderRadius: 1,
                          width: "fit-content",
                          display: "inline-block",
                          cursor: "pointer",
                        })}
                      >
                        Download Ready
                      </Box>
                    ) : (
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        sx={theme => ({
                          fontSize: "0.75rem",
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          width: "fit-content",
                          display: "inline-block",
                          color: notif.data?.success
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          backgroundColor: notif.data?.success
                            ? theme.palette.success.lighter
                            : theme.palette.error.lighter,
                        })}
                      >
                        {notif.data?.success ? "Success" : "Failed"}
                      </Typography>
                    )}

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

                    <Typography variant="caption" sx={{ color: "#8c8c8c" }}>
                      {notif.created_on},{" "}
                      {dayjs(notif.created_at).format("MMM D, YYYY h:mm A")}
                    </Typography>
                  </Grid>

                  <Grid
                    size={{ xs: 4, sm: 3 }}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {notif.read_at && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={0.5}
                      >
                        <MarkChatReadOutlinedIcon
                          fontSize="small"
                          color="secondary"
                        />
                        <Typography variant="caption" color="secondary">
                          {dayjs(notif.read_at).format("MMM D, YYYY h:mm A")}
                        </Typography>
                      </Box>
                    )}
                    <IconButton onClick={e => handleMenuClick(e, notif.id)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuNotifId === notif.id}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      {!notif.read_at && (
                        <MenuItem
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            handleMenuClose();
                          }}
                        >
                          <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                          Mark as Read
                        </MenuItem>
                      )}

                      <MenuItem
                        onClick={() => {
                          handleDeleteNotification(notif.id);
                          handleMenuClose();
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              No Notifications
            </Typography>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default AllNotifications;
