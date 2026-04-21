import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import {
  TUsersPaginatedResponseSchema,
  usersPaginatedResponseSchema,
} from "@/lib/zod/schemas/user";
import { GridFilterModel } from "@mui/x-data-grid";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export const emptyUsersPaginatedResponse: TUsersPaginatedResponseSchema = {
  success: false,
  message: "Parse error. Invalid response format",
  data: {
    data: [],
    links: {
      first: "",
      last: "",
      prev: null,
      next: null,
    },
    meta: {
      path: "",
      links: [],
      current_page: 0,
      from: 0,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },
  },
};

const fetchUsers = async ({
  page = 1,
  pageSize = 10,
  sortModel,
  filter,
}: UsersQueryOptions): Promise<TUsersPaginatedResponseSchema> => {
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

  const response = await axiosInstance.get<unknown>("users", {
    params: {
      page: page,
      per_page: pageSize,
      sort,
      filter: object,
      include: "profile,roles",
    },
  });

  const validatedResponse = usersPaginatedResponseSchema.safeParse(
    response.data
  );

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);
    return emptyUsersPaginatedResponse;
  }

  return validatedResponse.data;
};

export type UsersQueryOptions = {
  page?: number;
  pageSize?: number;
  sortModel?: SortingState;
  filterModel?: GridFilterModel;
  filter?: ColumnFiltersState;
  keepPreviousData?: boolean;
};

export const useGetUsersQuery = (query: UsersQueryOptions) => {
  return useQuery<TUsersPaginatedResponseSchema>({
    queryFn: () => fetchUsers(query),
    queryKey: ["users", JSON.stringify(query)],
    placeholderData: query.keepPreviousData ? keepPreviousData : undefined,
    refetchOnWindowFocus: false,
    staleTime: minutesToMilliseconds(5),
  });
};
