import { resolveRole } from "@powerchain/authz";
export const dynamic="force-dynamic";
export async function GET(request:Request){
  const web=(process.env.WEB_APP_URL??process.env.WEB_APP_LOCAL_URL??"http://localhost:3000").replace(/\/$/,"");
  const response=await fetch(`${web}/api/v1/authz/session`,{headers:{cookie:request.headers.get("cookie")??""},cache:"no-store"}).catch(()=>null);
  if(!response?.ok)return Response.json({authenticated:false,role:"viewer",status:"unavailable"},{status:401});
  const body=await response.json();
  return Response.json({...body,role:body.role??resolveRole(body.user?.email)},{headers:{"cache-control":"no-store"}})
}
