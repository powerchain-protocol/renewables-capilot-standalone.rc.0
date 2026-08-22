import { NextResponse, type NextRequest } from "next/server";
const PUBLIC_PREFIXES=["/_next","/api/health","/manifest.webmanifest","/favicon.ico"];
export function proxy(request:NextRequest){
  const {pathname}=request.nextUrl;
  if(PUBLIC_PREFIXES.some(p=>pathname.startsWith(p))||pathname.includes("."))return NextResponse.next();
  const hasBetterAuth=Boolean(request.cookies.get("better-auth.session_token")||request.cookies.get("__Secure-better-auth.session_token"));
  const hasDemo=Boolean(request.cookies.get("pc_demo_session"));
  if(!hasBetterAuth&&!hasDemo){
    const web=process.env.WEB_APP_URL||process.env.WEB_APP_LOCAL_URL||"http://localhost:3000";
    const target=new URL("/signin",web); target.searchParams.set("next",`${request.nextUrl.origin}/dashboard`); return NextResponse.redirect(target);
  }
  if(pathname==="/"){const url=request.nextUrl.clone();url.pathname="/dashboard";return NextResponse.redirect(url)}
  return NextResponse.next();
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
