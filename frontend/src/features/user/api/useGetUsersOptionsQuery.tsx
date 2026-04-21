import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { userOptionsSchema } from "@/lib/zod/schemas/user";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import { ColumnFiltersState } from "@tanstack/react-table";
import { z } from "zod";

const fetchUsers = async ({
  filter,
}: UsersQueryOptions): Promise<z.infer<typeof userOptionsSchema>> => {
  const filterParam = filter?.length
    ? Object.fromEntries(filter.map(({ id, value }) => [id, value]))
    : null;

  const response = await axiosInstance.get("users/options", {
    params: { filter: filterParam },
  });

  const validatedResponse = userOptionsSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return {
      success: false,
      message: validatedResponse.error.message,
      data: [],
    };
  }

  return validatedResponse.data;
};

export type UsersQueryOptions = {
  filter?: ColumnFiltersState;
  keepPreviousData?: boolean;
};

export const useGetUsersOptionsQuery = (query: UsersQueryOptions) => {
  return useQuery({
    queryFn: () => fetchUsers(query),
    queryKey: ["users", JSON.stringify(query)],
    placeholderData: query.keepPreviousData ? keepPreviousData : undefined,
    refetchOnWindowFocus: false,
    staleTime: minutesToMilliseconds(5),
  });
};
