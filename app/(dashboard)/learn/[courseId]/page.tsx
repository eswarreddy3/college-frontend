"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fireStars } from "@/lib/effects"
import { PointsBurst } from "@/components/points-burst"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { getLessonContent } from "@/content"
import { PYTHON_TOPIC_META, COURSE_TOPIC_META } from "@/lib/python-topics"

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
  due_date: string
  duration_mins: number
  total_questions: number
  completed_questions: number
  status: "pending" | "in-progress" | "completed" | "overdue"
  points: number
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

// ─── Inline renderer: bold + inline-code ─────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code key={i} className="bg-secondary/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-primary border border-border">
          {part.slice(1, -1)}
        </code>
      )
    return <span key={i}>{part}</span>
  })
}

// ─── Custom block config ──────────────────────────────────────────────────────
const BLOCK_CFG = {
  scenario: {
    bg: 'bg-[rgba(0,212,200,0.05)]',
    border: 'border-l-[3px] border-primary',
    icon: '📍',
    label: 'Real Scenario',
    labelClass: 'text-primary',
  },
  insight: {
    bg: 'bg-[rgba(245,158,11,0.05)]',
    border: 'border-l-[3px] border-amber-500',
    icon: '💡',
    label: 'Real World Insight',
    labelClass: 'text-amber-400',
  },
  challenge: {
    bg: 'bg-[rgba(139,92,246,0.05)]',
    border: 'border-l-[3px] border-violet-500',
    icon: '🚀',
    label: 'Challenge',
    labelClass: 'text-violet-400',
  },
  mistake: {
    bg: 'bg-[rgba(239,68,68,0.05)]',
    border: 'border-l-[3px] border-red-500',
    icon: '⚠️',
    label: 'Common Mistake',
    labelClass: 'text-red-400',
  },
  tip: {
    bg: 'bg-[rgba(16,185,129,0.05)]',
    border: 'border-l-[3px] border-emerald-500',
    icon: '✨',
    label: 'Pro Tip',
    labelClass: 'text-emerald-400',
  },
} as const

