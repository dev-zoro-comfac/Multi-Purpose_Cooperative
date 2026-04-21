import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { logInDevelopment } from "@/utils";

const restoreUser = async (id: string): Promise<TBaseResponse> => {
  const response = await axiosInstance.patch<unknown>(`users/${id}/restore`);

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);
    return { message: "Parse error. Invalid response format", success: false };
  }

  return validatedResponse.data;
};

export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TBaseResponse, Error, string>({
    mutationFn: restoreUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
