/**
 * PowerChain Copilot credit economics — canonical product version 1.0.0.
 *
 * Pricing is expressed in integer micro-USD and PWRC atomic units to avoid
 * floating-point rounding. A base Message Credit Unit (MCU) is 10,000 PWRC.
 * At the launch reference price of $0.000002/PWRC this is exactly $0.02.
 */

export const COPILOT_CREDIT_VERSION = "1.0.0" as const;

export const PWRC_DECIMALS = 9 as const;
export const PWRC_ATOMIC_FACTOR = 1_000_000_000n;

/** $0.000002 = 2 micro-USD per PWRC. */
export const PWRC_REFERENCE_PRICE_USD_MICROS = 2n;

/** One base chat Message Credit Unit. */
export const MESSAGE_CREDIT_UNIT_PWRC = 10_000n;
export const MESSAGE_CREDIT_UNIT_ATOMIC = MESSAGE_CREDIT_UNIT_PWRC * PWRC_ATOMIC_FACTOR;
export const MESSAGE_CREDIT_UNIT_USD_MICROS = MESSAGE_CREDIT_UNIT_PWRC * PWRC_REFERENCE_PRICE_USD_MICROS;

export type CopilotCreditClass =
  | "CHAT_STANDARD"
  | "CHAT_TOOL"
  | "ANALYSIS"
  | "AGENT_RUN"
  | "REPORT";

export type CopilotPricingMode = "FIXED_PWRC" | "USD_INDEXED";

export const CREDIT_CLASS_UNITS: Readonly<Record<CopilotCreditClass, bigint>> = {
  CHAT_STANDARD: 1n,
  CHAT_TOOL: 2n,
  ANALYSIS: 5n,
  AGENT_RUN: 10n,
  REPORT: 25n,
};

