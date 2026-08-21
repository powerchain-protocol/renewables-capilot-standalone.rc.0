import { clientEnv } from "@/env/client";
import { PROGRAM_IDS } from "@/constants/programs";

export const APP_NAME = "Renewables Copilot";
export const GRIDLLM_NAME = "GRIDLLM";
export const POWERCHAIN_NETWORK = clientEnv.NEXT_PUBLIC_POWERCHAIN_NETWORK;
export const PWRC_MINT = clientEnv.NEXT_PUBLIC_PWRC_MINT;
export const SPL_TOKEN_PROGRAM_ID = clientEnv.NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID;
export const TOKEN_2022_PROGRAM_ID = clientEnv.NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID;
export const ASSOCIATED_TOKEN_PROGRAM_ID = clientEnv.NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID;
export { PROGRAM_IDS };
