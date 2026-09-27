"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ShieldCheck, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopBar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const openSearch = () => {
    if (pathname === "/knowledge") document.querySelector<HTMLInputElement>('[aria-label="Search project knowledge"]')?.focus()
    else router.push("/knowledge?focus=search")
  }
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (pathname === "/knowledge") document.querySelector<HTMLInputElement>('[aria-label="Search project knowledge"]')?.focus()
        else router.push("/knowledge?focus=search")
      }
    }
    window.addEventListener("keydown", shortcut)
    return () => window.removeEventListener("keydown", shortcut)
  }, [router, pathname])
  return (
    <header className="workspace-topbar flex shrink-0 items-center justify-between gap-3 border-b border-border">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="mobile-menu" onClick={onOpenNavigation} aria-label="Open navigation"><Menu /></Button>
        <div className="local-first-badge flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          <span className="text-[10px] font-semibold tracking-[0.12em]">LOCAL-FIRST MODE</span>
        </div>
        <span className="hidden text-[11px] text-muted-foreground xl:inline">Project data stays on this device</span>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <Link onClick={(event) => { event.preventDefault(); openSearch() }} href="/knowledge?focus=search" className="topbar-search hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex" aria-label="Search knowledge">
          <Search aria-hidden="true" className="size-3.5" /><span className="text-xs">Search knowledge…</span>
          <kbd className="ml-6 rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </Link>
        <div className="workspace-avatar flex size-8 items-center justify-center rounded-full text-[10px] font-semibold">PT</div>
      </div>
    </header>
  )
}
