import { createHash } from "node:crypto";
import { atomicToPwrcString, PWRC_ATOMIC_FACTOR, tokenizedMessageReceiptHashInput, usdMicrosToString } from "../../../../backend/copilot_credits";
import type {
  CopilotRepository,
  CreditReservationRecord,
  RequestContext,
  TokenizedMessageReceiptRecord,
} from "./types";

type CreditAccountRow = {
  id: string;
  asset: string;
  assetDecimals: number;
  availableAtomic: bigint;
  reservedAtomic: bigint;
};

type CreditReservationRow = {
  id: string;
  requestId: string;
  creditClass: string;
  units: number;
  reservedAtomic: bigint;
  settledAtomic: bigint;
  priceUsdMicrosPerPwrc: bigint;
  pricingMode: string;
  status: "RESERVED" | "SETTLED" | "RELEASED" | "EXPIRED";
  expiresAt: Date;
};

type PrismaLike = {
  copilotSavedPrompt: {
    findMany(args: unknown): Promise<Array<{ promptId: string; createdAt: Date }>>;
    upsert(args: unknown): Promise<{ promptId: string; createdAt: Date }>;
    deleteMany(args: unknown): Promise<{ count: number }>;
  };
  copilotConversation: {
    updateMany(args: unknown): Promise<{ count: number }>;
  };
  copilotMessage: {
    findFirst(args: unknown): Promise<{ id: string; role: string } | null>;
  };
  copilotMessageFeedback: {
    upsert(args: unknown): Promise<{ messageId: string; rating: "HELPFUL" | "UNHELPFUL"; updatedAt: Date }>;
  };
  copilotCreditAccount: {
    findUnique(args: unknown): Promise<CreditAccountRow | null>;
    upsert(args: unknown): Promise<CreditAccountRow>;
    updateMany(args: unknown): Promise<{ count: number }>;
    update(args: unknown): Promise<CreditAccountRow>;
  };
  copilotCreditLedgerEntry: {
    findFirst(args: unknown): Promise<null | { id: string }>;
    findMany(args: unknown): Promise<Array<{
      id: string;
      type: "FUND" | "RESERVE" | "SETTLE" | "RELEASE" | "REVERSAL" | "ADJUSTMENT" | "EXPIRATION";
      amountAtomic: bigint;
      balanceAfterAtomic: bigint;
      referenceType: string;
      referenceId: string;
      createdAt: Date;
    }>>;
    create(args: unknown): Promise<unknown>;
  };
  copilotCreditReservation: {
    create(args: unknown): Promise<CreditReservationRow>;
    findFirst(args: unknown): Promise<(CreditReservationRow & { accountId: string; account: CreditAccountRow }) | null>;
    update(args: unknown): Promise<CreditReservationRow>;
  };
  copilotTokenizedMessageReceipt: {
    create(args: unknown): Promise<{
      id: string;
      messageId: string;
      conversationId: string;
      requestId: string | null;
      status: "RESERVED" | "SETTLED" | "REVERSED" | "FAILED";
      messageCreditUnits: number;
      settledAtomic: bigint;
      priceUsdMicrosPerPwrc: bigint;
      referenceUsdMicros: bigint;
      promptHash: string;
      responseHash: string;
      receiptHash: string;
      anchorSignature: string | null;
      createdAt: Date;
    }>;
    findFirst(args: unknown): Promise<null | {
      id: string;
      messageId: string;
      conversationId: string;
      requestId: string | null;
      status: "RESERVED" | "SETTLED" | "REVERSED" | "FAILED";
      messageCreditUnits: number;
      settledAtomic: bigint;
      priceUsdMicrosPerPwrc: bigint;
      referenceUsdMicros: bigint;
      promptHash: string;
      responseHash: string;
      receiptHash: string;
      anchorSignature: string | null;
      createdAt: Date;
    }>;
  };
  $transaction<T>(callback: (tx: PrismaLike) => Promise<T>): Promise<T>;
};

function creditEnforcement(): "OFF" | "WARN" | "ENFORCED" {
  const value = (process.env.COPILOT_CREDITS_ENFORCEMENT ?? "WARN").toUpperCase();
  return value === "ENFORCED" || value === "OFF" ? value : "WARN";
}

