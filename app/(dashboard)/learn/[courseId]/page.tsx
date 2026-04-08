"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Clock,
  ArrowRight,
  Loader2,
  BookOpen,
  Brain,
  ClipboardList,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Star,
  Timer,
  FileText,
  RotateCcw,
  Copy,
  Check,
  ZoomIn,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fireStars, fireSchoolPride } from "@/lib/effects"
import { PointsBurst } from "@/components/points-burst"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { getLessonContent } from "@/content"
import { PYTHON_TOPIC_META, COURSE_TOPIC_META } from "@/lib/python-topics"

interface McqQState {
  selected: number | null
  submitting: boolean
  result: { correct: boolean; correct_answer: number; explanation: string | null; points_earned: number; total_points: number } | null
  locked: boolean
}

interface ApiMcqQuestion {
  id: number
  topic: string
  subtopic: string
  question: string
  options: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  explanation: string | null
  attempted: boolean
  selected_answer?: number
  is_correct?: boolean
  correct_answer?: number
}

interface ModuleAssignment {
  id: string
  module_id: string
  title: string
  course: string
  icon: string
  duration_mins: number
  total_questions: number
  completed_questions: number
  status: "pending" | "completed"
  max_score: number
  score: number
}

interface Lesson {
  id: number
  title: string
  content?: string | null
  duration_mins: number
  order: number
  points: number
  is_completed: boolean
}

interface Course {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon_color: string
  total_lessons: number
  lessons_completed: number
  lessons: Lesson[]
}

const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

