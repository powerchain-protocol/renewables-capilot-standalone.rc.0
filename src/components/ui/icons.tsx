"use client";

import { NetworkSolana, NetworkSui, TokenUSDC } from "@web3icons/react";
import { WalletIcon } from "@web3icons/react/dynamic";

export function SolanaIcon({ size = 20 }: { size?: number }) {
  return <NetworkSolana size={size} variant="branded" aria-label="Solana" />;
}

export function SuiIcon({ size = 20 }: { size?: number }) {
  return <NetworkSui size={size} variant="branded" aria-label="Sui" />;
}

export function UsdcIcon({ size = 20 }: { size?: number }) {
  return <TokenUSDC size={size} variant="branded" aria-label="USDC" />;
}

export function WalletBrandIcon({ name, size = 20 }: { name: string; size?: number }) {
  return <WalletIcon name={name} size={size} variant="branded" />;
}
