import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { saveAs } from "file-saver";

const fetchUserImportTemplate = async () => {
  try {
    const response = await axiosInstance.get("/users/import/template", {
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition
          .split("filename=")[1]
          ?.split(";")[0]
          ?.replace(/"/g, "")
      : `users_template_${Date.now()}.xlsx`;

    saveAs(response.data, filename);
    return null;
  } catch (error) {
    throw error;
  }
};

export const useGetUserImportTemplateQuery = () => {
  return useQuery({
    queryFn: fetchUserImportTemplate,
    queryKey: ["users-import-template"],
    staleTime: 0,
    enabled: false,
  });
};
