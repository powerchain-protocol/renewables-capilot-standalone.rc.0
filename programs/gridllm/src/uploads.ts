export const GRIDLLM_UPLOAD_TYPES = ["text/csv", "application/json", "text/plain"] as const;
export const GRIDLLM_UPLOAD_MAX_FILES = 3;
export const GRIDLLM_UPLOAD_MAX_BYTES = 256 * 1024;
export function validateUploadMeta(file: { type: string; size: number }) {
  return GRIDLLM_UPLOAD_TYPES.includes(file.type as (typeof GRIDLLM_UPLOAD_TYPES)[number]) && file.size > 0 && file.size <= GRIDLLM_UPLOAD_MAX_BYTES;
}
