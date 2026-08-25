import { COPILOT_PRODUCT_VERSION, COPILOT_PROMPTS, findCopilotPrompt } from "../../../../backend/copilot_prompts";
import {
  CREDIT_CLASS_UNITS,
  PWRC_REFERENCE_PRICE_USD_MICROS,
  quoteCopilotCredits,
  type CopilotCreditClass,
  type CopilotPricingMode,
} from "../../../../backend/copilot_credits";
import type { CopilotRepository, RequestContext } from "./types";

function json(data: unknown, status = 200, requestId?: string) {
  return new Response(JSON.stringify({ data, meta: { requestId, version: COPILOT_PRODUCT_VERSION } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function error(code: string, message: string, status: number, requestId?: string) {
  return new Response(JSON.stringify({ error: { code, message }, meta: { requestId, version: COPILOT_PRODUCT_VERSION } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function requireCopilot(context: RequestContext) {
  if (!context.capabilities.includes("copilot.access")) {
    throw Object.assign(new Error("Copilot access is required"), { status: 403, code: "FORBIDDEN" });
  }
}

export async function handleCopilotUxApi(
  request: Request,
  context: RequestContext,
  repository: CopilotRepository,
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  try {
    requireCopilot(context);


    if (method === "GET" && path.endsWith("/api/v1/copilot/credits/pricing")) {
      const creditClass = (url.searchParams.get("class") ?? "CHAT_STANDARD") as CopilotCreditClass;
      const pricingMode = (url.searchParams.get("mode") ?? "FIXED_PWRC") as CopilotPricingMode;
      if (!(creditClass in CREDIT_CLASS_UNITS)) {
        return error("INVALID_CREDIT_CLASS", "Unknown Copilot credit class", 400, context.requestId);
      }
      if (pricingMode !== "FIXED_PWRC" && pricingMode !== "USD_INDEXED") {
        return error("INVALID_PRICING_MODE", "mode must be FIXED_PWRC or USD_INDEXED", 400, context.requestId);
      }
      const rawPrice = url.searchParams.get("priceUsdMicrosPerPwrc");
      let priceUsdMicrosPerPwrc = PWRC_REFERENCE_PRICE_USD_MICROS;
      if (rawPrice) {
        try {
          priceUsdMicrosPerPwrc = BigInt(rawPrice);
        } catch {
          return error("INVALID_PWRC_PRICE", "priceUsdMicrosPerPwrc must be an integer micro-USD value", 400, context.requestId);
        }
      }
      if (priceUsdMicrosPerPwrc <= 0n) {
        return error("INVALID_PWRC_PRICE", "PWRC price must be positive", 400, context.requestId);
      }
      return json(quoteCopilotCredits({ creditClass, pricingMode, priceUsdMicrosPerPwrc }), 200, context.requestId);
    }

    if (method === "GET" && path.endsWith("/api/v1/copilot/credits/balance")) {
      return json(await repository.getCreditBalance(context), 200, context.requestId);
    }

    if (method === "GET" && path.endsWith("/api/v1/copilot/credits/ledger")) {
      const take = Number(url.searchParams.get("take") ?? 50);
      return json(await repository.listCreditLedger(context, Number.isFinite(take) ? take : 50), 200, context.requestId);
    }

    if (method === "POST" && path.endsWith("/api/v1/copilot/credits/reservations")) {
      const body = await request.json().catch(() => null) as {
        requestId?: string;
        creditClass?: CopilotCreditClass;
        pricingMode?: CopilotPricingMode;
        priceUsdMicrosPerPwrc?: string;
      } | null;
      const creditClass = body?.creditClass ?? "CHAT_STANDARD";
      const pricingMode = body?.pricingMode ?? "FIXED_PWRC";
      if (!body?.requestId || !(creditClass in CREDIT_CLASS_UNITS)) {
        return error("INVALID_CREDIT_RESERVATION", "requestId and a valid creditClass are required", 400, context.requestId);
      }
      if (pricingMode !== "FIXED_PWRC" && pricingMode !== "USD_INDEXED") {
        return error("INVALID_PRICING_MODE", "Unknown pricing mode", 400, context.requestId);
      }
      let priceUsdMicrosPerPwrc = PWRC_REFERENCE_PRICE_USD_MICROS;
      if (body.priceUsdMicrosPerPwrc) {
        try {
          priceUsdMicrosPerPwrc = BigInt(body.priceUsdMicrosPerPwrc);
        } catch {
          return error("INVALID_PWRC_PRICE", "priceUsdMicrosPerPwrc must be an integer micro-USD value", 400, context.requestId);
        }
      }
      const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
      const quote = quoteCopilotCredits({ creditClass, pricingMode, priceUsdMicrosPerPwrc, expiresAt });
      const reservation = await repository.reserveCredits(context, {
        requestId: body.requestId,
        creditClass,
        units: Number(quote.messageCreditUnits),
        reservedAtomic: quote.pwrcAtomic,
        priceUsdMicrosPerPwrc: quote.priceUsdMicrosPerPwrc,
        pricingMode,
        expiresAt,
      });
      return json({ reservation, quote }, 201, context.requestId);
    }

    const releaseMatch = path.match(/\/api\/v1\/copilot\/credits\/reservations\/([^/]+)\/release$/);
    if (method === "POST" && releaseMatch) {
      const body = await request.json().catch(() => null) as { reason?: string } | null;
      return json(await repository.releaseCreditReservation(context, decodeURIComponent(releaseMatch[1]), body?.reason ?? "operator_release"), 200, context.requestId);
    }

    const receiptMatch = path.match(/\/api\/v1\/copilot\/messages\/([^/]+)\/receipt$/);
    if (method === "GET" && receiptMatch) {
      const receipt = await repository.getTokenizedMessageReceipt(context, decodeURIComponent(receiptMatch[1]));
      if (!receipt) return error("RECEIPT_NOT_FOUND", "Tokenized message receipt not found", 404, context.requestId);
      return json(receipt, 200, context.requestId);
    }

    if (method === "GET" && path.endsWith("/api/v1/copilot/prompts/library")) {
      const saved = new Set((await repository.listSavedPrompts(context)).map((item) => item.promptId));
      const category = url.searchParams.get("category")?.toLowerCase();
      const query = url.searchParams.get("q")?.trim().toLowerCase();
      const prompts = COPILOT_PROMPTS.filter((prompt) => {
        if (category && prompt.category.toLowerCase() !== category) return false;
        if (!query) return true;
        return `${prompt.title} ${prompt.description} ${prompt.prompt}`.toLowerCase().includes(query);
      }).map((prompt) => ({ ...prompt, saved: saved.has(prompt.id) }));
      return json(prompts, 200, context.requestId);
    }

    if (method === "GET" && path.endsWith("/api/v1/copilot/prompts/saved")) {
      return json(await repository.listSavedPrompts(context), 200, context.requestId);
    }

    if (method === "POST" && path.endsWith("/api/v1/copilot/prompts/saved")) {
      const body = await request.json().catch(() => null) as { promptId?: string } | null;
      if (!body?.promptId || !findCopilotPrompt(body.promptId)) return error("INVALID_PROMPT", "Unknown prompt ID", 400, context.requestId);
      return json(await repository.savePrompt(context, body.promptId), 201, context.requestId);
    }

    const savedMatch = path.match(/\/api\/v1\/copilot\/prompts\/saved\/([^/]+)$/);
    if (method === "DELETE" && savedMatch) {
      await repository.deleteSavedPrompt(context, decodeURIComponent(savedMatch[1]));
      return new Response(null, { status: 204 });
    }

    const conversationMatch = path.match(/\/api\/v1\/copilot\/conversations\/([^/]+)$/);
    if (method === "DELETE" && conversationMatch) {
      await repository.deleteConversation(context, decodeURIComponent(conversationMatch[1]));
      return new Response(null, { status: 204 });
    }

    const feedbackMatch = path.match(/\/api\/v1\/copilot\/messages\/([^/]+)\/feedback$/);
    if (method === "POST" && feedbackMatch) {
      const body = await request.json().catch(() => null) as { rating?: string } | null;
      if (body?.rating !== "HELPFUL" && body?.rating !== "UNHELPFUL") {
        return error("INVALID_FEEDBACK", "rating must be HELPFUL or UNHELPFUL", 400, context.requestId);
      }
      const feedback = await repository.saveMessageFeedback(context, decodeURIComponent(feedbackMatch[1]), body.rating);
      return json(feedback, 200, context.requestId);
    }

    return null;
  } catch (cause) {
    const value = cause as { status?: number; code?: string; message?: string };
    return error(value.code ?? "COPILOT_REQUEST_FAILED", value.message ?? "Copilot request failed", value.status ?? 500, context.requestId);
  }
}
