import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { logInDevelopment } from "@/utils";

const deleteUser = async (id: string): Promise<TBaseResponse> => {
  const response = await axiosInstance.delete<unknown>(`users/${id}`);

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return { message: "Parse error. Invalid response format", success: false };
  }

  return validatedResponse.data;
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TBaseResponse, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