function reservationRecord(row: CreditReservationRow): CreditReservationRecord {
  return {
    id: row.id,
    requestId: row.requestId,
    creditClass: row.creditClass as CreditReservationRecord["creditClass"],
    units: row.units,
    reservedAtomic: row.reservedAtomic.toString(),
    settledAtomic: row.settledAtomic.toString(),
    priceUsdMicrosPerPwrc: row.priceUsdMicrosPerPwrc.toString(),
    pricingMode: row.pricingMode as CreditReservationRecord["pricingMode"],
    status: row.status,
    expiresAt: row.expiresAt.toISOString(),
  };
}

export class PrismaCopilotRepository implements CopilotRepository {
  constructor(private readonly prisma: PrismaLike) {}

  async listSavedPrompts(context: RequestContext) {
    const rows = await this.prisma.copilotSavedPrompt.findMany({
      where: { userId: context.userId },
      orderBy: { createdAt: "desc" },
      select: { promptId: true, createdAt: true },
    });
    return rows.map((row) => ({ promptId: row.promptId, createdAt: row.createdAt.toISOString() }));
  }

  async savePrompt(context: RequestContext, promptId: string) {
    const row = await this.prisma.copilotSavedPrompt.upsert({
      where: { userId_promptId: { userId: context.userId, promptId } },
      create: { userId: context.userId, promptId },
      update: {},
      select: { promptId: true, createdAt: true },
    });
    return { promptId: row.promptId, createdAt: row.createdAt.toISOString() };
  }

  async deleteSavedPrompt(context: RequestContext, promptId: string) {
    await this.prisma.copilotSavedPrompt.deleteMany({ where: { userId: context.userId, promptId } });
  }

