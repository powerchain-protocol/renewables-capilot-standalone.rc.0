import { ZodError } from "zod";

export const ERROR_CODES = {
  invalidInput: "INVALID_INPUT",
  invalidConfiguration: "INVALID_CONFIGURATION",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  notFound: "NOT_FOUND",
  conflict: "CONFLICT",
  rateLimited: "RATE_LIMITED",
  providerUnavailable: "PROVIDER_UNAVAILABLE",
  rpcUnavailable: "RPC_UNAVAILABLE",
  databaseUnavailable: "DATABASE_UNAVAILABLE",
  uploadRejected: "UPLOAD_REJECTED",
  upstreamFailure: "UPSTREAM_FAILURE",
} as const;
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status = 500,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toErrorMessage(error: unknown, fallback = "Unexpected error") {
  if (error instanceof ZodError) return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  return error instanceof Error ? error.message : fallback;
}

export function toApiError(error: unknown) {
  if (error instanceof AppError) return { status: error.status, body: { error: error.code, message: error.message, metadata: error.metadata } };
  if (error instanceof ZodError) return { status: 400, body: { error: ERROR_CODES.invalidInput, message: "Request validation failed", issues: error.flatten() } };
  return { status: 500, body: { error: "INTERNAL_ERROR", message: toErrorMessage(error) } };
}
