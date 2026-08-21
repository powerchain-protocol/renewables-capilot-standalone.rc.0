import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90", secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:brightness-95 dark:hover:brightness-110", outline: "border bg-[var(--card)] hover:bg-[var(--muted)]", ghost: "hover:bg-[var(--muted)]", danger: "bg-[var(--danger)] text-white" }, size: { default: "h-10 px-4", sm: "h-8 rounded-lg px-3 text-xs", icon: "size-10 p-0" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export function Button({ className, variant, size, asChild=false, ...props }: ButtonProps) { const Comp=asChild?Slot:"button"; return <Comp className={cn(buttonVariants({variant,size}),className)} {...props}/>; }
