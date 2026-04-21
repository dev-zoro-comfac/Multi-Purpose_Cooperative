import { z } from "zod";

export type TBaseResponse = z.infer<typeof responseSchema>;
export const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type TLink = z.infer<typeof linkSchema>;
export const linkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
});

export type TPagination = z.infer<typeof paginationSchema>;
export const paginationSchema = z.object({
  current_page: z.number(),
  first_page_url: z.string(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(linkSchema),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number().nullable(),
  total: z.number(),
});

const linksSchema = z.object({
  first: z.string(),
  last: z.string(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

const metaLinksSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
});

const metaSchema = z.object({
  current_page: z.number(),
  from: z.number().nullable(),
  last_page: z.number(),
  links: z.array(metaLinksSchema),
  path: z.string(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
});

export type TApiPaginatedResponse = z.infer<typeof apiPaginatedResponseSchema>;
export const apiPaginatedResponseSchema = z.object({
  links: linksSchema,
  meta: metaSchema,
});
