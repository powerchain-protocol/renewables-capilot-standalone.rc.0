import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  PROGRAM_IDS,
  PWRC_MINT,
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@/lib/constants";
import { solanaConfig } from "@/lib/solana/config";

export async function GET() {
  return Response.json({
    cluster: solanaConfig.cluster,
    publicRpc: solanaConfig.publicRpc,
    pwrcMint: PWRC_MINT,
    tokenPrograms: {
      splToken: SPL_TOKEN_PROGRAM_ID,
      token2022: TOKEN_2022_PROGRAM_ID,
      associatedToken: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
    programs: PROGRAM_IDS,
  });
}
