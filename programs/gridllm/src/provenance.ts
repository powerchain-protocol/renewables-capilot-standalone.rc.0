import type { GridllmProvenance } from "./types";
export function normalizeConfidence(value: number, evidenceState: GridllmProvenance["evidenceState"]) {
  if (evidenceState === "unavailable") return 0;
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
export function createProvenance(input: Omit<GridllmProvenance, "confidence"> & { confidence: number }): GridllmProvenance {
  return { ...input, confidence: normalizeConfidence(input.confidence, input.evidenceState) };
}
