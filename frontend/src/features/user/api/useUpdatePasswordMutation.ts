import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";

import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { logInDevelopment } from "@/utils";
import { TEditUserPasswordSchema } from "@/lib/zod/schemas/user";

type UpdateUserArg = {
  userUpdateData: Partial<TEditUserPasswordSchema>;
  id: string;
};

const updatePassword = async ({
  userUpdateData,
  id,
}: UpdateUserArg): Promise<TBaseResponse> => {
  const response = await axiosInstance.post<unknown>(
    `users/${id}/change-password`,
    userUpdateData
  );

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return { message: "Parse error. Invalid response format", success: false };
  }

  return validatedResponse.data;
};

export const useUpdatePasswordMutation = () => {
  return useMutation<TBaseResponse, Error, UpdateUserArg>({
    mutationFn: updatePassword,
  });
};
