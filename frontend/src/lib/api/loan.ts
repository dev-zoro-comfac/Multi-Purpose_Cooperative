import axiosInstance from "@/lib/axios-instance";

export const getLoans = () =>
  axiosInstance.get("/loan-applications");

export const getLoan = (id: string | number) =>
  axiosInstance.get(`/loan-applications/${id}`);

export const approveLoan = (id: number) =>
  axiosInstance.patch(`/loan-applications/${id}/approve`);

export const releaseLoan = (id: number) =>
  axiosInstance.patch(`/loan-applications/${id}/release`);

export const rejectLoan = (
  id: number,
  data: { accounting_notes?: string }
) =>
  axiosInstance.patch(
    `/loan-applications/${id}/reject`,
    data
  );

export const downloadLoanDocumentUrl = (
  documentId: number
) =>
  `${
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:8000/api/v1"
  }/loan-documents/${documentId}/download`;

export const createLoan = (data: any) =>
  axiosInstance.post("/loan-applications", data);