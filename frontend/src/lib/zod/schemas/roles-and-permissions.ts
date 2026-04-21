import { z } from "zod";
import { basePermissionSchema, baseRoleSchema } from "./base";
import { responseSchema } from "./json-response";

export type TCreateRoleSchema = z.infer<typeof createRoleSchema>;
export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters long"),
});

export type TEditRoleSchema = z.infer<typeof editRoleSchema>;
export const editRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters long"),
  permissions: z.array(z.string()),
});

export type TRole = z.infer<typeof roleSchema>;
export const roleSchema = baseRoleSchema.extend({
  permissions: z.array(basePermissionSchema).optional().nullable(),
});

export type TRoleResponseSchema = z.infer<typeof roleResponseSchema>;
export const roleResponseSchema = responseSchema.extend({
  data: roleSchema,
});

export type TRolesPaginatedResponseSchema = z.infer<
  typeof rolesPaginatedResponseSchema
>;
export const rolesPaginatedResponseSchema = responseSchema.extend({
  data: z.array(roleSchema),
});

export type TPermission = z.infer<typeof PermissionSchema>;
export const PermissionSchema = basePermissionSchema;

export type TPermissionsPaginatedResponseSchema = z.infer<
  typeof permissionsPaginatedResponseSchema
>;
export const permissionsPaginatedResponseSchema = responseSchema.extend({
  data: z.array(PermissionSchema),
});
