const DEFAULT_ALLOWED = ["http://localhost:3000"];
export function corsHeaders(origin?: string | null) {
  const allowed = (process.env.CORS_ALLOWED_ORIGINS ?? DEFAULT_ALLOWED.join(",")).split(",").map(v=>v.trim()).filter(Boolean);
  const accepted = origin && allowed.includes(origin) ? origin : allowed[0];
  return { "access-control-allow-origin": accepted ?? "null", "access-control-allow-methods":"GET,POST,OPTIONS", "access-control-allow-headers":"content-type,authorization", "access-control-max-age":"86400", "vary":"Origin" };
}
