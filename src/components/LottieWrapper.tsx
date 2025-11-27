import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LottieRefCurrentProps } from 'lottie-react';

interface LottieWrapperProps {
  animationData: unknown;
  play?: boolean;
  loop?: boolean;
  className?: string;
  alt?: string;
}

const Lottie = dynamic(() => import('lottie-react').then(mod => mod.default), { ssr: false });

const LottieWrapper: React.FC<LottieWrapperProps> = ({ animationData, play = true, loop = true, className, alt }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handleChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener?.('change', handleChange);
    return () => mq.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { root: null, threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lottieRef.current) return;
    const shouldPlay = play && isVisible && !prefersReducedMotion;
    if (shouldPlay) lottieRef.current.play();
    else lottieRef.current.pause();
  }, [play, isVisible, prefersReducedMotion]);

  if (!animationData) return <div ref={containerRef} className={className} aria-label={alt} role="img">Loading…</div>;

  return (
    <div ref={containerRef} className={className} aria-label={alt} role="img">
      <Lottie lottieRef={lottieRef} animationData={animationData} loop={!prefersReducedMotion && loop} />
    </div>
  );
};

export default LottieWrapper;
