import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";

import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { AxiosError } from "axios";
import { logInDevelopment } from "@/utils";
import { TCreateUserSchema } from "@/lib/zod/schemas/user";

const postUser = async (data: TCreateUserSchema): Promise<TBaseResponse> => {
  const response = await axiosInstance.post<unknown>("users", data);

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return { message: "Parse error. Invalid response format", success: false };
  }

  return validatedResponse.data;
};

export const usePostUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TBaseResponse, AxiosError, TCreateUserSchema>({
    mutationFn: postUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
