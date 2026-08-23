import * as React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-11 w-full rounded-[9px] border border-black/10 bg-white px-3.5 text-sm text-[#111513] outline-none transition placeholder:text-[#8a948f] focus:border-[#064e3b]/45 focus:ring-4 focus:ring-[#064e3b]/8 dark:border-white/10 dark:bg-white/[.04] dark:text-white ${className}`} {...props} />;
}
