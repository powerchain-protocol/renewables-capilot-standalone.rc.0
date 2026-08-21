import { cn } from "@/lib/utils";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("rounded-2xl border bg-[var(--card)] text-[var(--card-foreground)] shadow-[0_1px_2px_rgba(0,0,0,.03)]", className)} {...props}/>; }
