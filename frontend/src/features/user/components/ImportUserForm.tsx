"use client";

import { useRef, useState } from "react";
import {
  Stack,
  Button,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Box,
  Divider,
  Container,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useUsersImportMutation } from "../api/useImportUserMutation";
import { enqueueSnackbar } from "notistack";
import { useGetUserImportTemplateQuery } from "../api/useDownloadTemplateUser";
import VisuallyHiddenInput from "@/components/ui/VisuallyHiddenInput";

const ImportUserForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { refetch: downloadTemplate, isLoading: isDownloading } =
    useGetUserImportTemplateQuery();
  const { mutate: userImport, isPending } = useUsersImportMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!file) return;

    userImport(
      { users: file },
      {
        onSuccess: response => {
          const message = response?.message || "User imported successfully";
          enqueueSnackbar(message, { variant: "success" });
          handleRemoveFile();
        },
        onError: response => {
          const message = response?.message || "Import failed";
          setError(message);
          enqueueSnackbar(message, {
            variant: "error",
            autoHideDuration: null,
          });
        },
      }
    );
  };

  const handleDownloadClick = async () => {
    try {
      await downloadTemplate();
    } catch {
      enqueueSnackbar("Failed to download template", {
        variant: "error",
        autoHideDuration: null,
      });
    }
  };
  return (
    <Box>
      <Box>
        <Typography variant="h3">Import Users</Typography>
        <Typography variant="body1">Upload your import file below</Typography>
      </Box>
      <Container maxWidth="lg">
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={isPending}
                  sx={{ height: "100px" }}
                >
                  Select File
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                    disabled={isPending}
                    ref={fileInputRef}
                  />
                </Button>
              </Stack>
              {file && (
                <Box
                  sx={{
                    p: 2,
                    flexDirection: "row",
                    bgcolor: "#f5f5f5",
                    borderRadius: "5px",
                  }}
                >
                  <Stack
                    sx={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InsertDriveFileIcon sx={{ color: "text.secondary" }} />
                      <Stack>
                        <Typography variant="subtitle1">{file.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                      </Stack>
                    </Stack>
                    <Button
                      onClick={handleRemoveFile}
                      disabled={isPending}
                      variant="text"
                    >
                      X
                    </Button>
                  </Stack>
                </Box>
              )}

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {isPending && <LinearProgress />}

              <Box sx={{ pt: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.primary"
                  gutterBottom
                >
                  Upload Requirements:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    • File type must be csv and excel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Maximum file size: 10MB
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Special characters are not allowed in file names
                  </Typography>
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!file || isPending}
                  onClick={handleSubmit}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "secondary.light",
                      color: "secondary.dark",
                      cursor: "not-allowed",
                    },
                  }}
                >
                  {isPending ? "Importing..." : "Import File"}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Need a template?</Typography>
              <Button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                sx={{
                  minWidth: "auto",
                  padding: "0",
                  margin: "0",
                  textTransform: "none",
                  color: "primary.main",
                  "&:hover": {
                    background: "none",
                    textDecoration: "underline",
                  },
                }}
              >
                download here
              </Button>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ImportUserForm;
