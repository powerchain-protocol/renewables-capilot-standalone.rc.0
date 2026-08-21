import { WebSocketServer, type RawData } from "ws";
import { websocketMessageSchema } from "@/schemas/ws";

export const WS_MAX_PAYLOAD_BYTES = 256 * 1024;

export function createSafeWebSocketServer() {
  const server = new WebSocketServer({
    noServer: true,
    maxPayload: WS_MAX_PAYLOAD_BYTES,
    perMessageDeflate: false,
    clientTracking: true,
  });
  return server;
}

export function parseWebSocketMessage(raw: RawData) {
  try {
    const text = typeof raw === "string" ? raw : raw.toString();
    return websocketMessageSchema.safeParse(JSON.parse(text));
  } catch {
    return websocketMessageSchema.safeParse(null);
  }
}
