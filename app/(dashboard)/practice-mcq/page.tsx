"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Code2,
  Brain,
  RotateCcw,
  Database,
  GitBranch,
  Table2,
  Cpu,
  Network,
  FileCode2,
  Terminal,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { motion, AnimatePresence } from "framer-motion"
import { fireStars } from "@/lib/effects"

// ── Programming MCQ types ─────────────────────────────────────────────────────

interface Subtopic {
  name: string
  total: number
  attempted: number
}
interface Topic {
  topic: string
  subtopics: Subtopic[]
}
interface Question {
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
interface ProgQState {
  selected: number | null
  submitting: boolean
  result: { correct: boolean; correct_answer: number; explanation: string | null; points_earned: number; total_points: number } | null
  locked: boolean
}

const difficultyColors = {
  Easy: "chip chip-success",
  Medium: "chip chip-warning",
  Hard: "chip chip-danger",
}

// ── Aptitude types ────────────────────────────────────────────────────────────

interface AptSubtopic {
  name: string
  total: number
  answered: number
}
interface AptTopic {
  topic: string
  total: number
  answered: number
  subtopics: AptSubtopic[]
}
interface AptQuestion {
  id: number
  topic: string
  sub_topic: string | null
  image_url: string | null
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e?: string | null
  correct_option?: string   // 'A'|'B'|'C'|'D' — present when already_correct
  correct_answer?: string   // answer text — present when already_correct
  explanation: string | null
  difficulty?: string
  points?: number
  already_correct: boolean
}
interface AptQState {
  selected: "A" | "B" | "C" | "D" | null
  submitting: boolean
  result: { correct: boolean; correct_option: string; correct_answer: string; explanation: string | null; points_earned: number } | null
  locked: boolean
}

const APT_OPTIONS: { key: "A" | "B" | "C" | "D"; field: keyof AptQuestion }[] = [
  { key: "A", field: "option_a" },
  { key: "B", field: "option_b" },
  { key: "C", field: "option_c" },
  { key: "D", field: "option_d" },
]

// ── Main content ──────────────────────────────────────────────────────────────

function PracticeMCQContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"home" | "programming" | "aptitude">("home")

