import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import {
  rolesPaginatedResponseSchema,
  TRolesPaginatedResponseSchema,
} from "@/lib/zod/schemas/roles-and-permissions";

const fetchRoles = async (): Promise<TRolesPaginatedResponseSchema> => {
  const response = await axiosInstance.get<unknown>("roles", {
    params: {
      sort: "name",
    },
  });

  const validatedResponse = rolesPaginatedResponseSchema.safeParse(
    response.data
  );

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return {
      data: [],
      success: false,
      message: "Parse error. Invalid response format",
    };
  }

  return validatedResponse.data;
};

export const useGetRolesQuery = () => {
  return useQuery<TRolesPaginatedResponseSchema>({
    queryFn: fetchRoles,
    queryKey: ["roles"],
    staleTime: minutesToMilliseconds(15),
  });
};
