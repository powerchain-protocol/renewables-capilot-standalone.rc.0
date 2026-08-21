import type { AppProps } from "next/app";
import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";
export default function PagesApp({Component,pageProps}:AppProps){return <AppProviders><Component {...pageProps}/></AppProviders>}
