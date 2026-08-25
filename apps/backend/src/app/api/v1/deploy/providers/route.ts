const providers=[
 {id:"vercel",tier:"primary",supports:["web","copilot","backend"]},
 {id:"cloudflare",tier:"secondary",supports:["web","copilot","backend"]},
 {id:"aws",tier:"emergency",supports:["web","copilot","backend"]},
 {id:"hostinger",tier:"emergency",supports:["web","copilot"]},
 {id:"firebase",tier:"emergency",supports:["web"]},
] as const;
export function GET(){return Response.json({providers})}
