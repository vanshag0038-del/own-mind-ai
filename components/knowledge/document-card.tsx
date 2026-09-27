import { ArrowUpRight, Check, FileCode2, FileText, GitBranch, ListChecks, NotebookPen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SheetTrigger } from "@/components/ui/sheet"
import type { KnowledgeDocument } from "@/lib/knowledge-data"
import { cn } from "@/lib/utils"

const categoryStyles = {
  PDF: "bg-brand-primary/10 text-brand-primary-hover ring-accent-blue/20",
  "Meeting Notes": "bg-brand-primary/10 text-brand-primary-hover ring-brand-primary/20",
  Technical: "bg-brand-secondary/10 text-brand-secondary ring-accent-purple/20",
  Research: "bg-brand-primary/10 text-brand-primary-hover ring-accent-blue/20",
  Notes: "bg-brand-secondary/10 text-brand-secondary ring-accent-purple/20",
}

export function DocumentCard({ document, onSelect }: { document: KnowledgeDocument; onSelect: () => void }) {
  const Icon = document.category === "Technical" ? FileCode2 : document.category === "Notes" ? NotebookPen : FileText

  return (
    <article className="group relative min-w-0 rounded-2xl transition-transform duration-200 motion-safe:hover:-translate-y-0.5" data-document-id={document.id}>
      <Card size="sm" className="h-full rounded-2xl [--card-spacing:--spacing(5)] transition-shadow duration-200 group-hover:ring-brand-primary/20 group-focus-within:ring-brand-primary/20">
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className={cn("flex size-10 items-center justify-center rounded-xl ring-1 ring-inset", categoryStyles[document.category])}>
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <Badge variant="current"><Check aria-hidden="true" data-icon="inline-start" />Indexed</Badge>
          </div>
          <CardTitle>
            <h3>
              <SheetTrigger
                onClick={onSelect}
                aria-label={`View knowledge from ${document.filename}`}
                className="block w-full cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-accent-cyan"
              >
                <span className="block truncate" title={document.filename}>{document.filename}</span>
              </SheetTrigger>
            </h3>
          </CardTitle>
          <div className="-mt-2 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span>{document.category}</span>
            <span aria-hidden="true" className="size-0.5 rounded-full bg-muted-foreground/60" />
            <span>Added {document.added}</span>
            {document.updated && <Badge variant="pending">Updated</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-xs leading-relaxed text-text-muted">{document.insight}</p>
        </CardContent>
        <CardFooter className="gap-4 py-3">
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <ListChecks aria-hidden="true" className="size-3.5 text-brand-primary-hover/80" />
            <span className="font-semibold text-text-primary">{document.factCount}</span> facts
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <GitBranch aria-hidden="true" className="size-3.5 text-brand-secondary/80" />
            <span className="font-semibold text-text-primary">{document.decisionCount}</span> {document.decisionCount === 1 ? "decision" : "decisions"}
          </span>
          <ArrowUpRight aria-hidden="true" className="ml-auto size-3.5 shrink-0 text-text-muted transition-colors group-hover:text-brand-primary-hover" />
        </CardFooter>
      </Card>
    </article>
  )
}
