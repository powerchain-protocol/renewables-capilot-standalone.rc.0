export type StreamStage = "idle" | "context" | "generate" | "verify" | "complete" | "error";

export type EvidenceLink = {
  id: string;
  title: string;
  sourceType: "ASSET" | "ENERGY" | "TREASURY" | "ALERT" | "REPORT" | "DOCUMENT" | "CHAIN" | "OTHER";
  href?: string;
  verification?: "VERIFIED" | "STALE" | "UNVERIFIED";
};

export type CopilotCreditClass = "CHAT_STANDARD" | "CHAT_TOOL" | "ANALYSIS" | "AGENT_RUN" | "REPORT";
export type CopilotPricingMode = "FIXED_PWRC" | "USD_INDEXED";

export type CopilotCreditQuote = {
  version: "1.0.0";
  creditClass: CopilotCreditClass;
  pricingMode: CopilotPricingMode;
  messageCreditUnits: string;
  pwrc: string;
  pwrcAtomic: string;
  referencePriceUsdPerPwrc: string;
  referenceUsd: string;
  priceUsdMicrosPerPwrc: string;
  expiresAt?: string;
};

export type CopilotCreditBalance = {
  asset: "PWRC";
  decimals: number;
  availableAtomic: string;
  reservedAtomic: string;
  availablePwrc: string;
  reservedPwrc: string;
  enforcement: "OFF" | "WARN" | "ENFORCED";
};

export type CopilotMessageCredits = {
  reservationId?: string;
  receiptId?: string;
  creditClass?: CopilotCreditClass;
  messageCreditUnits?: number;
  reservedPwrc?: string;
  settledPwrc?: string;
  referenceUsd?: string;
  status?: "RESERVED" | "SETTLED" | "RELEASED" | "EXPIRED" | "FAILED";
};

export type TokenizedMessageReceipt = {
  id: string;
  messageId: string;
  conversationId: string;
  requestId?: string;
  status: "RESERVED" | "SETTLED" | "REVERSED" | "FAILED";
  messageCreditUnits: number;
  settledAtomic: string;
  settledPwrc: string;
  priceUsdMicrosPerPwrc: string;
  referenceUsd: string;
  promptHash: string;
  responseHash: string;
  receiptHash: string;
  anchorSignature?: string;
  createdAt: string;
};

export type CopilotMessage = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM" | "TOOL";
  content: string;
  status?: "QUEUED" | "STREAMING" | "COMPLETE" | "FAILED" | "CANCELLED";
  provider?: string;
  model?: string;
  latencyMs?: number;
  grounded?: boolean;
  evidence?: EvidenceLink[];
  requestId?: string;
  usage?: { inputTokens?: number; outputTokens?: number };
  credits?: CopilotMessageCredits;
  reviewIntentIds?: string[];
};

export type CopilotPromptCategory =
  | "Operations"
  | "Assets"
  | "Energy"
  | "Treasury"
  | "Alerts"
  | "Reports"
  | "Risk";

export type CopilotPrompt = {
  id: string;
  title: string;
  description: string;
  category: CopilotPromptCategory;
  creditClass: CopilotCreditClass;
  prompt: string;
  saved?: boolean;
};

export type CopilotStreamEvent =
  | { type: "request.started"; requestId: string }
  | { type: "context.started" }
  | { type: "context.completed" }
  | { type: "credits.reserved"; reservationId: string; creditClass: CopilotCreditClass; units: number; pwrc: string; referenceUsd?: string }
  | { type: "generation.started" }
  | { type: "message.delta"; delta: string }
  | { type: "generation.completed" }
  | { type: "verification.started" }
  | { type: "grounding.completed"; grounded: boolean }
  | { type: "evidence"; evidence: EvidenceLink[] }
  | { type: "usage"; inputTokens?: number; outputTokens?: number; latencyMs?: number }
  | { type: "credits.settled"; reservationId: string; receiptId?: string; units: number; pwrc: string; referenceUsd?: string }
  | { type: "credits.released"; reservationId: string; pwrc: string; reason?: string }
  | { type: "review.intent"; intentId: string }
  | { type: "verification.completed" }
  | { type: "heartbeat"; at?: string }
  | { type: "cancelled" }
  | { type: "done"; messageId: string; provider?: string; model?: string }
  | { type: "error"; code: string; message: string };
