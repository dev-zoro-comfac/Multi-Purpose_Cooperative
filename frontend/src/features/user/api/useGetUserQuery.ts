import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import {
  TUserResponseSchema,
  userResponseSchema,
} from "@/lib/zod/schemas/user";
import { logInDevelopment, minutesToMilliseconds } from "@/utils";
import { genderEnum } from "@/lib/zod/schemas/gender";

export const emptyResponse = {
  id: "",
  email: "",
  profile: {
    id: "",
    first_name: "",
    middle_name: null,
    last_name: "",
    gender: genderEnum.Values.male,
    user_id: "",
    contact_number: "",
  },
};

const fetchUserData = async (userId: string): Promise<TUserResponseSchema> => {
  const response = await axiosInstance.get<unknown>(`users/${userId}`, {
    params: {
      include: "profile,roles,permissions",
    },
  });

  const validatedResponse = userResponseSchema.safeParse(response.data);

  if (!validatedResponse.success) {
    logInDevelopment(`user api : ${validatedResponse.error.message}`);
    return {
      data: emptyResponse,
      success: false,
      message: "Parse error. Invalid response format",
    };
  }

  return validatedResponse.data;
};

export const useGetUserQuery = (userId: string, enabled: boolean = true) => {
  return useQuery<TUserResponseSchema>({
    queryFn: () => fetchUserData(userId),
    queryKey: ["users", userId],
    staleTime: minutesToMilliseconds(15),
    enabled: enabled,
  });
};
