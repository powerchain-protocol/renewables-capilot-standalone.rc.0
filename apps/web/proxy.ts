import { NextResponse, type NextRequest } from "next/server";
const PUBLIC=["/","/about","/pricing","/legal","/signin","/signup","/auth","/get-started","/api/auth","/api/health","/api/v1/demo-login"];
export function proxy(request:NextRequest){
  const {pathname}=request.nextUrl;
  if(pathname.startsWith("/_next")||pathname.includes(".")||PUBLIC.some(route=>pathname===route||pathname.startsWith(`${route}/`)))return NextResponse.next();
  return NextResponse.next();
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
