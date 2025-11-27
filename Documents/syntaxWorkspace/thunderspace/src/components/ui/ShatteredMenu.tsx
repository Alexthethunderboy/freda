'use client';

import { useMobileStore } from '@/lib/store/useMobileStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function ShatteredMenu() {
  const { isMenuOpen, setMenuOpen } = useMobileStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      }
    }
    checkAdmin();
  }, [supabase]);

  const menuItems = [
    { label: 'The Archive', href: '/', delay: 0.1 },
    { label: 'Topics', href: '/topics', delay: 0.2 },
    { label: 'Authors', href: '/authors', delay: 0.3 },
    { label: 'About', href: '/about', delay: 0.4 },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin', delay: 0.5 }] : []),
  ];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-background/95 backdrop-blur-3xl md:hidden flex flex-col"
        >
          {/* Close Button */}
          <div className="absolute top-6 right-6 z-50">
            <button 
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
            {menuItems.map((item) => (
              <motion.div
                key={item.label}
                initial={{ x: -50, opacity: 0, rotate: -5 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: 50, opacity: 0, rotate: 5 }}
                transition={{ 
                  delay: item.delay,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <Link 
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="group block relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-between p-6 bg-card/50 border border-white/5 backdrop-blur-md transform transition-transform group-hover:scale-[1.02] group-active:scale-[0.98]">
                    {/* Shard Background Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <span className="text-3xl font-headings font-bold text-foreground group-hover:text-thunder-yellow transition-colors">
                      {item.label}
                    </span>
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-thunder-yellow opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 text-center"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              UnlearnNaija Mobile v2.0
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
