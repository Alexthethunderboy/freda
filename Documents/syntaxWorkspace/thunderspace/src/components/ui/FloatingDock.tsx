'use client';

import { useMobileStore } from '@/lib/store/useMobileStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, User, Menu, Search, PlusCircle, Settings, Hash, Library } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function FloatingDock() {
  const { isScrollDown, isImmersiveMode, toggleMenu, isMenuOpen, setSearchOpen } = useMobileStore();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile to get username and role
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

  // Hide dock if scrolling down or in immersive mode
  const isVisible = !isScrollDown && !isImmersiveMode;

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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md md:hidden"
        >
          <div className="relative">
            {/* Glass Container */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl" />
            
            {/* Inner Content */}
            <div className="relative flex items-center justify-between px-4 py-3 gap-1">
              {navItems.map((item) => {
                const isActive = item.href ? pathname === item.href : false;
                const Icon = item.icon;

                if (item.action) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="relative group flex flex-col items-center justify-center"
                    >
                      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors duration-300 relative z-10" />
                    </button>
                  );
                }

                if (item.label === 'Profile' && username) {
                  return (
                    <Link 
                      key={item.label} 
                      href={item.href!}
                      className="relative group flex flex-col items-center justify-center px-2"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="dock-active-glow"
                          className="absolute inset-0 bg-thunder-yellow/20 blur-md rounded-full"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold uppercase transition-colors duration-300 relative z-10",
                        isActive 
                          ? "bg-primary/20 border-primary text-primary" 
                          : "bg-white/5 border-white/10 text-muted-foreground group-hover:border-white/30 group-hover:text-white"
                      )}>
                        {username.charAt(0)}
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="dock-active-dot"
                          className="absolute -bottom-2 w-1 h-1 bg-thunder-yellow rounded-full shadow-[0_0_8px_rgba(255,200,0,0.8)]"
                        />
                      )}
                    </Link>
                  );
                }

                return (
                  <Link 
                    key={item.label} 
                    href={item.href!}
                    className="relative group flex flex-col items-center justify-center px-2"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="dock-active-glow"
                        className="absolute inset-0 bg-thunder-yellow/20 blur-md rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <Icon 
                      className={cn(
                        "w-6 h-6 transition-colors duration-300 relative z-10",
                        isActive ? "text-thunder-yellow" : "text-muted-foreground group-hover:text-white"
                      )} 
                    />
                    {isActive && (
                      <motion.div
                        layoutId="dock-active-dot"
                        className="absolute -bottom-2 w-1 h-1 bg-thunder-yellow rounded-full shadow-[0_0_8px_rgba(255,200,0,0.8)]"
                      />
                    )}
                  </Link>
                );
              })}

              {/* Menu Trigger */}
              <button 
                onClick={toggleMenu}
                className="relative group flex flex-col items-center justify-center ml-2 pl-4 border-l border-white/10"
              >
                <Menu 
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    isMenuOpen ? "text-thunder-yellow" : "text-muted-foreground group-hover:text-white"
                  )} 
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
