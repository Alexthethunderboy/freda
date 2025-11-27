'use client';

import { useEffect, useRef } from 'react';
import { useMobileStore } from '@/lib/store/useMobileStore';
import { FloatingDock } from './ui/FloatingDock';
import { ShatteredMenu } from './ui/ShatteredMenu';

export function MobileLayoutManager() {
  const { setScrollDown } = useMobileStore();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScrollDown(true);
      } else {
        setScrollDown(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollDown]);

  return (
    <>
      <FloatingDock />
      <ShatteredMenu />
    </>
  );
}
