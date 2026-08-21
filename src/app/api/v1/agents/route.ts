import { AGENTS } from "@/agents";
export function GET(){return Response.json({agents:AGENTS},{headers:{"cache-control":"public, max-age=300"}})}
