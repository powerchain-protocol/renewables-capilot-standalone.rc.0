const production=process.env.NODE_ENV==="production";
const trim=(value:string)=>value.replace(/\/$/,"");
function pick(prod:string|undefined,local:string|undefined,fallback:string){return trim((production?prod:local)||prod||local||fallback)}
export const WEB_URL=pick(process.env.WEB_APP_URL,process.env.WEB_APP_LOCAL_URL,"http://localhost:3000");
export const COPILOT_URL=pick(process.env.COPILOT_APP_URL,process.env.COPILOT_APP_LOCAL_URL||process.env.CAPILOT_APP_URL,"http://localhost:3001");
export const BACKEND_URL=pick(process.env.BACKEND_APP_URL,process.env.BACKEND_APP_LOCAL_URL,"http://localhost:3002");
