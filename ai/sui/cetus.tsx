// Cetus SDK v2 adapter boundary.
// Keep SDK-specific calls isolated here so the rest of PowerChain depends on a
// stable quote/build interface rather than Cetus package internals.

export type CetusSwapQuoteRequest = {
  coinTypeA: string;
  coinTypeB: string;
  amount: bigint;
  byAmountIn: boolean;
  slippageBps: number;
};

export type CetusSwapQuote = {
  provider: "cetus";
  amountIn: string;
  amountOut: string;
  priceImpactPct?: string;
  route?: unknown;
  raw: unknown;
};

export interface CetusAdapter {
  quote(request: CetusSwapQuoteRequest): Promise<CetusSwapQuote>;
  buildSwapTransaction(request: CetusSwapQuoteRequest, sender: string): Promise<unknown>;
}

export class CetusSdkV2Adapter implements CetusAdapter {
  constructor(private readonly sdk: any) {}

  async quote(request: CetusSwapQuoteRequest): Promise<CetusSwapQuote> {
    // SDK v2 APIs evolve independently; inject the configured Cetus SDK instance
    // and normalize its router result at this boundary.
    const result = await this.sdk.router?.getBestRouter?.({
      coinTypeA: request.coinTypeA,
      coinTypeB: request.coinTypeB,
      amount: request.amount.toString(),
      byAmountIn: request.byAmountIn,
    });
    if (!result) throw new Error("Cetus router adapter is not configured for this SDK build");
    return {
      provider: "cetus",
      amountIn: String(result.amountIn ?? request.amount),
      amountOut: String(result.amountOut ?? result.outputAmount ?? "0"),
      priceImpactPct: result.priceImpactPct == null ? undefined : String(result.priceImpactPct),
      route: result.route ?? result.paths,
      raw: result,
    };
  }

  async buildSwapTransaction(request: CetusSwapQuoteRequest, sender: string): Promise<unknown> {
    if (!this.sdk.router?.buildSwapTransaction) {
      throw new Error("Cetus buildSwapTransaction adapter is not configured for this SDK build");
    }
    return this.sdk.router.buildSwapTransaction({
      ...request,
      amount: request.amount.toString(),
      sender,
    });
  }
}

// Always send a built Cetus transaction through PowerChain transaction-intent,
// dry-run/review, policy and wallet authorization before execution.
