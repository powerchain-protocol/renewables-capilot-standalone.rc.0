export const ERROR_CODES = {
  invalidInput: "INVALID_INPUT",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  notFound: "NOT_FOUND",
  conflict: "CONFLICT",
  rateLimited: "RATE_LIMITED",
  providerUnavailable: "PROVIDER_UNAVAILABLE",
  rpcUnavailable: "RPC_UNAVAILABLE",
  databaseUnavailable: "DATABASE_UNAVAILABLE",
  uploadRejected: "UPLOAD_REJECTED",
} as const;
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(public readonly code: ErrorCode, message: string, public readonly status=500, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
  }
}

export function toErrorMessage(error: unknown, fallback="Unexpected error") {
  return error instanceof Error ? error.message : fallback;
}
