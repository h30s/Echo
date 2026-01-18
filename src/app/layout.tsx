import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echo - The Infinite Context City Brain",
  description: "The memory layer for sentient cities. 10x context compression so the City Brain never forgets. Built for NexHacks 2026.",
  keywords: ["AI", "City Brain", "Token Company", "bear-1", "Gemini", "Compression", "Smart City"],
  authors: [{ name: "Solo Hacker" }],
  openGraph: {
    title: "Echo - The Infinite Context City Brain",
    description: "The memory layer for sentient cities. 10x context compression so the City Brain never forgets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
