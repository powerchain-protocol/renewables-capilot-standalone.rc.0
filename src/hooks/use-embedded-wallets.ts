"use client";
import { embeddedWalletConfig } from "@/lib/embedded-wallets";
export function useEmbeddedWallets() { return { ...embeddedWalletConfig, ready:embeddedWalletConfig.enabled }; }
