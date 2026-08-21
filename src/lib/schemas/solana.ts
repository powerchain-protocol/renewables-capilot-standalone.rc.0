import bs58 from "bs58";
import { z } from "zod";

export const publicKeySchema = z.string().superRefine((value, ctx) => {
  try {
    const decoded = bs58.decode(value);
    if (decoded.length !== 32) {
      ctx.addIssue({ code: "custom", message: "Solana public key must decode to 32 bytes" });
    }
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid base58 Solana public key" });
  }
});

export const heliusRpcSchema = z.object({
  method: z.enum([
    "getBalance",
    "getAccountInfo",
    "getTokenAccountBalance",
    "getSignaturesForAddress",
    "getTransaction",
    "getProgramAccounts",
    "getLatestBlockhash",
  ]),
  params: z.array(z.unknown()).default([]),
});
