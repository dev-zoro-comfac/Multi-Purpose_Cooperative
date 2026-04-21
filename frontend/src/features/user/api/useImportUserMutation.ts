import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { AxiosError } from "axios";
import { logInDevelopment } from "@/utils";
import { TUserImport } from "@/lib/zod/schemas/user";

const uploadFile = async ({ users }: TUserImport): Promise<TBaseResponse> => {
  const response = await axiosInstance.post<unknown>(
    "users/import",
    { users },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const validatedResponse = responseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);

    return { message: "Parse error. Invalid response format", success: false };
  }

  return validatedResponse.data;
};

export const useUsersImportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TBaseResponse, AxiosError, TUserImport>({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
