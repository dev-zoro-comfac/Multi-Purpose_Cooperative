import axiosInstance from "@/lib/axios-instance";
import {
  TUsersInfiniteListSchema,
  usersInfiniteListSchema,
} from "@/lib/zod/schemas/user";
import { GridFilterModel } from "@mui/x-data-grid";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export const emptyUsersPaginatedResponse: TUsersInfiniteListSchema = {
  success: false,
  message: "Parse error. Invalid response format",
  data: {
    data: [
      {
        id: "",
        full_name: "",
      },
    ],
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
  sortModel,
  filter,
}: UsersQueryOptions): Promise<TUsersInfiniteListSchema> => {
  const object =
    filter?.reduce<Record<string, unknown>>((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {}) ?? null;

  const sort =
    sortModel
      ?.map(sortItem => (sortItem.desc ? `-${sortItem.id}` : sortItem.id))
      .join(",") ?? null;

  const response = await axiosInstance.get<unknown>("users/infinite-list", {
    params: {
      page: page,
      per_page: 20,
      sort,
      filter: object,
    },
  });

  const validatedResponse = usersInfiniteListSchema.safeParse(response.data);

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
};

export const useGetInfiniteUsersQuery = (query: UsersQueryOptions) => {
  return useInfiniteQuery<TUsersInfiniteListSchema>({
    queryFn: ({ pageParam }) =>
      fetchUsers({ ...query, page: pageParam as number }),
    queryKey: ["infinite-users", query],
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: lastPage =>
      lastPage.data.meta.current_page < lastPage.data.meta.last_page
        ? lastPage.data.meta.current_page + 1
        : undefined,
    getPreviousPageParam: firstPage => firstPage.data.meta.current_page - 1,
    refetchOnWindowFocus: false,
    staleTime: minutesToMilliseconds(5),
  });
};
