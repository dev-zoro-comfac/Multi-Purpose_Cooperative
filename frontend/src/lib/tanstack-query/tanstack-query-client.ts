import { QueryCache, QueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const client = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query && query.meta?.errorMessage) {
        enqueueSnackbar(query.meta.errorMessage, { variant: "error" });
      }
    },
    onSuccess: (data, query) => {
      if (query && query.meta?.successMessage) {
        enqueueSnackbar(query.meta.successMessage, { variant: "success" });
      }
    },
  }),
});
