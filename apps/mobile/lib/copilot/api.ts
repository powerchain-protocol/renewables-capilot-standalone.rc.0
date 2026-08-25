import type {
  CopilotCreditBalance,
  CopilotCreditClass,
  CopilotCreditQuote,
  CopilotPricingMode,
  CopilotPrompt,
  CopilotStreamEvent,
  TokenizedMessageReceipt,
} from "./types";

export type CopilotApiOptions = {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
};

async function authHeaders(getToken?: CopilotApiOptions["getToken"]) {
  const token = await getToken?.();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseApiError(response: Response, fallback: string): Promise<Error> {
  try {
    const body = await response.json();
    return Object.assign(new Error(body?.error?.message ?? fallback), { code: body?.error?.code, status: response.status });
  } catch {
    return Object.assign(new Error(fallback), { status: response.status });
  }
}

export function createCopilotApi(options: CopilotApiOptions) {
  const url = (path: string) => `${options.baseUrl.replace(/\/$/, "")}${path}`;

  return {
    async getPromptLibrary(): Promise<CopilotPrompt[]> {
      const response = await fetch(url("/api/v1/copilot/prompts/library"), {
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to load prompt library");
      const body = await response.json();
      return body.data ?? [];
    },

    async getSavedPromptIds(): Promise<string[]> {
      const response = await fetch(url("/api/v1/copilot/prompts/saved"), {
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to load saved prompts");
      const body = await response.json();
      return (body.data ?? []).map((item: { promptId: string }) => item.promptId);
    },

    async savePrompt(promptId: string) {
      const response = await fetch(url("/api/v1/copilot/prompts/saved"), {
        method: "POST",
        headers: await authHeaders(options.getToken),
        body: JSON.stringify({ promptId }),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to save prompt");
    },

    async deleteSavedPrompt(promptId: string) {
      const response = await fetch(url(`/api/v1/copilot/prompts/saved/${encodeURIComponent(promptId)}`), {
        method: "DELETE",
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to remove saved prompt");
    },

    async deleteConversation(conversationId: string) {
      const response = await fetch(url(`/api/v1/copilot/conversations/${encodeURIComponent(conversationId)}`), {
        method: "DELETE",
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to delete conversation");
    },

    async submitFeedback(messageId: string, rating: "HELPFUL" | "UNHELPFUL") {
      const response = await fetch(url(`/api/v1/copilot/messages/${encodeURIComponent(messageId)}/feedback`), {
        method: "POST",
        headers: await authHeaders(options.getToken),
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to save feedback");
    },

    async getCreditPricing(
      creditClass: CopilotCreditClass = "CHAT_STANDARD",
      pricingMode: CopilotPricingMode = "FIXED_PWRC",
    ): Promise<CopilotCreditQuote> {
      const params = new URLSearchParams({ class: creditClass, mode: pricingMode });
      const response = await fetch(url(`/api/v1/copilot/credits/pricing?${params.toString()}`), {
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to load PWRC pricing");
      const body = await response.json();
      return body.data;
    },

    async getCreditBalance(): Promise<CopilotCreditBalance> {
      const response = await fetch(url("/api/v1/copilot/credits/balance"), {
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to load PWRC credit balance");
      const body = await response.json();
      return body.data;
    },

    async getCreditLedger(take = 50) {
      const response = await fetch(url(`/api/v1/copilot/credits/ledger?take=${Math.max(1, Math.min(100, take))}`), {
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to load credit ledger");
      const body = await response.json();
      return body.data ?? [];
    },

    async reserveCredits(input: {
      requestId: string;
      creditClass?: CopilotCreditClass;
      pricingMode?: CopilotPricingMode;
      priceUsdMicrosPerPwrc?: string;
    }) {
      const response = await fetch(url("/api/v1/copilot/credits/reservations"), {
        method: "POST",
        headers: await authHeaders(options.getToken),
        body: JSON.stringify(input),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to reserve PWRC credits");
      const body = await response.json();
      return body.data;
    },

    async releaseCreditReservation(reservationId: string, reason = "operator_release") {
      const response = await fetch(url(`/api/v1/copilot/credits/reservations/${encodeURIComponent(reservationId)}/release`), {
        method: "POST",
        headers: await authHeaders(options.getToken),
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to release PWRC reservation");
      const body = await response.json();
      return body.data;
    },

    async getMessageReceipt(messageId: string): Promise<TokenizedMessageReceipt> {
      const response = await fetch(url(`/api/v1/copilot/messages/${encodeURIComponent(messageId)}/receipt`), {
        headers: await authHeaders(options.getToken),
      });
      if (!response.ok) throw await parseApiError(response, "Unable to load tokenized message receipt");
      const body = await response.json();
      return body.data;
    },

    async *streamChat(input: {
      conversationId?: string;
      message: string;
      creditClass?: CopilotCreditClass;
      signal?: AbortSignal;
    }): AsyncGenerator<CopilotStreamEvent> {
      const response = await fetch(url("/api/v1/copilot/chat/stream"), {
        method: "POST",
        headers: {
          ...(await authHeaders(options.getToken)),
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          conversationId: input.conversationId,
          message: input.message,
          creditClass: input.creditClass ?? "CHAT_STANDARD",
        }),
        signal: input.signal,
      });
      if (!response.ok || !response.body) throw await parseApiError(response, "Copilot stream unavailable");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const data = frame
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim())
            .join("\n");
          if (!data || data === "[DONE]") continue;
          try {
            yield JSON.parse(data) as CopilotStreamEvent;
          } catch {
            // Malformed event payloads are ignored; the stream remains alive.
          }
        }
      }
    },
  };
}

export type CopilotApi = ReturnType<typeof createCopilotApi>;
