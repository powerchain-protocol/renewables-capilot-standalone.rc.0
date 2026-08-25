import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { SolanaSignIn } from "@/components/auth/solana-sign-in";

export default function SignInPage() {
  return <AuthShell title="Welcome back" description="Sign in with email, social identity, enterprise SSO or a verified Solana wallet.">
    <div className="space-y-4">
      <SolanaSignIn />
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#8a918d]"><span className="h-px flex-1 bg-[#e1e5e2]" />or<span className="h-px flex-1 bg-[#e1e5e2]" /></div>
      <SignIn routing="hash" appearance={{ elements: { rootBox: "w-full", cardBox: "shadow-none w-full", card: "shadow-none p-0 w-full" } }} />
    </div>
  </AuthShell>;
}
