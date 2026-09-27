"use client"

import { useCallback, useEffect, useRef } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type QuantumNodesProps = {
  className?: string
  mode?: "grid" | "random"
  gridSpacing?: number
  nodeCount?: number
  jitter?: number
  cursorDistance?: number
  nodeDistance?: number
  maxConnectionsPerNode?: number
  /** CSS custom properties read from the element, so the canvas follows the active theme. */
  idleColorVar?: string
  activeColorVar?: string
  lineColorVar?: string
}

type Point = { x: number; y: number }

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export function QuantumNodes({
  className,
  mode = "random",
  gridSpacing = 36,
  nodeCount = 70,
  jitter = 24,
  cursorDistance = 140,
  nodeDistance = 70,
  maxConnectionsPerNode = 3,
  idleColorVar = "--text-muted",
  activeColorVar = "--brand-primary",
  lineColorVar = "--rule",
}: QuantumNodesProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Point[]>([])
  const pointerRef = useRef({ x: 0, y: 0, inside: false })
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const colorsRef = useRef({ idle: "#888", active: "#ccc", line: "#444" })
  const frameRef = useRef<number | null>(null)
  const inView = useInView(wrapRef, { margin: "100px" })
  const reduceMotion = useReducedMotion()

  const readColors = useCallback(() => {
    const el = wrapRef.current
    if (!el) return
    const styles = getComputedStyle(el)
    colorsRef.current = {
      idle: styles.getPropertyValue(idleColorVar).trim() || colorsRef.current.idle,
      active: styles.getPropertyValue(activeColorVar).trim() || colorsRef.current.active,
      line: styles.getPropertyValue(lineColorVar).trim() || colorsRef.current.line,
    }
  }, [activeColorVar, idleColorVar, lineColorVar])

  const buildNodes = useCallback(() => {
    const { w, h } = sizeRef.current
    if (w < 2 || h < 2) return
    const rng = mulberry32(1337 ^ (w * 73856093) ^ (h * 19349663))
    const nodes: Point[] = []
    if (mode === "grid") {
      for (let y = gridSpacing / 2; y <= h; y += gridSpacing)
        for (let x = gridSpacing / 2; x <= w; x += gridSpacing)
          nodes.push({ x: clamp(x + (rng() - 0.5) * jitter * 0.6, 0, w), y: clamp(y + (rng() - 0.5) * jitter * 0.6, 0, h) })
    } else {
      for (let i = 0; i < nodeCount; i++)
        nodes.push({ x: clamp(rng() * w + (rng() - 0.5) * jitter, 0, w), y: clamp(rng() * h + (rng() - 0.5) * jitter, 0, h) })
    }
    nodesRef.current = nodes
  }, [gridSpacing, jitter, mode, nodeCount])

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const { w, h, dpr } = sizeRef.current
    const { idle, active, line } = colorsRef.current
    const nodes = nodesRef.current
    const pointer = pointerRef.current
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    ctx.strokeStyle = line
    ctx.lineWidth = 1
    const connections = new Array(nodes.length).fill(0)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length && connections[i] < maxConnectionsPerNode; j++) {
        if (connections[j] >= maxConnectionsPerNode) continue
        const d = Math.hypot(nodes[j].x - nodes[i].x, nodes[j].y - nodes[i].y)
        if (d > nodeDistance) continue
        ctx.globalAlpha = 0.5 * (1 - d / nodeDistance)
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
        connections[i]++
        connections[j]++
      }
    }

    if (pointer.inside) {
      ctx.strokeStyle = active
      for (const node of nodes) {
        const d = Math.hypot(pointer.x - node.x, pointer.y - node.y)
        if (d > cursorDistance) continue
        ctx.globalAlpha = 0.35 * (1 - d / cursorDistance)
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(pointer.x, pointer.y)
        ctx.stroke()
      }
    }

    for (const node of nodes) {
      const d = pointer.inside ? Math.hypot(pointer.x - node.x, pointer.y - node.y) : Infinity
      const t = d < cursorDistance ? 1 - d / cursorDistance : 0
      const radius = 1.2 + t * 1.6
      if (t > 0) {
        ctx.save()
        ctx.globalAlpha = t * 0.5
        ctx.shadowColor = active
        ctx.shadowBlur = 10 * (0.35 + t)
        ctx.fillStyle = active
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = t > 0 ? 1 : 0.45
      ctx.fillStyle = t > 0 ? active : idle
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }, [cursorDistance, maxConnectionsPerNode, nodeDistance])

  const resize = useCallback(() => {
    const el = wrapRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return
    const rect = el.getBoundingClientRect()
    const w = Math.max(1, Math.floor(rect.width))
    const h = Math.max(1, Math.floor(rect.height))
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2)
    sizeRef.current = { w, h, dpr }
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    readColors()
    buildNodes()
    draw()
  }, [buildNodes, draw, readColors])

  useEffect(() => {
    resize()
    const el = wrapRef.current
    if (!el) return
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(el)
    const themeObserver = new MutationObserver(() => {
      readColors()
      draw()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    return () => {
      resizeObserver.disconnect()
      themeObserver.disconnect()
    }
  }, [draw, readColors, resize])

  useEffect(() => {
    if (reduceMotion || !inView) {
      draw()
      return
    }
    const loop = () => {
      draw()
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [draw, inView, reduceMotion])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("relative size-full overflow-hidden", className)}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, inside: true }
        if (reduceMotion) draw()
      }}
      onPointerLeave={() => {
        pointerRef.current.inside = false
        if (reduceMotion) draw()
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
