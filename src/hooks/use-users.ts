"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
export function useUsers() { const[user,setUser]=useState<{id:string;email?:string}|null>(null); const[loading,setLoading]=useState(true); useEffect(()=>{const supabase=createSupabaseBrowserClient(); if(!supabase){setLoading(false);return;} void supabase.auth.getUser().then(({data})=>{setUser(data.user?{id:data.user.id,email:data.user.email}:null);setLoading(false)});},[]); return { user, loading }; }
