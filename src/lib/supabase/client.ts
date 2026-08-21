"use client";

import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/env/client";

export function createClient() {
  const url = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const createSupabaseBrowserClient = createClient;
