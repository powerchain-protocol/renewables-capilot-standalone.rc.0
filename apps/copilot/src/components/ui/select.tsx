"use client";
import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
export function BrandSelect({label,value,onChange,children,icon}:{label:string;value:string;onChange:(value:string)=>void;children:React.ReactNode;icon?:React.ReactNode}){return <label className="relative inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-2.5 text-xs font-medium shadow-sm dark:border-white/10 dark:bg-white/5"><span className="sr-only">{label}</span>{icon}<select aria-label={label} value={value} onChange={e=>onChange(e.target.value)} className="appearance-none bg-transparent pr-5 outline-none">{children}</select><ChevronDownIcon className="pointer-events-none absolute right-2 text-black/45 dark:text-white/45"/></label>}
