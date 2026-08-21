import { z } from "zod";
export const reserveCreditsSchema = z.object({ amount:z.number().int().positive().max(100_000), reason:z.string().trim().min(1).max(240) });
