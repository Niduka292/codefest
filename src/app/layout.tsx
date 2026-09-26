import type { Metadata } from "next";
import { Inter, Orbitron, Space_Grotesk } from "next/font/google";
import { BlinkingDots } from "@/components/BlinkingDots";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CODEXIA | Voyager-1 Transmission",
  description: "A classified interstellar computer science mission.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} h-full scroll-smooth antialiased`}
    >
      <body className="mission-shell relative min-h-full bg-void text-white">
        <BlinkingDots />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
