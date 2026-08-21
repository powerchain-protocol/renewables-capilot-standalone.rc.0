async function main(){
  if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for db:seed");
  const { prisma } = await import("../src/lib/prisma");
  console.log("PowerChain seed policy: create auth users through Supabase Auth, then seed only user-owned workspace records.");
  await prisma.$disconnect();
}
main().catch((error)=>{console.error(error);process.exit(1)});
