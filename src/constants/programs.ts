export const PROGRAM_IDS = {
  nativeToken: process.env.NEXT_PUBLIC_NATIVE_TOKEN_PROGRAM_ID ?? null,
  energyToken: process.env.NEXT_PUBLIC_ENERGY_TOKEN_PROGRAM_ID ?? null,
  proofOfEnergy: process.env.NEXT_PUBLIC_PROOF_OF_ENERGY_PROGRAM_ID ?? null,
  carbonCredit: process.env.NEXT_PUBLIC_CARBON_CREDIT_PROGRAM_ID ?? null,
  tokenFactory: process.env.NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID ?? null,
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_PROGRAM_ID ?? null,
  escrow: process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID ?? null,
  treasury: process.env.NEXT_PUBLIC_TREASURY_PROGRAM_ID ?? null,
} as const;
