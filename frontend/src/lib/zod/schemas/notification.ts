import { z } from "zod";
import { apiPaginatedResponseSchema, responseSchema } from "./json-response";
import { baseNotificationSchema } from "./base";

export type TNotificationSchema = z.infer<typeof notificationSchema>;
export const notificationSchema = z.object({
  id: z.string().optional().nullable(),
  data: z.object({
    success: z.boolean().optional().nullable(),
    message: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    data: z
      .object({
        download_link: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
  }),
  read_at: z.string().nullable().optional(),
  read_on: z.string().nullable().optional(),
  created_at: z.string(),
});

const notificationInnerDataSchema = z
  .object({
    download_link: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

const notificationDataSchema = z.object({
  success: z.boolean().optional().nullable(),
  message: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  data: notificationInnerDataSchema,
});

export type TNotification = z.infer<typeof notificationItemSchema>;
export const notificationItemSchema = z.object({
  id: z.string().uuid(),
  data: notificationDataSchema,
  read_at: z.string().nullable().optional(),
  read_on: z.string().nullable().optional(),
  created_at: z.string(),
  created_on: z.string().optional().nullable(),
});

export type TNotificationList = z.infer<typeof notificationListSchema>;
export const notificationListSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(notificationItemSchema),
  summary: z.object({
    unread_count: z.coerce.number(),
  }),
});

export type TNotificationsPaginatedResponseSchema = z.infer<
  typeof notificationsPaginatedResponseSchema
>;
export const notificationsPaginatedResponseSchema = responseSchema.extend({
  data: apiPaginatedResponseSchema.extend({
    data: z.array(baseNotificationSchema),
  }),
});
