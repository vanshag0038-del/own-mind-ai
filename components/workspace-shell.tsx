"use client"

import { useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { AmbientField } from "@/components/workspace-effects"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"

/** One persistent shell keeps spacing, navigation and ambient motion consistent. */
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [navigationOpen, setNavigationOpen] = useState(false)

  return (
    <div className="workspace flex h-dvh overflow-hidden bg-background text-foreground">
      <a className="skip-link" href="#workspace-content">Skip to content</a>
      <AmbientField />
      <div className="desktop-navigation"><AppSidebar /></div>
      <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
        <SheetContent side="left" className="mobile-navigation gap-0 p-0">
          <SheetTitle className="sr-only">OwnMind AI navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigate your sovereign workspace.</SheetDescription>
          <AppSidebar onNavigate={() => setNavigationOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="page-shell">
        <TopBar onOpenNavigation={() => setNavigationOpen(true)} />
        <main key={pathname} id="workspace-content" tabIndex={-1} className="workspace-main flex-1 overflow-y-auto outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}
