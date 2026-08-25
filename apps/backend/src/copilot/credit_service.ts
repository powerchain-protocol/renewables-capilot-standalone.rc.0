import { createHash, randomUUID } from "node:crypto";
import {
  quoteCopilotCredits,
  type CopilotCreditClass,
  type CopilotPricingMode,
} from "../../../../backend/copilot_credits";
import type { CopilotRepository, RequestContext } from "./types";

export type CreditLifecycleEvent =
  | {
      type: "credits.reserved";
      reservationId: string;
      creditClass: CopilotCreditClass;
      units: number;
      pwrc: string;
      referenceUsd: string;
    }
  | {
      type: "credits.settled";
      reservationId: string;
      receiptId: string;
      units: number;
      pwrc: string;
      referenceUsd: string;
    }
  | {
      type: "credits.released";
      reservationId: string;
      pwrc: string;
      reason: string;
    };

export function hashCopilotContent(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

export class CopilotCreditService {
  constructor(private readonly repository: CopilotRepository) {}

  async quote(input: {
    creditClass?: CopilotCreditClass;
    pricingMode?: CopilotPricingMode;
    priceUsdMicrosPerPwrc?: bigint;
  } = {}) {
    return quoteCopilotCredits(input);
  }

  async reserve(
    context: RequestContext,
    input: {
      requestId?: string;
      creditClass?: CopilotCreditClass;
      pricingMode?: CopilotPricingMode;
      priceUsdMicrosPerPwrc?: bigint;
    } = {},
  ) {
    const requestId = input.requestId ?? randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
    const quote = quoteCopilotCredits({
      creditClass: input.creditClass,
      pricingMode: input.pricingMode,
      priceUsdMicrosPerPwrc: input.priceUsdMicrosPerPwrc,
      expiresAt,
    });
    const reservation = await this.repository.reserveCredits(context, {
      requestId,
      creditClass: quote.creditClass,
      units: Number(quote.messageCreditUnits),
      reservedAtomic: quote.pwrcAtomic,
      priceUsdMicrosPerPwrc: quote.priceUsdMicrosPerPwrc,
      pricingMode: quote.pricingMode,
      expiresAt,
    });
    const event: CreditLifecycleEvent = {
      type: "credits.reserved",
      reservationId: reservation.id,
      creditClass: quote.creditClass,
      units: Number(quote.messageCreditUnits),
      pwrc: quote.pwrc,
      referenceUsd: quote.referenceUsd,
    };
    return { quote, reservation, event };
  }

  async settleMessage(
    context: RequestContext,
    input: {
      reservationId: string;
      messageId: string;
      conversationId: string;
      prompt: string;
      response: string;
    },
  ) {
    const result = await this.repository.settleCreditReservation(context, {
      reservationId: input.reservationId,
      messageId: input.messageId,
      conversationId: input.conversationId,
      promptHash: hashCopilotContent(input.prompt),
      responseHash: hashCopilotContent(input.response),
    });
    const event: CreditLifecycleEvent = {
      type: "credits.settled",
      reservationId: result.reservation.id,
      receiptId: result.receipt.id,
      units: result.receipt.messageCreditUnits,
      pwrc: result.receipt.settledPwrc,
      referenceUsd: result.receipt.referenceUsd,
    };
    return { ...result, event };
  }

  async release(context: RequestContext, reservationId: string, reason: string) {
    const reservation = await this.repository.releaseCreditReservation(context, reservationId, reason);
    const quote = quoteCopilotCredits({
      creditClass: reservation.creditClass,
      pricingMode: reservation.pricingMode,
      priceUsdMicrosPerPwrc: BigInt(reservation.priceUsdMicrosPerPwrc),
    });
    const event: CreditLifecycleEvent = {
      type: "credits.released",
      reservationId: reservation.id,
      pwrc: quote.pwrc,
      reason,
    };
    return { reservation, event };
  }
}
