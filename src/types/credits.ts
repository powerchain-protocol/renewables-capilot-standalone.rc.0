export type CreditBalance = { available: number; reserved: number; used: number; unit: "ai-credit" };
export type CreditLedgerEntry = { id: string; amount: number; kind: "grant" | "usage" | "refund" | "reservation"; createdAt: string; description: string };
