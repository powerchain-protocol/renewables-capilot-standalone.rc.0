const trim=(value:string)=>value.replace(/\/$/,"");
export const WEB_URL=trim(process.env.NEXT_PUBLIC_WEB_APP_URL||process.env.WEB_APP_LOCAL_URL||"http://localhost:3000");
export const COPILOT_URL=trim(process.env.NEXT_PUBLIC_COPILOT_APP_URL||process.env.COPILOT_APP_LOCAL_URL||process.env.CAPILOT_APP_URL||"http://localhost:3001");
export const BACKEND_URL=trim(process.env.NEXT_PUBLIC_BACKEND_APP_URL||process.env.BACKEND_APP_LOCAL_URL||"http://localhost:3002");
