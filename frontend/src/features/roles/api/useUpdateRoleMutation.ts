import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";

import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { logInDevelopment } from "@/utils";
import { TEditRoleSchema } from "@/lib/zod/schemas/roles-and-permissions";

const updateRole = async ({
  roleUpdateData,
  id,
}: {
  id: string;
  roleUpdateData: TEditRoleSchema;
}): Promise<TBaseResponse> => {
  const response = await axiosInstance.put<unknown>(
    `roles/${id}`,
    roleUpdateData
  );

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return {
      message: "Parse error. Invalid response format",
      success: false,
    };
  }

  return validatedResponse.data;
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TBaseResponse,
    Error,
    { roleUpdateData: TEditRoleSchema; id: string }
  >({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
