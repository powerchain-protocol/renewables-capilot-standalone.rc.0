import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement,React.ComponentProps<"input">>(({className,type,...props},ref)=><input ref={ref} type={type} className={cn("flex h-10 w-full rounded-lg border bg-[var(--background)] px-3 py-2 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:opacity-50",className)} {...props}/>);
Input.displayName="Input";
