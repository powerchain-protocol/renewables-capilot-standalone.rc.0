"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_AI_SETTINGS, type AISettings } from "@/lib/ai/settings";

const STORAGE_KEY = "powerchain.gridllm.ai-settings.v1";

export function useAISettings() {
  const [settings, setSettingsState] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettingsState({ ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) });
    } catch {
      // Corrupt browser state should never block the workspace.
    } finally {
      setHydrated(true);
    }
  }, []);

  const setSettings = useCallback((next: AISettings | ((current: AISettings) => AISettings)) => {
    setSettingsState((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  }, []);

  const reset = useCallback(() => setSettings(DEFAULT_AI_SETTINGS), [setSettings]);
  return { settings, setSettings, reset, hydrated };
}
