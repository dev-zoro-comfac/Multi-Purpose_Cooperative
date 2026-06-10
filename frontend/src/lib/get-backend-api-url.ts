export const getBackendApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!apiUrl && process.env.NODE_ENV !== "production") {
    return "http://localhost:8000/api/v1";
  }

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not configured.");
  }

  return apiUrl;
};

export const getBackendOrigin = () => new URL(getBackendApiUrl()).origin;
