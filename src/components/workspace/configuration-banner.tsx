"use client";

import { ExclamationTriangleIcon, GearIcon } from "@radix-ui/react-icons";
import { useConfigHealth } from "@/hooks/use-config-health";
import { Button } from "@/components/ui/button";

export function ConfigurationBanner() {
  const health = useConfigHealth();
  if (!health?.integrations.supabase.invalidPublicUrl) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <div className="text-sm font-semibold">Supabase configuration needs attention</div>
          <div className="mt-0.5 text-xs leading-5 text-[var(--muted-foreground)]">
            NEXT_PUBLIC_SUPABASE_URL is not a valid HTTP(S) URL. Supabase features are disabled, but the workspace remains operational.
          </div>
        </div>
      </div>
      <Button asChild variant="outline" size="sm" className="shrink-0">
        <a href="/settings"><GearIcon /> Open settings</a>
      </Button>
    </div>
  );
}
