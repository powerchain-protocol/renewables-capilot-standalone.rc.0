"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { shortAddress } from "@/lib/utils";
export function useWallets() { const wallet=useWallet(); return { ...wallet, address:wallet.publicKey?.toBase58() ?? null, shortAddress:shortAddress(wallet.publicKey?.toBase58()) }; }
