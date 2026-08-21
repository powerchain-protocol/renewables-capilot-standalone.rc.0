import actions from "@/actions.json";
import type { PowerChainAction } from "@/types/actions";
export const ACTIONS = actions.actions as PowerChainAction[];
export function getAction(id: string) { return ACTIONS.find((action) => action.id === id) ?? null; }
