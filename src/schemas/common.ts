import { z } from "zod";
export const uuidSchema = z.string().uuid();
export const nonEmptyString = z.string().trim().min(1);
export const paginationSchema = z.object({ cursor:z.string().optional(), limit:z.coerce.number().int().min(1).max(100).default(25) });