  async deleteConversation(context: RequestContext, conversationId: string) {
    const result = await this.prisma.copilotConversation.updateMany({
      where: {
        id: conversationId,
        userId: context.userId,
        organizationId: context.organizationId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
    if (result.count !== 1) throw Object.assign(new Error("Conversation not found"), { status: 404 });
  }

  async saveMessageFeedback(context: RequestContext, messageId: string, rating: "HELPFUL" | "UNHELPFUL") {
    const message = await this.prisma.copilotMessage.findFirst({
      where: {
        id: messageId,
        role: "ASSISTANT",
        conversation: {
          userId: context.userId,
          organizationId: context.organizationId,
          deletedAt: null,
        },
      },
      select: { id: true, role: true },
    });
    if (!message) throw Object.assign(new Error("Assistant message not found"), { status: 404 });

    const row = await this.prisma.copilotMessageFeedback.upsert({
      where: { messageId },
      create: { messageId, userId: context.userId, rating },
      update: { rating, userId: context.userId },
      select: { messageId: true, rating: true, updatedAt: true },
    });
    return { messageId: row.messageId, rating: row.rating, updatedAt: row.updatedAt.toISOString() };
  }

  async getCreditBalance(context: RequestContext) {
    const row = await this.prisma.copilotCreditAccount.findUnique({
      where: {
        userId_organizationId_asset: {
          userId: context.userId,
          organizationId: context.organizationId,
          asset: "PWRC",
        },
      },
      select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
    });

    const availableAtomic = row?.availableAtomic ?? 0n;
    const reservedAtomic = row?.reservedAtomic ?? 0n;
    return {
      asset: "PWRC" as const,
      decimals: row?.assetDecimals ?? 9,
      availableAtomic: availableAtomic.toString(),
      reservedAtomic: reservedAtomic.toString(),
      availablePwrc: atomicToPwrcString(availableAtomic),
      reservedPwrc: atomicToPwrcString(reservedAtomic),
      enforcement: creditEnforcement(),
    };
  }

  async listCreditLedger(context: RequestContext, take = 50) {
    const account = await this.prisma.copilotCreditAccount.findUnique({
      where: {
        userId_organizationId_asset: {
          userId: context.userId,
          organizationId: context.organizationId,
          asset: "PWRC",
        },
      },
      select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
    });
    if (!account) return [];
    const rows = await this.prisma.copilotCreditLedgerEntry.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
      take: Math.max(1, Math.min(100, take)),
      select: {
        id: true,
        type: true,
        amountAtomic: true,
        balanceAfterAtomic: true,
        referenceType: true,
        referenceId: true,
        createdAt: true,
      },
    });
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      amountAtomic: row.amountAtomic.toString(),
      balanceAfterAtomic: row.balanceAfterAtomic.toString(),
      referenceType: row.referenceType,
      referenceId: row.referenceId,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async reserveCredits(
    context: RequestContext,
    input: {
      requestId: string;
      creditClass: CreditReservationRecord["creditClass"];
      units: number;
      reservedAtomic: string;
      priceUsdMicrosPerPwrc: string;
      pricingMode: CreditReservationRecord["pricingMode"];
      expiresAt: string;
    },
  ) {
    const amount = BigInt(input.reservedAtomic);
    if (amount <= 0n) throw Object.assign(new Error("Reservation amount must be positive"), { status: 400, code: "INVALID_CREDIT_RESERVATION" });

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.copilotCreditAccount.upsert({
        where: {
          userId_organizationId_asset: {
            userId: context.userId,
            organizationId: context.organizationId,
            asset: "PWRC",
          },
        },
        create: { userId: context.userId, organizationId: context.organizationId, asset: "PWRC", assetDecimals: 9 },
        update: {},
        select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
      });

      const debited = await tx.copilotCreditAccount.updateMany({
        where: { id: account.id, availableAtomic: { gte: amount } },
        data: {
          availableAtomic: { decrement: amount },
          reservedAtomic: { increment: amount },
        },
      });
      if (debited.count !== 1) {
        throw Object.assign(new Error("Insufficient PWRC credits"), { status: 402, code: "INSUFFICIENT_CREDITS" });
      }

      const updatedAccount = await tx.copilotCreditAccount.findUnique({
        where: { id: account.id },
        select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
      });
      if (!updatedAccount) throw new Error("Credit account disappeared during reservation");

      const reservation = await tx.copilotCreditReservation.create({
        data: {
          accountId: account.id,
          requestId: input.requestId,
          creditClass: input.creditClass,
          units: input.units,
          reservedAtomic: amount,
          settledAtomic: 0n,
          priceUsdMicrosPerPwrc: BigInt(input.priceUsdMicrosPerPwrc),
          pricingMode: input.pricingMode,
          expiresAt: new Date(input.expiresAt),
        },
        select: {
          id: true,
          requestId: true,
          creditClass: true,
          units: true,
          reservedAtomic: true,
          settledAtomic: true,
          priceUsdMicrosPerPwrc: true,
          pricingMode: true,
          status: true,
          expiresAt: true,
        },
      });

      await tx.copilotCreditLedgerEntry.create({
        data: {
          accountId: account.id,
          reservationId: reservation.id,
          type: "RESERVE",
          amountAtomic: 0n,
          balanceAfterAtomic: updatedAccount.availableAtomic,
          referenceType: "COPILOT_REQUEST",
          referenceId: input.requestId,
          idempotencyKey: `reserve:${input.requestId}`,
          metadata: { creditClass: input.creditClass, units: input.units },
        },
      });

      return reservationRecord(reservation);
    });
  }

