import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import { responseSchema } from "@/lib/zod/schemas/json-response";
import { useUsersTableStore } from "../store/useUsersTableStore";

const exportUsers = async ({
  page = 1,
  pageSize = 10,
  sortModel,
  filter,
}: UsersQueryOptions) => {
  const object =
    filter?.reduce<Record<string, unknown>>((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {}) ?? null;

  const firstSortItem = sortModel?.[0];

  const sort = firstSortItem
    ? firstSortItem.desc
      ? `-${firstSortItem.id}`
      : firstSortItem.id
    : null;

  const response = await axiosInstance.get("users/export", {
    params: {
      page: page,
      per_page: pageSize,
      sort,
      filter: object,
    },
  });

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return { message: "Parse error. Invalid response format", success: false };
  }

  return validatedResponse.data;
};

export type UsersQueryOptions = {
  page?: number;
  pageSize?: number;
  sortModel?: SortingState;
  filter?: ColumnFiltersState;
  keepPreviousData?: boolean;
};

export const useExportUsers = () => {
  const columnFilters = useUsersTableStore(state => state.columnFilters);
  const pageIndex = useUsersTableStore(state => state.pageIndex);
  const pageSize = useUsersTableStore(state => state.pageSize);
  const sorting = useUsersTableStore(state => state.sorting);
  const trashOnly = useUsersTableStore(state => state.trashOnly);

  const filter = [
    ...columnFilters,
    ...(trashOnly ? [{ id: "trashed", value: "only" }] : []),
  ];

  const options = {
    page: pageIndex,
    pageSize,
    sortModel: sorting,
    filter,
  };

  return useQuery({
    queryFn: () => exportUsers(options),
    queryKey: ["users-export", options],
    refetchOnWindowFocus: false,
    staleTime: minutesToMilliseconds(5),
    enabled: false,
    meta: {
      successMessage: "Export in progress. You'll be notified once it's ready.",
    },
  });
};
