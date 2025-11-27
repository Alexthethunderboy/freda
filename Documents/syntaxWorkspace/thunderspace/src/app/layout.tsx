import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AudioPlayer } from "@/components/features/AudioPlayer";
import { MobileLayoutManager } from "@/components/MobileLayoutManager";
import { DesktopNav } from "@/components/ui/DesktopNav";
import { GlobalSearch } from "@/components/features/GlobalSearch";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UnlearnNaija",
  description: "The Thunder Archive",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body 
        className="antialiased bg-background text-foreground font-body bg-noise transition-colors duration-500 overflow-x-hidden"
        suppressHydrationWarning
      >
        <Toaster 
          theme="dark" 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            },
            className: 'font-sans'
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <div className="hidden md:block">
              {/* Sidebar removed in favor of DesktopNav */}
            </div>
            <main className="md:pl-16 min-h-screen pb-16 md:pb-0">
              {children}
              {modal}
            </main>
            <MobileLayoutManager />
            <DesktopNav />
            <AudioPlayer />
            <GlobalSearch />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
