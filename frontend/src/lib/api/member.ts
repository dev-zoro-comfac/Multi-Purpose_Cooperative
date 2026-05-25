import axiosInstance from "@/lib/axios-instance";

export const getMembers = () =>
  axiosInstance.get("/members");