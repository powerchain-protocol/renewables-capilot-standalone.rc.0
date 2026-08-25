import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    return toNextJsHandler(getAuth()).GET(request);
  } catch (error) {
    return Response.json(
      { error: "AUTH_UNAVAILABLE", message: error instanceof Error ? error.message : "Authentication service unavailable" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    return toNextJsHandler(getAuth()).POST(request);
  } catch (error) {
    return Response.json(
      { error: "AUTH_UNAVAILABLE", message: error instanceof Error ? error.message : "Authentication service unavailable" },
      { status: 503 },
    );
  }
}
