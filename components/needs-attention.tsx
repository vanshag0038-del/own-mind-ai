"use client"

import { useState } from "react"
import { ArrowUpRight, Clock, TriangleAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HoldToApprove } from "@/components/approval/hold-to-approve"
import { StampSurface, type StampVerdict } from "@/components/approval/approval-stamp"
import { demoDateDecision } from "@/lib/overview-data"
import { cn } from "@/lib/utils"

const attentionItems = [
  {
    id: "deployment-conflict",
    title: "Decision Conflict",
    description: "Deployment method has conflicting notes",
    status: "conflict",
    action: "Review Evidence",
    icon: TriangleAlert,
  },
  {
    id: "demo-plan",
    title: "Pending Action",
    description: `Update demo plan to ${demoDateDecision.current}`,
    status: "pending",
    action: "Review Action",
    icon: Clock,
  },
] as const

export function NeedsAttention() {
  const [verdicts, setVerdicts] = useState<Record<string, StampVerdict>>({})
  const [openId, setOpenId] = useState<string | null>(null)

  const decide = (id: string, verdict: StampVerdict) => {
    setVerdicts((prev) => ({ ...prev, [id]: verdict }))
    setOpenId(null)
  }

  return (
    <section aria-labelledby="attention-heading" className="mt-10 animate-card-enter stagger-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="attention-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted"
        >
          Needs Your Attention
        </h2>
        <span className="text-[11px] text-text-muted">2 items</span>
      </div>

      <ul className="divide-y divide-[rgba(255,255,255,0.06)] surface-card/80">
        {attentionItems.map(({ id, title, description, status, action, icon: Icon }) => (
          <li key={id}>
          <StampSurface
            verdict={verdicts[id] ?? null}
            fresh={Boolean(verdicts[id])}
            className={cn(
              "flex flex-wrap items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-brand-primary/[0.04]",
              verdicts[id] && "pr-40",
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                status === "conflict"
                  ? "bg-warning/10 text-warning ring-warning/15"
                  : "bg-brand-secondary/10 text-brand-secondary ring-brand-secondary/15",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xs font-medium text-text-primary">{title}</h3>
                <Badge variant={status}>{status.toUpperCase()}</Badge>
              </div>
              <p className="text-xs leading-relaxed text-text-muted">{description}</p>
            </div>

            {!verdicts[id] && (
            <Dialog open={openId === id} onOpenChange={(open) => setOpenId(open ? id : null)}>
              <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                {action}
                <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <Badge variant={status}>{status.toUpperCase()}</Badge>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {status === "pending" ? (
                  <dl className="flex flex-col gap-4 py-2 text-sm">
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-text-muted">Decision change</dt>
                      <dd>
                        <span className="text-text-muted line-through">{demoDateDecision.previous}</span>
                        {" → "}
                        <span className="font-medium text-brand-primary-hover">{demoDateDecision.current}</span>
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-text-muted">Reason</dt>
                      <dd>{demoDateDecision.reason}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-text-muted">Source</dt>
                      <dd className="break-words">{demoDateDecision.source} · {demoDateDecision.date}</dd>
                    </div>
                  </dl>
                ) : (
                  <div className="flex flex-col gap-2 py-2">
                    <p className="text-sm leading-relaxed text-text-secondary">
                      Review the conflicting notes before choosing the current deployment decision.
                    </p>
                    <p className="text-xs leading-relaxed text-text-muted">
                      Source excerpts are not included in this static preview. No evidence has been loaded or resolved.
                    </p>
                  </div>
                )}

                <DialogFooter showCloseButton={status !== "pending"}>
                  {status === "pending" ? (
                    <>
                      <p className="mr-auto self-center text-[11px] text-text-muted">Preview only · Nothing is saved</p>
                      <Button variant="ghost" size="sm" onClick={() => decide(id, "denied")} className="text-approval-deny-fg hover:text-approval-deny-fg">
                        Deny
                      </Button>
                      <HoldToApprove onComplete={() => decide(id, "approved")} />
                    </>
                  ) : (
                    <p className="mr-auto self-center text-[11px] text-text-muted">
                      Static preview · No changes are saved
                    </p>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            )}
          </StampSurface>
          </li>
        ))}
      </ul>
    </section>
  )
}
