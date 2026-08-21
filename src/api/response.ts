import { toApiError } from "@/utils/errors";

const NO_STORE_HEADERS = { "cache-control": "no-store" } as const;

export function jsonNoStore(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: { ...NO_STORE_HEADERS, ...init.headers },
  });
}

export function jsonFromError(error: unknown) {
  const normalized = toApiError(error);
  return jsonNoStore(normalized.body, { status: normalized.status });
}
