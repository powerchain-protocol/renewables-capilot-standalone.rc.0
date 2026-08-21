"use client";
import { ThemeProvider } from "next-themes";
import { SolanaWalletProvider } from "@/components/providers/wallet-provider";
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><SolanaWalletProvider>{children}</SolanaWalletProvider></ThemeProvider>;
}
