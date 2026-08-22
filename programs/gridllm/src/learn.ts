export type LearningArtifact = { id: string; kind: "feedback" | "evaluation" | "example"; content: string; createdAt: string; approved: boolean };
export function acceptLearningArtifact(input: Omit<LearningArtifact,"createdAt">): LearningArtifact {
  return { ...input, content: input.content.trim(), createdAt: new Date().toISOString() };
}
export function mayEnterTrainingSet(item: LearningArtifact) { return item.approved && item.content.length > 0; }
