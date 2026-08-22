import { NextResponse, type NextRequest } from "next/server";
const allowed=()=>new Set([process.env.WEB_APP_URL,process.env.WEB_APP_LOCAL_URL,process.env.COPILOT_APP_URL,process.env.COPILOT_APP_LOCAL_URL].filter(Boolean));
export function proxy(request:NextRequest){const origin=request.headers.get("origin");if(origin&& !allowed().has(origin))return NextResponse.json({error:"ORIGIN_NOT_ALLOWED"},{status:403});const response=NextResponse.next();response.headers.set("x-content-type-options","nosniff");response.headers.set("referrer-policy","strict-origin-when-cross-origin");return response}
export const config={matcher:["/api/:path*"]};
