import * as React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[14px] border border-black/[.075] bg-white shadow-[0_1px_2px_rgba(0,0,0,.025)] dark:border-white/10 dark:bg-[#0d110f] ${className}`} {...props} />;
}
