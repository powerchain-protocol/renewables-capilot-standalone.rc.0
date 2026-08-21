"use client";
import { useMemo } from "react";
import { DEMO_PORTFOLIO, DEMO_USER } from "@/data/seed";
export function useDemo() { return useMemo(()=>({ enabled:true, user:DEMO_USER, portfolio:DEMO_PORTFOLIO }),[]); }
