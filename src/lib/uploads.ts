import { serverEnv } from "@/env/server";
import { AppError, ERROR_CODES } from "@/utils/errors";

const ALLOWED = new Set(["text/csv","application/json","text/plain","application/pdf","image/png","image/jpeg","image/webp"]);
const BLOCKED_EXTENSIONS = new Set(["icns","jxl","heic","heif","avif","jp2","j2c"]);

export function validateUpload(file: Pick<File,"size"|"type"|"name">) {
  if (file.size <= 0) throw new AppError(ERROR_CODES.uploadRejected, "Empty uploads are not accepted", 400);
  if (file.size > serverEnv.UPLOAD_MAX_BYTES) throw new AppError(ERROR_CODES.uploadRejected, `File exceeds ${serverEnv.UPLOAD_MAX_BYTES} bytes`, 413);
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (BLOCKED_EXTENSIONS.has(extension)) throw new AppError(ERROR_CODES.uploadRejected, `Image format .${extension} is blocked by upload policy`, 415);
  if (!ALLOWED.has(file.type)) throw new AppError(ERROR_CODES.uploadRejected, `Unsupported upload type: ${file.type || file.name}`, 415);
  return true;
}
