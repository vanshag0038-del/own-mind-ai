"use client"

import { useState } from "react"
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  FileText,
  Lock,
  Code,
  Check,
  X,
  UserCheck,
  Terminal,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  initialSummaryStats,
  initialPendingActions,
  initialHistoryRecords,
  type ActionItem,
  type ActionHistoryRecord,
  type RiskLevel,
} from "@/lib/actions-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoldToApprove } from "@/components/approval/hold-to-approve"
import { StampSurface } from "@/components/approval/approval-stamp"

export function ActionsPage() {
  const [stats, setStats] = useState(initialSummaryStats)
  const [pendingActions, setPendingActions] = useState<ActionItem[]>(initialPendingActions)
  const [history, setHistory] = useState<ActionHistoryRecord[]>(initialHistoryRecords)
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null)

  // Drawer / modal states
  const [isExecuting, setIsExecuting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<string>("Not required")
  const [showRejectionOptions, setShowRejectionOptions] = useState(false)
  const [highRiskConfirmed, setHighRiskConfirmed] = useState(false)
  const [freshStamps, setFreshStamps] = useState<Set<string>>(() => new Set())

  const handleOpenReview = (action: ActionItem) => {
    setSelectedAction({ ...action })
    setShowRejectionOptions(false)
    setHighRiskConfirmed(false)
  }

  const handleCloseReview = () => {
    setSelectedAction(null)
    setShowRejectionOptions(false)
    setHighRiskConfirmed(false)
  }

  const syncSelected = (updated: ActionItem) =>
    setSelectedAction((prev) => (prev?.id === updated.id ? updated : prev))

  const handleApprove = (target: ActionItem | null = selectedAction) => {
    if (!target || target.status !== "WAITING_APPROVAL") return
    const fromDrawer = target.id === selectedAction?.id
    if (fromDrawer) setIsExecuting(true)

    setTimeout(() => {
      if (fromDrawer) setIsExecuting(false)
      const auditId = target.auditId || `AUD-${Math.floor(1000 + Math.random() * 9000)}`
      const updatedAction: ActionItem = {
        ...target,
        status: "EXECUTED",
        executionResult: "Task created successfully",
        auditId,
      }
      syncSelected(updatedAction)
      setFreshStamps((prev) => new Set(prev).add(updatedAction.id))

      // Update pending actions list
      setPendingActions((prev) =>
        prev.map((a) => (a.id === updatedAction.id ? updatedAction : a)),
      )

      // Increment stats
      setStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        approvedToday: prev.approvedToday + 1,
        completed: prev.completed + 1,
      }))

      // Prepend to history
      const newHistoryItem: ActionHistoryRecord = {
        id: `hist-${Date.now()}`,
        time: "Just now",
        action: target.title,
        decision: target.title.includes("Demo") ? "Demo Date" : "Data Storage",
        approval: "Approved",
        result: "Completed",
        auditId,
        riskLevel: target.riskLevel,
      }
      setHistory((prev) => [newHistoryItem, ...prev])
    }, 450)
  }

  const handleReject = (target: ActionItem | null = selectedAction, reason: string = rejectionReason) => {
    if (!target || target.status !== "WAITING_APPROVAL") return
    const selectedActionForHistory = target

    const updatedAction: ActionItem = {
      ...target,
      status: "REJECTED",
      rejectionReason: reason,
      executionResult: "No action taken",
    }
    syncSelected(updatedAction)
    setFreshStamps((prev) => new Set(prev).add(updatedAction.id))

    // Update pending actions list
    setPendingActions((prev) =>
      prev.map((a) => (a.id === updatedAction.id ? updatedAction : a)),
    )

    // Increment stats
    setStats((prev) => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1),
      rejected: prev.rejected + 1,
    }))

    // Prepend to history
    const newHistoryItem: ActionHistoryRecord = {
      id: `hist-${Date.now()}`,
      time: "Just now",
      action: selectedActionForHistory.title,
      decision: selectedActionForHistory.title.includes("Demo") ? "Demo Date" : "Data Storage",
      approval: "Rejected",
      result: "No action taken",
      auditId: selectedActionForHistory.auditId || "AUD-REJ",
      riskLevel: selectedActionForHistory.riskLevel,
    }
    setHistory((prev) => [newHistoryItem, ...prev])
    setShowRejectionOptions(false)
  }

  const getRiskBadge = (level: RiskLevel) => {
    if (level === "LOW") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
          <span className="size-1 rounded-full bg-success" />
          LOW RISK
        </span>
      )
    }
    if (level === "MEDIUM") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
          <span className="size-1 rounded-full bg-warning" />
          MEDIUM RISK
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-danger/30 bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
        <span className="size-1 rounded-full bg-danger" />
        HIGH RISK
      </span>
    )
  }

  return (
    <div className="page-container animate-page-enter">
      {/* ─── PAGE HEADER ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-medium text-text-muted">
            <span className="size-1.5 rounded-full bg-brand-secondary" />
            Execution Governance
          </div>
          <Badge
            variant="outline"
            className="border-success/30 bg-success/[0.08] text-success font-medium text-[11px] gap-1.5 py-1 px-3"
          >
            <UserCheck className="size-3.5" />
            Human-in-the-Loop
          </Badge>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Action{" "}
          <span className="bg-gradient-to-r from-brand-secondary via-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Center
          </span>
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-text-muted">
          Review, approve and control every action before OwnMind executes it.
        </p>

        {/* ─── CORE PRINCIPLE: AI NEVER HAS DIRECT EXECUTION AUTHORITY ──────── */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-secondary/20 bg-gradient-to-r from-brand-secondary/[0.07] via-background to-accent-cyan/[0.05] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-brand-secondary/20 text-brand-secondary ring-1 ring-inset ring-brand-secondary/30">
                <Lock className="size-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                  Core Security Invariant
                </p>
                <p className="text-xs font-semibold text-text-primary">
                  AI NEVER HAS DIRECT EXECUTION AUTHORITY
                </p>
              </div>
            </div>
            <span className="text-[11px] text-text-muted">
              Every tool call requires explicit human approval
            </span>
          </div>

          {/* Stepper Pipeline Flow */}
          <div className="signal-flow mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background-secondary/60 p-2.5 text-[11px] text-text-muted">
            <span className="font-semibold text-text-primary">MODEL OUTPUT</span>
            <ArrowRight className="size-3 text-text-muted/40" />
            <span className="font-semibold text-text-primary">STRUCTURED INTENT</span>
            <ArrowRight className="size-3 text-text-muted/40" />
            <span className="font-semibold text-brand-secondary">POLICY GATE</span>
            <ArrowRight className="size-3 text-text-muted/40" />
            <span className="font-semibold text-success">USER APPROVAL</span>
            <ArrowRight className="size-3 text-text-muted/40" />
            <span className="font-semibold text-brand-primary-hover">TOOL EXECUTION</span>
            <ArrowRight className="size-3 text-text-muted/40" />
            <span className="font-semibold text-text-primary">AUDIT LOG</span>
          </div>
        </div>
      </div>

      {/* ─── TOP SUMMARY CARDS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Pending Actions */}
        <div className="surface-card metric-card card-accent-gold group relative overflow-hidden rounded-2xl border border-brand-secondary/20 bg-surface p-5 ring-1 ring-transparent transition-all duration-300 hover:ring-brand-secondary/30">
          <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-brand-secondary/15 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-secondary/10 text-brand-secondary ring-1 ring-inset ring-brand-secondary/20">
            <Clock className="size-5" />
          </div>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">{stats.pending}</p>
          <p className="mt-1 text-sm text-text-muted">Pending Actions</p>
        </div>

        {/* Approved Today */}
        <div className="surface-card metric-card card-accent-success group relative overflow-hidden rounded-2xl border border-success/20 bg-surface p-5 ring-1 ring-transparent transition-all duration-300 hover:ring-success/30">
          <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-success/15 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-success/10 text-success ring-1 ring-inset ring-success/20">
            <CheckCircle2 className="size-5" />
          </div>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">{stats.approvedToday}</p>
          <p className="mt-1 text-sm text-text-muted">Approved Today</p>
        </div>

        {/* Rejected */}
        <div className="surface-card metric-card card-accent-danger group relative overflow-hidden rounded-2xl border border-danger/20 bg-surface p-5 ring-1 ring-transparent transition-all duration-300 hover:ring-danger/30">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-danger/10 text-danger ring-1 ring-inset ring-danger/20">
            <XCircle className="size-5" />
          </div>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">{stats.rejected}</p>
          <p className="mt-1 text-sm text-text-muted">Rejected</p>
        </div>

        {/* Completed */}
        <div className="surface-card metric-card group relative overflow-hidden rounded-2xl border border-brand-primary/20 bg-surface p-5 ring-1 ring-transparent transition-all duration-300 hover:ring-brand-primary/30">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary-hover ring-1 ring-inset ring-brand-primary/20">
            <Zap className="size-5" />
          </div>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">{stats.completed}</p>
          <p className="mt-1 text-sm text-text-muted">Completed</p>
        </div>
      </div>

      {/* ─── PENDING ACTIONS SECTION ────────────────────────────────────────── */}
      <section className="mt-12" aria-labelledby="pending-actions-heading">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2
              id="pending-actions-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted"
            >
              Pending Actions
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Actions proposed by OwnMind awaiting explicit human authorization
            </p>
          </div>
          <Badge variant="pending">
            {pendingActions.filter((a) => a.status === "WAITING_APPROVAL").length} Awaiting Review
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {pendingActions.map((action) => {
            const isExecuted = action.status === "EXECUTED"
            const isRejected = action.status === "REJECTED"
            const isHighRisk = action.riskLevel === "HIGH"

            return (
              <StampSurface
                key={action.id}
                verdict={isExecuted ? "approved" : isRejected ? "denied" : null}
                fresh={freshStamps.has(action.id)}
                className={cn(
                  "flex flex-col justify-between rounded-3xl border bg-surface/80 p-6 transition-colors duration-200",
                  isExecuted
                    ? "border-success/30 bg-success/[0.03]"
                    : isRejected
                      ? "border-border bg-muted/10 opacity-70"
                      : isHighRisk
                        ? "border-danger/25 bg-danger/[0.03] hover:border-danger/40"
                        : "border-border hover:border-accent-purple/40 hover:shadow-lg",
                )}
              >
                <div>
                  {/* Card Header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {getRiskBadge(action.riskLevel)}
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                          <Check className="size-2.5" />
                          POLICY PASSED
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground tracking-tight">
                        {action.title}
                      </h3>
                    </div>

                    <Badge
                      variant={
                        isExecuted
                          ? "current"
                          : isRejected
                            ? "replaced"
                            : "pending"
                      }
                    >
                      {isExecuted
                        ? "EXECUTED"
                        : isRejected
                          ? "REJECTED"
                          : "WAITING FOR APPROVAL"}
                    </Badge>
                  </div>

                  {/* High Risk Notice */}
                  {isHighRisk && !isExecuted && !isRejected && (
                    <div className="mb-3.5 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                      <AlertTriangle className="size-4 shrink-0 text-danger" />
                      <span>Manual confirmation required before execution.</span>
                    </div>
                  )}

                  {/* Task details if present */}
                  {action.taskSummary && (
                    <div className="mb-3 rounded-xl border border-border bg-background/50 p-3 text-xs">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                        Task Summary
                      </p>
                      <p className="mt-0.5 font-medium text-text-primary">{action.taskSummary}</p>
                      {action.suggestedDueDate && (
                        <p className="mt-1 text-[11px] text-text-muted">
                          Suggested Due Date:{" "}
                          <strong className="text-foreground">{action.suggestedDueDate}</strong>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reason */}
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Reason
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-primary/90">
                      {action.reason}
                    </p>
                  </div>

                  {/* Evidence */}
                  <div className="mb-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Evidence
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {action.evidence.map((ev, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/90 px-2.5 py-1 text-[11px] text-text-muted"
                        >
                          <FileText className="size-3 text-brand-primary-hover" />
                          <span className="font-medium text-text-primary">{ev.source}</span>
                          <span className="text-[10px]">({ev.date})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposed Changes */}
                  <div className="mb-4 rounded-xl border border-border bg-background-secondary/60 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                      Proposed Changes
                    </p>
                    <ul className="space-y-1 text-xs text-text-secondary">
                      {action.proposedChanges.map((change, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="size-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Post-execution or Post-rejection notice */}
                  {isExecuted && (
                    <div className="mb-3 flex items-center justify-between rounded-xl border border-success/25 bg-success/10 px-3.5 py-2 text-xs text-success">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        <span className="font-medium">{action.executionResult}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-text-primary">
                        {action.auditId}
                      </span>
                    </div>
                  )}

                  {isRejected && (
                    <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/60 px-3.5 py-2 text-xs text-text-muted">
                      <XCircle className="size-4 text-danger" />
                      <span>
                        Rejected: {action.rejectionReason ?? "No action was executed"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action Button */}
                <div className="mt-2 border-t border-border pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Terminal className="size-3.5 text-brand-secondary" />
                    <span className="font-mono text-[11px]">{action.tool}</span>
                  </div>

                  {isExecuted || isRejected ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(action)}
                      className="text-xs gap-1.5"
                    >
                      {isExecuted ? "View Audit Details" : "View Rejection Details"}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(action, "Not required")}
                        className="text-xs text-approval-deny-fg hover:text-approval-deny-fg"
                      >
                        Deny
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenReview(action)}
                        className="text-xs"
                      >
                        Details
                      </Button>
                      <HoldToApprove
                        onComplete={() => handleApprove(action)}
                        disabled={isHighRisk}
                        disabledLabel="Confirm in review"
                        className="ml-1"
                      />
                    </div>
                  )}
                </div>
              </StampSurface>
            )
          })}
        </div>
      </section>

      {/* ─── ACTION HISTORY TABLE ───────────────────────────────────────────── */}
      <section className="mt-14" aria-labelledby="history-heading">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2
              id="history-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted"
            >
              Recent Action History
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Immutable audit log of all decisions reviewed by human operators
            </p>
          </div>
          <span className="text-[11px] text-text-muted">{history.length} audit records</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-elevated/60 text-[10px] uppercase tracking-wider text-text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Time</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Action</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Decision</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Approval</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Result</th>
                  <th scope="col" className="px-5 py-3 font-semibold text-right">Audit Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-5 py-3.5 text-text-muted whitespace-nowrap">{row.time}</td>
                    <td className="px-5 py-3.5 font-medium text-text-primary">{row.action}</td>
                    <td className="px-5 py-3.5 text-text-muted">{row.decision}</td>
                    <td className="px-5 py-3.5">
                      {row.approval === "Approved" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                          <Check className="size-2.5" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-danger/25 bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
                          <X className="size-2.5" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "text-xs",
                          row.result === "Completed" ? "text-foreground" : "text-text-muted",
                        )}
                      >
                        {row.result}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono text-[11px] font-semibold text-brand-primary-hover">
                        {row.auditId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── REVIEW ACTION DRAWER / MODAL ────────────────────────────────────── */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm transition-opacity"
            onClick={handleCloseReview}
            aria-hidden="true"
          />

          {/* Side Panel */}
          <aside
            className="detail-drawer relative z-50 flex h-full w-full max-w-lg flex-col border-l border-border bg-sidebar shadow-2xl overflow-y-auto"
            aria-label="Action Review Panel"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-sidebar/95 px-6 py-5 backdrop-blur-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
                  Action Review & Approval
                </p>
                <h3 className="text-base font-semibold text-text-primary">
                  {selectedAction.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseReview}
                className="flex size-8 items-center justify-center rounded-lg text-text-muted hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 px-6 py-5 space-y-6">
              {/* Status Header Pill */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface/90 p-3.5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Execution State
                  </p>
                  <p
                    className={cn(
                      "text-xs font-bold mt-0.5",
                      selectedAction.status === "EXECUTED"
                        ? "text-success"
                        : selectedAction.status === "REJECTED"
                          ? "text-danger"
                          : "text-warning",
                    )}
                  >
                    STATUS: {selectedAction.status === "WAITING_APPROVAL" ? "NOT EXECUTED" : selectedAction.status}
                  </p>
                </div>
                {getRiskBadge(selectedAction.riskLevel)}
              </div>

              {/* ACTION PREVIEW */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Action Preview
                  </p>
                  <span className="font-mono text-[10px] text-brand-primary-hover">
                    Tool: {selectedAction.tool}
                  </span>
                </div>

                <div className="rounded-2xl border border-border bg-background/70 p-4 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-text-muted">Action:</span>
                    <span className="font-semibold text-text-primary">{selectedAction.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-text-muted">Requested By:</span>
                    <span className="font-medium text-text-primary">{selectedAction.requestedBy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted block mb-1">
                      Exact Payload:
                    </span>
                    <pre className="overflow-x-auto rounded-xl border border-border bg-background-secondary p-3 font-mono text-[11px] text-success">
                      {JSON.stringify(selectedAction.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* EVIDENCE USED */}
              <div>
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Evidence Used
                </p>
                <div className="space-y-2">
                  {selectedAction.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-surface/80 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-medium text-text-primary">
                          <FileText className="size-3.5 text-brand-primary-hover" />
                          <span>{ev.source}</span>
                        </div>
                        <span className="text-[10px] text-text-muted">{ev.date}</span>
                      </div>
                      <p className="mt-1 text-text-muted text-[11px]">{ev.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* POLICY GATE */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Policy Gate
                  </p>
                  <Badge variant="current" className="text-[9px]">
                    READY FOR APPROVAL
                  </Badge>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-3.5 space-y-2">
                  {selectedAction.policyChecks.map((chk, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-text-primary/90">{chk.rule}</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                        <Check className="size-3" /> Passed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Risk Confirmation Requirement */}
              {selectedAction.riskLevel === "HIGH" && selectedAction.status === "WAITING_APPROVAL" && (
                <div className="rounded-2xl border border-danger/30 bg-danger/[0.08] p-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="size-4 shrink-0 text-danger mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-danger">
                        High-Risk Action Confirmation
                      </h4>
                      <p className="text-[11px] text-rose-200/80 mt-0.5 leading-relaxed">
                        This action modifies primary vector schema indexes. One-click execution is disabled.
                      </p>
                      <label className="mt-3 flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={highRiskConfirmed}
                          onChange={(e) => setHighRiskConfirmed(e.target.checked)}
                          className="size-4 rounded border-danger text-danger accent-danger"
                        />
                        <span className="text-xs font-medium text-text-primary">
                          I manually authorize this schema migration
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Execution Result Banner */}
              {selectedAction.status === "EXECUTED" && (
                <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
                  <div className="flex items-center gap-2.5 text-success">
                    <CheckCircle2 className="size-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">STATUS: EXECUTED</p>
                      <p className="text-xs text-foreground mt-0.5">
                        Result: {selectedAction.executionResult}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-success/20 pt-2 flex items-center justify-between text-xs">
                    <span className="text-text-muted">Audit Record ID:</span>
                    <span className="font-mono font-bold text-brand-primary-hover">
                      {selectedAction.auditId}
                    </span>
                  </div>
                </div>
              )}

              {/* Rejection State Banner */}
              {selectedAction.status === "REJECTED" && (
                <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
                  <div className="flex items-center gap-2.5 text-danger">
                    <XCircle className="size-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">STATUS: REJECTED</p>
                      <p className="text-xs text-foreground mt-0.5">
                        No action was executed.
                      </p>
                    </div>
                  </div>
                  {selectedAction.rejectionReason && (
                    <p className="mt-2 text-[11px] text-text-muted">
                      Reason: <strong className="text-foreground">{selectedAction.rejectionReason}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Optional Rejection Reason Picker */}
              {showRejectionOptions && selectedAction.status === "WAITING_APPROVAL" && (
                <div className="surface-card rounded-2xl border border-border bg-card/80 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                    Select Rejection Reason (Optional):
                  </p>
                  <div className="space-y-1.5">
                    {["Not required", "Incorrect suggestion", "Needs modification"].map((opt) => (
                      <label
                        key={opt}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-2.5 text-xs cursor-pointer transition-all",
                          rejectionReason === opt
                            ? "border-danger/50 bg-danger/10 text-foreground font-medium"
                            : "border-border hover:bg-muted/20 text-text-muted",
                        )}
                      >
                        <span>{opt}</span>
                        <input
                          type="radio"
                          name="rejReason"
                          checked={rejectionReason === opt}
                          onChange={() => setRejectionReason(opt)}
                          className="accent-danger"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRejectionOptions(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject()}
                      className="text-xs gap-1"
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Controls */}
            <div className="sticky bottom-0 border-t border-border bg-sidebar/95 px-6 py-4 backdrop-blur-md">
              {selectedAction.status === "WAITING_APPROVAL" ? (
                <div className="space-y-2">
                  <p className="text-center text-[10px] text-text-muted">
                    Action is paused until explicit approval. Auto-execution is blocked.
                  </p>
                  <div className="flex gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRejectionOptions(true)}
                      className="flex-1 border-danger/30 text-danger hover:bg-danger/10 text-xs"
                    >
                      Reject
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      disabled={selectedAction.riskLevel === "HIGH" && !highRiskConfirmed}
                      onClick={() => handleApprove()}
                      className={cn(
                        "flex-1 text-xs font-semibold text-primary-foreground",
                        selectedAction.riskLevel === "HIGH" && !highRiskConfirmed
                          ? "opacity-50 cursor-not-allowed"
                          : "bg-success hover:bg-success shadow-none",
                      )}
                    >
                      {isExecuting ? "Executing..." : "Approve & Execute"}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCloseReview}
                  className="w-full text-xs"
                >
                  Close Review Panel
                </Button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
