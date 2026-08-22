export type CreditEntryKind = "grant" | "usage" | "refund" | "reservation" | "release";
export type CreditEntry = { id: string; accountId: string; amount: bigint; kind: CreditEntryKind; reference: string; createdAt: string };
export function creditBalance(entries: readonly CreditEntry[]) { return entries.reduce((sum, entry) => sum + entry.amount, 0n); }
export function canReserve(entries: readonly CreditEntry[], amount: bigint) { return amount > 0n && creditBalance(entries) >= amount; }
