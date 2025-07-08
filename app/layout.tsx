/**
 * @file layout.tsx
 *
 * @description
 * The root server layout for the app. This version is simplified to remove
 * the global auth() call that was causing middleware conflicts.
 */
// The "use server" directive has been removed from here.

import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import { Inter } from 'next/font/google';
import "./globals.css"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "QCare",
  description: "A real-time queue management system."
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Add the font's className to the body tag here
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

