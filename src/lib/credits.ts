import { DEMO_CREDIT_BALANCE } from "@/data/credits";
export function getDemoCredits() { return { ...DEMO_CREDIT_BALANCE }; }
export function canReserveCredits(available: number, amount: number) { return Number.isFinite(amount) && amount > 0 && amount <= available; }
