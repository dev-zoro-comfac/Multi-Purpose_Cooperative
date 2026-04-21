import { z } from "zod";

export const roleEnum = z.enum(["super-admin", "admin", "manager", "user"]);

export type TRoleSchema = z.infer<typeof roleEnum>;