// ─── Copy button for code blocks ─────────────────────────────────────────────
function CopyCodeBlock({ code, lang, isOutput }: { code: string; lang: string; isOutput: boolean }) {
  const [copied, setCopied] = useState(false)
  const dotColor = LANG_DOT_MAP[lang] ?? 'bg-slate-400'
  const label = LANG_LABEL_MAP[lang] ?? (lang || null)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative my-5 rounded-2xl overflow-hidden shadow-lg group/code">
      {/* Header bar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2',
        isOutput ? 'bg-emerald-950/80 border-b border-emerald-900/50' : 'bg-[#161b22] border-b border-white/8'
      )}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-3">
          {label && (
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', dotColor)} />
              <span className={cn('text-[10px] font-mono font-semibold uppercase tracking-wider', isOutput ? 'text-emerald-400' : 'text-slate-400')}>{label}</span>
            </div>
          )}
          {!isOutput && (
            <button
              onClick={copy}
              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-200 transition-colors opacity-0 group-hover/code:opacity-100"
            >
              {copied
                ? <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                : <><Copy className="h-3 w-3" /><span>Copy</span></>
              }
            </button>
          )}
        </div>
      </div>
      <pre className={cn(
        'p-4 overflow-x-auto text-sm font-mono leading-relaxed',
        isOutput ? 'bg-[#040810] text-emerald-400' : 'bg-[#0d1117] text-slate-200'
      )}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ─── Zoomable image ───────────────────────────────────────────────────────────
function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false)
  return (
    <>
      <div
        className="relative my-5 rounded-2xl overflow-hidden border border-border cursor-zoom-in group/img shadow-lg"
        onClick={() => setZoomed(true)}
      >
        <img src={src} alt={alt} className="w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.02]" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/20">
          <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
            <ZoomIn className="h-3 w-3" /> Click to zoom
          </div>
        </div>
        {alt && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
            <p className="text-white/80 text-xs">{alt}</p>
          </div>
        )}
      </div>
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <img src={src} alt={alt} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
        </div>
      )}
    </>
  )
}

// ─── Memory Model diagram ─────────────────────────────────────────────────────
// Format per line: "varName | value | type"
function MemoryModelBlock({ content }: { content: string }) {
  const rows = content.trim().split('\n').filter(l => l.includes('|'))
  const TYPE_STYLES: Record<string, string> = {
    int:      'bg-blue-500/20 text-blue-300 border-blue-500/40',
    str:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    float:    'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bool:     'bg-violet-500/20 text-violet-300 border-violet-500/40',
    list:     'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    dict:     'bg-pink-500/20 text-pink-300 border-pink-500/40',
    tuple:    'bg-orange-500/20 text-orange-300 border-orange-500/40',
    set:      'bg-rose-500/20 text-rose-300 border-rose-500/40',
    NoneType: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
  }
  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-primary/25 bg-gradient-to-br from-primary/5 to-transparent shadow-lg">
      <div className="bg-primary/10 px-4 py-2.5 flex items-center gap-2 border-b border-primary/20">
        <span className="text-base">🧠</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Python Memory Model</span>
        <span className="text-[10px] text-muted-foreground ml-auto font-mono">RAM visualization</span>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="grid grid-cols-[minmax(120px,auto)_28px_1fr_70px] gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-1">
          <span>Variable</span><span></span><span>Value stored</span><span>Type</span>
        </div>
        {rows.map((row, idx) => {
          const [name, value, type] = row.split('|').map(p => p.trim())
          const tc = TYPE_STYLES[type] ?? 'bg-secondary text-muted-foreground border-border'
          return (
            <motion.div key={idx}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="grid grid-cols-[minmax(120px,auto)_28px_1fr_70px] gap-2 items-center"
            >
              <div className="bg-secondary/70 border border-border rounded-lg px-3 py-2 font-mono text-[13px] font-semibold text-foreground break-all">
                {name}
              </div>
              <div className="flex items-center justify-center text-primary font-bold text-base">→</div>
              <div className="bg-[#0d1117] border border-primary/30 rounded-lg px-3 py-2 font-mono text-[13px] text-primary break-all">
                {value}
              </div>
              <div className={cn('text-center rounded-full px-2 py-1 text-[9px] font-bold border', tc)}>
                {type}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Interactive Quiz ──────────────────────────────────────────────────────────
// Format: first line = question, then "- Option text" (append ✓ to correct one)
function QuizBlock({ content }: { content: string }) {
  const [selected, setSelected] = useState<number | null>(null)
  const lines = content.trim().split('\n').filter(l => l.trim())
  const question = lines[0]
  const options = lines.slice(1).filter(l => l.startsWith('- ')).map(l => {
    const text = l.slice(2)
    const isCorrect = text.trimEnd().endsWith('✓')
    return { text: isCorrect ? text.trimEnd().slice(0, -1).trim() : text.trim(), isCorrect }
  })
  const correctIdx = options.findIndex(o => o.isCorrect)
  const answered = selected !== null
  const isRight = selected === correctIdx
  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-500/8 to-transparent shadow-lg">
      <div className="bg-violet-500/10 px-4 py-2.5 flex items-center gap-2 border-b border-violet-500/20">
        <span className="text-base">🧩</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-violet-400">Quick Check</span>
        {answered && (
          <span className={cn('ml-auto text-[10px] font-semibold px-2.5 py-0.5 rounded-full border',
            isRight ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
          )}>
            {isRight ? '✓ Correct!' : '✗ Not quite — see green'}
          </span>
        )}
      </div>
      <div className="px-4 pt-3 pb-4 space-y-3">
        <p className="text-sm font-medium text-foreground leading-relaxed">{renderInline(question)}</p>
        <div className="grid gap-2">
          {options.map((opt, idx) => {
            const alpha = String.fromCharCode(65 + idx)
            let rowCls = 'border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 cursor-pointer'
            let dotCls = 'border-border text-muted-foreground bg-transparent'
            if (answered) {
              if (idx === correctIdx)  { rowCls = 'border border-emerald-500/60 bg-emerald-500/10 cursor-default'; dotCls = 'border-emerald-500 bg-emerald-500/30 text-emerald-300' }
              else if (idx === selected){ rowCls = 'border border-red-500/60 bg-red-500/10 cursor-default';     dotCls = 'border-red-500 bg-red-500/30 text-red-300' }
              else                      { rowCls = 'border border-border bg-transparent opacity-35 cursor-default' }
            }
            return (
              <button key={idx} onClick={() => !answered && setSelected(idx)}
                className={cn('rounded-xl px-4 py-2.5 text-left text-sm text-foreground/90 transition-all duration-200 flex items-center gap-3 w-full', rowCls)}
              >
                <span className={cn('w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all', dotCls)}>
                  {answered && idx === correctIdx ? '✓' : answered && idx === selected && !isRight ? '✗' : alpha}
                </span>
                {opt.text}
              </button>
            )
          })}
        </div>
        {!answered && <p className="text-[10px] text-muted-foreground text-center">↑ Pick an option to test yourself</p>}
      </div>
    </div>
  )
}

// ─── Good vs Bad side-by-side ─────────────────────────────────────────────────
// Lines starting with "✓ " = good, "✗ " = bad
function CompareBlock({ content }: { content: string }) {
  const lines = content.trim().split('\n').filter(l => l.trim())
  const good = lines.filter(l => l.startsWith('✓ ')).map(l => l.slice(2))
  const bad  = lines.filter(l => l.startsWith('✗ ')).map(l => l.slice(2))
  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-border shadow-lg">
      <div className="grid grid-cols-2 divide-x divide-border">
        <div>
          <div className="bg-emerald-500/15 px-4 py-2.5 flex items-center gap-2 border-b border-emerald-500/20">
            <span className="text-emerald-400 font-bold text-sm">✓</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Do This</span>
          </div>
          <div className="p-3 space-y-1.5">
            {good.map((line, i) => (
              <div key={i} className="font-mono text-xs bg-emerald-500/10 text-emerald-300 px-3 py-2 rounded-lg border border-emerald-500/20 break-all">
                {line}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-red-500/15 px-4 py-2.5 flex items-center gap-2 border-b border-red-500/20">
            <span className="text-red-400 font-bold text-sm">✗</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">Avoid This</span>
          </div>
          <div className="p-3 space-y-1.5">
            {bad.map((line, i) => (
              <div key={i} className="font-mono text-xs bg-red-500/10 text-red-300 px-3 py-2 rounded-lg border border-red-500/20 break-all">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Fun Fact ─────────────────────────────────────────────────────────────────
function FunFactBlock({ content }: { content: string }) {
  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-amber-400/30 bg-gradient-to-br from-amber-500/8 to-transparent shadow-lg">
      <div className="bg-amber-500/10 px-4 py-2.5 flex items-center gap-2 border-b border-amber-500/20">
        <span className="text-base">🎉</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Did You Know?</span>
      </div>
      <div className="px-4 py-3 space-y-1">
        {content.trim().split('\n').filter(l => l.trim()).map((line, i) => (
          <p key={i} className="text-sm text-foreground/90 leading-relaxed">{renderInline(line)}</p>
        ))}
      </div>
    </div>
  )
}

// These are referenced by components above, defined before renderInline
const LANG_LABEL_MAP: Record<string, string> = {
  python: 'Python', bash: 'Terminal', shell: 'Terminal',
  javascript: 'JavaScript', js: 'JavaScript', ts: 'TypeScript',
  typescript: 'TypeScript', sql: 'SQL', json: 'JSON',
  html: 'HTML', css: 'CSS', output: 'Output',
}
const LANG_DOT_MAP: Record<string, string> = {
  python: 'bg-blue-400', bash: 'bg-gray-400', shell: 'bg-gray-400',
  javascript: 'bg-yellow-400', js: 'bg-yellow-400', typescript: 'bg-blue-500',
  ts: 'bg-blue-500', sql: 'bg-orange-400', json: 'bg-green-400',
  html: 'bg-orange-500', css: 'bg-blue-300', output: 'bg-emerald-400',
}

// ─── Inline renderer: bold + inline-code ─────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\!\[[^\]]*\]\([^)]+\))/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code key={i} className="bg-primary/10 px-1.5 py-0.5 rounded-md text-[11px] font-mono text-primary border border-primary/20">
          {part.slice(1, -1)}
        </code>
      )
    const imgM = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgM)
      return <img key={i} src={imgM[2]} alt={imgM[1]} className="inline-block h-5 align-middle mx-0.5 rounded" />
    return <span key={i}>{part}</span>
  })
}

// ─── Custom block config ──────────────────────────────────────────────────────
const BLOCK_CFG = {
  scenario: {
    bg: 'bg-gradient-to-br from-[rgba(0,212,200,0.08)] to-[rgba(0,212,200,0.03)]',
    border: 'border border-primary/30 border-l-[4px] border-l-primary',
    icon: '📍',
    label: 'Real Scenario',
    labelClass: 'text-primary',
    headerBg: 'bg-primary/10',
  },
  insight: {
    bg: 'bg-gradient-to-br from-[rgba(245,158,11,0.08)] to-[rgba(245,158,11,0.03)]',
    border: 'border border-amber-500/30 border-l-[4px] border-l-amber-500',
    icon: '💡',
    label: 'Real World Insight',
    labelClass: 'text-amber-400',
    headerBg: 'bg-amber-500/10',
  },
  challenge: {
    bg: 'bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(139,92,246,0.03)]',
    border: 'border border-violet-500/30 border-l-[4px] border-l-violet-500',
    icon: '🚀',
    label: 'Challenge',
    labelClass: 'text-violet-400',
    headerBg: 'bg-violet-500/10',
  },
  mistake: {
    bg: 'bg-gradient-to-br from-[rgba(239,68,68,0.08)] to-[rgba(239,68,68,0.03)]',
    border: 'border border-red-500/30 border-l-[4px] border-l-red-500',
    icon: '⚠️',
    label: 'Common Mistake',
    labelClass: 'text-red-400',
    headerBg: 'bg-red-500/10',
  },
  tip: {
    bg: 'bg-gradient-to-br from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.03)]',
    border: 'border border-emerald-500/30 border-l-[4px] border-l-emerald-500',
    icon: '✨',
    label: 'Pro Tip',
    labelClass: 'text-emerald-400',
    headerBg: 'bg-emerald-500/10',
  },
} as const

// LANG_LABEL and LANG_DOT are defined above as LANG_LABEL_MAP / LANG_DOT_MAP (used by CopyCodeBlock)
const LANG_LABEL = LANG_LABEL_MAP
const LANG_DOT = LANG_DOT_MAP

// ─── Block content renderer (supports code fences + inline formatting) ────────
function renderBlockLines(lines: string[], baseKey: number): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let k = baseKey * 10000
  let j = 0
  while (j < lines.length) {
    const line = lines[j]
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase()
      const codeLines: string[] = []
      j++
      while (j < lines.length && !lines[j].startsWith('```')) { codeLines.push(lines[j]); j++ }
      const isOutput = lang === 'output'
      result.push(
        <CopyCodeBlock key={k++} code={codeLines.join('\n')} lang={lang} isOutput={isOutput} />
      )
    } else if (line.trim() === '') {
      result.push(<div key={k++} className="h-1" />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(
        <div key={k++} className="flex items-start gap-2.5 text-sm my-1">
          <span className="text-primary mt-1 flex-shrink-0 text-xs">◆</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/)
      if (m) result.push(
        <div key={k++} className="flex items-start gap-2.5 text-sm my-1">
          <span className="bg-primary/20 text-primary font-mono font-bold text-[10px] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{m[1]}</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(m[2])}</span>
        </div>
      )
    } else {
      result.push(
        <p key={k++} className="text-sm text-foreground/90 leading-relaxed">{renderInline(line)}</p>
      )
    }
    j++
  }
  return result
}

// ─── Main content renderer ────────────────────────────────────────────────────
function renderContent(content: string): React.ReactNode[] {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Custom blocks: :::type … :::
    const blockMatch = line.match(/^:::(\w+)$/)
    if (blockMatch) {
      const type = blockMatch[1]
      const blockLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') { blockLines.push(lines[i]); i++ }
      const blockContent = blockLines.join('\n')

      // New interactive visual blocks
      if (type === 'memorymodel') { elements.push(<MemoryModelBlock key={key++} content={blockContent} />); i++; continue }
      if (type === 'quiz')        { elements.push(<QuizBlock        key={key++} content={blockContent} />); i++; continue }
      if (type === 'compare')     { elements.push(<CompareBlock     key={key++} content={blockContent} />); i++; continue }
      if (type === 'funfact')     { elements.push(<FunFactBlock     key={key++} content={blockContent} />); i++; continue }

      const cfg = BLOCK_CFG[type as keyof typeof BLOCK_CFG]
      if (cfg) {
        elements.push(
          <div key={key++} className={cn('rounded-2xl my-5 overflow-hidden', cfg.bg, cfg.border)}>
            <div className={cn('flex items-center gap-2 px-4 py-2.5', cfg.headerBg)}>
              <span className="text-base leading-none">{cfg.icon}</span>
              <span className={cn('text-[11px] font-bold uppercase tracking-widest', cfg.labelClass)}>{cfg.label}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">{renderBlockLines(blockLines, key)}</div>
          </div>
        )
      }
      i++; continue
    }

    // Images: ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      elements.push(<ZoomableImage key={key++} alt={imgMatch[1]} src={imgMatch[2]} />)
      i++; continue
    }

    // Fenced code blocks
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      const isOutput = lang === 'output'
      elements.push(
        <CopyCodeBlock key={key++} code={codeLines.join('\n')} lang={lang} isOutput={isOutput} />
      )
      i++; continue
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="flex items-center gap-2 text-sm font-bold text-foreground mt-6 mb-2">
          <span className="w-1 h-4 rounded-full bg-primary/60 flex-shrink-0" />
          {renderInline(line.slice(4))}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-base font-bold text-foreground mt-8 mb-3 font-serif flex items-center gap-3">
          <span className="w-1 h-5 rounded-full bg-primary flex-shrink-0" />
          <span>{renderInline(line.slice(3))}</span>
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <div key={key++} className="mt-2 mb-5">
          <h1 className="text-2xl font-bold font-serif gradient-text leading-tight">{line.slice(2)}</h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-transparent rounded-full mt-2" />
        </div>
      )
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="flex items-start gap-3 bg-secondary/30 rounded-xl px-4 py-3 my-3 border-l-4 border-primary/50">
          <span className="text-primary/60 text-lg leading-none mt-0.5">"</span>
          <p className="text-sm text-foreground/80 italic leading-relaxed">{renderInline(line.slice(2))}</p>
        </blockquote>
      )
    }
    // Unordered list
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={key++} className="flex items-start gap-3 text-sm my-1.5 ml-1">
          <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
    }
    // Ordered list
    else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/)
      if (m) elements.push(
        <div key={key++} className="flex items-start gap-3 text-sm my-1.5 ml-1">
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 flex-shrink-0">{m[1]}</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(m[2])}</span>
        </div>
      )
    }
    // Table
    else if (line.startsWith('| ')) {
      const tableLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim())
      const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()))
      elements.push(
        <div key={key++} className="overflow-x-auto my-5 rounded-2xl border border-border shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-secondary/60">
                {headers.map((h, j) => (
                  <th key={j} className="text-left py-3 px-4 text-primary font-semibold text-xs uppercase tracking-wide border-b border-border">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className={cn("border-b border-border transition-colors last:border-0", j % 2 === 0 ? "bg-secondary/10" : "bg-transparent", "hover:bg-primary/5")}>
                  {row.map((cell, k) => (
                    <td key={k} className="py-2.5 px-4 text-foreground/90 text-sm">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1.5" />)
    }
    // Paragraph
    else {
      elements.push(
        <p key={key++} className="text-sm text-foreground/85 leading-7 my-0.5">
          {renderInline(line)}
        </p>
      )
    }

    i++
  }
  return elements
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { updateUser } = useAuthStore()

  const contentPanelRef = useRef<HTMLDivElement>(null)

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [completing, setCompleting] = useState(false)
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2, 3])
  const [lessonCompleteAnim, setLessonCompleteAnim] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [showPointsBurst, setShowPointsBurst] = useState(false)

  // Top-level tab (only used for Python)
  const [activeTab, setActiveTab] = useState<"lessons" | "practice" | "assignment">("lessons")
  const [mcqTopicCounts, setMcqTopicCounts] = useState<Record<string, number>>({})

  // Inline MCQ state
  const [mcqTopic, setMcqTopic] = useState<{ topic: string; subtopic: string; lessonOrder: number } | null>(null)
  const [mcqQuestions, setMcqQuestions] = useState<ApiMcqQuestion[]>([])
  const [mcqLoading, setMcqLoading] = useState(false)
  const [mcqPage, setMcqPage] = useState(1)
  const MCQ_PAGE_SIZE = 5
  const [mcqQStates, setMcqQStates] = useState<McqQState[]>([])
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(null)
  const [moduleAssignments, setModuleAssignments] = useState<ModuleAssignment[]>([])

  const MCQ_LETTERS = ["A", "B", "C", "D", "E"]

  useEffect(() => {
    if (activeTab !== "practice") return
    api.get("/mcq/topics")
      .then(res => {
        const map: Record<string, number> = {}
        for (const t of res.data) {
          for (const sub of t.subtopics) {
            map[`${t.topic}|${sub.name}`] = sub.total
          }
        }
        setMcqTopicCounts(map)
      })
      .catch(() => {})
  }, [activeTab])

  function normalizeMcqQuestions(raw: any[]): ApiMcqQuestion[] {
    return raw.map(q => ({
      ...q,
      options: [q.option_a, q.option_b, q.option_c, q.option_d, q.option_e].filter(Boolean),
      selected_answer: q.selected_answer != null ? MCQ_LETTERS.indexOf(q.selected_answer) : undefined,
      correct_answer: q.correct_option != null ? MCQ_LETTERS.indexOf(q.correct_option) : undefined,
    }))
  }

  async function openMcqTopic(topic: string, subtopic: string, lessonOrder: number) {
    setMcqTopic({ topic, subtopic, lessonOrder })
    setMcqQuestions([])
    setMcqQStates([])
    setMcqPage(1)
    setAnswerFeedback(null)
    setMcqLoading(true)
    try {
      const res = await api.get(`/mcq/questions?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`)
      const normalized = normalizeMcqQuestions(res.data)
      setMcqQuestions(normalized)
      setMcqQStates(normalized.map((q) => ({
        selected: q.attempted ? (q.selected_answer ?? null) : null,
        submitting: false,
        result: q.attempted ? {
          correct: q.is_correct ?? false,
          correct_answer: q.correct_answer ?? -1,
          explanation: q.explanation ?? null,
          points_earned: 0,
          total_points: 0,
        } : null,
        locked: q.attempted && (q.is_correct ?? false),
      })))
    } catch {
      toast.error("Failed to load questions")
      setMcqTopic(null)
    } finally {
      setMcqLoading(false)
    }
  }

  function updateMcqQState(index: number, patch: Partial<McqQState>) {
    setMcqQStates((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  async function handleMcqAnswer(qIndex: number, optionIndex: number) {
    const state = mcqQStates[qIndex]
    if (!state || state.locked || state.submitting) return
    updateMcqQState(qIndex, { selected: optionIndex, submitting: true })
    const q = mcqQuestions[qIndex]
    try {
      const res = await api.post("/mcq/answer", {
        question_id: q.id,
        selected_answer: MCQ_LETTERS[optionIndex],
      })
      const result = res.data
      const correctIndex = MCQ_LETTERS.indexOf(result.correct_option)
      updateMcqQState(qIndex, {
        submitting: false,
        result: { ...result, correct_answer: correctIndex },
        locked: result.correct,
      })
      updateUser({ points: result.total_points })
      if (result.correct) {
        setAnswerFeedback("correct")
        fireStars()
        toast.success(`Correct!${result.points_earned > 0 ? ` +${result.points_earned} pts` : ""}`)
      } else {
        setAnswerFeedback("wrong")
        toast.error("Incorrect — check the explanation below")
      }
      setTimeout(() => setAnswerFeedback(null), 700)
    } catch {
      updateMcqQState(qIndex, { submitting: false, selected: null })
      toast.error("Failed to submit answer")
    }
  }

  function mcqTryAgain(qIndex: number) {
    updateMcqQState(qIndex, { selected: null, result: null, locked: false })
  }

  useEffect(() => {
    api.get(`/learn/courses/${courseId}`)
      .then((res) => {
        const data: Course = res.data
        setCourse(data)
        // Auto-select first incomplete lesson, or first lesson
        const first = data.lessons.find(l => !l.is_completed) ?? data.lessons[0]
        setActiveLesson(first ?? null)
      })
      .catch(() => {
        toast.error("Failed to load course")
        router.push("/learn")
      })
      .finally(() => setLoading(false))
  }, [courseId])

  useEffect(() => {
    if (courseId !== "python" && courseId !== "sql" && courseId !== "html-css") return
    const moduleIds =
      courseId === "sql"
        ? ["sql-basics", "sql-intermediate", "sql-advanced"]
        : courseId === "html-css"
        ? ["html-basics", "css-basics", "css-advanced"]
        : ["python-basics", "python-intermediate", "python-advanced"]
    api.get("/assignments/list")
      .then((res) => {
        const filtered = (res.data as ModuleAssignment[]).filter((a) =>
          moduleIds.includes(a.module_id)
        )
        setModuleAssignments(filtered)
      })
      .catch(() => {/* silently fail — assignment tab will be empty */})
  }, [courseId])

  // Scroll content panel to top on every lesson change
  useEffect(() => {
    if (activeLesson) {
      contentPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeLesson?.id])

  async function markComplete() {
    if (!activeLesson || activeLesson.is_completed) return
    setCompleting(true)
    try {
      const res = await api.post(`/learn/lessons/${activeLesson.id}/complete`)
      const { points_earned, total_points, course_completion_bonus, domain_completion_bonus } = res.data

      // Update local state
      setCourse(prev => {
        if (!prev) return prev
        const updated = prev.lessons.map(l =>
          l.id === activeLesson.id ? { ...l, is_completed: true } : l
        )
        return { ...prev, lessons: updated, lessons_completed: prev.lessons_completed + 1 }
      })
      setActiveLesson(prev => prev ? { ...prev, is_completed: true } : prev)

      updateUser({ points: total_points })

      fireStars()
      setLessonCompleteAnim(true)
      setEarnedPoints(points_earned > 0 ? points_earned : 10)
      setShowPointsBurst(true)
      setTimeout(() => setLessonCompleteAnim(false), 2000)

      if (points_earned > 0) {
        toast.success(`Lesson complete! +${points_earned} pts`)
      } else {
        toast.success("Lesson marked complete")
      }

      if (course_completion_bonus > 0) {
        setTimeout(() => {
          fireSchoolPride()
          toast.success(`Course complete! +${course_completion_bonus} bonus pts`)
        }, 1200)
      }
      if (domain_completion_bonus > 0) {
        setTimeout(() => {
          fireSchoolPride()
          toast.success(`Domain mastered! +${domain_completion_bonus} bonus pts 🎓`)
        }, 2400)
      }

      // Auto-advance to next lesson
      const currentIdx = course!.lessons.findIndex(l => l.id === activeLesson.id)
      const next = course!.lessons[currentIdx + 1]
      if (next) {
        setTimeout(() => setActiveLesson(next), 800)
      }
    } catch {
      toast.error("Failed to mark lesson complete")
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!course) return null

  const progress = course.total_lessons > 0
    ? Math.round((course.lessons_completed / course.total_lessons) * 100)
    : 0

  const activeIdx = course.lessons.findIndex(l => l.id === activeLesson?.id)

  // ── Module definitions for tiered courses ─────────────────────────────────
  const PYTHON_MODULES = [
    { id: 1, title: "Python Basics",        emoji: "🌱", lessonOrders: [1, 2, 3, 4],   bar: "bg-emerald-500" },
    { id: 2, title: "Python Intermediate",  emoji: "⚙️",  lessonOrders: [5, 6, 7, 8],   bar: "bg-amber-500"   },
    { id: 3, title: "Python Advanced",      emoji: "🚀", lessonOrders: [9, 10, 11, 12], bar: "bg-violet-500"  },
  ]
  const SQL_MODULES = [
    { id: 1, title: "SQL Basics",        emoji: "🌱", lessonOrders: [1, 2, 3, 4],   bar: "bg-emerald-500" },
    { id: 2, title: "SQL Intermediate",  emoji: "⚙️",  lessonOrders: [5, 6, 7, 8],   bar: "bg-amber-500"   },
    { id: 3, title: "SQL Advanced",      emoji: "🚀", lessonOrders: [9, 10, 11, 12], bar: "bg-violet-500"  },
  ]
  const HTML_CSS_MODULES = [
    { id: 1, title: "HTML Basics",        emoji: "🌐", lessonOrders: [1, 2, 3, 4, 5],      bar: "bg-emerald-500" },
    { id: 2, title: "CSS Basics & Intermediate", emoji: "🎨", lessonOrders: [6, 7, 8, 9, 10, 11, 12], bar: "bg-amber-500" },
    { id: 3, title: "CSS Advanced",       emoji: "✨", lessonOrders: [13, 14, 15],           bar: "bg-violet-500"  },
  ]
  const EXCEL_MODULES = [
    { id: 1, title: "Excel Beginner",      emoji: "🌱", lessonOrders: [1, 2, 3, 4, 5, 6],          bar: "bg-emerald-500" },
    { id: 2, title: "Excel Intermediate",  emoji: "⚙️",  lessonOrders: [7, 8, 9, 10, 11, 12, 13, 14], bar: "bg-amber-500"   },
    { id: 3, title: "Excel Advanced",      emoji: "🚀", lessonOrders: [15, 16, 17, 18, 19, 20, 21], bar: "bg-violet-500"  },
  ]
  function toggleModule(mid: number) {
    setExpandedModules(prev => prev.includes(mid) ? prev.filter(x => x !== mid) : [...prev, mid])
  }

  const isPython = courseId === "python"
  const isModular = isPython || courseId === "sql" || courseId === "html-css" || courseId === "excel"
  const ACTIVE_MODULES =
    courseId === "sql" ? SQL_MODULES :
    courseId === "html-css" ? HTML_CSS_MODULES :
    courseId === "excel" ? EXCEL_MODULES :
    PYTHON_MODULES

  return (
    <div className="space-y-6">
      <PointsBurst points={earnedPoints} show={showPointsBurst} onDone={() => setShowPointsBurst(false)} />

      <AnimatePresence>
        {lessonCompleteAnim && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl px-6 py-3 backdrop-blur-sm"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Lesson Complete! Keep going 🔥</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/learn")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-serif text-foreground">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("text-xs border", difficultyColors[course.difficulty])}>
            {course.difficulty}
          </Badge>
          <FeedbackModal compact triggerClassName="text-muted-foreground hover:text-primary" />
          <ProgressRing progress={progress} size={52} strokeWidth={4} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{course.lessons_completed} of {course.total_lessons} lessons completed</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* ── Tiered courses: 3-tab nav bar ──────────────────────────────────── */}
      {isModular && (
        <div className="flex gap-1 p-1 rounded-xl bg-secondary/40 border border-border w-fit">
          {(["lessons", "practice", "assignment"] as const).map((tab) => {
            const labels = { lessons: "📖 Lessons", practice: "🧠 MCQ Practice", assignment: "📋 Assignment" }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {labels[tab]}
              </button>
            )
          })}
        </div>
      )}

      {/* ── TAB: Lessons (+ non-tiered courses) ────────────────────────────── */}
      {(!isModular || activeTab === "lessons") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Module / lesson nav — sticky on desktop */}
          <div className="lg:col-span-1 lg:sticky lg:top-4">
            <GlassCard className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold font-serif text-foreground">
                  {isModular ? "Modules" : "Lessons"}
                </h2>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {isModular ? (
                  ACTIVE_MODULES.map((mod) => {
                    const modLessons = course.lessons.filter(l => mod.lessonOrders.includes(l.order))
                    const completed = modLessons.filter(l => l.is_completed).length
                    const total = modLessons.length
                    const modProgress = total > 0 ? Math.round((completed / total) * 100) : 0
                    const isExpanded = expandedModules.includes(mod.id)
                    const hasActive = modLessons.some(l => l.id === activeLesson?.id)

                    return (
                      <div key={mod.id} className="border-b border-border last:border-0">
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/30",
                            hasActive && "bg-primary/5"
                          )}
                        >
                          <span className="text-xl flex-shrink-0">{mod.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-semibold", hasActive ? "text-foreground" : "text-foreground/80")}>
                              {mod.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 bg-secondary/30 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", mod.bar)} style={{ width: `${modProgress}%` }} />
                              </div>
                              <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{completed}/{total}</span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                        </button>

                        {isExpanded && (
                          <div className="bg-secondary/10">
                            {modLessons.map((lesson) => {
                              const isActive = activeLesson?.id === lesson.id
                              const lessonNum = mod.lessonOrders.indexOf(lesson.order) + 1
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setActiveLesson(lesson)}
                                  className={cn(
                                    "w-full flex items-start gap-3 pl-6 pr-4 py-3 text-left border-t border-border transition-colors hover:bg-secondary/30",
                                    isActive && "bg-primary/10 border-l-2 border-l-primary pl-[22px]"
                                  )}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {lesson.is_completed
                                      ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                                      : <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", isActive ? "border-primary bg-primary/20" : "border-white/20")}>
                                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                        </div>
                                    }
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn("text-xs font-medium leading-snug", isActive ? "text-foreground" : lesson.is_completed ? "text-muted-foreground" : "text-foreground/80")}>
                                      {lessonNum}. {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                                      <span className="text-[10px] text-muted-foreground">{lesson.duration_mins} min</span>
                                      <span className="text-[10px] text-amber-500">+{lesson.points} pts</span>
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  course.lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 text-left border-b border-border last:border-0 transition-colors hover:bg-secondary/30",
                        activeLesson?.id === lesson.id && "bg-primary/10 border-l-2 border-l-primary"
                      )}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {lesson.is_completed
                          ? <CheckCircle className="h-5 w-5 text-emerald-400" />
                          : <PlayCircle className={cn("h-5 w-5", activeLesson?.id === lesson.id ? "text-primary" : "text-muted-foreground")} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium truncate", lesson.is_completed ? "text-muted-foreground line-through" : "text-foreground")}>
                          {idx + 1}. {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{lesson.duration_mins} min</span>
                          <span className="text-xs text-amber-500">+{lesson.points} pts</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

          {/* Lesson content */}
          <div className="lg:col-span-2" ref={contentPanelRef}>
            {activeLesson ? (
              <GlassCard className="p-0 overflow-hidden">
                {/* Lesson header */}
                <div className="relative px-6 pt-6 pb-4 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                          Lesson {activeIdx + 1} of {course.total_lessons}
                        </span>
                        {activeLesson.is_completed && (
                          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Completed
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold font-serif text-foreground leading-tight">{activeLesson.title}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />{activeLesson.duration_mins} min read
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />+{activeLesson.points} pts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content area */}
                <div className="px-6 py-6 max-w-none">
                  {(() => {
                    const content = activeLesson.content || getLessonContent(courseId, activeLesson.order)
                    return content
                      ? <div className="space-y-0.5">{renderContent(content)}</div>
                      : <p className="text-muted-foreground text-sm italic">Content coming soon for this lesson.</p>
                  })()}
                </div>

                {/* Footer nav */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20">
                  <Button variant="outline" size="sm" disabled={activeIdx <= 0} onClick={() => setActiveLesson(course.lessons[activeIdx - 1])}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <div className="flex gap-2">
                    {!activeLesson.is_completed && (
                      <Button onClick={markComplete} disabled={completing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {completing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    {activeIdx < course.lessons.length - 1 && (
                      <Button variant="outline" size="sm" onClick={() => setActiveLesson(course.lessons[activeIdx + 1])}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="flex flex-col items-center justify-center h-64">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Select a lesson to start learning</p>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: MCQ Practice ───────────────────────────────────────────────── */}
      {isModular && activeTab === "practice" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Topic list by module — sticky on desktop */}
          <div className="lg:col-span-1 lg:sticky lg:top-4">
            <GlassCard className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold font-serif text-foreground">Topics</h2>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {ACTIVE_MODULES.map((mod) => {
                  const activeMeta = COURSE_TOPIC_META[courseId] ?? PYTHON_TOPIC_META
                  const withQuestions = mod.lessonOrders.filter(o => {
                    const key = `${activeMeta[o]?.topic}|${activeMeta[o]?.subtopic}`
                    return (mcqTopicCounts[key] ?? 0) > 0
                  }).length
                  const total = mod.lessonOrders.length
                  const modPct = total > 0 ? Math.round((withQuestions / total) * 100) : 0
                  const isExpanded = expandedModules.includes(mod.id)
                  const hasSelected = mod.lessonOrders.some(o => mcqTopic?.lessonOrder === o)
                  return (
                    <div key={mod.id} className="border-b border-border last:border-0">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/30",
                          hasSelected && "bg-primary/5"
                        )}
                      >
                        <span className="text-xl flex-shrink-0">{mod.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-semibold", hasSelected ? "text-foreground" : "text-foreground/80")}>
                            {mod.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 bg-secondary/30 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all", mod.bar)} style={{ width: `${modPct}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{withQuestions}/{total}</span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      </button>

                      {isExpanded && (
                        <div className="bg-secondary/10">
                          {mod.lessonOrders.map((order) => {
                            const meta = activeMeta[order]
                            if (!meta) return null
                            const scoreKey = `${meta.topic}|${meta.subtopic}`
                            const isSelected = mcqTopic?.lessonOrder === order
                            const hasQuestions = (mcqTopicCounts[scoreKey] ?? 0) > 0
                            return (
                              <button
                                key={order}
                                onClick={() => openMcqTopic(meta.topic, meta.subtopic, order)}
                                className={cn(
                                  "w-full flex items-start gap-3 pl-6 pr-4 py-3 text-left border-t border-border transition-colors hover:bg-secondary/30",
                                  isSelected && "bg-primary/10 border-l-2 border-l-primary pl-[22px]"
                                )}
                              >
                                <div className="mt-0.5 flex-shrink-0">
                                  <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                    isSelected ? "border-primary bg-primary/20"
                                    : hasQuestions ? "border-white/30"
                                    : "border-white/10"
                                  )}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-xs font-medium leading-snug", isSelected ? "text-foreground" : hasQuestions ? "text-foreground/80" : "text-muted-foreground/50")}>
                                    {meta.subtopic}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-muted-foreground">
                                      {mcqTopicCounts[scoreKey] != null
                                        ? `${mcqTopicCounts[scoreKey]} question${mcqTopicCounts[scoreKey] !== 1 ? "s" : ""}`
                                        : "No questions yet"}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>

          {/* MCQ question panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Answer flash overlay */}
            <AnimatePresence>
              {answerFeedback && (
                <motion.div
                  className={cn(
                    "fixed inset-0 pointer-events-none z-40",
                    answerFeedback === "correct" ? "bg-emerald-500/10" : "bg-red-500/10"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {!mcqTopic ? (
              <GlassCard className="flex flex-col items-center justify-center h-64 text-center gap-3">
                <Brain className="h-10 w-10 text-primary/40" />
                <h3 className="font-semibold font-serif text-foreground">Select a Topic</h3>
                <p className="text-sm text-muted-foreground">Pick a topic from the left to start practicing</p>
              </GlassCard>
            ) : mcqLoading ? (
              <GlassCard className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </GlassCard>
            ) : mcqQuestions.length === 0 ? (
              <GlassCard className="flex flex-col items-center justify-center h-64 gap-3">
                <Brain className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">No questions uploaded for this topic yet.</p>
              </GlassCard>
            ) : (
              <>
                {/* Top strip */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-muted-foreground truncate">
                      <span className="text-foreground font-medium">{mcqTopic.topic}</span>
                      {" › "}
                      <span className="text-foreground">{mcqTopic.subtopic}</span>
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      — Page {mcqPage}/{Math.ceil(mcqQuestions.length / MCQ_PAGE_SIZE)} ({mcqQuestions.length} Qs)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400">Correct</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-red-500/20 bg-red-500/5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-400">Wrong</span>
                    </div>
                  </div>
                </div>

                {/* 5 question cards */}
                <div className="space-y-4">
                  {mcqQuestions.slice((mcqPage - 1) * MCQ_PAGE_SIZE, mcqPage * MCQ_PAGE_SIZE).map((q, localIdx) => {
                    const qIndex = (mcqPage - 1) * MCQ_PAGE_SIZE + localIdx
                    const state = mcqQStates[qIndex]
                    if (!state) return null
                    const result = state.result
                    const isLocked = state.locked

                    return (
                      <GlassCard
                        key={q.id}
                        className={cn(
                          "transition-all duration-200",
                          isLocked && "border-emerald-500/30 bg-emerald-500/5"
                        )}
                      >
                        {/* Question header */}
                        <div className="flex items-start gap-3 mb-4">
                          <span className={cn(
                            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border",
                            isLocked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : result && !result.correct
                              ? "bg-red-500/20 border-red-500/50 text-red-400"
                              : "bg-secondary border-border text-muted-foreground"
                          )}>
                            {qIndex + 1}
                          </span>
                          <p className="text-sm font-medium text-foreground leading-relaxed flex-1">{q.question}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className={cn(
                              "text-[10px]",
                              q.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : q.difficulty === "Medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : "bg-red-500/15 text-red-400 border-red-500/30"
                            )}>
                              {q.difficulty}
                            </Badge>
                            <span className="text-xs text-primary whitespace-nowrap">{q.points} pts</span>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          {q.options.map((opt, idx) => {
                            const isSelected = state.selected === idx
                            const correctAnswer = result?.correct_answer ?? -1
                            const isCorrectOpt = result ? idx === correctAnswer : false
                            const wasSelectedWrong = !!(result && isSelected && !isCorrectOpt)
                            const isLockCorrect = isLocked && idx === correctAnswer

                            return (
                              <button
                                key={idx}
                                onClick={() => !isLocked && !result && !state.submitting && handleMcqAnswer(qIndex, idx)}
                                disabled={isLocked || !!result || state.submitting}
                                className={cn(
                                  "w-full p-3 rounded-xl text-left transition-all duration-150 border text-sm",
                                  !result && !isLocked && isSelected && "border-primary bg-primary/10 text-foreground",
                                  !result && !isLocked && !isSelected && "border-border hover:border-primary/40 hover:bg-primary/5 text-foreground",
                                  isLockCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                                  result && isCorrectOpt && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                                  result && wasSelectedWrong && "border-red-500 bg-red-500/10 text-red-400",
                                  result && !isCorrectOpt && !wasSelectedWrong && "border-border text-muted-foreground opacity-40",
                                  isLocked && !isLockCorrect && "border-border text-muted-foreground opacity-40",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0",
                                    (result && isCorrectOpt) || isLockCorrect ? "bg-emerald-500 border-emerald-500 text-white"
                                    : result && wasSelectedWrong ? "bg-red-500 border-red-500 text-white"
                                    : "border-border text-muted-foreground"
                                  )}>
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className="flex-1 text-sm leading-relaxed">{opt}</span>
                                  {state.submitting && isSelected && <Loader2 className="h-4 w-4 animate-spin ml-auto flex-shrink-0" />}
                                  {((result && isCorrectOpt) || isLockCorrect) && <CheckCircle className="h-4 w-4 ml-auto text-emerald-400 flex-shrink-0" />}
                                  {result && wasSelectedWrong && <XCircle className="h-4 w-4 ml-auto text-red-400 flex-shrink-0" />}
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* Feedback strip */}
                        {(result || isLocked) && (
                          <div className="mt-3 flex items-start justify-between gap-3">
                            <div className={cn(
                              "flex-1 p-3 rounded-lg text-xs leading-relaxed",
                              isLocked || result?.correct
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                            )}>
                              {isLocked && !result && <p className="font-medium mb-1">Already answered correctly!</p>}
                              {result && (
                                <p className="font-medium mb-1">
                                  {result.correct
                                    ? `Correct!${result.points_earned > 0 ? ` +${result.points_earned} pts` : ""}`
                                    : `Wrong — correct answer is ${String.fromCharCode(65 + result.correct_answer)}`}
                                </p>
                              )}
                              {result?.explanation && <p className="text-muted-foreground mt-1">{result.explanation}</p>}
                            </div>
                            {result && !result.correct && (
                              <Button
                                size="sm" variant="outline"
                                onClick={() => mcqTryAgain(qIndex)}
                                className="border-primary/30 text-primary hover:bg-primary/10 flex-shrink-0"
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Try Again
                              </Button>
                            )}
                          </div>
                        )}
                      </GlassCard>
                    )
                  })}
                </div>

                {/* Pagination */}
                {Math.ceil(mcqQuestions.length / MCQ_PAGE_SIZE) > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline" size="sm"
                      onClick={() => setMcqPage((p) => Math.max(1, p - 1))}
                      disabled={mcqPage <= 1}
                      className="text-foreground"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(mcqQuestions.length / MCQ_PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setMcqPage(p)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                            p === mcqPage
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-secondary/50 text-muted-foreground border border-border hover:border-primary/30 hover:text-primary"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => setMcqPage((p) => Math.min(Math.ceil(mcqQuestions.length / MCQ_PAGE_SIZE), p + 1))}
                      disabled={mcqPage >= Math.ceil(mcqQuestions.length / MCQ_PAGE_SIZE)}
                      className="text-foreground"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Assignment ─────────────────────────────────────────────────── */}
      {isModular && activeTab === "assignment" && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Complete the timed assessment for each module to earn points and test your understanding.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {moduleAssignments.map((a, i) => {
              const mod = ACTIVE_MODULES[i]
              const activeMeta = COURSE_TOPIC_META[courseId] ?? PYTHON_TOPIC_META
              const pct = a.total_questions > 0 ? Math.round((a.completed_questions / a.total_questions) * 100) : 0
              return (
                <GlassCard key={a.id} hover className="flex flex-col gap-4">
                  {/* Module identity */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mod?.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Module {i + 1}</p>
                      <h3 className="font-bold font-serif text-foreground text-base">{a.title}</h3>
                    </div>
                  </div>

                  {/* Covered topics */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-medium">Covers:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ACTIVE_MODULES[i]?.lessonOrders.map((order) => (
                        <span key={order} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border">
                          {activeMeta[order]?.subtopic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Timer className="h-3.5 w-3.5" />{a.duration_mins} min
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />{a.total_questions} questions
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />{a.points} pts
                    </span>
                  </div>

                  {/* Progress */}
                  {pct > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span><span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mt-auto"
                    onClick={() => router.push(`/assignments/${a.module_id}`)}
                  >
                    <ClipboardList className="h-4 w-4" />
                    {a.status === "completed" ? "Review" : a.completed_questions > 0 ? "Continue" : "Start Assessment"}
                  </Button>
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
