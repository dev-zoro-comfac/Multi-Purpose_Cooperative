import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import {
  roleResponseSchema,
  TRoleResponseSchema,
} from "@/lib/zod/schemas/roles-and-permissions";

export const emptyRoleResponse = {
  id: "",
  name: "",
  created_at: "",
  updated_at: "",
};

const fetchRoleData = async (roleId: string): Promise<TRoleResponseSchema> => {
  const response = await axiosInstance.get<unknown>(`roles/${roleId}`, {
    params: {
      include: "permissions",
    },
  });

  const validatedResponse = roleResponseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return {
      data: emptyRoleResponse,
      success: false,
      message: "Parse error. Invalid response format",
    };
  }

  return validatedResponse.data;
};

export const useGetRoleQuery = (roleId: string) => {
  return useQuery<TRoleResponseSchema>({
    queryFn: () => fetchRoleData(roleId),
    queryKey: ["roles", roleId],
    staleTime: minutesToMilliseconds(15),
  });
};
