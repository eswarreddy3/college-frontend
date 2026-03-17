"use client"

import { Suspense, useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Code2,
  Brain,
  RotateCcw,
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
type QuestionStatus = "unattempted" | "answered" | "marked"

const difficultyColors = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
}

// ── Aptitude types ────────────────────────────────────────────────────────────

interface AptTopic {
  topic_name: string
  total: number
  answered: number
}
interface AptQuestion {
  id: number
  topic_name: string
  image_url: string | null
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  explanation: string | null
  already_correct: boolean
}
interface AptQState {
  selected: "A" | "B" | "C" | "D" | null
  submitting: boolean
  result: { correct: boolean; correct_answer: string; explanation: string | null; points_earned: number } | null
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
  const [selectedSubtopic, setSelectedSubtopic] = useState<{ topic: string; subtopic: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>([])
  const [serverResult, setServerResult] = useState<{
    correct: boolean; correct_answer: number; explanation: string | null; points_earned: number; total_points: number
  } | null>(null)
  const tryingAgainRef = useRef(false)
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(null)

  // ── Aptitude state ─────────────────────────────────────────────────────────
  const [aptTopics, setAptTopics] = useState<AptTopic[]>([])
  const [loadingAptTopics, setLoadingAptTopics] = useState(false)
  const [selectedAptTopic, setSelectedAptTopic] = useState<string | null>(null)
  const [aptPage, setAptPage] = useState(1)
  const [aptTotalPages, setAptTotalPages] = useState(1)
  const [aptTotal, setAptTotal] = useState(0)
  const [aptQuestions, setAptQuestions] = useState<AptQuestion[]>([])
  const [aptStates, setAptStates] = useState<AptQState[]>([])
  const [loadingAptQ, setLoadingAptQ] = useState(false)

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
      setExpandedTopics((prev) => (prev.includes(topicParam) ? prev : [...prev, topicParam]))
      loadSubtopic(topicParam, subtopicParam)
    }
  }, [view, loadingTopics, topics, searchParams]) // eslint-disable-line

  const loadSubtopic = useCallback((topic: string, subtopic: string) => {
    setSelectedSubtopic({ topic, subtopic })
    setLoadingQuestions(true)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsSubmitted(false)
    setServerResult(null)
    api.get(`/mcq/questions?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`)
      .then((res) => {
        const qs: Question[] = res.data
        setQuestions(qs)
        setQuestionStatuses(qs.map((q) => (q.attempted ? "answered" : "unattempted")))
        if (qs[0]?.attempted) {
          setSelectedAnswer(qs[0].selected_answer ?? null)
          setIsSubmitted(true)
        }
      })
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoadingQuestions(false))
  }, [])

  function toggleTopic(topicName: string) {
    setExpandedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    )
  }

  function navigateTo(index: number) {
    setCurrentIndex(index)
    setServerResult(null)
    const q = questions[index]
    if (q?.attempted) {
      setSelectedAnswer(q.selected_answer ?? null)
      setIsSubmitted(true)
    } else {
      setSelectedAnswer(null)
      setIsSubmitted(false)
    }
  }

  async function handleSubmit() {
    if (selectedAnswer === null) { toast.error("Please select an answer"); return }
    const q = questions[currentIndex]
    setSubmitting(true)
    tryingAgainRef.current = false
    try {
      const res = await api.post("/mcq/answer", { question_id: q.id, selected_answer: selectedAnswer })
      const result = res.data
      setServerResult(result)
      setIsSubmitted(true)
      const newStatuses = [...questionStatuses]
      newStatuses[currentIndex] = "answered"
      setQuestionStatuses(newStatuses)
      const updatedQuestions = [...questions]
      updatedQuestions[currentIndex] = {
        ...q, attempted: true, selected_answer: selectedAnswer,
        is_correct: result.correct, correct_answer: result.correct_answer,
      }
      setQuestions(updatedQuestions)
      updateUser({ points: result.total_points })
      if (result.correct) {
        setAnswerFeedback("correct")
        fireStars()
      } else {
        setAnswerFeedback("wrong")
      }
      setTimeout(() => setAnswerFeedback(null), 900)
      if (result.correct) toast.success(`Correct!${result.points_earned > 0 ? ` +${result.points_earned} pts` : ""}`)
      else toast.error("Incorrect — check the explanation below")
      api.get("/mcq/topics").then((res) => setTopics(res.data)).catch(() => {})
    } catch {
      toast.error("Failed to submit answer")
    } finally {
      setSubmitting(false)
    }
  }

  function getStatusColor(status: QuestionStatus, index: number) {
    if (index === currentIndex) return "bg-primary text-primary-foreground"
    switch (status) {
      case "answered": return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
      case "marked": return "bg-amber-500/20 text-amber-400 border border-amber-500/30"
      default: return "bg-secondary/50 text-muted-foreground border border-border"
    }
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

  const loadAptQuestions = useCallback((topic: string, page: number) => {
    setLoadingAptQ(true)
    api.get(`/mcq/aptitude/questions?topic=${encodeURIComponent(topic)}&page=${page}`)
      .then((res) => {
        const qs: AptQuestion[] = res.data.questions
        setAptQuestions(qs)
        setAptTotalPages(res.data.total_pages)
        setAptTotal(res.data.total)
        setAptStates(qs.map((q) => ({
          selected: null,
          submitting: false,
          result: null,
          locked: q.already_correct,
        })))
      })
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoadingAptQ(false))
  }, [])

  function selectAptTopic(topic: string) {
    setSelectedAptTopic(topic)
    setAptPage(1)
    loadAptQuestions(topic, 1)
  }

  function aptChangePage(newPage: number) {
    if (!selectedAptTopic) return
    setAptPage(newPage)
    loadAptQuestions(selectedAptTopic, newPage)
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
        if (result.points_earned > 0) {
          updateUser({ points: result.total_points })
          toast.success("+1 pt")
        }
        loadAptTopics()
      }
    } catch {
      updateAptState(qIndex, { submitting: false, selected: null })
      toast.error("Failed to submit answer")
    }
  }

  function handleAptTryAgain(qIndex: number) {
    updateAptState(qIndex, { selected: null, result: null, locked: false })
  }

  // ── Render: Home ───────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold font-serif gradient-text mb-2">Practice MCQ</h1>
          <p className="text-muted-foreground text-sm">Choose a category to start practising</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Programming Card */}
          <button
            onClick={() => setView("programming")}
            className="group text-left"
          >
            <GlassCard className="h-full transition-all duration-200 hover:border-primary/50 group-hover:primary-glow cursor-pointer">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-serif text-foreground mb-1">Programming</h2>
                  <p className="text-sm text-muted-foreground">
                    Topic-based MCQs on DSA, Python, Java, DBMS, OS, and more. Earn points for each correct answer.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary text-sm font-medium mt-auto">
                  Start practising
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </GlassCard>
          </button>

          {/* Aptitude Card */}
          <button
            onClick={() => setView("aptitude")}
            className="group text-left"
          >
            <GlassCard className="h-full transition-all duration-200 hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-serif text-foreground mb-1">Aptitude</h2>
                  <p className="text-sm text-muted-foreground">
                    Quantitative aptitude, logical reasoning, and data interpretation. 5 questions per page, 1 pt each.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mt-auto">
                  Start practising
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </GlassCard>
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Programming MCQ ────────────────────────────────────────────────
  if (view === "programming") {
    const currentQuestion = questions[currentIndex]
    const isWrongAnswer = (index: number) =>
      isSubmitted &&
      displayResult !== null &&
      index === selectedAnswer &&
      index !== displayResult.correct_answer
    const displayResult = isSubmitted
      ? (serverResult ?? (currentQuestion?.attempted ? {
          correct: currentQuestion.is_correct ?? false,
          correct_answer: currentQuestion.correct_answer ?? -1,
          explanation: currentQuestion.explanation ?? null,
          points_earned: 0,
          total_points: 0,
        } : null))
      : null

    return (
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {answerFeedback && (
            <motion.div
              className={`fixed inset-0 pointer-events-none z-40 ${answerFeedback === "correct" ? "bg-emerald-500/10" : "bg-red-500/10"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Back */}
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </button>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
          {/* Left Panel */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <GlassCard className="h-full overflow-y-auto">
              <h2 className="font-semibold font-serif mb-4 text-foreground flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                Topics
              </h2>
              {loadingTopics ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : (
                <div className="space-y-1">
                  {topics.map((t) => (
                    <div key={t.topic}>
                      <button
                        onClick={() => toggleTopic(t.topic)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors text-foreground"
                      >
                        <span className="text-sm font-medium">{t.topic}</span>
                        {expandedTopics.includes(t.topic)
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      {expandedTopics.includes(t.topic) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {t.subtopics.map((sub) => {
                            const isSelected = selectedSubtopic?.topic === t.topic && selectedSubtopic?.subtopic === sub.name
                            return (
                              <button
                                key={sub.name}
                                onClick={() => loadSubtopic(t.topic, sub.name)}
                                className={cn(
                                  "w-full text-left p-2 rounded-lg text-sm transition-colors",
                                  isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{sub.name}</span>
                                  <span className="text-xs">{sub.attempted}/{sub.total}</span>
                                </div>
                                {sub.attempted > 0 && (
                                  <Progress value={(sub.attempted / sub.total) * 100} className="h-1 mt-1" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col min-h-0">
            {!selectedSubtopic ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <GlassCard className="text-center max-w-sm">
                  <CheckCircle className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                  <h3 className="font-semibold font-serif text-foreground mb-2">Select a Topic</h3>
                  <p className="text-sm text-muted-foreground">Choose a subtopic from the left panel to start practising</p>
                </GlassCard>
              </div>
            ) : loadingQuestions ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">No questions available for this subtopic.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {selectedSubtopic.topic} › {selectedSubtopic.subtopic} — {currentIndex + 1}/{questions.length}
                    </span>
                    <Progress value={((currentIndex + 1) / questions.length) * 100} className="w-32 h-2" />
                  </div>
                  <Badge variant="outline" className={cn("text-xs", currentQuestion && difficultyColors[currentQuestion.difficulty])}>
                    {currentQuestion?.difficulty}
                  </Badge>
                </div>

                <GlassCard className="flex-1 flex flex-col overflow-y-auto">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <h3 className="text-base font-medium text-foreground leading-relaxed">
                        {currentQuestion?.question}
                      </h3>
                      <span className="text-xs text-primary whitespace-nowrap">{currentQuestion?.points} pts</span>
                    </div>
                    <div className="space-y-3">
                      {currentQuestion?.options.map((option, index) => {
                        const isSelected = index === selectedAnswer
                        const isCorrect = displayResult ? index === displayResult.correct_answer : false
                        const wasSelected = displayResult ? index === selectedAnswer : false
                        const isWrong = isWrongAnswer(index)
                        return (
                          <motion.button
                            key={index}
                            onClick={() => !isSubmitted && setSelectedAnswer(index)}
                            disabled={isSubmitted}
                            animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className={cn(
                              "w-full p-4 rounded-xl text-left transition-all duration-200 border",
                              !isSubmitted && isSelected && "border-primary bg-primary/10 text-foreground",
                              !isSubmitted && !isSelected && "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground",
                              isSubmitted && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                              isSubmitted && wasSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-400",
                              isSubmitted && !wasSelected && !isCorrect && "border-border text-muted-foreground opacity-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border flex-shrink-0",
                                !isSubmitted && isSelected && "border-primary bg-primary text-primary-foreground",
                                !isSubmitted && !isSelected && "border-border text-muted-foreground",
                                isSubmitted && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                                isSubmitted && wasSelected && !isCorrect && "border-red-500 bg-red-500 text-white",
                                isSubmitted && !wasSelected && !isCorrect && "border-border text-muted-foreground"
                              )}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span>{option}</span>
                              {isSubmitted && isCorrect && <CheckCircle className="h-5 w-5 ml-auto text-emerald-400" />}
                              {isSubmitted && wasSelected && !isCorrect && <XCircle className="h-5 w-5 ml-auto text-red-400" />}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                    {isSubmitted && (displayResult?.explanation || currentQuestion?.explanation) && (
                      <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
                        <h4 className="font-medium mb-2 text-foreground flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          Explanation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {displayResult?.explanation ?? currentQuestion?.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline" size="sm"
                        onClick={() => {
                          const s = [...questionStatuses]
                          s[currentIndex] = "marked"
                          setQuestionStatuses(s)
                          toast.info("Marked for review")
                        }}
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        disabled={isSubmitted}
                      >
                        <Flag className="h-4 w-4 mr-2" />Mark
                      </Button>
                      {isSubmitted && (
                        <Button
                          variant="outline" size="sm"
                          onClick={() => { tryingAgainRef.current = true; setIsSubmitted(false); setSelectedAnswer(null); setServerResult(null) }}
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateTo(currentIndex - 1)} disabled={currentIndex === 0} className="text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-1" />Prev
                      </Button>
                      {!isSubmitted ? (
                        <Button size="sm" onClick={handleSubmit} disabled={selectedAnswer === null || submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}Submit
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => navigateTo(currentIndex + 1)} disabled={currentIndex === questions.length - 1} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Next<ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Question Palette */}
                <div className="mt-4">
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-foreground">Question Palette</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                          <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
                          <span>Review</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-secondary/50 border border-border" />
                          <span>Unattempted</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {questionStatuses.map((status, index) => (
                        <button
                          key={index}
                          onClick={() => navigateTo(index)}
                          className={cn("w-8 h-8 rounded-lg text-xs font-medium transition-all", getStatusColor(status, index))}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Render: Aptitude ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <button
        onClick={() => setView("home")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </button>

      <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: "calc(100vh - 10rem)" }}>
        {/* Left: Topic list */}
        <div className="w-full lg:w-60 flex-shrink-0">
          <GlassCard className="h-full overflow-y-auto">
            <h2 className="font-semibold font-serif mb-4 text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-amber-400" />
              Topics
            </h2>
            {loadingAptTopics ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {aptTopics.map((t) => {
                  const isSelected = selectedAptTopic === t.topic_name
                  const pct = t.total > 0 ? (t.answered / t.total) * 100 : 0
                  return (
                    <button
                      key={t.topic_name}
                      onClick={() => selectAptTopic(t.topic_name)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-sm transition-colors",
                        isSelected ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{t.topic_name}</span>
                        <span className="text-xs">{t.answered}/{t.total}</span>
                      </div>
                      {t.answered > 0 && (
                        <Progress value={pct} className="h-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right: Questions */}
        <div className="flex-1 flex flex-col gap-4">
          {!selectedAptTopic ? (
            <div className="flex-1 flex items-center justify-center">
              <GlassCard className="text-center max-w-sm">
                <Brain className="h-12 w-12 text-amber-400/40 mx-auto mb-4" />
                <h3 className="font-semibold font-serif text-foreground mb-2">Select a Topic</h3>
                <p className="text-sm text-muted-foreground">Choose an aptitude topic from the left panel</p>
              </GlassCard>
            </div>
          ) : loadingAptQ ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Page header */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{selectedAptTopic}</span>
                  {" — "}Page {aptPage} of {aptTotalPages}
                  {" "}
                  <span className="text-xs">(Q{(aptPage - 1) * 5 + 1}–{Math.min(aptPage * 5, aptTotal)} of {aptTotal})</span>
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />Correct
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />Wrong
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-secondary/50 border border-border" />Unattempted
                  </div>
                </div>
              </div>

              {/* 5 Questions */}
              <div className="space-y-4">
                {aptQuestions.map((q, qIdx) => {
                  const state = aptStates[qIdx]
                  if (!state) return null
                  const result = state.result

                  return (
                    <GlassCard key={q.id} className={cn(
                      "transition-all duration-200",
                      state.locked && "border-emerald-500/30 bg-emerald-500/5"
                    )}>
                      {/* Question header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className={cn(
                            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border",
                            state.locked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : result && !result.correct
                              ? "bg-red-500/20 border-red-500/50 text-red-400"
                              : "bg-secondary border-border text-muted-foreground"
                          )}>
                            {(aptPage - 1) * 5 + qIdx + 1}
                          </span>
                          <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>
                        </div>
                        <span className="text-xs text-amber-400 whitespace-nowrap flex-shrink-0">1 pt</span>
                      </div>

                      {/* Image */}
                      {q.image_url && (
                        <img src={q.image_url} alt="Question" className="mb-4 rounded-lg max-h-48 object-contain" />
                      )}

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {APT_OPTIONS.map(({ key, field }) => {
                          const optText = q[field] as string
                          const isSelected = state.selected === key
                          const isCorrect = result ? key === result.correct_answer : false
                          const wasSelected = result ? key === state.selected : false
                          const isLocked = state.locked

                          return (
                            <button
                              key={key}
                              onClick={() => !isLocked && !result && handleAptAnswer(qIdx, key)}
                              disabled={isLocked || !!result || state.submitting}
                              className={cn(
                                "p-3 rounded-xl text-left transition-all duration-150 border text-sm",
                                // unattempted
                                !result && !isLocked && isSelected && "border-amber-500 bg-amber-500/10 text-foreground",
                                !result && !isLocked && !isSelected && "border-border hover:border-amber-500/40 hover:bg-amber-500/5 text-foreground",
                                // after submit: correct answer
                                result && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                                // after submit: wrong selection
                                result && wasSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-400",
                                // after submit: other options
                                result && !isCorrect && !wasSelected && "border-border text-muted-foreground opacity-40",
                                // locked (already correct from previous session)
                                isLocked && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                                isLocked && !isCorrect && "border-border text-muted-foreground opacity-40",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0",
                                  result && isCorrect && "bg-emerald-500 border-emerald-500 text-white",
                                  result && wasSelected && !isCorrect && "bg-red-500 border-red-500 text-white",
                                  isLocked && isCorrect && "bg-emerald-500 border-emerald-500 text-white",
                                  !result && !isLocked && "border-border text-muted-foreground",
                                )}>
                                  {key}
                                </span>
                                <span className="flex-1">{optText}</span>
                                {state.submitting && isSelected && <Loader2 className="h-4 w-4 animate-spin ml-auto flex-shrink-0" />}
                                {result && isCorrect && <CheckCircle className="h-4 w-4 ml-auto text-emerald-400 flex-shrink-0" />}
                                {result && wasSelected && !isCorrect && <XCircle className="h-4 w-4 ml-auto text-red-400 flex-shrink-0" />}
                                {isLocked && isCorrect && <CheckCircle className="h-4 w-4 ml-auto text-emerald-400 flex-shrink-0" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Feedback */}
                      {(result || state.locked) && (
                        <div className="mt-3 flex items-start justify-between gap-3">
                          <div className={cn(
                            "flex-1 p-3 rounded-lg text-xs",
                            state.locked || result?.correct
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/10 border border-red-500/20 text-red-400"
                          )}>
                            {state.locked && !result && (
                              <p className="font-medium mb-1">Already answered correctly!</p>
                            )}
                            {result && (
                              <p className="font-medium mb-1">
                                {result.correct ? "Correct!" : `Wrong — correct answer is ${result.correct_answer}`}
                              </p>
                            )}
                            {(result?.explanation) && (
                              <p className="text-muted-foreground">{result.explanation}</p>
                            )}
                          </div>
                          {result && !result.correct && (
                            <Button
                              size="sm" variant="outline"
                              onClick={() => handleAptTryAgain(qIdx)}
                              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex-shrink-0"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />Try Again
                            </Button>
                          )}
                        </div>
                      )}
                    </GlassCard>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline" size="sm"
                  onClick={() => aptChangePage(aptPage - 1)}
                  disabled={aptPage <= 1}
                  className="text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: aptTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => aptChangePage(p)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                        p === aptPage
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-secondary/50 text-muted-foreground border border-border hover:border-amber-500/30 hover:text-amber-400"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline" size="sm"
                  onClick={() => aptChangePage(aptPage + 1)}
                  disabled={aptPage >= aptTotalPages}
                  className="text-foreground"
                >
                  Next<ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
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
