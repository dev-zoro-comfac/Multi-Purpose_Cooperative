import { z } from "zod";
import { Gender } from "@/constant";
import { apiPaginatedResponseSchema, responseSchema } from "./json-response";
import { baseProfileSchema, baseUserSchema } from "./base";

const CreateBaseSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(
      /^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ .]+$/,
      "First name can only contain letters, spaces, and periods."
    ),

  middle_name: z
    .string()
    .regex(
      /^[a-zA-Z .]*$/,
      "Middle name can only contain letters, spaces, and periods"
    )
    .optional(),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(
      /^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ .]+$/,
      "Last name can only contain letters, spaces, and periods."
    ),

  gender: z
    .nativeEnum(Gender, {
      errorMap: () => ({ message: "Please select a gender" }),
    })
    .optional()
    .nullable(),

  contact_number: z.string().optional().nullable(),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g., name@example.com)"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  password_confirmation: z.string().min(1, "Please confirm your password"),

  roles: z.array(z.string()).min(1, "Please select at least one role"),
});

export const CreateUserSchema = CreateBaseSchema.refine(
  data => data.password === data.password_confirmation,
  {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  }
);

export const editProfileSchema = CreateBaseSchema.pick({
  first_name: true,
  middle_name: true,
  last_name: true,
  gender: true,
  contact_number: true,
});

export const EditUserPasswordSchema = CreateBaseSchema.pick({
  password: true,
  password_confirmation: true,
})
  .extend({
    current_password: z.string().optional(),
  })
  .refine(
    data => {
      if (data.password || data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["password_confirmation"],
    }
  );

export const EditUserAccountSchema = CreateBaseSchema.pick({
  email: true,
  roles: true,
});

export type TEditUserAccountSchema = z.infer<typeof EditUserAccountSchema>;
export type TCreateUserSchema = z.infer<typeof CreateUserSchema>;
export type TEditProfileSchema = z.infer<typeof editProfileSchema>;
export type TEditUserPasswordSchema = z.infer<typeof EditUserPasswordSchema>;

export type TUser = z.infer<typeof userSchema>;
export const userSchema = baseUserSchema.extend({
  profile: baseProfileSchema,
});

export type TUserWithProfileOnly = z.infer<typeof userWithProfileOnlySchema>;
export const userWithProfileOnlySchema = baseUserSchema.extend({
  profile: baseProfileSchema,
});

export const userOptionsSchema = responseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      full_name: z.string(),
    })
  ),
});

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const rolesResponseSchema = responseSchema.extend({
  data: z.array(roleSchema),
});

export type TRoleSchema = z.infer<typeof roleSchema>;

export type TRolesResponseSchema = z.infer<typeof rolesResponseSchema>;

export type Users = z.infer<typeof usersSchema>;
export const usersSchema = z.array(userSchema);

export type TUsersResponseSchema = z.infer<typeof usersResponseSchema>;
export const usersResponseSchema = responseSchema.extend({
  data: z.array(
    baseUserSchema.extend({
      profile: baseProfileSchema,
    })
  ),
});

export type TUserResponseSchema = z.infer<typeof userResponseSchema>;
export const userResponseSchema = responseSchema.extend({
  data: userSchema,
});

export type TUsersPaginatedResponseSchema = z.infer<
  typeof usersPaginatedResponseSchema
>;
export const usersPaginatedResponseSchema = responseSchema.extend({
  data: apiPaginatedResponseSchema.extend({ data: usersSchema }),
});

export type TinfiniteUsersSchema = z.infer<typeof infiniteUsersSchema>;
export const infiniteUsersSchema = z.object({
  id: z.string(),
  full_name: z.string(),
});

export type TUsersInfiniteListSchema = z.infer<typeof usersInfiniteListSchema>;
export const usersInfiniteListSchema = responseSchema.extend({
  data: apiPaginatedResponseSchema.extend({
    data: z.array(infiniteUsersSchema),
  }),
});

export type TUserImport = z.infer<typeof userImportSchema>;
export const userImportSchema = z.object({
  users: z
    .instanceof(File, { message: "Please select a file" })
    .refine(file => {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
        "application/csv",
      ];
      return allowedTypes.includes(file.type);
    }, "File must be an Excel spreadsheet (XLSX) or CSV file")
    .refine(
      file => file.size <= 10 * 1024 * 1024,
      "File must be less than 10MB"
    ),
});
