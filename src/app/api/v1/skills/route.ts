import { SKILLS } from "@/skills";
export function GET(){return Response.json({skills:SKILLS},{headers:{"cache-control":"public, max-age=300"}})}
