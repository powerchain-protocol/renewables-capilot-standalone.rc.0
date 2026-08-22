import { cookies, headers } from "next/headers";
import { resolveRole } from "@powerchain/authz";
import { verifyDemoSession } from "@/lib/auth/demo-session";
export const dynamic="force-dynamic";
export async function GET(){
 const jar=await cookies();const demo=await verifyDemoSession(jar.get("pc_demo_session")?.value);if(demo)return Response.json({authenticated:true,kind:"demo",role:demo.role,user:{id:demo.sub,email:`${demo.role}@demo.powerchain.app`}},{headers:{"cache-control":"no-store"}});
 try{
  const {getAuth}=await import("@/auth/server");const session=await getAuth().api.getSession({headers:await headers()});if(!session)return Response.json({authenticated:false,role:"viewer"},{status:401});
  return Response.json({authenticated:true,kind:"account",role:resolveRole(session.user.email),user:{id:session.user.id,email:session.user.email,name:session.user.name}},{headers:{"cache-control":"no-store"}})
 }catch{return Response.json({authenticated:false,role:"viewer",status:"auth-unavailable"},{status:503})}
}
