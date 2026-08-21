"use client";
import { NetworkIcon, TokenIcon, WalletIcon } from "@web3icons/react/dynamic";
export function SolanaIcon({size=20}:{size?:number}){return <NetworkIcon network="solana" size={size} variant="branded"/>}
export function SuiIcon({size=20}:{size?:number}){return <NetworkIcon network="sui" size={size} variant="branded"/>}
export function UsdcIcon({size=20}:{size?:number}){return <TokenIcon symbol="USDC" size={size} variant="branded"/>}
export function WalletBrandIcon({name,size=20}:{name:string;size?:number}){return <WalletIcon name={name} size={size} variant="branded"/>}
