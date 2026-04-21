"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { logInDevelopment } from "@/utils";
import { TCreateRoleSchema } from "@/lib/zod/schemas/roles-and-permissions";

const postRole = async (data: TCreateRoleSchema): Promise<TBaseResponse> => {
  const response = await axiosInstance.post<unknown>("roles", data);

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

export const usePostRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TBaseResponse, Error, TCreateRoleSchema>({
    mutationFn: postRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