export type CopilotCreditQuote = {
  version: typeof COPILOT_CREDIT_VERSION;
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

export function ceilDiv(value: bigint, divisor: bigint): bigint {
  if (divisor <= 0n) throw new Error("divisor must be positive");
  return (value + divisor - 1n) / divisor;
}

export function wholePwrcToAtomic(pwrc: bigint): bigint {
  return pwrc * PWRC_ATOMIC_FACTOR;
}

export function atomicToPwrcString(atomic: bigint): string {
  const sign = atomic < 0n ? "-" : "";
  const value = atomic < 0n ? -atomic : atomic;
  const whole = value / PWRC_ATOMIC_FACTOR;
  const fraction = (value % PWRC_ATOMIC_FACTOR).toString().padStart(PWRC_DECIMALS, "0").replace(/0+$/, "");
  return `${sign}${whole}${fraction ? `.${fraction}` : ""}`;
}

export function usdMicrosToString(micros: bigint): string {
  const sign = micros < 0n ? "-" : "";
  const value = micros < 0n ? -micros : micros;
  const dollars = value / 1_000_000n;
  const cents = (value % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
  return `${sign}${dollars}${cents ? `.${cents}` : ""}`;
}

/**
 * Stable service-price conversion. Example: target $0.02 at $0.000002/PWRC
 * produces 10,000 PWRC. If PWRC moves, USD_INDEXED changes the PWRC amount.
 */
export function pwrcForUsdMicros(targetUsdMicros: bigint, priceUsdMicrosPerPwrc: bigint): bigint {
  if (priceUsdMicrosPerPwrc <= 0n) throw new Error("PWRC price must be positive");
  return ceilDiv(targetUsdMicros, priceUsdMicrosPerPwrc);
}

export function quoteCopilotCredits(input: {
  creditClass?: CopilotCreditClass;
  pricingMode?: CopilotPricingMode;
  priceUsdMicrosPerPwrc?: bigint;
  expiresAt?: string;
} = {}): CopilotCreditQuote {
  const creditClass = input.creditClass ?? "CHAT_STANDARD";
  const pricingMode = input.pricingMode ?? "FIXED_PWRC";
  const priceUsdMicrosPerPwrc = input.priceUsdMicrosPerPwrc ?? PWRC_REFERENCE_PRICE_USD_MICROS;
  const units = CREDIT_CLASS_UNITS[creditClass];
  const referenceUsdMicros = units * MESSAGE_CREDIT_UNIT_USD_MICROS;

  const pwrc = pricingMode === "FIXED_PWRC"
    ? units * MESSAGE_CREDIT_UNIT_PWRC
    : pwrcForUsdMicros(referenceUsdMicros, priceUsdMicrosPerPwrc);

  return {
    version: COPILOT_CREDIT_VERSION,
    creditClass,
    pricingMode,
    messageCreditUnits: units.toString(),
    pwrc: pwrc.toString(),
    pwrcAtomic: wholePwrcToAtomic(pwrc).toString(),
    referencePriceUsdPerPwrc: usdMicrosToString(PWRC_REFERENCE_PRICE_USD_MICROS),
    referenceUsd: usdMicrosToString(referenceUsdMicros),
    priceUsdMicrosPerPwrc: priceUsdMicrosPerPwrc.toString(),
    expiresAt: input.expiresAt,
  };
}

/**
 * Calculates the minimum MCU count needed to cover a provider cost while
 * preserving a target gross margin. This is a routing/quoting input only;
 * it must never silently increase a user's settled charge after approval.
 */
export function requiredUnitsForProviderCost(
  providerCostUsdMicros: bigint,
  targetGrossMarginBps = 3_000n,
): bigint {
  if (providerCostUsdMicros <= 0n) return 1n;
  if (targetGrossMarginBps < 0n || targetGrossMarginBps >= 10_000n) {
    throw new Error("targetGrossMarginBps must be between 0 and 9999");
  }
  const requiredRevenueMicros = ceilDiv(providerCostUsdMicros * 10_000n, 10_000n - targetGrossMarginBps);
  return requiredRevenueMicros <= MESSAGE_CREDIT_UNIT_USD_MICROS
    ? 1n
    : ceilDiv(requiredRevenueMicros, MESSAGE_CREDIT_UNIT_USD_MICROS);
}

export function tokenizedMessageReceiptHashInput(input: {
  messageId: string;
  conversationId: string;
  requestId?: string;
  promptHash: string;
  responseHash: string;
  settledAtomic: string;
  priceUsdMicrosPerPwrc: string;
}): string {
  return [
    COPILOT_CREDIT_VERSION,
    input.messageId,
    input.conversationId,
    input.requestId ?? "",
    input.promptHash,
    input.responseHash,
    input.settledAtomic,
    input.priceUsdMicrosPerPwrc,
  ].join("|");
}

/**
 * Mirrors the Token-2022 transfer-fee shape: fee = min(ceil(amount*bps/10_000), maximumFee).
 * The active bps/maximum fee must be read from the mint for the current epoch.
 */
export function calculateToken2022TransferFeeAtomic(
  preFeeAtomic: bigint,
  transferFeeBasisPoints: number,
  maximumFeeAtomic?: bigint,
): bigint {
  if (preFeeAtomic < 0n) throw new Error("preFeeAtomic cannot be negative");
  if (!Number.isInteger(transferFeeBasisPoints) || transferFeeBasisPoints < 0 || transferFeeBasisPoints > 10_000) {
    throw new Error("transferFeeBasisPoints must be an integer between 0 and 10000");
  }
  if (preFeeAtomic === 0n || transferFeeBasisPoints === 0) return 0n;
  const raw = ceilDiv(preFeeAtomic * BigInt(transferFeeBasisPoints), 10_000n);
  return maximumFeeAtomic === undefined ? raw : raw > maximumFeeAtomic ? maximumFeeAtomic : raw;
}

export function calculateToken2022PostFeeAtomic(
  preFeeAtomic: bigint,
  transferFeeBasisPoints: number,
  maximumFeeAtomic?: bigint,
): bigint {
  return preFeeAtomic - calculateToken2022TransferFeeAtomic(preFeeAtomic, transferFeeBasisPoints, maximumFeeAtomic);
}

/** Returns the smallest pre-fee transfer that yields at least targetNetAtomic. */
export function calculateToken2022GrossForNetAtomic(
  targetNetAtomic: bigint,
  transferFeeBasisPoints: number,
  maximumFeeAtomic?: bigint,
): bigint {
  if (targetNetAtomic < 0n) throw new Error("targetNetAtomic cannot be negative");
  if (targetNetAtomic === 0n || transferFeeBasisPoints === 0) return targetNetAtomic;
  if (transferFeeBasisPoints === 10_000 && maximumFeeAtomic === undefined) {
    throw new Error("A 100% uncapped transfer fee cannot produce a positive net amount");
  }

  let low = targetNetAtomic;
  let high = targetNetAtomic + 1n;
  while (calculateToken2022PostFeeAtomic(high, transferFeeBasisPoints, maximumFeeAtomic) < targetNetAtomic) {
    high *= 2n;
  }

  while (low < high) {
    const mid = (low + high) / 2n;
    if (calculateToken2022PostFeeAtomic(mid, transferFeeBasisPoints, maximumFeeAtomic) >= targetNetAtomic) {
      high = mid;
    } else {
      low = mid + 1n;
    }
  }
  return low;
}
