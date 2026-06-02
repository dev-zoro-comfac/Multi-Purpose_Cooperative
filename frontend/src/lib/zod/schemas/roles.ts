import { z } from "zod";

export const roleEnum = z.enum(["admin", "accounting", "member", "non-member"]);

export type TRoleSchema = z.infer<typeof roleEnum>;
