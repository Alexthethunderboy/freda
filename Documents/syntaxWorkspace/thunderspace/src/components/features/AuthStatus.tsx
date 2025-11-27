"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ThunderButton } from "@/components/ui/design-system";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { User } from "@supabase/supabase-js";

export function AuthStatus({ collapsed = false }: { collapsed?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) return <div className="w-8 h-8 animate-pulse bg-surface rounded-full" />;

  if (user) {
    return (
      <Link href={`/u/${user.user_metadata?.username || user.email?.split('@')[0]}`}>
        <div className={`flex items-center gap-2 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20 hover:bg-primary/30 transition-colors">
            {user.email?.[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-bold truncate max-w-[100px]">{user.user_metadata?.username || user.email?.split('@')[0]}</span>
              <span className="text-[10px] text-muted-foreground">Scholar</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href="/login">
      {collapsed ? (
        <div className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <LogIn className="w-4 h-4" />
        </div>
      ) : (
        <ThunderButton size="sm" variant="outline" className="w-full text-xs">
          Sign In
        </ThunderButton>
      )}
    </Link>
  );
}
