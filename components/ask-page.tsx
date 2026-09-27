"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  Brain,
  FileText,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Check,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  GitBranch,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  askQuestionsData,
  sampleSuggestions,
  type AskQueryState,
} from "@/lib/ask-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AskPage() {
  const evidenceNodes = useRef<Map<string, HTMLDivElement>>(new Map())
  const [activeQueryKey, setActiveQueryKey] = useState<string>("demo-date")
  const [inputValue, setInputValue] = useState<string>("")
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [isTraceExpanded, setIsTraceExpanded] = useState<boolean>(true)
  const [actionDismissed, setActionDismissed] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedSourceId) return
    const evidence = evidenceNodes.current.get(selectedSourceId)
    evidence?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
    evidence?.focus({ preventScroll: true })
  }, [selectedSourceId])

  const activeData: AskQueryState =
    askQuestionsData[activeQueryKey] ?? askQuestionsData["demo-date"]

  const handleSelectSuggestion = (key: string) => {
    setActiveQueryKey(key)
    setSelectedSourceId(null)
    setActionDismissed(false)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const lower = inputValue.toLowerCase()
    if (lower.includes("flask") || lower.includes("fastapi") || lower.includes("backend")) {
      setActiveQueryKey("backend-framework")
    } else if (lower.includes("conflict") || lower.includes("docker") || lower.includes("cloud")) {
      setActiveQueryKey("deployment-conflict")
    } else if (lower.includes("next") || lower.includes("todo") || lower.includes("action")) {
      setActiveQueryKey("next-actions")
    } else {
      setActiveQueryKey("demo-date")
    }
    setInputValue("")
    setSelectedSourceId(null)
    setActionDismissed(false)
  }

  const isConflict = activeData.status === "CONFLICT"

  return (
    <div className="page-container animate-page-enter">
      {/* ─── PAGE HEADER ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-medium text-text-muted">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            Project Intelligence
          </div>
          <Badge
            variant="outline"
            className="border-brand-primary/30 bg-brand-primary/[0.08] text-brand-primary-hover font-medium text-[11px] gap-1.5 py-1 px-3"
          >
            <ShieldCheck className="size-3.5" />
            Evidence-Backed Reasoning
          </Badge>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Ask{" "}
          <span className="bg-gradient-to-r from-brand-primary via-brand-primary-hover to-brand-secondary bg-clip-text text-transparent">
            OwnMind
          </span>
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-text-muted">
          Ask across your project knowledge, decisions and memory — with traceable evidence.
        </p>

        {/* ─── COGNITIVE PIPELINE INDICATOR ───────────────────────────────────── */}
        <div className="signal-flow mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface/80 p-2.5 text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <span className="flex size-4 items-center justify-center rounded-full bg-brand-primary/20 text-[10px] font-bold text-brand-primary-hover">
              1
            </span>
            <span>Question</span>
          </div>
          <ArrowRight className="size-3 text-text-muted/40" />
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <span className="flex size-4 items-center justify-center rounded-full bg-brand-primary/20 text-[10px] font-bold text-brand-primary-hover">
              2
            </span>
            <span>Retrieve Evidence</span>
          </div>
          <ArrowRight className="size-3 text-text-muted/40" />
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <span className="flex size-4 items-center justify-center rounded-full bg-brand-secondary/20 text-[10px] font-bold text-brand-secondary">
              3
            </span>
            <span>Compare Decisions</span>
          </div>
          <ArrowRight className="size-3 text-text-muted/40" />
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <span className="flex size-4 items-center justify-center rounded-full bg-success/20 text-[10px] font-bold text-success">
              4
            </span>
            <span>Answer with Sources</span>
          </div>
          <ArrowRight className="size-3 text-text-muted/40" />
          <div className="flex items-center gap-1.5 font-medium text-brand-primary-hover">
            <span className="flex size-4 items-center justify-center rounded-full bg-brand-primary/20 text-[10px] font-bold text-brand-primary-hover">
              5
            </span>
            <span>Propose Next Action</span>
          </div>
        </div>
      </div>

      {/* ─── TWO COLUMN MAIN LAYOUT ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ─── LEFT COLUMN (approx 65%) ────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-8">
          {/* User Question */}
          <div className="surface-card flex items-start gap-3 rounded-2xl border border-border bg-surface/90 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary/30 to-accent-purple/30 text-xs font-semibold text-foreground ring-1 ring-inset ring-white/10">
              PT
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-text-muted">Project Team Query</p>
                <span className="text-[10px] text-text-muted">Live Memory Session</span>
              </div>
              <p className="mt-1 text-base font-medium text-text-primary">
                “{activeData.userQuestion}”
              </p>
            </div>
          </div>

          {/* OwnMind Response Section */}
          <div key={activeQueryKey} className="answer-sequence surface-card relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 ring-1 ring-border/50">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br from-brand-primary/10 to-accent-purple/10 blur-3xl" />

            {/* Answer Header */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-8 items-center justify-center rounded-xl bg-brand-primary/15 ring-1 ring-inset ring-brand-primary/30">
                  <Brain className="size-4 text-brand-primary-hover" />
                  <span className="absolute inset-0 rounded-xl shadow-none opacity-70" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-text-primary">OwnMind</p>
                    <span className="rounded bg-brand-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-primary-hover">
                      Local Qwen3 4B
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted">Sovereign Memory & Lineage Engine</p>
                </div>
              </div>

              {isConflict ? (
                <Badge variant="conflict">
                  <span className="size-1 rounded-full bg-destructive" />
                  CONFLICT DETECTED
                </Badge>
              ) : (
                <Badge variant="current">
                  <span className="size-1 rounded-full bg-brand-primary" />
                  VERIFIED DECISION
                </Badge>
              )}
            </div>

            {/* Answer text paragraphs */}
            <div className="space-y-2 text-sm leading-relaxed text-text-primary/95">
              {activeData.answerParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* ─── STRUCTURED RESULT CARDS ─────────────────────────────────── */}
            <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Decision Comparison
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <Clock className="size-3" />
                  <span>Effective Date: <strong className="text-foreground">{activeData.effectiveDate}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Current Decision */}
                <div
                  className={cn(
                    "flex flex-col justify-between rounded-xl border p-3.5 transition-all",
                    isConflict
                      ? "border-warning/30 bg-warning/[0.04]"
                      : "border-brand-primary/30 bg-brand-primary/[0.05] shadow-none",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isConflict ? "text-warning" : "text-brand-primary-hover",
                      )}
                    >
                      Current Decision
                    </p>
                    <Badge variant={isConflict ? "conflict" : "current"}>
                      {isConflict ? "CONFLICT" : "CURRENT"}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] text-text-muted">{activeData.currentDecision.title}</p>
                    <p
                      className={cn(
                        "text-lg font-semibold tracking-tight",
                        isConflict ? "text-warning" : "text-brand-primary-hover",
                      )}
                    >
                      {activeData.currentDecision.value}
                    </p>
                  </div>
                </div>

                {/* Previous Decision */}
                {activeData.previousDecision && (
                  <div className="flex flex-col justify-between rounded-xl border border-border bg-surface-elevated/60 p-3.5 opacity-80">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Previous Decision
                      </p>
                      <Badge variant="replaced">REPLACED</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-[11px] text-text-muted">Superseded Baseline</p>
                      <p className="text-lg font-medium tracking-tight text-text-muted line-through decoration-muted-foreground/40">
                        {activeData.previousDecision.value}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reason for Change */}
              {activeData.reasonForChange && (
                <div className="mt-3 rounded-xl border border-border bg-surface/70 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Reason for Change
                  </p>
                  <p className="mt-0.5 text-xs text-text-primary/90 font-medium">
                    {activeData.reasonForChange}
                  </p>
                </div>
              )}
            </div>

            {/* ─── SOURCE CITATIONS (CLICKABLE CHIPS) ───────────────────────── */}
            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Authoritative Citations &nbsp;
                <span className="text-[10px] font-normal text-text-muted">
                  (Click to inspect in Evidence panel)
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {activeData.sources.map((src) => {
                  const isSelected = selectedSourceId === src.id
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setSelectedSourceId(isSelected ? null : src.id)}
                      aria-pressed={isSelected}
                      aria-controls={`evidence-${src.id}`}
                      className={cn(
                        "group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "border-accent-cyan bg-brand-primary/15 text-brand-primary-hover shadow-none ring-1 ring-brand-primary"
                          : "border-border bg-surface/90 text-text-muted hover:border-brand-primary/40 hover:text-foreground",
                      )}
                    >
                      <span className="font-mono text-[10px] font-bold text-brand-primary-hover">
                        [{src.citationId}]
                      </span>
                      <FileText className="size-3 text-text-muted group-hover:text-brand-primary-hover transition-colors" />
                      <span className="font-medium text-text-primary">{src.filename}</span>
                      <span className="text-[10px] text-text-muted">· {src.date}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ─── REASONING TRACE (EXPANDABLE) ────────────────────────────── */}
            <div className="mt-6 rounded-2xl border border-border bg-surface/80">
              <button
                type="button"
                onClick={() => setIsTraceExpanded(!isTraceExpanded)}
                aria-expanded={isTraceExpanded}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-brand-secondary" />
                  <span className="text-xs font-semibold text-text-primary">
                    Why OwnMind answered this way
                  </span>
                  <span className="rounded-full bg-brand-secondary/10 px-2 py-0.5 text-[10px] font-medium text-brand-secondary">
                    {activeData.reasoningTrace.length} Steps Verified
                  </span>
                </div>
                {isTraceExpanded ? (
                  <ChevronUp className="size-4 text-text-muted" />
                ) : (
                  <ChevronDown className="size-4 text-text-muted" />
                )}
              </button>

              {isTraceExpanded && (
                <div className="border-t border-border px-4 py-3.5 space-y-2">
                  {activeData.reasoningTrace.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-[10px] font-bold text-success mt-0.5">
                        <Check className="size-2.5" />
                      </span>
                      <span>
                        <strong className="text-text-muted font-mono mr-1.5">
                          {idx + 1}.
                        </strong>
                        {step}
                      </span>
                    </div>
                  ))}
                  <p className="pt-2 text-[10px] text-text-muted italic">
                    Reasoning derived strictly from indexed document memory. No external hallucination.
                  </p>
                </div>
              )}
            </div>

            {/* ─── PROPOSED NEXT ACTION ─────────────────────────────────────── */}
            {activeData.suggestedAction && !actionDismissed && (
              <div className="mt-6 rounded-2xl border border-brand-secondary/30 bg-gradient-to-br from-brand-secondary/[0.08] to-transparent p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-brand-secondary/15 text-brand-secondary ring-1 ring-inset ring-brand-secondary/30">
                      <Zap className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                        Suggested Action
                      </p>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {activeData.suggestedAction.title}
                      </h4>
                    </div>
                  </div>
                  <Badge variant="pending">
                    {activeData.suggestedAction.status.replace("_", " ")}
                  </Badge>
                </div>

                <p className="mt-2 text-xs text-text-muted">
                  {activeData.suggestedAction.description}
                </p>

                <div className="mt-3.5 rounded-xl border border-border bg-background-secondary/60 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Proposed steps:
                  </p>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    {activeData.suggestedAction.steps.map((st, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-brand-secondary" />
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionDismissed(true)}
                    className="text-xs text-text-muted hover:text-foreground"
                  >
                    Reject
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="gap-1.5 text-xs bg-brand-secondary hover:bg-brand-secondary/90 text-background"
                    onClick={() => {
                      alert("Action review will be coordinated in the Actions page.")
                    }}
                  >
                    Review Action
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ─── QUESTION INPUT BOX ────────────────────────────────────────── */}
          <div className="space-y-3">
            <form
              onSubmit={handleCustomSubmit}
              className="relative flex items-center rounded-2xl border border-border bg-card/70 px-4 py-2 shadow-sm transition-all focus-within:border-accent-cyan/50 focus-within:ring-1 focus-within:ring-brand-primary/30"
            >
              <Sparkles className="size-4 shrink-0 text-brand-primary-hover mr-3" />
              <input
                type="text"
                aria-label="Ask about your project knowledge"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Ask about your project knowledge... (e.g. "What changed in the architecture this week?")'
                className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted outline-none"
              />
              <Button
                type="submit"
                size="sm"
                className="ml-2 gap-1.5 bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground font-semibold text-xs rounded-xl"
              >
                Send
                <Send className="size-3" />
              </Button>
            </form>

            {/* Quick Suggestions Chips */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5 px-1">
                Suggested Questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sampleSuggestions.map((item) => (
                  <button
                    key={item.queryKey}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.queryKey)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs transition-all cursor-pointer",
                      activeQueryKey === item.queryKey
                        ? "border-brand-primary/40 bg-brand-primary/10 text-brand-primary-hover font-medium"
                        : "border-border bg-surface/70 text-text-muted hover:border-border hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN — EVIDENCE PANEL (approx 35%) ─────────────────── */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-5">
            <div className="surface-card rounded-3xl border border-border bg-surface/80 p-5 ring-1 ring-border/50">
              {/* Evidence Panel Header */}
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-brand-primary-hover" />
                  <h3 className="text-sm font-semibold text-text-primary">Evidence Used</h3>
                </div>
                <Badge variant="outline" className="text-[10px] border-border text-text-muted">
                  {activeData.sources.length} Documents
                </Badge>
              </div>

              {/* Evidence Sources List */}
              <div className="space-y-4">
                {activeData.sources.map((src, index) => {
                  const isHighlighted = selectedSourceId === src.id
                  const isCurrent = src.status === "Current Source"
                  const isConflicting = src.status === "Conflicting Source"

                  return (
                    <div
                      key={src.id}
                      id={`evidence-${src.id}`}
                      tabIndex={-1}
                      ref={(node) => { if (node) evidenceNodes.current.set(src.id, node); else evidenceNodes.current.delete(src.id) }}
                      className={cn(
                        isHighlighted && "evidence-focused",
                        "rounded-2xl border p-4 transition-all duration-300",
                        isHighlighted
                          ? "border-accent-cyan bg-brand-primary/[0.08] shadow-none ring-1 ring-brand-primary"
                          : "border-border bg-background/50 hover:border-border",
                      )}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-brand-primary-hover">
                              SOURCE {index + 1}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              · [{src.citationId}]
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-foreground mt-0.5">
                            {src.filename}
                          </p>
                          <p className="text-[10px] text-text-muted">{src.date}</p>
                        </div>

                        <Badge
                          variant={
                            isConflicting
                              ? "conflict"
                              : isCurrent
                                ? "current"
                                : "replaced"
                          }
                        >
                          {src.status}
                        </Badge>
                      </div>

                      {/* Passage Box with Highlighted Phrases */}
                      <div className="mt-3 rounded-xl border border-border bg-surface/90 p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted mb-1">
                          Relevant passage:
                        </p>
                        <p className="text-xs leading-relaxed text-text-primary/90 italic">
                          “
                          {src.highlightPhrases && src.highlightPhrases.length > 0 ? (
                            <span>
                              {renderHighlightedPassage(src.passage, src.highlightPhrases)}
                            </span>
                          ) : (
                            src.passage
                          )}
                          ”
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ─── EVIDENCE CONFIDENCE ───────────────────────────────────── */}
              <div className="mt-5 border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Evidence Strength
                  </p>
                  <span
                    className={cn(
                      "text-xs font-bold tracking-wider",
                      activeData.evidenceStrength.level === "HIGH"
                        ? "text-success"
                        : activeData.evidenceStrength.level === "CONFLICT"
                          ? "text-destructive"
                          : "text-brand-secondary",
                    )}
                  >
                    {activeData.evidenceStrength.level}
                  </span>
                </div>

                {/* Visual confidence indicator bar (no fake numerical percentages!) */}
                <div className="grid grid-cols-3 gap-1.5 my-2">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      activeData.evidenceStrength.level === "CONFLICT"
                        ? "bg-destructive shadow-none"
                        : "bg-success shadow-none",
                    )}
                  />
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      activeData.evidenceStrength.level === "CONFLICT"
                        ? "bg-destructive/40"
                        : "bg-success shadow-none",
                    )}
                  />
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      activeData.evidenceStrength.level === "CONFLICT"
                        ? "bg-muted"
                        : activeData.evidenceStrength.level === "HIGH"
                          ? "bg-success shadow-none"
                          : "bg-muted",
                    )}
                  />
                </div>

                <div className="rounded-xl border border-border bg-background/60 p-2.5 mt-2">
                  <p className="text-[11px] leading-relaxed text-text-muted">
                    <span className="font-semibold text-text-primary">Verification Basis: </span>
                    {activeData.evidenceStrength.reason}
                  </p>
                </div>
              </div>

              {/* ─── SOURCE LINEAGE GRAPH ──────────────────────────────────── */}
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Document Precedence
                </p>
                <div className="flex items-center justify-between rounded-xl border border-border bg-background/30 p-2.5 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <GitBranch className="size-3.5 text-text-muted" />
                    <span className="text-text-muted">Chronological Flow</span>
                  </div>
                  <Link
                    href="/decisions"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-primary-hover hover:underline"
                  >
                    View Lineage
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderHighlightedPassage(passage: string, phrases: string[]) {
  let parts: { text: string; isHighlight: boolean }[] = [{ text: passage, isHighlight: false }]

  for (const phrase of phrases) {
    const newParts: { text: string; isHighlight: boolean }[] = []
    for (const part of parts) {
      if (part.isHighlight) {
        newParts.push(part)
        continue
      }
      const index = part.text.toLowerCase().indexOf(phrase.toLowerCase())
      if (index === -1) {
        newParts.push(part)
      } else {
        const before = part.text.substring(0, index)
        const match = part.text.substring(index, index + phrase.length)
        const after = part.text.substring(index + phrase.length)
        if (before) newParts.push({ text: before, isHighlight: false })
        newParts.push({ text: match, isHighlight: true })
        if (after) newParts.push({ text: after, isHighlight: false })
      }
    }
    parts = newParts
  }

  return (
    <>
      {parts.map((p, idx) =>
        p.isHighlight ? (
          <mark
            key={idx}
            className="rounded bg-brand-primary/25 px-1 py-0.5 font-semibold text-brand-primary-hover not-italic"
          >
            {p.text}
          </mark>
        ) : (
          <span key={idx}>{p.text}</span>
        ),
      )}
    </>
  )
}
