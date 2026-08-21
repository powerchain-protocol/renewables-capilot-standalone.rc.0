import type { ReactNode } from "react";
import Link from "next/link";
import { PowerChainLogo } from "@/components/brand/powerchain-logo";
export function PageShell({title,description,children}:{title:string;description?:string;children:ReactNode}){return <main className="min-h-screen bg-[var(--background)] p-5 sm:p-8"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between gap-4 border-b pb-5"><PowerChainLogo/><Link href="/" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">Back to Copilot</Link></div><header className="py-8"><h1 className="text-3xl font-bold tracking-tight">{title}</h1>{description&&<p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">{description}</p>}</header>{children}</div></main>}
