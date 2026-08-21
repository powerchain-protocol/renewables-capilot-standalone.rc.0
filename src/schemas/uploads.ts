import { z } from "zod";
export const uploadMetadataSchema = z.object({ name:z.string().min(1).max(255), size:z.number().int().nonnegative(), type:z.string().min(1) });
