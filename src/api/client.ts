import { z } from "zod";
import type { ApiResult } from "@/types/api";

const DEFAULT_API_TIMEOUT_MS = 12_000;

export async function apiRequest<T>(
  input: string | URL,
  init: RequestInit = {},
  schema?: z.ZodType<T>,
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
): Promise<ApiResult<T>> {
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(new DOMException("Request timed out", "TimeoutError")), timeoutMs);
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    const response = await fetch(input, {
      cache: "no-store",
      ...init,
      signal,
      headers: { accept: "application/json", ...init.headers },
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: {
          error: payload?.error ?? "HTTP_ERROR",
          message: payload?.message ?? `Request failed (${response.status})`,
          issues: payload?.issues,
        },
      };
    }
    const data = schema ? schema.parse(payload) : payload as T;
    return { ok: true, status: response.status, data };
  } catch (error) {
    const timedOut = timeoutController.signal.aborted && !init.signal?.aborted;
    return {
      ok: false,
      status: 0,
      error: {
        error: timedOut ? "REQUEST_TIMEOUT" : "NETWORK_ERROR",
        message: timedOut ? `Request timed out after ${timeoutMs}ms` : error instanceof Error ? error.message : "Network request failed",
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
