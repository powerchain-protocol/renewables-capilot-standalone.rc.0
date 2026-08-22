import type { ExecutionReviewState } from "./types";
export type ReviewCheck = { status: "pending" | "passed" | "failed"; checkedAt: string | null; reason?: string };
export type ExecutionReview = {
  id: string;
  state: ExecutionReviewState;
  intentHash: string;
  policy: ReviewCheck;
  evidence: ReviewCheck;
  simulation: ReviewCheck;
  signatureProduced: false;
  transactionSubmitted: false;
};
export function reviewState(review: Pick<ExecutionReview, "policy" | "evidence" | "simulation">): ExecutionReviewState {
  if ([review.policy, review.evidence, review.simulation].some((check) => check.status === "failed")) return "rejected";
  if (review.policy.status !== "passed") return "policy-required";
  if (review.evidence.status !== "passed") return "simulation-required";
  if (review.simulation.status !== "passed") return "simulation-required";
  return "ready";
}
export function canApproveInWallet(review: ExecutionReview) {
  return reviewState(review) === "ready" && review.signatureProduced === false && review.transactionSubmitted === false;
}
