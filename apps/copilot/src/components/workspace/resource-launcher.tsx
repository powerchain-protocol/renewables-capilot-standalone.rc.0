"use client";
import * as React from "react";
import { BackpackIcon, CubeIcon, MobileIcon, Link2Icon } from "@radix-ui/react-icons";
import { BrandDropdown } from "@/components/ui/dropdown";
const resources=[
 {id:"balances",label:"Balances",description:"SOL, USDC, EURC and PWRC balances",icon:<BackpackIcon/>,href:"/dashboard?panel=balances"},
 {id:"tokens",label:"Tokens",description:"Token and mint details",icon:<CubeIcon/>,href:"/dashboard?panel=tokens"},
 {id:"pwa",label:"Field / PWA",description:"Open mobile and offline integration status",icon:<MobileIcon/>,href:"/dashboard?panel=pwa"},
 {id:"integrations",label:"Integrations",description:"RPC, oracle, AI and infrastructure providers",icon:<Link2Icon/>,href:"/dashboard?panel=integrations"},
];
export function ResourceLauncher(){return <BrandDropdown label="Resources" items={resources}/>}