const LANG_LABEL: Record<string, string> = {
  python: 'Python', bash: 'Terminal', shell: 'Terminal',
  javascript: 'JavaScript', js: 'JavaScript', ts: 'TypeScript',
  typescript: 'TypeScript', sql: 'SQL', json: 'JSON',
  html: 'HTML', css: 'CSS', output: 'Output',
}

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
        <pre key={k++} className={cn(
          'rounded-lg p-3 overflow-x-auto text-xs font-mono mt-2 leading-relaxed',
          isOutput
            ? 'bg-[#050A10] text-emerald-400 border border-emerald-900/40'
            : 'bg-card text-card-foreground border border-border'
        )}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
    } else if (line.trim() === '') {
      result.push(<div key={k++} className="h-1" />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(
        <div key={k++} className="flex items-start gap-2 text-sm my-0.5">
          <span className="text-primary mt-1.5 text-[8px]">▸</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/)
      if (m) result.push(
        <div key={k++} className="flex items-start gap-2 text-sm my-0.5">
          <span className="text-primary font-mono font-bold text-xs mt-0.5 min-w-[14px]">{m[1]}.</span>
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
      const type = blockMatch[1] as keyof typeof BLOCK_CFG
      const blockLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') { blockLines.push(lines[i]); i++ }
      const cfg = BLOCK_CFG[type]
      if (cfg) {
        elements.push(
          <div key={key++} className={cn('rounded-xl p-4 my-4', cfg.bg, cfg.border)}>
            <div className={cn('flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3', cfg.labelClass)}>
              <span>{cfg.icon}</span><span>{cfg.label}</span>
            </div>
            <div className="space-y-1.5">{renderBlockLines(blockLines, key)}</div>
          </div>
        )
      }
      i++; continue
    }

    // Fenced code blocks
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      const label = LANG_LABEL[lang] ?? (lang || null)
      const isOutput = lang === 'output'
      elements.push(
        <div key={key++} className="relative my-4 group">
          {label && (
            <div className={cn(
              'absolute top-0 right-0 px-2.5 py-1 text-[10px] font-mono font-semibold rounded-bl-lg rounded-tr-xl border-b border-l z-10 uppercase tracking-wider',
              isOutput
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                : 'bg-secondary/80 text-muted-foreground border-border'
            )}>{label}</div>
          )}
          <pre className={cn(
            'rounded-xl p-4 pt-7 overflow-x-auto text-sm font-mono leading-relaxed',
            isOutput
              ? 'bg-[#040810] text-emerald-400 border border-emerald-900/40'
              : 'bg-card text-card-foreground border border-border'
          )}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      i++; continue
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-sm font-bold text-foreground mt-5 mb-1.5">{renderInline(line.slice(4))}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-base font-bold text-foreground mt-7 mb-2 font-serif pb-1.5 border-b border-border">
          {renderInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-xl font-bold mt-4 mb-3 font-serif gradient-text">{line.slice(2)}</h1>
      )
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground italic my-2">
          {renderInline(line.slice(2))}
        </blockquote>
      )
    }
    // Unordered list
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 text-sm my-0.5 ml-1">
          <span className="text-primary mt-1.5 text-[8px] flex-shrink-0">▸</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
    }
    // Ordered list
    else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/)
      if (m) elements.push(
        <div key={key++} className="flex items-start gap-2 text-sm my-0.5 ml-1">
          <span className="text-primary font-mono font-bold text-xs mt-0.5 min-w-[16px]">{m[1]}.</span>
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
        <div key={key++} className="overflow-x-auto my-5 rounded-xl border border-border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/60">
                {headers.map((h, j) => (
                  <th key={j} className="text-left py-2.5 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wide border-b border-border">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="border-b border-border hover:bg-secondary/20 transition-colors last:border-0">
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
      elements.push(<div key={key++} className="h-2" />)
    }
    // Paragraph
    else {
      elements.push(
        <p key={key++} className="text-sm text-foreground/85 leading-7">
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

  // Inline MCQ state
  const [mcqTopic, setMcqTopic] = useState<{ topic: string; subtopic: string; lessonOrder: number } | null>(null)
  const [mcqQuestions, setMcqQuestions] = useState<ApiMcqQuestion[]>([])
  const [mcqLoading, setMcqLoading] = useState(false)
  const [mcqIndex, setMcqIndex] = useState(0)
  const [mcqSelected, setMcqSelected] = useState<number | null>(null)
  const [mcqSubmitted, setMcqSubmitted] = useState(false)
  const [mcqResult, setMcqResult] = useState<{ correct: boolean; correct_answer: number; explanation: string | null; points_earned: number } | null>(null)
  const [mcqScores, setMcqScores] = useState<Record<string, { correct: number; total: number }>>({})
  const [moduleAssignments, setModuleAssignments] = useState<ModuleAssignment[]>([])

  async function openMcqTopic(topic: string, subtopic: string, lessonOrder: number) {
    setMcqTopic({ topic, subtopic, lessonOrder })
    setMcqQuestions([])
    setMcqIndex(0)
    setMcqSelected(null)
    setMcqSubmitted(false)
    setMcqResult(null)
    setMcqLoading(true)
    try {
      const res = await api.get(`/mcq/questions?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`)
      setMcqQuestions(res.data)
    } catch {
      toast.error("Failed to load questions")
      setMcqTopic(null)
    } finally {
      setMcqLoading(false)
    }
  }

  async function mcqSubmit() {
    if (mcqSelected === null) return
    const q = mcqQuestions[mcqIndex]
    try {
      const res = await api.post("/mcq/answer", { question_id: q.id, selected_answer: mcqSelected })
      const result = res.data
      setMcqResult(result)
      setMcqSubmitted(true)
      const key = `${mcqTopic?.topic}|${mcqTopic?.subtopic}`
      setMcqScores(prev => {
        const cur = prev[key] ?? { correct: 0, total: 0 }
        return { ...prev, [key]: { correct: cur.correct + (result.correct ? 1 : 0), total: cur.total + 1 } }
      })
      updateUser({ points: result.total_points })
      if (result.correct) toast.success(`Correct!${result.points_earned > 0 ? ` +${result.points_earned} pts` : ""}`)
      else toast.error("Incorrect — see the explanation")
    } catch {
      toast.error("Failed to submit answer")
    }
  }

  function mcqNext() {
    if (mcqIndex < mcqQuestions.length - 1) {
      setMcqIndex(i => i + 1)
      setMcqSelected(null)
      setMcqSubmitted(false)
      setMcqResult(null)
    }
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

  async function markComplete() {
    if (!activeLesson || activeLesson.is_completed) return
    setCompleting(true)
    try {
      const res = await api.post(`/learn/lessons/${activeLesson.id}/complete`)
      const { points_earned, total_points } = res.data

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
  function toggleModule(mid: number) {
    setExpandedModules(prev => prev.includes(mid) ? prev.filter(x => x !== mid) : [...prev, mid])
  }

  const isPython = courseId === "python"
  const isModular = isPython || courseId === "sql" || courseId === "html-css"
  const ACTIVE_MODULES =
    courseId === "sql" ? SQL_MODULES :
    courseId === "html-css" ? HTML_CSS_MODULES :
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
          <div className="lg:col-span-2">
            {activeLesson ? (
              <GlassCard>
                <div className="mb-6">
                  <h2 className="text-xl font-bold font-serif text-foreground">{activeLesson.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />{activeLesson.duration_mins} min
                    </div>
                    <span className="text-xs text-amber-500 font-medium">+{activeLesson.points} pts</span>
                    {activeLesson.is_completed && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Completed</Badge>
                    )}
                  </div>
                </div>

                <div className="prose-sm max-w-none mb-8">
                  {(() => {
                    const content = activeLesson.content || getLessonContent(courseId, activeLesson.order)
                    return content
                      ? renderContent(content)
                      : <p className="text-muted-foreground text-sm italic">Content coming soon for this lesson.</p>
                  })()}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="outline" size="sm" disabled={activeIdx <= 0} onClick={() => setActiveLesson(course.lessons[activeIdx - 1])}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
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
                        Next <ArrowRight className="h-4 w-4 ml-1" />
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
                  const attempted = mod.lessonOrders.filter(o => mcqScores[`${activeMeta[o]?.topic}|${activeMeta[o]?.subtopic}`]).length
                  const total = mod.lessonOrders.length
                  const modPct = total > 0 ? Math.round((attempted / total) * 100) : 0
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
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{attempted}/{total}</span>
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
                            const score = mcqScores[scoreKey]
                            const isSelected = mcqTopic?.lessonOrder === order
                            const isDone = score && score.correct === score.total
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
                                  {isDone
                                    ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                                    : <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", isSelected ? "border-primary bg-primary/20" : "border-white/20")}>
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                      </div>
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-xs font-medium leading-snug", isSelected ? "text-foreground" : isDone ? "text-muted-foreground" : "text-foreground/80")}>
                                    {meta.subtopic}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {score ? (
                                      <span className={cn("text-[10px] font-medium", isDone ? "text-emerald-400" : "text-amber-400")}>
                                        {score.correct}/{score.total} correct
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground">5 questions</span>
                                    )}
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
          <div className="lg:col-span-2">
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
              <GlassCard className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground text-sm">No questions for this topic yet.</p>
              </GlassCard>
            ) : (() => {
              const q = mcqQuestions[mcqIndex]
              const isCorrect = mcqSubmitted && mcqResult?.correct === true
              const isWrong = mcqSubmitted && mcqResult?.correct === false
              return (
                <GlassCard className="space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{mcqTopic.subtopic}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          Question {mcqIndex + 1} / {mcqQuestions.length}
                        </span>
                        <Badge variant="outline" className={cn("text-[10px] border", q.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : q.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-red-500/20 text-red-400 border-red-500/30")}>
                          {q.difficulty}
                        </Badge>
                        <span className="text-xs text-amber-500">+{q.points} pts</span>
                      </div>
                    </div>
                    <Progress value={((mcqIndex + 1) / mcqQuestions.length) * 100} className="w-24 h-1.5" />
                  </div>

                  {/* Question */}
                  <p className="text-base font-medium text-foreground leading-relaxed">{q.question}</p>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((opt, idx) => {
                      const isSelected = mcqSelected === idx
                      const showCorrect = mcqSubmitted && idx === mcqResult?.correct_answer
                      const showWrong = mcqSubmitted && isSelected && idx !== mcqResult?.correct_answer
                      return (
                        <button
                          key={idx}
                          disabled={mcqSubmitted}
                          onClick={() => setMcqSelected(idx)}
                          className={cn(
                            "w-full text-left rounded-xl border px-4 py-3 flex items-start gap-3 transition-all",
                            !mcqSubmitted && isSelected && "border-primary bg-primary/10 text-foreground",
                            !mcqSubmitted && !isSelected && "border-white/8 bg-secondary/30 text-muted-foreground hover:border-white/20 hover:text-foreground",
                            showCorrect && "border-emerald-500/60 bg-emerald-500/10 text-emerald-300",
                            showWrong && "border-red-500/60 bg-red-500/10 text-red-300",
                            mcqSubmitted && !showCorrect && !showWrong && "border-border bg-secondary/20 text-muted-foreground opacity-50"
                          )}
                        >
                          <span className={cn("flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5",
                            !mcqSubmitted && isSelected ? "border-primary bg-primary text-primary-foreground" : "",
                            showCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "",
                            showWrong ? "border-red-500 bg-red-500 text-white" : "",
                            !mcqSubmitted && !isSelected ? "border-white/20 text-muted-foreground" : "",
                            mcqSubmitted && !showCorrect && !showWrong ? "border-border" : ""
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 text-sm leading-relaxed pt-0.5">{opt}</span>
                          {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                          {showWrong && <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />}
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {mcqSubmitted && mcqResult && (
                    <div className={cn("p-3 rounded-xl border text-sm", isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
                      <p className={cn("font-semibold text-xs mb-1", isCorrect ? "text-emerald-400" : "text-red-400")}>
                        {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{mcqResult.explanation ?? q.explanation}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <button
                      onClick={() => { setMcqIndex(i => Math.max(0, i - 1)); setMcqSelected(null); setMcqSubmitted(false); setMcqResult(null) }}
                      disabled={mcqIndex === 0}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </button>

                    <div className="flex gap-2">
                      {!mcqSubmitted ? (
                        <Button
                          size="sm"
                          disabled={mcqSelected === null}
                          onClick={mcqSubmit}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Submit
                        </Button>
                      ) : mcqIndex < mcqQuestions.length - 1 ? (
                        <Button size="sm" onClick={mcqNext} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-2 border-border" onClick={() => { setMcqIndex(0); setMcqSelected(null); setMcqSubmitted(false); setMcqResult(null) }}>
                          <RotateCcw className="h-3.5 w-3.5" /> Restart
                        </Button>
                      )}
                    </div>

                    <button
                      onClick={() => { if (mcqIndex < mcqQuestions.length - 1) { setMcqIndex(i => i + 1); setMcqSelected(null); setMcqSubmitted(false) } }}
                      disabled={mcqIndex === mcqQuestions.length - 1}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Question dots */}
                  <div className="flex gap-1.5 justify-center flex-wrap">
                    {mcqQuestions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setMcqIndex(i); setMcqSelected(null); setMcqSubmitted(false) }}
                        className={cn("w-2 h-2 rounded-full transition-all", i === mcqIndex ? "bg-primary w-4" : "bg-white/20 hover:bg-white/40")}
                      />
                    ))}
                  </div>
                </GlassCard>
              )
            })()}
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
