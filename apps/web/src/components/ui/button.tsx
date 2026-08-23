import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
};

export function Button({ size = "md", className = "", ...props }: ButtonProps) {
  const height = size === "lg" ? "h-11 px-5" : size === "sm" ? "h-9 px-3" : "h-10 px-4";
  return <button className={`${height} inline-flex items-center justify-center rounded-[9px] bg-[#064e3b] text-sm font-medium text-white transition hover:bg-[#053f31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30 disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />;
}
