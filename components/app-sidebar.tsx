"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Sparkles,
  Zap,
  ScrollText,
  Settings,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  href?: string
}

const navItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Knowledge", icon: Database, href: "/knowledge" },
  { label: "Decisions", icon: GitBranch, href: "/decisions" },
  { label: "Ask OwnMind", icon: Sparkles, href: "/ask" },
  { label: "Actions", icon: Zap, href: "/actions" },
  { label: "Audit Log", icon: ScrollText, href: "/audit-log" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const [selectedPlaceholder, setSelectedPlaceholder] = useState<string | null>(null)

  return (
    <aside className="workspace-sidebar flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="brand-emblem relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary/30 to-brand-secondary/20 ring-1 ring-inset ring-white/10">
          <Brain className="size-5 text-brand-primary-hover" />
          {/* Indigo ambient glow */}
          <span className="absolute inset-0 rounded-xl shadow-none" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">OwnMind AI</p>
          <p className="text-[11px] text-muted-foreground">Sovereign Second Brain</p>
        </div>
      </div>

      {/* Thin top-edge accent line */}
      <div className="mx-5 mb-2 h-px bg-gradient-to-r from-transparent via-brand-primary/25 to-transparent" />

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = selectedPlaceholder
            ? selectedPlaceholder === item.label
            : item.href
              ? pathname === item.href
              : false

          const className = cn(
            "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-brand-primary/12 text-text-primary"
              : "text-muted-foreground hover:bg-brand-primary/06 hover:text-text-secondary",
          )

          const content = (
            <>
              {/* Active left-edge indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-brand-primary shadow-none" />
              )}
              <Icon
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-brand-primary-hover"
                    : "text-muted-foreground group-hover:text-brand-primary-hover",
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-brand-primary shadow-none" />
              )}
            </>
          )

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => { setSelectedPlaceholder(null); onNavigate?.() }}
                aria-current={isActive ? "page" : undefined}
                className={className}
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedPlaceholder(item.label)}
              className={className}
            >
              {content}
            </button>
          )
        })}
      </nav>

      {/* Local AI status module */}
      <div className="local-module m-3 rounded-xl border border-sidebar-border bg-gradient-to-b from-brand-primary/06 to-transparent p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Local AI
        </p>
        <div className="mb-2.5 flex items-center gap-2">
          {/* Breathing dot animation */}
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/50" />
            <span className="relative inline-flex size-2 rounded-full bg-success animate-breathe" />
          </span>
          <span className="text-xs font-medium text-sidebar-foreground">Model Online</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-background-secondary/60 px-3 py-2">
          <span className="text-xs font-medium text-sidebar-foreground">Qwen3 4B</span>
          <span className="rounded-md bg-brand-secondary/12 px-2 py-0.5 text-[10px] font-medium text-brand-secondary ring-1 ring-inset ring-brand-secondary/20">
            Private Mode
          </span>
        </div>
      </div>
    </aside>
  )
}
