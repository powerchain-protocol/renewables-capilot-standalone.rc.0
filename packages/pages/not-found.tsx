import Link from "next/link";
import { PageShell } from "./page-shell";
export function NotFoundPage(){return <PageShell title="Page not found" description="The requested PowerChain workspace route does not exist or is no longer available."><Link href="/" className="inline-flex rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]">Return to Renewables Copilot</Link></PageShell>}
