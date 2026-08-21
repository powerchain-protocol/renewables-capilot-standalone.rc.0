export type ApiErrorPayload = {
  error: string;
  message: string;
  requestId?: string;
  issues?: unknown;
};

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: ApiErrorPayload; status: number };

export type IntegrationState = "ready" | "optional" | "invalid" | "disabled";
