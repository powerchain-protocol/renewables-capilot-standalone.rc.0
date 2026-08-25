import "dotenv/config";
function value(name:string){return process.env[name]?.trim()||""}
async function main(){
 const checks=[
  ["NODE_ENV",value("NODE_ENV")||"development"],
  ["WEB",value("WEB_APP_URL")||value("WEB_APP_LOCAL_URL")||"http://localhost:3000"],
  ["COPILOT",value("COPILOT_APP_URL")||value("CAPILOT_APP_URL")||value("COPILOT_APP_LOCAL_URL")||"http://localhost:3001"],
  ["BACKEND",value("BACKEND_APP_URL")||value("BACKEND_APP_LOCAL_URL")||"http://localhost:3002"],
  ["SOLANA_CLUSTER",value("NEXT_PUBLIC_SOLANA_CLUSTER")||"devnet"],
 ];
 console.log("PowerChain config doctor");for(const[row,val]of checks)console.log(`${row}: ${val}`);
 if(value("NODE_ENV")==="developemnt")throw new Error("NODE_ENV typo: use development");
 if((value("COPILOT_APP_LOCAL_URL")||value("CAPILOT_APP_URL")).includes("http;//"))throw new Error("Copilot URL typo: use http://");
}
main().catch(error=>{console.error(error instanceof Error?error.message:error);process.exit(1)});
