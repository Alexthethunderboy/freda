import { ThunderCard, ThunderButton } from "@/components/ui/design-system";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ThunderCard className="w-full max-w-md p-8 text-center border-red-500/20 bg-red-500/5 backdrop-blur-sm">
        <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          There was a problem signing you in. The link may have expired or is invalid.
        </p>
        <Link href="/login">
          <ThunderButton className="w-full">
            Try Again
          </ThunderButton>
        </Link>
      </ThunderCard>
    </div>
  );
}
