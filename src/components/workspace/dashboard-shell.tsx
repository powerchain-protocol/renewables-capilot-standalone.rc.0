"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AppSidebar, MobileSidebar } from "@/components/workspace/app-sidebar";
import { DashboardFooter } from "@/components/workspace/dashboard-footer";
import { RightSidebar } from "@/components/workspace/right-sidebar";
import { Topbar } from "@/components/workspace/topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="h-dvh min-h-0 overflow-hidden bg-[var(--background)]">
      <div className="flex h-full min-h-0 overflow-hidden">
        <AppSidebar />
        <MobileSidebar open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar onMenuClick={() => setMobileNavOpen(true)} />

          <div
            id="dashboard-scroll-region"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pc-scrollbar"
          >
            <div className="flex min-h-full flex-col">
              <main className="min-w-0 flex-1 p-4 sm:p-6">
                <div className="mx-auto w-full max-w-[1280px]">{children}</div>
              </main>
              <DashboardFooter />
            </div>
          </div>
        </section>

        <RightSidebar />
      </div>
    </div>
  );
}
