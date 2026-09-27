"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const palettes = [
  {
    id: "aubergine", name: "Aubergine & Chartreuse", short: "Aubergine", mode: "dark",
    description: "Independent-magazine energy. Moody plum with a sharp, restrained pear accent.",
    colors: ["#211A24", "#302735", "#F1EADF", "#D2DC88"],
  },
  {
    id: "porcelain", name: "Porcelain & Cobalt", short: "Porcelain", mode: "light",
    description: "Ceramic-inspired clarity. Warm porcelain, ink-blue type and a confident cobalt accent.",
    colors: ["#F2EFE7", "#FCFAF5", "#202B3A", "#294BC4"],
  },
  {
    id: "petrol", name: "Petrol & Apricot", short: "Petrol", mode: "dark",
    description: "A warmer kind of dark mode. Deep petrol and dried apricot, without the neon.",
    colors: ["#13282B", "#20383B", "#F1E8D9", "#E8AE83"],
  },
  {
    id: "parchment", name: "Parchment & Rust", short: "Parchment", mode: "light",
    description: "An architect’s notebook. Paper-toned surfaces, espresso ink and earthy rust.",
    colors: ["#EAE3D5", "#F7F1E7", "#332B26", "#98462F"],
  },
  {
    id: "graphite", name: "Graphite & Mineral Blue", short: "Graphite", mode: "dark",
    description: "Quiet and precise. Warm graphite gives mineral-blue details room to breathe.",
    colors: ["#232321", "#30312E", "#EDE9DF", "#A2C4CF"],
  },
] as const

const colorRoles = ["Background", "Cards", "Text", "Accent"]

export function OverviewPalettePreview() {
  const [selected, setSelected] = useState<string>(palettes[0].id)
  const palette = palettes.find(({ id }) => id === selected)

  useEffect(() => {
    if (!palette) return

    const root = document.documentElement
    const [background, surface, foreground, accent] = palette.colors
    const dark = palette.mode === "dark"
    const mix = (color: string, percentage: number, base: string = background) =>
      `color-mix(in srgb, ${color} ${percentage}%, ${base})`
    const tokens: Record<string, string> = {
      "color-scheme": palette.mode,
      "--background": background,
      "--background-secondary": mix(surface, 65),
      "--surface": surface,
      "--surface-elevated": mix(foreground, 5, surface),
      "--ink": foreground,
      "--text-primary": foreground,
      "--text-secondary": mix(foreground, 85),
      "--text-muted": mix(foreground, 70),
      "--brand-primary": accent,
      "--brand-primary-hover": mix(accent, 86, foreground),
      "--brand-secondary": mix(accent, 78, foreground),
      "--primary-foreground": dark ? background : surface,
      "--rule": mix(foreground, 28),
      "--rule-soft": mix(foreground, 14),
      "--input": mix(foreground, 28),
      "--hard-shadow": dark ? mix(background, 55, "#000000") : mix(foreground, 55),
      "--success": dark ? "#A5C5AA" : "#386445",
      "--warning": dark ? "#D6BA88" : "#805E23",
      "--danger": dark ? "#E5A19B" : "#A23932",
      "--info": dark ? "#A2C4CF" : "#345C78",
      "--panel-glow": "transparent",
      "--gold-glow": "transparent",
    }
    const previous = Object.keys(tokens).map((key) => [key, root.style.getPropertyValue(key), root.style.getPropertyPriority(key)])
    const previousPreview = root.getAttribute("data-palette-preview")
    root.setAttribute("data-palette-preview", palette.id)
    for (const [key, value] of Object.entries(tokens)) root.style.setProperty(key, value)

    return () => {
      for (const [key, value, priority] of previous) {
        if (value) root.style.setProperty(key, value, priority)
        else root.style.removeProperty(key)
      }
      if (previousPreview === null) root.removeAttribute("data-palette-preview")
      else root.setAttribute("data-palette-preview", previousPreview)
    }
  }, [palette])

  return (
    <section aria-labelledby="palette-preview-title" className="palette-preview mb-8 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Colour studies / 01—05</p>
          <h2 id="palette-preview-title" className="palette-preview-title">One overview. Five different moods.</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelected("original")} disabled={!palette}>Original theme</Button>
      </div>
      <ToggleGroup aria-label="Preview a colour palette" value={palette ? [selected] : []} onValueChange={(values) => { if (values.length) setSelected(values[0]) }} variant="outline" className="max-w-full flex-wrap justify-start">
        {palettes.map((option, index) => (
          <ToggleGroupItem key={option.id} value={option.id} aria-label={option.name} className="gap-2">
            <span aria-hidden="true" className="palette-choice-swatch" style={{ backgroundColor: option.colors[0], borderColor: option.colors[3] }} />
            {String(index + 1).padStart(2, "0")} {option.short}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div aria-live="polite" aria-atomic="true" className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{palette?.name ?? "Your original theme"}{palette && <span className="ml-2 text-xs font-normal text-muted-foreground">/ {palette.mode}</span>}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{palette?.description ?? "The existing colours are restored. Select a study to compare again."}</p>
        </div>
        {palette && <dl className="flex flex-wrap gap-x-5 gap-y-2">
          {palette.colors.map((color, index) => <div key={color} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-6 shrink-0 rounded-sm border border-border" style={{ backgroundColor: color }} />
            <div><dt className="text-[10px] text-muted-foreground">{colorRoles[index]}</dt><dd className="font-mono text-[10px] text-foreground">{color}</dd></div>
          </div>)}
        </dl>}
      </div>
      <p className="text-[10px] leading-relaxed text-muted-foreground">Preview only · Includes the sidebar and cards. Leaving Overview restores your theme.</p>
    </section>
  )
}
