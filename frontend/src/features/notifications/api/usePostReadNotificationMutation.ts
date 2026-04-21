import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { logInDevelopment } from "@/utils";
import { responseSchema, TBaseResponse } from "@/lib/zod/schemas/json-response";
import { TNotificationSchema } from "@/lib/zod/schemas/notification";

type UpdateNotificationArg = {
  notificationUpdateData: TNotificationSchema | Partial<TNotificationSchema>;
  id: string;
};

const updateNotification = async ({
  notificationUpdateData,
  id,
}: UpdateNotificationArg): Promise<TBaseResponse> => {
  const response = await axiosInstance.post<unknown>(
    `notifications/${id}`,
    notificationUpdateData
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

export const useReadNotificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TBaseResponse, Error, UpdateNotificationArg>({
    mutationFn: updateNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
