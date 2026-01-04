'use client';
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Custom Icons
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TiktokLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const SubstackLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.38 9.841-.719 13.56 1.56.42.24.6.72.18 1.26zm.12-3.36C15.222 8.4 8.822 8.16 5.142 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.139-1.26 11.219-.96 15.659 1.68.539.3.719 1.02.42 1.56-.3.48-1.02.66-1.499.36z"/>
  </svg>
);

const InstagramLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const GithubLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
)

const LinkedinLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
)

const PortfolioLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
)

const MailLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
)

export function FlyingDock() {
  const mouseX = useMotionValue(Infinity);

  const links = [
    { title: "Portfolio", icon: <PortfolioLogo className="h-full w-full" />, href: "https://thunderboy.vercel.app/", color: "text-yellow-400" },
    { title: "Mail", icon: <MailLogo className="h-full w-full" />, href: "mailto:alexthegreatdeveloper@gmail.com", color: "text-red-500" },
    { title: "GitHub", icon: <GithubLogo className="h-full w-full" />, href: "https://github.com/Alexthethunderboy", color: "text-white" },
    { title: "LinkedIn", icon: <LinkedinLogo className="h-full w-full" />, href: "https://www.linkedin.com/in/thunderboy", color: "text-blue-600" },
    { title: "X (Twitter)", icon: <XLogo className="h-full w-full" />, href: "https://x.com/xthethunderboy", color: "text-white" },
    { title: "Instagram", icon: <InstagramLogo className="h-full w-full" />, href: "https://www.instagram.com/heisthunderboy/", color: "text-pink-500" },
    { title: "TikTok", icon: <TiktokLogo className="h-full w-full" />, href: "https://www.tiktok.com/@alexthethunderboy", color: "text-cyan-400" },
    { title: "Substack", icon: <SubstackLogo className="h-full w-full" />, href: "https://themedgriot.substack.com/", color: "text-orange-500" },
    { title: "Spotify", icon: <SpotifyLogo className="h-full w-full" />, href: "/api/spotify", color: "text-green-500" },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-50 mx-auto w-full max-w-full px-2 sm:px-4 flex justify-center pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto mx-auto flex h-14 sm:h-16 items-center gap-1.5 sm:gap-2 rounded-full bg-neutral-900/90 border border-neutral-800 px-3 backdrop-blur-md overflow-x-auto no-scrollbar w-auto max-w-[95vw] sm:max-w-none sm:overflow-visible justify-start sm:justify-center ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {links.map((link) => (
          <IconContainer mouseX={mouseX} key={link.title} {...link} />
        ))}
      </motion.div>
    </div>
  );
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  color,
}: {
  mouseX: any;
  title: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link 
      href={href} 
      target={href.startsWith('http') ? "_blank" : undefined}
      className="shrink-0"
    >
      {/* Desktop View with Magnification */}
      <motion.div
        ref={ref}
        style={{ width, height }}
        className={cn(
          "aspect-square rounded-full bg-neutral-800/50 hidden sm:flex items-center justify-center relative hover:bg-neutral-800 transition-all group border border-white/5",
          color
        )}
      >
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 w-auto p-2 min-w-max rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-mono shadow-xl">
          {title}
        </span>
        <div className="h-5 w-5 sm:h-1/2 sm:w-1/2 flex items-center justify-center drop-shadow-[0_0_8px_currentColor]">{icon}</div>
      </motion.div>
      
      {/* Mobile View - Consistent size, all links visible/scrolling */}
      <div className={cn(
        "w-9 h-9 sm:hidden rounded-full bg-neutral-800 flex items-center justify-center active:bg-neutral-700 transition-colors border border-white/5 shadow-lg",
        color
      )}>
         <div className="h-5 w-5 flex items-center justify-center drop-shadow-[0_0_5px_currentColor]">{icon}</div>
      </div>
    </Link>
  );
}

