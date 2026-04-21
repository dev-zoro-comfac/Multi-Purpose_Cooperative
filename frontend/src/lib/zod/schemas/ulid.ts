import { z } from "zod";

export const ulidSchema = z.string().regex(/^[a-z0-9]{26}$/);
