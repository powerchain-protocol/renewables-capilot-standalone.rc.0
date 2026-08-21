import * as SeparatorPrimitive from "@radix-ui/react-separator";
export function Separator({ className="" }: { className?: string }) { return <SeparatorPrimitive.Root className={`h-px w-full bg-[var(--border)] ${className}`}/>; }
