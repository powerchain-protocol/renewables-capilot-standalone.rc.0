import type { CanonicalCopilotPrompt } from "../../../../backend/copilot_prompts";
import type { CopilotCreditClass, CopilotPricingMode } from "../../../../backend/copilot_credits";

export type RequestContext = {
  requestId: string;
  userId: string;
  organizationId: string;
  capabilities: string[];
};

export type SavedPromptRecord = { promptId: string; createdAt: string };

export type CreditBalanceRecord = {
  asset: "PWRC";
  decimals: number;
  availableAtomic: string;
  reservedAtomic: string;
  availablePwrc: string;
  reservedPwrc: string;
  enforcement: "OFF" | "WARN" | "ENFORCED";
};

export type CreditLedgerRecord = {
  id: string;
  type: "FUND" | "RESERVE" | "SETTLE" | "RELEASE" | "REVERSAL" | "ADJUSTMENT" | "EXPIRATION";
  amountAtomic: string;
  balanceAfterAtomic: string;
  referenceType: string;
  referenceId: string;
  createdAt: string;
};

export type CreditReservationRecord = {
  id: string;
  requestId: string;
  creditClass: CopilotCreditClass;
  units: number;
  reservedAtomic: string;
  settledAtomic: string;
  priceUsdMicrosPerPwrc: string;
  pricingMode: CopilotPricingMode;
  status: "RESERVED" | "SETTLED" | "RELEASED" | "EXPIRED";
  expiresAt: string;
};

export type TokenizedMessageReceiptRecord = {
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

export interface CopilotRepository {
  listSavedPrompts(context: RequestContext): Promise<SavedPromptRecord[]>;
  savePrompt(context: RequestContext, promptId: string): Promise<SavedPromptRecord>;
  deleteSavedPrompt(context: RequestContext, promptId: string): Promise<void>;
  deleteConversation(context: RequestContext, conversationId: string): Promise<void>;
  saveMessageFeedback(
    context: RequestContext,
    messageId: string,
    rating: "HELPFUL" | "UNHELPFUL",
  ): Promise<{ messageId: string; rating: "HELPFUL" | "UNHELPFUL"; updatedAt: string }>;

  getCreditBalance(context: RequestContext): Promise<CreditBalanceRecord>;
  listCreditLedger(context: RequestContext, take?: number): Promise<CreditLedgerRecord[]>;
  reserveCredits(
    context: RequestContext,
    input: {
      requestId: string;
      creditClass: CopilotCreditClass;
      units: number;
      reservedAtomic: string;
      priceUsdMicrosPerPwrc: string;
      pricingMode: CopilotPricingMode;
      expiresAt: string;
    },
  ): Promise<CreditReservationRecord>;
  releaseCreditReservation(context: RequestContext, reservationId: string, reason: string): Promise<CreditReservationRecord>;
  settleCreditReservation(
    context: RequestContext,
    input: {
      reservationId: string;
      messageId: string;
      conversationId: string;
      promptHash: string;
      responseHash: string;
    },
  ): Promise<{ reservation: CreditReservationRecord; receipt: TokenizedMessageReceiptRecord }>;
  applyVerifiedPwrcFunding(
    context: RequestContext,
    input: { signature: string; netAtomic: string; walletAddress: string; mint: string; slot?: string },
  ): Promise<CreditBalanceRecord>;
  getTokenizedMessageReceipt(context: RequestContext, messageId: string): Promise<TokenizedMessageReceiptRecord | null>;
}

export type PromptLibraryResponse = Array<CanonicalCopilotPrompt & { saved: boolean }>;
