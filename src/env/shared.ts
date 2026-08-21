import { z } from "zod";

export function normalizeOptionalUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Optional integrations are deliberately non-fatal at application boot.
 * Malformed values become undefined and are surfaced by the config doctor / UI.
 */
export function optionalUrl() {
  return z.preprocess(normalizeOptionalUrl, z.string().url().optional());
}

export function urlWithFallback(fallback: string) {
  return z.preprocess((value) => normalizeOptionalUrl(value), z.string().url().default(fallback));
}

export const optionalString = z.preprocess(normalizeOptionalString, z.string().optional());
