"use client";

import { ThemeProvider } from "next-themes";
import { SolanaWalletProvider } from "@/components/providers/wallet-provider";
import { SystemHealthProvider } from "@/components/providers/system-health-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SystemHealthProvider>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </SystemHealthProvider>
    </ThemeProvider>
  );
}
