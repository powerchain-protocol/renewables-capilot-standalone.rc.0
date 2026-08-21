import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useUsers } from "@/hooks/use-users";
import { useDemo } from "@/hooks/use-demo";
import { PageShell } from "../../packages/pages/page-shell";
export default function ProfilesPage(){const{user,loading}=useUsers();const demo=useDemo();const name=user?.email??demo.user.displayName;return <PageShell title="Profiles" description="PowerChain user and organization context used by the AI workspace."><Card className="flex items-center gap-4 p-5"><Avatar name={name} className="size-12"/><div><div className="font-semibold">{loading?"Loading profile…":name}</div><div className="text-xs text-[var(--muted-foreground)]">{user?"Authenticated Supabase user":"Demo workspace context"}</div></div></Card></PageShell>}
