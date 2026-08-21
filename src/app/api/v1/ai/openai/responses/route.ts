import { createOpenAIResponseForProfile } from "@/api/openai/responses";
import { jsonFromError, jsonNoStore } from "@/api/response";
import { openAIResponseRequestSchema } from "@/schemas/openai";
import { AppError, ERROR_CODES } from "@/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new AppError(ERROR_CODES.invalidInput, "Content-Type must be application/json", 415);
    }

    const body = await request.json().catch(() => null);
    const parsed = openAIResponseRequestSchema.parse(body);
    const response = await createOpenAIResponseForProfile(parsed.input, parsed.profile);

    return jsonNoStore({
      ok: true,
      response: {
        id: response.id,
        model: response.model,
        status: response.status,
        outputText: response.output_text,
        usage: response.usage,
      },
    });
  } catch (error) {
    return jsonFromError(error);
  }
}
