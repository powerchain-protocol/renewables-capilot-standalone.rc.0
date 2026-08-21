"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PUBLIC_SOLANA_RPC } from "@/lib/solana/config";

/**
 * Wallet Standard-first provider. `@solana/wallet-adapter-react` discovers
 * compatible browser wallets (including current Phantom and Solflare builds)
 * without bundling legacy per-wallet SDK adapters into the application.
 *
 * This keeps signing non-custodial and materially reduces transitive wallet
 * dependencies. Older wallets that do not implement Wallet Standard are not
 * supported by the default bundle and should be added only behind a separately
 * tested adapter boundary.
 */
export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint={PUBLIC_SOLANA_RPC}>
      <WalletProvider wallets={[]} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
