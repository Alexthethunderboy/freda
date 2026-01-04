import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { FlyingDock } from "@/components/layout/FlyingDock";
import { GlobalPlayer } from "@/components/spotify/GlobalPlayer";
import { VoltageCursor } from "@/components/ui/VoltageCursor";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "The ThunderSpace | Kelechi Alexander Ugoh",
  description: "Personal Hub: Psychonaut, Activist, Coder.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable} antialiased min-h-screen text-foreground select-none font-sans`}>
        <DynamicBackground />
        <Header />
        <main className="relative z-10 pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-32">
          {children}
        </main>
        <GlobalPlayer />
        <FlyingDock />
        <VoltageCursor />
      </body>
    </html>
  );
}
