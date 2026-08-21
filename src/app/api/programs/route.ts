import { PROGRAM_IDS, PWRC_MINT, TOKEN_2022_PROGRAM_ID } from "@/lib/constants";
export async function GET() { return Response.json({ pwrcMint: PWRC_MINT, token2022ProgramId: TOKEN_2022_PROGRAM_ID, programs: PROGRAM_IDS }); }
