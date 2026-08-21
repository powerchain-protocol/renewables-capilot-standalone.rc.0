import { ReloadIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
export function Loading({label="Loading",className}:{label?:string;className?:string}){return <div className={cn("flex items-center gap-2 text-sm text-[var(--muted-foreground)]",className)} role="status"><ReloadIcon className="animate-spin"/><span>{label}</span></div>}
