import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DevGallery – Developer Project Showcase",
  description:
    "Discover, share, and showcase developer projects. A community-driven platform for developers to exhibit their work.",
  keywords: ["developer", "projects", "portfolio", "showcase", "open source"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
