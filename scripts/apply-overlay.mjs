import fs from "node:fs";
import path from "node:path";
const overlay=path.resolve(import.meta.dirname,"..");
const target=path.resolve(process.argv[2]||".");
function mergeJson(targetFile,patchFile){if(!fs.existsSync(targetFile)||!fs.existsSync(patchFile))return;const current=JSON.parse(fs.readFileSync(targetFile,"utf8"));const patch=JSON.parse(fs.readFileSync(patchFile,"utf8"));current.scripts={...(current.scripts||{}),...(patch.scripts||{})};current.dependencies={...(current.dependencies||{}),...(patch.dependencies||{})};for(const[k,v]of Object.entries(patch)){if(!["scripts","dependencies"].includes(k))current[k]=v}fs.writeFileSync(targetFile,JSON.stringify(current,null,2)+"\n");console.log("merged",path.relative(target,targetFile))}
const skip=new Set(["README.md","package.patch.json","pnpm-workspace.patch.yaml","apps/web/package.patch.json","apps/copilot/package.patch.json"]);
for(const file of fs.readdirSync(overlay,{recursive:true,withFileTypes:true})){if(!file.isFile())continue;const abs=path.join(file.parentPath,file.name);const rel=path.relative(overlay,abs);if(rel.startsWith("scripts/")||skip.has(rel))continue;const dest=path.join(target,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(abs,dest);console.log("updated",rel)}
mergeJson(path.join(target,"package.json"),path.join(overlay,"package.patch.json"));
mergeJson(path.join(target,"apps/web/package.json"),path.join(overlay,"apps/web/package.patch.json"));
mergeJson(path.join(target,"apps/copilot/package.json"),path.join(overlay,"apps/copilot/package.patch.json"));
console.log("\nMerge pnpm-workspace.patch.yaml into pnpm-workspace.yaml, then run pnpm install --no-frozen-lockfile once.");
