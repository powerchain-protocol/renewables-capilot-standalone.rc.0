import { powerchainFetch } from "../../generic/fetch";

const JUPITER_BASE_URL = process.env.JUPITER_BASE_URL ?? "https://api.jup.ag";

export type JupiterOrderRequest = {
  inputMint: string;
  outputMint: string;
  amount: string;
  taker: string;
};

export type JupiterOrder = {
  requestId: string;
  transaction?: string;
  inputMint?: string;
  outputMint?: string;
  inAmount?: string;
  outAmount?: string;
  priceImpact?: number;
  slippageBps?: number;
  errorCode?: number;
  errorMessage?: string;
  [key: string]: unknown;
};

function headers() {
  const apiKey = process.env.JUPITER_API_KEY;
  return apiKey ? { "x-api-key": apiKey } : {};
}

export async function getJupiterOrder(input: JupiterOrderRequest): Promise<JupiterOrder> {
  const query = new URLSearchParams(input);
  const response = await powerchainFetch(`${JUPITER_BASE_URL}/ultra/v1/order?${query}`, {
    headers: headers(),
  });
  if (!response.ok) throw new Error(`Jupiter order failed: ${response.status}`);
  return response.json();
}

export async function executeJupiterSignedTransaction(input: {
  signedTransaction: string;
  requestId: string;
}) {
  const response = await powerchainFetch(`${JUPITER_BASE_URL}/ultra/v1/execute`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`Jupiter execute failed: ${response.status}`);
  return response.json();
}

// Security: getJupiterOrder returns an unsigned proposal. PowerChain must route it
// through transaction-intent validation, simulation/review and wallet authorization.
