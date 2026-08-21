import { serverEnv } from "@/env/server";
import { AppError, ERROR_CODES } from "@/utils/errors";

const ALLOWED = new Set(["text/csv","application/json","text/plain","application/pdf"]);
export function validateUpload(file: Pick<File,"size"|"type"|"name">) {
  if (file.size > serverEnv.UPLOAD_MAX_BYTES) throw new AppError(ERROR_CODES.uploadRejected, `File exceeds ${serverEnv.UPLOAD_MAX_BYTES} bytes`, 413);
  if (!ALLOWED.has(file.type)) throw new AppError(ERROR_CODES.uploadRejected, `Unsupported upload type: ${file.type || file.name}`, 415);
  return true;
}
