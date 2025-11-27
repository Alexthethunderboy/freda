'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function PullToRefresh() {
  const router = useRouter();
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY > 0 && window.scrollY === 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) {
          setPullDistance(Math.min(diff * 0.5, 150)); // Dampening
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 100) {
        setIsRefreshing(true);
        await controls.start({ height: 60, opacity: 1 });
        
        // Simulate refresh
        router.refresh();
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsRefreshing(false);
        setPullDistance(0);
        setStartY(0);
        await controls.start({ height: 0, opacity: 0 });
      } else {
        setPullDistance(0);
        setStartY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pullDistance, router, controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ height: isRefreshing ? 60 : pullDistance }}
      animate={controls}
    >
      <div className="relative w-full h-full flex items-end justify-center pb-4">
        {/* Electric Charge Effect */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-thunder-yellow rounded-full shadow-[0_0_10px_rgba(255,200,0,0.8)]"
              animate={{
                height: isRefreshing ? [10, 30, 10] : Math.min(pullDistance / 3, 30),
                opacity: Math.min(pullDistance / 100, 1)
              }}
              transition={{
                duration: 0.5,
                repeat: isRefreshing ? Infinity : 0,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
