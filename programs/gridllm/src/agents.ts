import { TOKENIZED_ASSISTANTS } from "./tokenized-assistant";

export const GRIDLLM_AGENT_IDS = TOKENIZED_ASSISTANTS.map((assistant) => assistant.id);
export function gridllmAgent(id: string) {
  return TOKENIZED_ASSISTANTS.find((assistant) => assistant.id === id) ?? null;
}
