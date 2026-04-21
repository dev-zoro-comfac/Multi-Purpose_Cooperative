export const StatusEnum = {
  OnGoing: "on-going",
  Done: "done",
  Cancelled: "cancelled",
} as const;

export const statusOptions = Object.values(StatusEnum);
