"use client";

import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThunderButton } from "@/components/ui/design-system";
import { Lock } from "lucide-react";

export function AuthGuard({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) return null; // Or a spinner

  if (!session) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border border-dashed border-border rounded-lg bg-surface/50">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">Member Access Only</h3>
          <p className="text-sm text-muted-foreground">Sign in to access this content.</p>
        </div>
        <ThunderButton onClick={() => router.push('/login')} size="sm">
          Sign In
        </ThunderButton>
      </div>
    );
  }

  return <>{children}</>;
}
