"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThunderButton, ThunderCard } from "@/components/ui/design-system";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <ThunderCard className="w-full max-w-md p-8 text-center border-border bg-surface/50 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to <span className="font-mono text-foreground">{email}</span>.
          </p>
          <Link href="/login">
            <ThunderButton variant="outline" className="w-full">
              Back to Sign In
            </ThunderButton>
          </Link>
        </ThunderCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-noise">
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-96 bg-linear-to-b from-primary/5 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
      <ThunderCard className="w-full max-w-md p-8 border-border bg-surface/50 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground">Already have an account? Let&apos;s get you signed in.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-background border border-border px-4 py-2 text-foreground outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-background border border-border px-4 py-2 text-foreground outline-none focus:border-primary transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 space-y-4">
            <ThunderButton type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
            </ThunderButton>
            
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </ThunderCard>
      </div>
    </div>
  );
}
