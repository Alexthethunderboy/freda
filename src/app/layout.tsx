import type { Metadata } from "next";
import { Playfair_Display, Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-poppins" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });

export const metadata: Metadata = {
  title: "Freda · Happy Birthday",
  description: "A birthday website for Simisola Fredamary Adewunmi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${dancing.variable}`}>
      <body className="min-h-screen text-textPrimary font-poppins antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
