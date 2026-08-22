import { NextResponse } from "next/server";
import { z } from "zod";
import { createDemoSession } from "@/lib/auth/demo-session";
const schema=z.object({role:z.enum(["demo","viewer","analyst","operator"]).default("demo")});
export async function POST(request:Request){
 if(process.env.NODE_ENV==="production"&&process.env.DEMO_AUTH_ENABLED!=="true")return NextResponse.json({error:"DEMO_DISABLED"},{status:403});
 const parsed=schema.safeParse(await request.json().catch(()=>({})));if(!parsed.success)return NextResponse.json({error:"INVALID_ROLE"},{status:400});
 const token=await createDemoSession(parsed.data.role);const base=(process.env.NODE_ENV==="production"?process.env.COPILOT_APP_URL:process.env.COPILOT_APP_LOCAL_URL)||process.env.COPILOT_APP_URL||process.env.COPILOT_APP_LOCAL_URL||"http://localhost:3001";const response=NextResponse.json({ok:true,role:parsed.data.role,redirect:`${base.replace(/\/$/,"")}/dashboard`});
 response.cookies.set("pc_demo_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:8*60*60,...(process.env.NODE_ENV==="production"?{domain:".powerchain.app"}:{})});return response;
}
