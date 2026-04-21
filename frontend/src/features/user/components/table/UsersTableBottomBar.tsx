"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { Pagination, Stack, TextField, Typography } from "@mui/material";
import { useUsersTableStore } from "@/features/user/store/useUsersTableStore";
import { TApiPaginatedResponse } from "@/lib/zod/schemas/json-response";
import { pageConfig } from "@/constant/pagination";

type PTableBottomBar = {
  pagination: TApiPaginatedResponse;
};

const UsersTableBottomBar = ({
  pagination: {
    meta: { last_page, from, to, total },
  },
}: PTableBottomBar) => {
  const setPageIndex = useUsersTableStore(state => state.setPageIndex);
  const setPageSize = useUsersTableStore(state => state.setPageSize);
  const pageIndex = useUsersTableStore(state => state.pageIndex);
  const pageSize = useUsersTableStore(state => state.pageSize);

  const [inputPageIndex, setInputPageIndex] = useState(pageIndex);
  const [inputPageSize, setInputPageSize] = useState(pageSize);

  const [debouncedPageSize] = useDebounce(inputPageSize, 1000);
  const [debouncedPageIndex] = useDebounce(inputPageIndex, 1000);

  const handlePageChangeDebounced = useDebouncedCallback((page: number) => {
    setPageIndex(page);
  }, 1000);

  const handlePageChange = (page: string | number) => {
    const pageNum = Number(page);

    if (!isNaN(pageNum)) {
      const validatedPageIndex = Math.max(
        pageConfig.MINIMUM_PAGE_INDEX,
        Math.min(pageNum, last_page)
      );

      if (validatedPageIndex !== inputPageIndex) {
        setInputPageIndex(validatedPageIndex);
      }
    }
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const pageSize = Number(e.target.value);

    if (!isNaN(pageSize)) {
      const validatedPageIndex = Math.max(
        pageConfig.MINIMUM_PAGE_SIZE,
        Math.min(pageSize, pageConfig.MAXIMUM_PAGE_SIZE)
      );

      if (validatedPageIndex !== inputPageSize) {
        setInputPageSize(validatedPageIndex);
        setInputPageIndex(pageConfig.DEFAULT_PAGE_INDEX);
      }
    }
  };

  useEffect(() => {
    if (inputPageSize !== pageSize) {
      setPageSize(debouncedPageSize);
    }
  }, [debouncedPageSize]);

  useEffect(() => {
    if (inputPageIndex !== pageIndex) {
      setPageIndex(debouncedPageIndex);
    }
  }, [debouncedPageIndex]);

  return (
    <Stack
      sx={{
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack
        sx={{
          gap: 2,
          flexDirection: { xs: "row", md: "row" },
          alignItems: "center",
        }}
      >
        <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
          <Typography variant="subtitle2" color="secondary">
            Rows per page
          </Typography>
          <TextField
            hiddenLabel
            type="number"
            value={inputPageSize}
            onChange={handleRowsPerPageChange}
            size="small"
            slotProps={{ htmlInput: { sx: { py: 0.75 } } }}
            sx={{ width: theme => theme.spacing(10) }}
          />
        </Stack>
        <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
          <Typography variant="subtitle2" color="secondary">
            Go to
          </Typography>
          <TextField
            hiddenLabel
            type="number"
            value={inputPageIndex}
            onChange={e => handlePageChange(e.target.value)}
            size="small"
            slotProps={{ htmlInput: { sx: { py: 0.75 } } }}
            sx={{ width: theme => theme.spacing(8) }}
          />
        </Stack>
      </Stack>
      <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
        <Typography variant="subtitle2" color="secondary">
          showing {from} - {to} of {total}
        </Typography>
      </Stack>
      <Pagination
        color="primary"
        onChange={(_, page) => handlePageChangeDebounced(page)}
        count={last_page}
        page={pageIndex}
        variant="outlined"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};
export default UsersTableBottomBar;
