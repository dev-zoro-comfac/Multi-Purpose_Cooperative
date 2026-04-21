import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import {
  notificationListSchema,
  TNotificationList,
} from "@/lib/zod/schemas/notification";

const emptyNotification: TNotificationList = {
  data: [],
  success: false,
  message: "",
  summary: {
    unread_count: 0,
  },
};

const fetchNotification = async (): Promise<TNotificationList> => {
  const response = await axiosInstance.get<unknown>("notifications/overview");

  const validatedResponse = notificationListSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(validatedResponse.error.message);
    return emptyNotification;
  }

  return validatedResponse.data;
};

export const useGetNotification = () => {
  return useQuery<TNotificationList>({
    queryKey: ["notifications"],
    queryFn: fetchNotification,
    refetchOnWindowFocus: false,
    staleTime: minutesToMilliseconds(5),
  });
};
