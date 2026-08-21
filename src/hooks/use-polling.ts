"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PollingState<T> = {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  updatedAt: Date | null;
  refresh: () => Promise<void>;
};

export function usePolling<T>(loader: (signal: AbortSignal) => Promise<T>, intervalMs = 30_000): PollingState<T> {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setRefreshing(true);
    try {
      const next = await loaderRef.current(controller.signal);
      if (controller.signal.aborted) return;
      setData(next);
      setError(null);
      setUpdatedAt(new Date());
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : "Unable to refresh status");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, intervalMs);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      controllerRef.current?.abort();
    };
  }, [intervalMs, refresh]);

  return { data, loading, refreshing, error, updatedAt, refresh };
}
