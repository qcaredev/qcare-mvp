/**
 * @file hero.tsx
 * @description This client component provides the hero section for the landing page.
 * It has been updated to remove dependencies on the 'magicui' components.
 */
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Link
          href="https://github.com/mckaywrigley/o1-pro-template-system"
          className="bg-muted mb-4 inline-block rounded-full px-4 py-1.5 text-sm"
        >
          View the code on GitHub
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-balance text-6xl font-bold"
        >
          QCare
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="max-w-xl text-balance text-xl"
        >
          A real-time, WhatsApp-driven queue-tracking system.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Link href="/signup">
            <Button className="bg-blue-500 text-lg hover:bg-blue-600">
              <Rocket className="mr-2 size-5" />
              Get Started →
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="bg-muted mx-auto mt-20 w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <img
          src="/hero.png"
          alt="Hero"
          className="w-full rounded-md border shadow-lg"
        />
      </motion.div>
    </div>
  )
}
