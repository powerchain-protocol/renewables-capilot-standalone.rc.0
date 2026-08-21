export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
export function compact<T>(values: Array<T | null | undefined | false>): T[] { return values.filter(Boolean) as T[]; }
export function safeJsonParse<T>(value: string, fallback: T): T { try { return JSON.parse(value) as T; } catch { return fallback; } }
export function formatNumber(value: number, maximumFractionDigits=2) { return new Intl.NumberFormat("en", { maximumFractionDigits }).format(value); }
export function formatEnergyWh(wh: number) { return wh >= 1_000_000 ? `${formatNumber(wh/1_000_000)} MWh` : `${formatNumber(wh/1_000)} kWh`; }
