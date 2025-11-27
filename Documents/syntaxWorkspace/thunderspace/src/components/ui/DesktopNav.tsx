'use client';

import { Home, Compass, Search, User, PlusCircle, Hash, Settings, Library } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMobileStore } from '@/lib/store/useMobileStore';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';

export function DesktopNav() {
  const pathname = usePathname();
  const { setSearchOpen } = useMobileStore();
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      }
    }
    getUser();
  }, [supabase]);

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Hash, label: 'Topics', href: '/topics' },
    { icon: Library, label: 'Collections', href: '/collections' },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    { icon: PlusCircle, label: 'Upload', href: '/upload' },
    ...(isAdmin ? [{ icon: Settings, label: 'Admin', href: '/admin' }] : []),
    { icon: User, label: 'Profile', href: username ? `/u/${username}` : '/login' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-black/50 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col items-center py-8 z-40">
      {/* Logo */}
      <div className="mb-12">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-8 w-full px-2">
        {navItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="group relative flex items-center justify-center w-full aspect-square rounded-xl transition-all hover:bg-white/5"
                title={item.label}
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
              </button>
            );
          }

          if (item.label === 'Profile' && username) {
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "group relative flex items-center justify-center w-full aspect-square rounded-xl transition-all",
                  isActive ? "bg-white/10 text-thunder-yellow" : "hover:bg-white/5 text-muted-foreground hover:text-white"
                )}
                title={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-active"
                    className="absolute left-0 w-1 h-8 bg-thunder-yellow rounded-r-full"
                  />
                )}
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-xs font-bold text-primary uppercase">
                  {username.charAt(0)}
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "group relative flex items-center justify-center w-full aspect-square rounded-xl transition-all",
                isActive ? "bg-white/10 text-thunder-yellow" : "hover:bg-white/5 text-muted-foreground hover:text-white"
              )}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="desktop-nav-active"
                  className="absolute left-0 w-1 h-8 bg-thunder-yellow rounded-r-full"
                />
              )}
              <Icon className="w-5 h-5 transition-colors" />
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto">
        {/* Logout removed as requested */}
      </div>
    </aside>
  );
}
