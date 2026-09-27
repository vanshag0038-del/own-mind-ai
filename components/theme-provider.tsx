"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <TooltipProvider delay={250}>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
