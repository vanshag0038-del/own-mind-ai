"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/navigation"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const [privateMode, setPrivateMode] = useState(true)

  return (
    <aside className="workspace-sidebar flex h-full shrink-0 flex-col">
      {/* Brand plate */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="brand-emblem relative">
          <svg viewBox="0 0 24 24" className="size-5 text-brand-primary" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" opacity=".45" />
            <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
          </svg>
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-success" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-xl text-sidebar-foreground">OwnMind</p>
          <p className="text-[10px] tracking-[.2em] text-muted-foreground uppercase">Sovereign ledger</p>
        </div>
      </div>

      <div className="mx-5 flex items-center justify-between">
        <span className="eyebrow">Index</span>
        <span className="index-label">vol. i</span>
      </div>

      {/* Table-of-contents navigation */}
      <nav aria-label="Main navigation" className="flex-1 px-3 pt-3">
        <ol className="flex flex-col">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const number = String(index + 1).padStart(2, "0")
            return (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        href={item.href}
                        onClick={() => onNavigate?.()}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group relative flex w-full items-center gap-3 px-2 py-2 text-[13px] transition-colors",
                          isActive ? "text-brand-primary" : "text-text-secondary hover:text-text-primary",
                        )}
                      />
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "index-label w-6 shrink-0 tabular-nums transition-colors",
                        isActive ? "text-brand-primary" : "group-hover:text-text-primary",
                      )}
                    >
                      {number}
                    </span>
                    <span className="leader flex-1">
                      <span className={cn("truncate font-medium", isActive && "font-display text-[15px]")}>
                        {item.label}
                      </span>
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          "size-3.5 shrink-0 transition-all duration-300",
                          isActive ? "text-brand-primary" : "text-muted-foreground opacity-60 group-hover:opacity-100",
                        )}
                      />
                    </span>
                    {isActive && (
                      <ArrowRight aria-hidden="true" className="absolute -left-1.5 size-3 text-brand-primary" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.description}</TooltipContent>
                </Tooltip>
              </li>
            )
          })}
        </ol>

        <div className="mt-5 flex items-center justify-between px-2 text-[11px] text-muted-foreground">
          <span>Jump anywhere</span>
          <span className="flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </div>
      </nav>

      {/* Local AI module: instrument panel */}
      <div className="local-module m-4 p-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Local AI</p>
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/50" />
            <span className="relative inline-flex size-2 rounded-full bg-success animate-breathe" />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <Cpu aria-hidden="true" className="size-4 text-brand-primary" />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-sidebar-foreground">Qwen3 4B</p>
            <p className="text-[10px] text-muted-foreground">Running on this device</p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Context window</span>
            <span className="tabular-nums">6.2k / 32k</span>
          </div>
          <Progress value={19} aria-label="Context window usage: 19%" className="h-1.5" />
        </div>

        <Separator className="my-3" />

        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-sidebar-foreground">Private mode</span>
            <span className="text-[10px] text-muted-foreground">{privateMode ? "No data leaves this device" : "Cloud fallback allowed"}</span>
          </span>
          <Switch size="sm" checked={privateMode} onCheckedChange={setPrivateMode} aria-label="Private mode" />
        </label>
      </div>
    </aside>
  )
}
