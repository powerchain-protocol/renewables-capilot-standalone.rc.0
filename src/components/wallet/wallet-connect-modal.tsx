"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CheckIcon, ChevronRightIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SolanaIcon, WalletBrandIcon } from "@/components/ui/icons";
import { shortAddress } from "@/lib/utils";

function walletIconName(name:string){const v=name.toLowerCase();if(v.includes("phantom"))return "phantom";if(v.includes("solflare"))return "solflare";if(v.includes("walletconnect"))return "wallet-connect";return v;}
export function WalletConnectModal() {
  const [open,setOpen]=useState(false); const { wallets, select, connect, disconnect, publicKey, connecting }=useWallet();
  async function choose(name: string) { select(name as never); setTimeout(()=>void connect().catch(()=>undefined),0); }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="outline" className="min-w-32 gap-2"><SolanaIcon size={17}/>{publicKey?shortAddress(publicKey.toBase58()):"Connect wallet"}</Button></DialogTrigger><DialogContent><DialogTitle className="text-xl font-bold">Connect Solana wallet</DialogTitle><DialogDescription className="mt-1 text-sm text-[var(--muted-foreground)]">Your wallet owns signing. GRIDLLM can prepare and simulate transactions but never receives your private key.</DialogDescription><div className="mt-3 flex items-center gap-2 rounded-xl border bg-[var(--muted)]/50 p-3 text-xs text-[var(--muted-foreground)]"><LockClosedIcon/><span>Non-custodial signing boundary</span></div><div className="mt-4 space-y-2">{wallets.length ? wallets.map(({adapter,readyState})=><button key={adapter.name} disabled={connecting} onClick={()=>choose(adapter.name)} className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:border-emerald-500/40 hover:bg-[var(--muted)]"><span className="grid size-10 place-items-center rounded-xl bg-[var(--muted)]"><WalletBrandIcon name={walletIconName(adapter.name)} size={24}/></span><div className="min-w-0 flex-1"><div className="font-semibold">{adapter.name}</div><div className="truncate text-xs text-[var(--muted-foreground)]">{readyState}</div></div><ChevronRightIcon/></button>) : <div className="rounded-xl border border-dashed p-4"><div className="font-medium">No compatible Solana wallet detected</div><p className="mt-1 text-sm text-[var(--muted-foreground)]">Install or unlock a Wallet Standard-compatible wallet such as Phantom or Solflare, then refresh wallet discovery.</p><Button variant="secondary" className="mt-3" onClick={()=>window.location.reload()}>Refresh wallets</Button></div>}</div>{publicKey&&<Button variant="secondary" className="mt-4 w-full" onClick={()=>void disconnect().then(()=>setOpen(false))}><CheckIcon/> Disconnect {shortAddress(publicKey.toBase58())}</Button>}</DialogContent></Dialog>;
}
