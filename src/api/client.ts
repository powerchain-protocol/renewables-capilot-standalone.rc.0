import { z } from "zod";
import type { ApiResult } from "@/types/api";

export async function apiRequest<T>(
  input: string | URL,
  init: RequestInit = {},
  schema?: z.ZodType<T>,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, { cache: "no-store", ...init, headers: { accept: "application/json", ...init.headers } });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return { ok: false, status: response.status, error: { error: payload?.error ?? "HTTP_ERROR", message: payload?.message ?? `Request failed (${response.status})`, issues: payload?.issues } };
    }
    const data = schema ? schema.parse(payload) : payload as T;
    return { ok: true, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 0, error: { error: "NETWORK_ERROR", message: error instanceof Error ? error.message : "Network request failed" } };
  }
}
