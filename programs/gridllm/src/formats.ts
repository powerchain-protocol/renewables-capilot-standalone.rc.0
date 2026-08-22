export function formatConfidence(value: number) { return `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`; }
export function formatFreshness(seconds: number | null) { if (seconds == null) return "Unavailable"; if (seconds < 60) return `${seconds}s ago`; if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`; return `${Math.floor(seconds/3600)}h ago`; }
