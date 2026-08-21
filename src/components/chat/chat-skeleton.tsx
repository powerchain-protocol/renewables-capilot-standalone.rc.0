import { Skeleton } from "@/components/ui/skeleton";
export function ChatSkeleton(){return <div className="space-y-3 rounded-2xl border bg-[var(--card)] p-5"><div className="flex items-center gap-2"><Skeleton className="size-8 rounded-full"/><Skeleton className="h-4 w-28"/></div><Skeleton className="h-4 w-[86%]"/><Skeleton className="h-4 w-[74%]"/><Skeleton className="h-24 w-full"/></div>}
