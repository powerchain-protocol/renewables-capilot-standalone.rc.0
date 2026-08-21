"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletAdapterNetwork, type WalletAdapter } from "@solana/wallet-adapter-base";
import { PUBLIC_SOLANA_RPC, SOLANA_CLUSTER } from "@/lib/solana/config";

/**
 * Keep the default wallet bundle intentionally small. Phantom and Solflare are
 * loaded directly; the deprecated WalletConnect adapter dependency tree is not
 * part of the default runtime. Additional Wallet Standard-compatible adapters
 * can be added behind a separately tested integration boundary.
 */
export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const network = SOLANA_CLUSTER === "mainnet-beta"
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet;

  const wallets = useMemo<WalletAdapter[]>(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network],
  );

  return (
    <ConnectionProvider endpoint={PUBLIC_SOLANA_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