  async releaseCreditReservation(context: RequestContext, reservationId: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.copilotCreditReservation.findFirst({
        where: {
          id: reservationId,
          account: { userId: context.userId, organizationId: context.organizationId, asset: "PWRC" },
        },
        include: { account: true },
      });
      if (!reservation) throw Object.assign(new Error("Credit reservation not found"), { status: 404 });
      if (reservation.status === "RELEASED") return reservationRecord(reservation);
      if (reservation.status !== "RESERVED") {
        throw Object.assign(new Error(`Reservation cannot be released from ${reservation.status}`), { status: 409, code: "CREDIT_RESERVATION_FINALIZED" });
      }

      const release = reservation.reservedAtomic - reservation.settledAtomic;
      const account = await tx.copilotCreditAccount.update({
        where: { id: reservation.accountId },
        data: {
          availableAtomic: { increment: release },
          reservedAtomic: { decrement: release },
        },
        select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
      });
      const updated = await tx.copilotCreditReservation.update({
        where: { id: reservation.id },
        data: { status: "RELEASED" },
        select: {
          id: true,
          requestId: true,
          creditClass: true,
          units: true,
          reservedAtomic: true,
          settledAtomic: true,
          priceUsdMicrosPerPwrc: true,
          pricingMode: true,
          status: true,
          expiresAt: true,
        },
      });
      await tx.copilotCreditLedgerEntry.create({
        data: {
          accountId: reservation.accountId,
          reservationId: reservation.id,
          type: "RELEASE",
          amountAtomic: 0n,
          balanceAfterAtomic: account.availableAtomic,
          referenceType: "COPILOT_REQUEST",
          referenceId: reservation.requestId,
          idempotencyKey: `release:${reservation.requestId}`,
          metadata: { reason },
        },
      });
      return reservationRecord(updated);
    });
  }

  async settleCreditReservation(
    context: RequestContext,
    input: {
      reservationId: string;
      messageId: string;
      conversationId: string;
      promptHash: string;
      responseHash: string;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.copilotCreditReservation.findFirst({
        where: {
          id: input.reservationId,
          account: { userId: context.userId, organizationId: context.organizationId, asset: "PWRC" },
        },
        include: { account: true },
      });
      if (!reservation) throw Object.assign(new Error("Credit reservation not found"), { status: 404 });
      if (reservation.status !== "RESERVED") {
        throw Object.assign(new Error(`Reservation cannot settle from ${reservation.status}`), { status: 409, code: "CREDIT_RESERVATION_FINALIZED" });
      }
      if (reservation.expiresAt.getTime() <= Date.now()) {
        throw Object.assign(new Error("Credit reservation expired"), { status: 409, code: "CREDIT_RESERVATION_EXPIRED" });
      }

      const message = await tx.copilotMessage.findFirst({
        where: {
          id: input.messageId,
          conversationId: input.conversationId,
          role: "ASSISTANT",
          conversation: {
            userId: context.userId,
            organizationId: context.organizationId,
            deletedAt: null,
          },
        },
        select: { id: true, role: true },
      });
      if (!message) throw Object.assign(new Error("Assistant message not found for settlement"), { status: 404 });

      const settledAtomic = reservation.reservedAtomic;
      const referenceUsdMicros = (settledAtomic * reservation.priceUsdMicrosPerPwrc) / PWRC_ATOMIC_FACTOR;
      const updatedAccount = await tx.copilotCreditAccount.update({
        where: { id: reservation.accountId },
        data: { reservedAtomic: { decrement: settledAtomic } },
        select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
      });
      const updatedReservation = await tx.copilotCreditReservation.update({
        where: { id: reservation.id },
        data: { status: "SETTLED", settledAtomic },
        select: {
          id: true,
          requestId: true,
          creditClass: true,
          units: true,
          reservedAtomic: true,
          settledAtomic: true,
          priceUsdMicrosPerPwrc: true,
          pricingMode: true,
          status: true,
          expiresAt: true,
        },
      });

      await tx.copilotCreditLedgerEntry.create({
        data: {
          accountId: reservation.accountId,
          reservationId: reservation.id,
          type: "SETTLE",
          amountAtomic: -settledAtomic,
          balanceAfterAtomic: updatedAccount.availableAtomic,
          referenceType: "COPILOT_MESSAGE",
          referenceId: input.messageId,
          idempotencyKey: `settle:${reservation.requestId}`,
          metadata: { conversationId: input.conversationId, units: reservation.units },
        },
      });

      const receiptInput = tokenizedMessageReceiptHashInput({
        messageId: input.messageId,
        conversationId: input.conversationId,
        requestId: reservation.requestId,
        promptHash: input.promptHash,
        responseHash: input.responseHash,
        settledAtomic: settledAtomic.toString(),
        priceUsdMicrosPerPwrc: reservation.priceUsdMicrosPerPwrc.toString(),
      });
      const receiptHash = createHash("sha256").update(receiptInput).digest("hex");
      const receiptRow = await tx.copilotTokenizedMessageReceipt.create({
        data: {
          accountId: reservation.accountId,
          reservationId: reservation.id,
          messageId: input.messageId,
          conversationId: input.conversationId,
          requestId: reservation.requestId,
          status: "SETTLED",
          messageCreditUnits: reservation.units,
          settledAtomic,
          priceUsdMicrosPerPwrc: reservation.priceUsdMicrosPerPwrc,
          referenceUsdMicros,
          promptHash: input.promptHash,
          responseHash: input.responseHash,
          receiptHash,
        },
        select: {
          id: true,
          messageId: true,
          conversationId: true,
          requestId: true,
          status: true,
          messageCreditUnits: true,
          settledAtomic: true,
          priceUsdMicrosPerPwrc: true,
          referenceUsdMicros: true,
          promptHash: true,
          responseHash: true,
          receiptHash: true,
          anchorSignature: true,
          createdAt: true,
        },
      });

      const receipt: TokenizedMessageReceiptRecord = {
        id: receiptRow.id,
        messageId: receiptRow.messageId,
        conversationId: receiptRow.conversationId,
        requestId: receiptRow.requestId ?? undefined,
        status: receiptRow.status,
        messageCreditUnits: receiptRow.messageCreditUnits,
        settledAtomic: receiptRow.settledAtomic.toString(),
        settledPwrc: atomicToPwrcString(receiptRow.settledAtomic),
        priceUsdMicrosPerPwrc: receiptRow.priceUsdMicrosPerPwrc.toString(),
        referenceUsd: usdMicrosToString(receiptRow.referenceUsdMicros),
        promptHash: receiptRow.promptHash,
        responseHash: receiptRow.responseHash,
        receiptHash: receiptRow.receiptHash,
        anchorSignature: receiptRow.anchorSignature ?? undefined,
        createdAt: receiptRow.createdAt.toISOString(),
      };

      return { reservation: reservationRecord(updatedReservation), receipt };
    });
  }

  async applyVerifiedPwrcFunding(
    context: RequestContext,
    input: { signature: string; netAtomic: string; walletAddress: string; mint: string; slot?: string },
  ) {
    const netAtomic = BigInt(input.netAtomic);
    if (netAtomic <= 0n) throw Object.assign(new Error("Verified funding amount must be positive"), { status: 400, code: "INVALID_FUNDING_AMOUNT" });

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.copilotCreditLedgerEntry.findFirst({
        where: { idempotencyKey: `fund:${input.signature}` },
        select: { id: true },
      });
      if (existing) return;

      const account = await tx.copilotCreditAccount.upsert({
        where: {
          userId_organizationId_asset: {
            userId: context.userId,
            organizationId: context.organizationId,
            asset: "PWRC",
          },
        },
        create: {
          userId: context.userId,
          organizationId: context.organizationId,
          asset: "PWRC",
          assetDecimals: 9,
          availableAtomic: netAtomic,
        },
        update: { availableAtomic: { increment: netAtomic } },
        select: { id: true, asset: true, assetDecimals: true, availableAtomic: true, reservedAtomic: true },
      });

      await tx.copilotCreditLedgerEntry.create({
        data: {
          accountId: account.id,
          type: "FUND",
          amountAtomic: netAtomic,
          balanceAfterAtomic: account.availableAtomic,
          referenceType: "PWRC_TRANSFER",
          referenceId: input.signature,
          idempotencyKey: `fund:${input.signature}`,
          metadata: {
            walletAddress: input.walletAddress,
            mint: input.mint,
            slot: input.slot,
            verifiedNetAtomic: netAtomic.toString(),
          },
        },
      });
    });

    return this.getCreditBalance(context);
  }

  async getTokenizedMessageReceipt(context: RequestContext, messageId: string): Promise<TokenizedMessageReceiptRecord | null> {
    const row = await this.prisma.copilotTokenizedMessageReceipt.findFirst({
      where: {
        messageId,
        message: {
          conversation: {
            userId: context.userId,
            organizationId: context.organizationId,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        messageId: true,
        conversationId: true,
        requestId: true,
        status: true,
        messageCreditUnits: true,
        settledAtomic: true,
        priceUsdMicrosPerPwrc: true,
        referenceUsdMicros: true,
        promptHash: true,
        responseHash: true,
        receiptHash: true,
        anchorSignature: true,
        createdAt: true,
      },
    });
    if (!row) return null;
    return {
      id: row.id,
      messageId: row.messageId,
      conversationId: row.conversationId,
      requestId: row.requestId ?? undefined,
      status: row.status,
      messageCreditUnits: row.messageCreditUnits,
      settledAtomic: row.settledAtomic.toString(),
      settledPwrc: atomicToPwrcString(row.settledAtomic),
      priceUsdMicrosPerPwrc: row.priceUsdMicrosPerPwrc.toString(),
      referenceUsd: usdMicrosToString((row.settledAtomic * row.priceUsdMicrosPerPwrc) / PWRC_ATOMIC_FACTOR),
      promptHash: row.promptHash,
      responseHash: row.responseHash,
      receiptHash: row.receiptHash,
      anchorSignature: row.anchorSignature ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
