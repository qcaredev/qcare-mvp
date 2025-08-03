import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QCare",
  description: "A real-time queue management system.",
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <TailwindIndicator />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
