import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/api/v1/cors";
export function OPTIONS(request:NextRequest){return new NextResponse(null,{status:204,headers:corsHeaders(request.headers.get("origin"))});}
export function GET(request:NextRequest){return NextResponse.json({ok:true,version:"v1"},{headers:corsHeaders(request.headers.get("origin"))});}
