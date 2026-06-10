import axiosInstance from "@/lib/axios-instance";

export const getLoans = () =>
  axiosInstance.get("/loan-applications");

export const getLoan = (id: string | number) =>
  axiosInstance.get(`/loan-applications/${id}`);

export const approveLoan = (id: number) =>
  axiosInstance.patch(`/loan-applications/${id}/approve`);

export const reviewLoan = (id: number) =>
  axiosInstance.patch(
    `/loan-applications/${id}/review`
  );

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

export const downloadLoanDocument = async (
  documentId: number,
  fallbackFileName = "loan-document.pdf"
) => {
  const response = await axiosInstance.get(
    `/loan-documents/${documentId}/download`,
    {
      responseType: "blob",
    }
  );

  const disposition = response.headers["content-disposition"];
  const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const fileName = fileNameMatch?.[1] || fallbackFileName;
  const blobUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

type AmortizationScheduleRow = {
  payday_no?: string | number | null;
  amortization?: string | number | null;
  interest?: string | number | null;
  principal?: string | number | null;
  balance?: string | number | null;
};

export const downloadAmortizationSchedule = ({
  applicationNo,
  borrowerName,
  schedule,
}: {
  applicationNo?: string | null;
  borrowerName?: string | null;
  schedule: AmortizationScheduleRow[];
}) => {
  const safeApplicationNo = applicationNo || "loan-application";
  const safeFileName = safeApplicationNo.replace(/[^a-z0-9-]/gi, "-");

  const rows = [
    ["Application No.", safeApplicationNo],
    ["Borrower Name", borrowerName || "Unknown borrower"],
    [],
    [
      "Payday No.",
      "Deduction / Amortization",
      "Interest Portion",
      "Principal Portion",
      "Remaining Balance",
    ],
    ...schedule.map((row) => [
      row.payday_no ?? "",
      formatCsvNumber(row.amortization),
      formatCsvNumber(row.interest),
      formatCsvNumber(row.principal),
      formatCsvNumber(row.balance),
    ]),
  ];

  const csv = rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = `${safeFileName}-amortization-schedule.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

const escapeCsvValue = (value: string | number | null | undefined) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const formatCsvNumber = (value: string | number | null | undefined) =>
  Number(value || 0).toFixed(2);

type CreateLoanPayload = Record<
  string,
  string | number | null | undefined
>;

export const createLoan = (data: CreateLoanPayload) =>
  axiosInstance.post("/loan-applications", data);

export const submitPublicLoanApplication = (data: CreateLoanPayload) =>
  axiosInstance.post("/public/loan-applications", data);

export const generateLoanDocuments = (loanId: string | number) =>
  axiosInstance.post(`/loan-applications/${loanId}/generate-documents`);

export const uploadLoanDocument = (
  loanId: string | number,
  data: FormData
) =>
  axiosInstance.post(
    `/loan-applications/${loanId}/upload-document`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const submitLoanForEvaluation = (
  loanId: string | number
) =>
  axiosInstance.patch(
    `/loan-applications/${loanId}/submit-for-evaluation`
  );