  // ── Programming state ──────────────────────────────────────────────────────
  const [topics, setTopics] = useState<Topic[]>([])
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState<{ topic: string; subtopic: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [progPage, setProgPage] = useState(1)
  const PROG_PAGE_SIZE = 5
  const [progStates, setProgStates] = useState<ProgQState[]>([])
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(null)

  // ── Aptitude state ─────────────────────────────────────────────────────────
  const [aptTopics, setAptTopics] = useState<AptTopic[]>([])
  const [loadingAptTopics, setLoadingAptTopics] = useState(false)
  const [selectedAptTopic, setSelectedAptTopic] = useState<string | null>(null)
  const [selectedAptSubtopic, setSelectedAptSubtopic] = useState<string | null>(null)
  const [aptPage, setAptPage] = useState(1)
  const [aptTotalPages, setAptTotalPages] = useState(1)
  const [aptTotal, setAptTotal] = useState(0)
  const [aptQuestions, setAptQuestions] = useState<AptQuestion[]>([])
  const [aptStates, setAptStates] = useState<AptQState[]>([])
  const [loadingAptQ, setLoadingAptQ] = useState(false)
  const [aptSidebarOpen, setAptSidebarOpen] = useState(true)

  const { updateUser } = useAuthStore()

  // ── Programming: load topics ───────────────────────────────────────────────
  useEffect(() => {
    if (view !== "programming") return
    setLoadingTopics(true)
    api.get("/mcq/topics")
      .then((res) => {
        setTopics(res.data)
        const first = res.data[0]?.topic
        if (first) setExpandedTopics([first])
      })
      .catch(() => toast.error("Failed to load topics"))
      .finally(() => setLoadingTopics(false))
  }, [view])

  // Auto-select from URL params
  useEffect(() => {
    if (view !== "programming" || loadingTopics || topics.length === 0) return
    const topicParam = searchParams.get("topic")
    const subtopicParam = searchParams.get("subtopic")
    if (topicParam && subtopicParam) {
      setSelectedTopic(topicParam)
      setExpandedTopics((prev) => (prev.includes(topicParam) ? prev : [...prev, topicParam]))
      loadSubtopic(topicParam, subtopicParam)
    }
  }, [view, loadingTopics, topics, searchParams]) // eslint-disable-line

  const loadSubtopic = useCallback((topic: string, subtopic: string) => {
    setSelectedSubtopic({ topic, subtopic })
    setLoadingQuestions(true)
    setProgPage(1)
    setProgStates([])
    api.get(`/mcq/questions?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`)
      .then((res) => {
        const OPT_LETTERS = ["A", "B", "C", "D", "E"]
        const qs: Question[] = res.data.map((q: any) => ({
          ...q,
          options: [q.option_a, q.option_b, q.option_c, q.option_d, q.option_e].filter(Boolean),
          selected_answer: q.selected_answer != null ? OPT_LETTERS.indexOf(q.selected_answer) : undefined,
          correct_answer: q.correct_option != null ? OPT_LETTERS.indexOf(q.correct_option) : undefined,
        }))
        setQuestions(qs)
        setProgStates(qs.map((q) => ({
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
      })
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoadingQuestions(false))
  }, [])

  function toggleTopic(topicName: string) {
    setExpandedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    )
  }

  function updateProgState(index: number, patch: Partial<ProgQState>) {
    setProgStates((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  async function handleProgAnswer(qIndex: number, optionIndex: number) {
    const state = progStates[qIndex]
    if (!state || state.locked || state.submitting) return
    updateProgState(qIndex, { selected: optionIndex, submitting: true })
    const q = questions[qIndex]
    const OPT_LETTERS = ["A", "B", "C", "D", "E"]
    try {
      const res = await api.post("/mcq/answer", {
        question_id: q.id,
        selected_answer: OPT_LETTERS[optionIndex],
      })
      const result = res.data
      const correctIndex = OPT_LETTERS.indexOf(result.correct_option)
      updateProgState(qIndex, {
        submitting: false,
        result: { ...result, correct_answer: correctIndex },
        locked: result.correct,
      })
      setQuestions((prev) => prev.map((qq, i) =>
        i === qIndex ? { ...qq, attempted: true, selected_answer: optionIndex, is_correct: result.correct, correct_answer: correctIndex } : qq
      ))
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
      api.get("/mcq/topics").then((res) => setTopics(res.data)).catch(() => {})
    } catch {
      updateProgState(qIndex, { submitting: false, selected: null })
      toast.error("Failed to submit answer")
    }
  }

  function progTryAgain(qIndex: number) {
    updateProgState(qIndex, { selected: null, result: null, locked: false })
  }

  // ── Aptitude helpers ───────────────────────────────────────────────────────
  const loadAptTopics = useCallback(() => {
    setLoadingAptTopics(true)
    api.get("/mcq/aptitude/topics")
      .then((res) => setAptTopics(res.data))
      .catch(() => toast.error("Failed to load aptitude topics"))
      .finally(() => setLoadingAptTopics(false))
  }, [])

  useEffect(() => {
    if (view === "aptitude") loadAptTopics()
  }, [view]) // eslint-disable-line

  const loadAptQuestions = useCallback((topic: string, subtopic: string | null, page: number) => {
    setLoadingAptQ(true)
    let url = `/mcq/aptitude/questions?topic=${encodeURIComponent(topic)}&page=${page}`
    if (subtopic) url += `&subtopic=${encodeURIComponent(subtopic)}`
    api.get(url)
      .then((res) => {
        const qs: AptQuestion[] = res.data.questions
        setAptQuestions(qs)
        setAptTotalPages(res.data.total_pages)
        setAptTotal(res.data.total)
        setAptStates(qs.map((q) => ({
          selected: q.already_correct ? (q.correct_option as "A"|"B"|"C"|"D" ?? null) : null,
          submitting: false,
          result: null,
          locked: q.already_correct,
        })))
      })
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoadingAptQ(false))
  }, [])

  function selectAptSubtopic(topic: string, subtopic: string) {
    setSelectedAptTopic(topic)
    setSelectedAptSubtopic(subtopic)
    setAptPage(1)
    loadAptQuestions(topic, subtopic, 1)
  }

  function aptChangePage(newPage: number) {
    if (!selectedAptTopic) return
    setAptPage(newPage)
    loadAptQuestions(selectedAptTopic, selectedAptSubtopic, newPage)
  }

  function updateAptState(index: number, patch: Partial<AptQState>) {
    setAptStates((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  async function handleAptAnswer(qIndex: number, answer: "A" | "B" | "C" | "D") {
    const state = aptStates[qIndex]
    if (state.locked || state.submitting) return
    updateAptState(qIndex, { selected: answer, submitting: true })
    try {
      const res = await api.post("/mcq/aptitude/answer", {
        question_id: aptQuestions[qIndex].id,
        selected_answer: answer,
      })
      const result = res.data
      updateAptState(qIndex, { submitting: false, result, locked: result.correct })
      if (result.correct) {
        fireStars()
        setAnswerFeedback("correct")
        setTimeout(() => setAnswerFeedback(null), 700)
        if (result.points_earned > 0) {
          updateUser({ points: result.total_points })
          toast.success(`+${result.points_earned} pt`)
        }
        loadAptTopics()
      } else {
        setAnswerFeedback("wrong")
        setTimeout(() => setAnswerFeedback(null), 700)
      }
    } catch {
      updateAptState(qIndex, { submitting: false, selected: null })
      toast.error("Failed to submit answer")
    }
  }

  function handleAptTryAgain(qIndex: number) {
    updateAptState(qIndex, { selected: null, result: null, locked: false })
  }

  // ── Topic meta ────────────────────────────────────────────────────────────
  const TOPIC_META: Record<string, { icon: React.ElementType }> = {
    "Python":            { icon: FileCode2  },
    "Java":              { icon: Code2      },
    "C":                 { icon: Terminal   },
    "C++":               { icon: Terminal   },
    "SQL":               { icon: Database   },
    "DBMS":              { icon: Database   },
    "DSA":               { icon: Layers     },
    "Data Structures":   { icon: Layers     },
    "Algorithms":        { icon: Cpu        },
    "OS":                { icon: Cpu        },
    "Operating Systems": { icon: Cpu        },
    "Networks":          { icon: Network    },
    "Computer Networks": { icon: Network    },
    "Git":               { icon: GitBranch  },
    "Excel":             { icon: Table2     },
    "JavaScript":        { icon: FileCode2  },
    "Web":               { icon: Network    },
  }
  const getTopicMeta = (name: string) =>
    TOPIC_META[name] ?? { icon: Code2 }

  // ── Render: Home ───────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <motion.div
        className="flex flex-col gap-10 max-w-4xl mx-auto py-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Page header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-serif gradient-text">Practice MCQ</h1>
          <p className="text-muted-foreground text-sm">Sharpen your skills across two categories</p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Programming card */}
          <motion.button
            onClick={() => setView("programming")}
            className="text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col gap-5 cursor-pointer border border-border hover:border-primary/50 teal-glow transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold font-serif text-foreground">Programming MCQ</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Topic-based questions on DSA, Python, Java, DBMS, OS, Networks, and more. Perfect for technical interview prep.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <span className="text-sm font-medium text-primary flex items-center gap-1.5">
                  Start Practice
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </motion.button>

          {/* Aptitude card */}
          <motion.button
            onClick={() => setView("aptitude")}
            className="text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col gap-5 cursor-pointer border border-border hover:border-primary/50 transition-all duration-200"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold font-serif text-foreground">Aptitude &amp; Reasoning</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Quantitative aptitude, logical reasoning, and data interpretation. Boost your placement test scores.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <span className="text-sm font-medium text-primary flex items-center gap-1.5">
                  Start Practice
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Tip pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: "💡", label: "Instant feedback" },
            { icon: "📊", label: "Progress tracking" },
            { icon: "🏆", label: "Earn points" },
          ].map((tip) => (
            <div
              key={tip.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground"
            >
              <span>{tip.icon}</span>
              <span>{tip.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  // ── Render: Programming MCQ ────────────────────────────────────────────────
  if (view === "programming") {
    const totalAttempted = topics.reduce(
      (acc, t) => acc + t.subtopics.reduce((a, s) => a + s.attempted, 0),
      0
    )

    return (
      <div className="flex flex-col gap-4 h-full">
        {/* Answer feedback flash */}
        <AnimatePresence>
          {answerFeedback && (
            <motion.div
              className={cn(
                "fixed inset-0 pointer-events-none z-40",
                answerFeedback === "correct" ? "bg-success/10" : "bg-danger/10"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => { setView("home"); setSelectedTopic(null); setSelectedSubtopic(null) }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Code2 className="h-4 w-4 text-primary" />
            Programming MCQ
          </div>
          <FeedbackModal compact triggerClassName="text-muted-foreground hover:text-primary" />
        </div>

        {/* ── Step 1: Full-width topic card grid (no topic selected) ── */}
        {!selectedTopic && (
          <div className="flex-1">
            {loadingTopics ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-foreground">Choose a Topic</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {totalAttempted > 0
                        ? `${totalAttempted} questions answered across all topics`
                        : "Pick a topic to start practising"}
                    </p>
                  </div>
                  {totalAttempted > 0 && (
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                      {totalAttempted} done
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {topics.map((t, i) => {
                    const meta = getTopicMeta(t.topic)
                    const total = t.subtopics.reduce((a, s) => a + s.total, 0)
                    const attempted = t.subtopics.reduce((a, s) => a + s.attempted, 0)
                    const pct = total > 0 ? Math.round((attempted / total) * 100) : 0
                    const Icon = meta.icon
                    return (
                      <motion.button
                        key={t.topic}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSelectedTopic(t.topic); setExpandedTopics([t.topic]) }}
                        className="text-left group"
                      >
                        <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 h-full border border-border hover:border-primary/40 transition-all duration-200">
                          {/* Top row: icon + chevron */}
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                          </div>

                          {/* Topic name + subtopics */}
                          <div className="flex-1">
                            <p className="font-bold text-base leading-tight text-foreground">{t.topic}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t.subtopics.length} subtopics · {total} questions</p>
                          </div>

                          {/* Progress */}
                          <div className="space-y-1.5">
                            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              {pct === 100 ? (
                                <span className="font-semibold text-success">✓ Complete</span>
                              ) : attempted > 0 ? (
                                <span className="text-primary font-medium">In Progress</span>
                              ) : (
                                <span className="text-muted-foreground">Not started</span>
                              )}
                              <span className="text-muted-foreground">{attempted}/{total}</span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ── Step 2: Split view (topic selected) ── */}
        {selectedTopic && (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0" style={{ height: "calc(100vh - 10rem)" }}>
          {/* Left sidebar — subtopic list */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col min-h-0">
            <GlassCard className="h-full overflow-y-auto flex flex-col gap-0">
              {/* Back + topic header */}
              <button
                onClick={() => { setSelectedTopic(null); setSelectedSubtopic(null) }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> All Topics
              </button>
              {(() => {
                const t = topics.find(t => t.topic === selectedTopic)!
                const meta = getTopicMeta(selectedTopic)
                const Icon = meta.icon
                const total = t?.subtopics.reduce((a, s) => a + s.total, 0) ?? 0
                const attempted = t?.subtopics.reduce((a, s) => a + s.attempted, 0) ?? 0
                return (
                  <div className="rounded-xl p-3 mb-4 border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-primary">{selectedTopic}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 relative z-10">
                      <span>{attempted} of {total} answered</span>
                      <span className="font-semibold">{total > 0 ? Math.round((attempted/total)*100) : 0}%</span>
                    </div>
                    <Progress value={total > 0 ? (attempted/total)*100 : 0} className="h-1.5 relative z-10" />
                  </div>
                )
              })()}
              {/* Subtopics */}
              <div className="space-y-1">
                {topics.find(t => t.topic === selectedTopic)?.subtopics.map((sub) => {
                  const isActive = selectedSubtopic?.topic === selectedTopic && selectedSubtopic?.subtopic === sub.name
                  const pct = sub.total > 0 ? (sub.attempted / sub.total) * 100 : 0
                  return (
                    <button
                      key={sub.name}
                      onClick={() => loadSubtopic(selectedTopic, sub.name)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border",
                        isActive
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent hover:border-border"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{sub.name}</span>
                        <span className="text-xs opacity-70">{sub.attempted}/{sub.total}</span>
                      </div>
                      <Progress value={pct} className="h-0.5 opacity-50" />
                    </button>
                  )
                })}
              </div>
            </GlassCard>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col min-h-0 gap-3">
            {!selectedSubtopic ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <GlassCard className="text-center max-w-sm">
                  <ChevronRight className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <h3 className="font-semibold font-serif text-foreground mb-2">Choose a Subtopic</h3>
                  <p className="text-sm text-muted-foreground">Pick a subtopic from the left panel to start practising</p>
                </GlassCard>
              </div>
            ) : loadingQuestions ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No questions available for this subtopic.</p>
              </div>
            ) : (
              <>
                {/* Top strip */}
                <div className="flex items-center justify-between gap-3 flex-shrink-0 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-muted-foreground truncate">
                      <span className="text-foreground font-medium">{selectedSubtopic.topic}</span>
                      {" › "}
                      <span className="text-foreground">{selectedSubtopic.subtopic}</span>
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      — Page {progPage}/{Math.ceil(questions.length / PROG_PAGE_SIZE)} ({questions.length} Qs)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-success/20 bg-success/5">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-success">Correct</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-danger/20 bg-danger/5">
                      <div className="w-2 h-2 rounded-full bg-danger" />
                      <span className="text-danger">Wrong</span>
                    </div>
                  </div>
                </div>

                {/* 5 question cards */}
                <div className="space-y-4">
                  {questions.slice((progPage - 1) * PROG_PAGE_SIZE, progPage * PROG_PAGE_SIZE).map((q, localIdx) => {
                    const qIndex = (progPage - 1) * PROG_PAGE_SIZE + localIdx
                    const state = progStates[qIndex]
                    if (!state) return null
                    const result = state.result
                    const isLocked = state.locked

                    return (
                      <GlassCard
                        key={q.id}
                        className={cn(
                          "transition-all duration-200",
                          isLocked && "border-success/30 bg-success/5"
                        )}
                      >
                        {/* Question header */}
                        <div className="flex items-start gap-3 mb-4">
                          <span className={cn(
                            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border",
                            isLocked
                              ? "bg-success border-success text-white"
                              : result && !result.correct
                              ? "bg-danger/20 border-danger/50 text-danger"
                              : "bg-secondary border-border text-muted-foreground"
                          )}>
                            {qIndex + 1}
                          </span>
                          <p className="text-sm font-medium text-foreground leading-relaxed flex-1">{q.question}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className={cn("text-xs", difficultyColors[q.difficulty])}>
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
                                onClick={() => !isLocked && !result && !state.submitting && handleProgAnswer(qIndex, idx)}
                                disabled={isLocked || !!result || state.submitting}
                                className={cn(
                                  "w-full p-3 rounded-xl text-left transition-all duration-150 border text-sm",
                                  !result && !isLocked && isSelected && "border-primary bg-primary/10 text-foreground",
                                  !result && !isLocked && !isSelected && "border-border hover:border-primary/40 hover:bg-primary/5 text-foreground",
                                  isLockCorrect && "border-success bg-success/10 text-success",
                                  result && isCorrectOpt && "border-success bg-success/10 text-success",
                                  result && wasSelectedWrong && "border-danger bg-danger/10 text-danger",
                                  result && !isCorrectOpt && !wasSelectedWrong && "border-border text-muted-foreground opacity-40",
                                  isLocked && !isLockCorrect && "border-border text-muted-foreground opacity-40",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0",
                                    (result && isCorrectOpt) || isLockCorrect ? "bg-success border-success text-white"
                                    : result && wasSelectedWrong ? "bg-danger border-danger text-white"
                                    : "border-border text-muted-foreground"
                                  )}>
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                  {state.submitting && isSelected && <Loader2 className="h-4 w-4 animate-spin ml-auto flex-shrink-0" />}
                                  {((result && isCorrectOpt) || isLockCorrect) && <CheckCircle className="h-4 w-4 ml-auto text-success flex-shrink-0" />}
                                  {result && wasSelectedWrong && <XCircle className="h-4 w-4 ml-auto text-danger flex-shrink-0" />}
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
                                ? "bg-success/10 border border-success/20 text-success"
                                : "bg-danger/10 border border-danger/20 text-danger"
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
                                onClick={() => progTryAgain(qIndex)}
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
                {Math.ceil(questions.length / PROG_PAGE_SIZE) > 1 && (
                  <div className="flex items-center justify-between pt-2 flex-shrink-0">
                    <Button
                      variant="outline" size="sm"
                      onClick={() => setProgPage((p) => Math.max(1, p - 1))}
                      disabled={progPage <= 1}
                      className="text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(questions.length / PROG_PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setProgPage(p)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                            p === progPage
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-secondary/50 text-muted-foreground border border-border hover:border-primary/40 hover:text-primary"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => setProgPage((p) => Math.min(Math.ceil(questions.length / PROG_PAGE_SIZE), p + 1))}
                      disabled={progPage >= Math.ceil(questions.length / PROG_PAGE_SIZE)}
                      className="text-foreground"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        )}
      </div>
    )
  }

  // ── Render: Aptitude ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Answer feedback flash */}
      <AnimatePresence>
        {answerFeedback && (
          <motion.div
            className={cn(
              "fixed inset-0 pointer-events-none z-40",
              answerFeedback === "correct" ? "bg-success/10" : "bg-danger/10"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Back button + header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Brain className="h-4 w-4 text-primary" />
          Aptitude &amp; Reasoning
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-4">
          {/* Mobile collapse toggle */}
          <button
            onClick={() => setAptSidebarOpen((o) => !o)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card mb-2 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Brain className="h-4 w-4 text-primary" />
              Topics
              {selectedAptTopic && (
                <span className="text-primary text-xs font-normal truncate max-w-[120px]">· {selectedAptTopic}{selectedAptSubtopic ? ` › ${selectedAptSubtopic}` : ""}</span>
              )}
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", aptSidebarOpen && "rotate-180")} />
          </button>

          {/* Panel — hidden on mobile when collapsed */}
          <div className={cn("lg:block", aptSidebarOpen ? "block" : "hidden")}>
            <GlassCard className="p-0 overflow-hidden">
              {/* Desktop header */}
              <div className="hidden lg:flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
                <Brain className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-semibold font-serif text-foreground text-sm">Topics</span>
              </div>

              {/* Scrollable topic list */}
              <div className="max-h-[45vh] lg:max-h-[calc(100vh-14rem)] overflow-y-auto p-2">
                {loadingAptTopics ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {aptTopics.map((t) => {
                      const isTopicSelected = selectedAptTopic === t.topic
                      const pct = t.total > 0 ? Math.round((t.answered / t.total) * 100) : 0
                      return (
                        <div key={t.topic}>
                          {/* Topic row */}
                          <button
                            onClick={() => {
                              if (isTopicSelected) { setSelectedAptTopic(null); setSelectedAptSubtopic(null) }
                              else { setSelectedAptTopic(t.topic); setSelectedAptSubtopic(null) }
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                              isTopicSelected
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium truncate flex-1">{t.topic}</span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-xs opacity-60 tabular-nums">{t.answered}/{t.total}</span>
                                <ChevronDown className={cn(
                                  "h-3.5 w-3.5 transition-transform duration-200",
                                  isTopicSelected ? "rotate-180 text-primary" : "text-muted-foreground"
                                )} />
                              </div>
                            </div>
                            <Progress value={pct} className="h-0.5 mt-1.5 opacity-40" />
                          </button>

                          {/* Subtopics (only when topic expanded) */}
                          {isTopicSelected && (
                            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2">
                              {t.subtopics.map((sub) => {
                                const isActiveSub = selectedAptSubtopic === sub.name
                                const subPct = sub.total > 0 ? Math.round((sub.answered / sub.total) * 100) : 0
                                return (
                                  <button
                                    key={sub.name}
                                    onClick={() => {
                                      selectAptSubtopic(t.topic, sub.name)
                                      if (window.innerWidth < 1024) setAptSidebarOpen(false)
                                    }}
                                    className={cn(
                                      "w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors",
                                      isActiveSub
                                        ? "bg-primary/15 text-primary"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-medium truncate flex-1">{sub.name}</span>
                                      <span className="opacity-50 tabular-nums flex-shrink-0">{sub.answered}/{sub.total}</span>
                                    </div>
                                    <Progress value={subPct} className="h-0.5 mt-1 opacity-30" />
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col gap-4">
          {!selectedAptSubtopic ? (
            <div className="flex-1 flex items-center justify-center">
              <GlassCard className="text-center max-w-sm">
                <Brain className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <h3 className="font-semibold font-serif text-foreground mb-2">
                  {selectedAptTopic ? "Select a Subtopic" : "Select a Topic"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAptTopic ? "Pick a subtopic from the left to start practising" : "Choose an aptitude topic from the left panel"}
                </p>
              </GlassCard>
            </div>
          ) : loadingAptQ ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{selectedAptTopic}</span>
                    {selectedAptSubtopic && <> <span className="opacity-50">›</span> <span className="text-foreground">{selectedAptSubtopic}</span></>}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    — Page {aptPage}/{aptTotalPages} ({aptTotal} Qs)
                  </span>
                </div>
                {/* Legend pills */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-success/20 bg-success/5">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-success">Correct</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-danger/20 bg-danger/5">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <span className="text-danger">Wrong</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-secondary/30">
                    <div className="w-2 h-2 rounded-full bg-secondary border border-border" />
                    <span>Unattempted</span>
                  </div>
                </div>
              </div>

              {/* Question cards */}
              <div className="space-y-3">
                {aptQuestions.map((q, qIdx) => {
                  const state = aptStates[qIdx]
                  if (!state) return null
                  const result = state.result
                  // Use correct_option (letter) — NOT correct_answer (text)
                  const correctKey: string | undefined =
                    result?.correct_option ?? (state.locked ? q.correct_option : undefined)
                  const isAnswered = !!result || state.locked
                  const qNum = (aptPage - 1) * 5 + qIdx + 1

                  return (
                    <GlassCard
                      key={q.id}
                      className={cn(
                        "transition-all duration-200 p-4 sm:p-5",
                        state.locked && !result && "border-success/20",
                        result?.correct && "border-success/20",
                        result && !result.correct && "border-danger/20",
                      )}
                    >
                      {/* Question row */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Number badge */}
                        <span className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border mt-0.5",
                          state.locked && !result ? "bg-success border-success text-white"
                            : result?.correct ? "bg-success border-success text-white"
                            : result && !result.correct ? "bg-danger/20 border-danger/40 text-danger"
                            : "bg-secondary border-border text-muted-foreground"
                        )}>
                          {result?.correct || (state.locked && !result) ? <CheckCircle className="h-3.5 w-3.5" />
                            : result && !result.correct ? <XCircle className="h-3.5 w-3.5" />
                            : qNum}
                        </span>
                        <p className="text-sm font-medium text-foreground leading-relaxed flex-1">{q.question}</p>
                      </div>

                      {/* Image */}
                      {q.image_url && (
                        <img src={q.image_url} alt="Question diagram"
                          className="mb-3 rounded-lg max-h-44 object-contain border border-border"
                        />
                      )}

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {APT_OPTIONS.map(({ key, field }) => {
                          const optText = q[field] as string
                          const isSelected = state.selected === key
                          const isCorrectOpt = correctKey ? key === correctKey : false
                          const isWrongSelected = isAnswered && isSelected && !isCorrectOpt

                          return (
                            <button
                              key={key}
                              onClick={() => !isAnswered && !state.submitting && handleAptAnswer(qIdx, key)}
                              disabled={isAnswered || state.submitting}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm border transition-all duration-150",
                                // Unanswered idle
                                !isAnswered && !isSelected && "border-border text-foreground hover:border-primary/40 hover:bg-primary/5",
                                // Unanswered selected (pre-submit highlight)
                                !isAnswered && isSelected && "border-primary bg-primary/10 text-foreground",
                                // Correct option after answer
                                isAnswered && isCorrectOpt && "border-success/60 bg-success/10 text-success",
                                // Wrong selected
                                isAnswered && isWrongSelected && "border-danger/60 bg-danger/10 text-danger",
                                // Neutral unchosen after answer
                                isAnswered && !isCorrectOpt && !isWrongSelected && "border-border text-muted-foreground opacity-50",
                              )}
                            >
                              {/* Letter badge */}
                              <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0",
                                isAnswered && isCorrectOpt ? "bg-success border-success text-white"
                                  : isAnswered && isWrongSelected ? "bg-danger border-danger text-white"
                                  : !isAnswered && isSelected ? "border-primary text-primary"
                                  : "border-border text-muted-foreground"
                              )}>
                                {key}
                              </span>
                              <span className="flex-1 leading-snug">{optText}</span>
                              {state.submitting && isSelected && <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0 text-primary" />}
                              {isAnswered && isCorrectOpt && <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-success" />}
                              {isAnswered && isWrongSelected && <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-danger" />}
                            </button>
                          )
                        })}
                      </div>

                      {/* Feedback bar */}
                      {isAnswered && (
                        <div className={cn(
                          "mt-3 rounded-lg px-3 py-2 text-xs border flex items-start justify-between gap-3",
                          state.locked && !result ? "bg-success/8 border-success/20 text-success"
                            : result?.correct ? "bg-success/8 border-success/20 text-success"
                            : "bg-danger/8 border-danger/20 text-danger"
                        )}>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold mb-0.5">
                              {state.locked && !result
                                ? "Already answered correctly"
                                : result?.correct
                                ? `Correct!${result.points_earned > 0 ? ` +${result.points_earned} pt` : ""}`
                                : `Incorrect — correct answer: ${result?.correct_option}`}
                            </p>
                            {(result?.explanation || (state.locked && q.explanation)) && (
                              <p className="text-muted-foreground leading-relaxed">
                                {result?.explanation ?? q.explanation}
                              </p>
                            )}
                          </div>
                          {result && !result.correct && (
                            <button
                              onClick={() => handleAptTryAgain(qIdx)}
                              className="flex items-center gap-1 text-xs text-primary hover:text-primary border border-primary/30 rounded-lg px-2 py-1 flex-shrink-0 transition-colors"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Retry
                            </button>
                          )}
                        </div>
                      )}
                    </GlassCard>
                  )
                })}
              </div>

              {/* Windowed pagination — safe for 2000+ pages */}
              {aptTotalPages > 1 && (() => {
                const delta = 2
                const pages: (number | "…")[] = []
                const addPage = (p: number) => { if (p >= 1 && p <= aptTotalPages) pages.push(p) }
                addPage(1)
                if (aptPage - delta > 2) pages.push("…")
                for (let p = Math.max(2, aptPage - delta); p <= Math.min(aptTotalPages - 1, aptPage + delta); p++) pages.push(p)
                if (aptPage + delta < aptTotalPages - 1) pages.push("…")
                if (aptTotalPages > 1) addPage(aptTotalPages)

                return (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => aptChangePage(aptPage - 1)} disabled={aptPage <= 1} className="text-foreground">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {pages.map((p, i) =>
                        p === "…" ? (
                          <span key={`e${i}`} className="w-8 text-center text-xs text-muted-foreground">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => aptChangePage(p as number)}
                            className={cn(
                              "w-8 h-8 rounded-lg text-xs font-medium transition-all border",
                              p === aptPage
                                ? "bg-primary/20 text-primary border-primary/30"
                                : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                            )}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => aptChangePage(aptPage + 1)} disabled={aptPage >= aptTotalPages} className="text-foreground">
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PracticeMCQPage() {
  return (
    <Suspense>
      <PracticeMCQContent />
    </Suspense>
  )
}
