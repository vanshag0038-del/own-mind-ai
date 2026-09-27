import { ArrowDown, ArrowRight, Check, ChevronDown, FileText, GitBranch, Link2, ListChecks, Quote, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { knowledgeDocuments, type KnowledgeDocument } from "@/lib/knowledge-data"
import { cn } from "@/lib/utils"

function HighlightedExcerpt({ text, highlights }: { text: string; highlights: string[] }) {
  const segments: { text: string; highlighted: boolean }[] = []
  let cursor = 0
  while (cursor < text.length) {
    const next = highlights
      .map((phrase) => ({ phrase, index: text.indexOf(phrase, cursor) }))
      .filter(({ index }) => index >= 0)
      .sort((a, b) => a.index - b.index)[0]
    if (!next) {
      segments.push({ text: text.slice(cursor), highlighted: false })
      break
    }
    if (next.index > cursor) segments.push({ text: text.slice(cursor, next.index), highlighted: false })
    segments.push({ text: next.phrase, highlighted: true })
    cursor = next.index + next.phrase.length
  }
  return segments.map((segment, index) => segment.highlighted
    ? <mark key={index} className="rounded bg-brand-primary/10 px-1 py-0.5 text-brand-primary-hover">{segment.text}</mark>
    : <span key={index}>{segment.text}</span>)
}

const sectionHeading = "mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted"

export function DocumentDetail({ document, onSelectSource }: { document: KnowledgeDocument; onSelectSource: (document: KnowledgeDocument) => void }) {
  const source = knowledgeDocuments.find((item) => item.id === document.linkedSourceId)!
  const decision = document.decision
  const relationship = [document.filename, decision.label, decision.value, "Reason", decision.relatedReason]

  return (
    <SheetContent side="right" className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
      <SheetHeader className="shrink-0 gap-3 border-b p-6 pr-12">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-primary-hover">
          <FileText aria-hidden="true" className="size-3.5" />Source intelligence
        </div>
        <SheetTitle className="break-words">{document.filename}</SheetTitle>
        <SheetDescription>Every insight, connected to its evidence.</SheetDescription>
      </SheetHeader>

      <div key={document.id} className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto overscroll-contain p-6" data-knowledge-detail-scroll>
        <section aria-labelledby="document-info-heading">
          <h3 id="document-info-heading" className={sectionHeading}>Document info</h3>
          <dl className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-background/30 p-4">
            <div><dt className="mb-2 text-[11px] text-text-muted">Added</dt><dd className="text-xs font-medium">{document.added}</dd></div>
            <div><dt className="mb-2 text-[11px] text-text-muted">Status</dt><dd><Badge variant="current"><Check aria-hidden="true" data-icon="inline-start" />Indexed</Badge></dd></div>
            <div><dt className="mb-2 text-[11px] text-text-muted">Source ID</dt><dd className="font-mono text-xs text-foreground/85">{document.id}</dd></div>
          </dl>
        </section>

        <section aria-labelledby="entities-heading">
          <h3 id="entities-heading" className={sectionHeading}><Users aria-hidden="true" className="size-3.5" />Extracted entities</h3>
          <dl className="flex flex-col gap-3">
            {[
              { label: "People", values: document.people },
              { label: "Project", values: ["OwnMind AI"] },
              { label: "Dates", values: document.dates },
            ].map(({ label, values }) => (
              <div key={label} className="flex items-center gap-4">
                <dt className="w-12 shrink-0 text-xs text-text-muted">{label}</dt>
                <dd className="flex flex-wrap gap-1.5">{values.map((value) => <Badge key={value} variant="outline">{value}</Badge>)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="facts-heading">
          <div className="flex items-start justify-between gap-3">
            <h3 id="facts-heading" className={sectionHeading}><ListChecks aria-hidden="true" className="size-3.5" />Extracted facts</h3>
            <span className="text-[10px] text-text-muted">{document.facts.length} of {document.factCount} shown</span>
          </div>
          <ul className="flex flex-col gap-3">
            {document.facts.map((fact) => (
              <li key={fact} className="flex gap-2.5 text-xs leading-relaxed text-foreground/85">
                <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand-primary-hover" />{fact}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="decisions-heading">
          <div className="flex items-start justify-between gap-3">
            <h3 id="decisions-heading" className={sectionHeading}><GitBranch aria-hidden="true" className="size-3.5" />Detected decisions</h3>
            <span className="text-[10px] text-text-muted">1 of {document.decisionCount} shown</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex flex-col gap-3 bg-brand-primary/10 p-4">
              <Badge variant={decision.status === "current" ? "current" : "replaced"}>
                {decision.status === "current" ? "CURRENT DECISION" : "REPLACED DECISION"}
              </Badge>
              <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {decision.label}<ArrowRight aria-hidden="true" className="size-3.5 text-text-muted" />
                <span className={cn(decision.status === "current" ? "text-brand-primary-hover" : "text-text-muted line-through")}>{decision.value}</span>
              </p>
            </div>
            <div className="flex flex-col gap-4 border-t border-border p-4">
              {decision.previous && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-text-muted"><ArrowDown aria-hidden="true" className="size-3" />REPLACES</p>
                  <p className="text-xs text-text-muted">{decision.label}{" → "}<span className="line-through decoration-muted-foreground/50">{decision.previous}</span></p>
                </div>
              )}
              <div><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Reason</p><p className="text-xs leading-relaxed text-foreground/85">{decision.reason}</p></div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Linked source</p>
                <Button variant="link" size="sm" className="h-auto max-w-full justify-start px-0 py-1 whitespace-normal text-left" onClick={() => onSelectSource(source)}>
                  <FileText aria-hidden="true" data-icon="inline-start" />{source.filename}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="related-knowledge-heading">
          <h3 id="related-knowledge-heading" className={sectionHeading}><Link2 aria-hidden="true" className="size-3.5" />Related knowledge</h3>
          <div className="rounded-xl border border-border bg-background/30 p-4">
            <ol className="flex flex-col items-center">
              {relationship.map((node, index) => (
                <li key={`${index}-${node}`} className="flex max-w-full flex-col items-center">
                  {index > 0 && <ChevronDown aria-hidden="true" className="my-1 size-3.5 text-text-muted/40" />}
                  <span className={cn("max-w-full rounded-md border px-3 py-1.5 text-center text-[11px] break-words", index === 2 ? "border-brand-primary/20 bg-brand-primary/10 font-medium text-brand-primary-hover" : index === 3 ? "border-transparent text-[10px] uppercase tracking-wider text-text-muted" : "border-border bg-card text-foreground/80")}>{node}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span className="text-[10px] text-text-muted">Related source</span>
              <Button variant="link" size="xs" className="h-auto max-w-full py-1 whitespace-normal" onClick={() => onSelectSource(source)}><Link2 aria-hidden="true" data-icon="inline-start" />{source.filename}</Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="source-preview-heading">
          <h3 id="source-preview-heading" className={sectionHeading}><Quote aria-hidden="true" className="size-3.5" />Source preview</h3>
          <blockquote className="rounded-r-xl border-l-2 border-brand-primary/20 bg-background/40 px-4 py-4 text-xs leading-7 text-foreground/80">
            &ldquo;<HighlightedExcerpt text={document.excerpt} highlights={document.highlights} />&rdquo;
          </blockquote>
          <p className="mt-2 text-[10px] text-text-muted">Highlighted phrases support the extracted knowledge.</p>
        </section>
        <p className="flex items-center gap-2 text-[10px] text-text-muted"><ShieldCheck aria-hidden="true" className="size-3.5" />Static demo · Illustrative source excerpts</p>
      </div>
    </SheetContent>
  )
}
