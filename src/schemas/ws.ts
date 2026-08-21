import { z } from "zod";

export const websocketMessageSchema = z.object({
  type: z.enum(["ping", "pong", "telemetry", "market", "status", "error"]),
  id: z.string().min(1).max(128).optional(),
  timestamp: z.string().datetime().optional(),
  payload: z.unknown().optional(),
});

export type WebsocketMessage = z.infer<typeof websocketMessageSchema>;
