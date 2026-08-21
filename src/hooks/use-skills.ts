"use client";
import { SKILLS } from "@/skills/registry";
export function useSkills() { return { skills:SKILLS, enabled:SKILLS.filter(s=>s.enabled) }; }
