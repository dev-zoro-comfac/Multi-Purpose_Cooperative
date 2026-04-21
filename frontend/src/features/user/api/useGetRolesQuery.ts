import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { rolesResponseSchema } from "@/lib/zod/schemas/user";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";

type TRoleSchema = {
  id: string;
  name: string;
};

type TRolesResponseSchema = {
  data: TRoleSchema[];
};

const fetchRoles = async ({
  searchKey,
}: RoleQueryArgs): Promise<TRolesResponseSchema> => {
  const response = await axiosInstance.get<unknown>("roles", {
    params: { search: searchKey },
  });

  const validatedResponse = rolesResponseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);
    return {
      data: [],
    };
  }

  return validatedResponse.data;
};

type RoleQueryArgs = {
  searchKey: string;
};

export const useGetRolesQuery = (args: RoleQueryArgs) => {
  return useQuery<TRolesResponseSchema>({
    queryFn: () => fetchRoles(args),
    queryKey: ["roles", args.searchKey],
    staleTime: minutesToMilliseconds(15),
  });
};
