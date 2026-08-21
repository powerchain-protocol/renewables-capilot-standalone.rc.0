import { WalletConnectModal } from "@/components/wallet/wallet-connect-modal";
import { Card } from "@/components/ui/card";
import { useWallets } from "@/hooks/use-wallets";
import { PageShell } from "../../packages/pages/page-shell";
export default function AccountsPage(){const wallet=useWallets();return <PageShell title="Accounts" description="Connected identities and non-custodial wallet boundaries."><Card className="p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="text-sm font-semibold">Solana wallet</div><div className="mt-1 font-mono text-xs text-[var(--muted-foreground)]">{wallet.address??"No wallet connected"}</div></div><WalletConnectModal/></div><div className="mt-4 rounded-xl bg-[var(--muted)] p-3 text-xs leading-5 text-[var(--muted-foreground)]">Private keys and signatures stay in the connected wallet. Embedded-wallet support remains disabled until a reviewed provider is configured.</div></Card></PageShell>}
