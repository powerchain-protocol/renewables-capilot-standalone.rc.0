"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
export function ThemeToggle() { const { resolvedTheme, setTheme }=useTheme(); const [mounted,setMounted]=useState(false); useEffect(()=>setMounted(true),[]); if(!mounted) return <Button variant="ghost" size="icon" aria-label="Theme"><SunIcon/></Button>; const dark=resolvedTheme==="dark"; return <Button variant="ghost" size="icon" onClick={()=>setTheme(dark?"light":"dark")} aria-label="Toggle theme">{dark?<SunIcon/>:<MoonIcon/>}</Button>; }
