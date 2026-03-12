"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  Send,
  AlertTriangle,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface ApiQuestion {
  id: number
  module_id: string
  topic: string
  subtopic: string
  question: string
  options: string[]
  difficulty: string
  points: number
  explanation: string
}

interface AssignmentMeta {
  id: string
  module_id: string
  title: string
  course: string
  icon: string
  duration_mins: number
  total_questions: number
  points: number
}

type QStatus = "unattempted" | "answered" | "marked" | "answered-marked"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

const statusLabel: Record<QStatus, { label: string; className: string }> = {
  unattempted: { label: "Not visited", className: "bg-secondary/80 text-muted-foreground border-white/10" },
  answered: { label: "Answered", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  marked: { label: "Marked for review", className: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  "answered-marked": { label: "Answered + Marked", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
}

function getQBtnClass(status: QStatus, isCurrent: boolean) {
  const base = "w-9 h-9 rounded-lg text-sm font-medium transition-all border flex items-center justify-center"
  if (isCurrent) return cn(base, "ring-2 ring-primary ring-offset-1 ring-offset-background bg-primary/20 border-primary text-primary")
  switch (status) {
    case "answered":        return cn(base, "bg-emerald-500/20 border-emerald-500/40 text-emerald-300")
    case "marked":          return cn(base, "bg-violet-500/20 border-violet-500/40 text-violet-300")
    case "answered-marked": return cn(base, "bg-amber-500/20 border-amber-500/40 text-amber-300")
    default:                return cn(base, "bg-secondary/60 border-white/10 text-muted-foreground hover:border-white/20")
  }
}

export default function AssignmentExamPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string

  const [assignmentMeta, setAssignmentMeta] = useState<AssignmentMeta | null>(null)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [statuses, setStatuses] = useState<Record<number, QStatus>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load questions from API, fall back to mock
  useEffect(() => {
    api.get(`/assignments/${moduleId}/questions`)
      .then((res) => {
        setAssignmentMeta(res.data.assignment)
        setQuestions(res.data.questions)
        setTimeLeft(res.data.assignment.duration_mins * 60)
      })
      .catch(() => {
        toast.error("Failed to load assignment")
        router.push("/assignments")
      })
      .finally(() => setLoading(false))
  }, [moduleId])

  const submit = useCallback(() => {
    if (!assignmentMeta || submitting) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitted(true)
    setSubmitting(true)

    // Build answers map {question_id: selected_index}
    const answersPayload: Record<string, number> = {}
    for (const [qId, idx] of Object.entries(answers)) {
      answersPayload[qId] = idx
    }

    api.post(`/assignments/${moduleId}/submit`, { answers: answersPayload })
      .then((res) => {
        sessionStorage.setItem(
          `assignment-result-${moduleId}`,
          JSON.stringify(res.data)
        )
        router.push(`/assignments/${moduleId}/results`)
      })
      .catch(() => {
        // Offline fallback: evaluate locally
        const results = questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: 0, // unknown without API
          selectedIndex: answers[q.id] ?? -1,
          explanation: q.explanation,
          isCorrect: false,
          subtopic: q.subtopic,
        }))
        const correct = 0
        const wrong = results.filter((r) => r.selectedIndex !== -1).length
        const unanswered = results.filter((r) => r.selectedIndex === -1).length
        sessionStorage.setItem(
          `assignment-result-${moduleId}`,
          JSON.stringify({
            assignmentId: moduleId,
            title: assignmentMeta.title,
            course: assignmentMeta.course,
            correct,
            wrong,
            unanswered,
            score: 0,
            maxScore: assignmentMeta.points,
            results,
          })
        )
        router.push(`/assignments/${moduleId}/results`)
      })
      .finally(() => setSubmitting(false))
  }, [assignmentMeta, answers, moduleId, questions, router, submitting])

  // Timer
  useEffect(() => {
    if (submitted || timeLeft === 0 || loading) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          toast.error("Time's up! Submitting your answers...")
          submit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [submitted, timeLeft, loading, submit])

  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
        <GlassCard className="space-y-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </GlassCard>
      </div>
    )
  }

  if (!assignmentMeta || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Assignment not found.</p>
        <Button variant="outline" onClick={() => router.push("/assignments")}>Back to Assignments</Button>
      </div>
    )
  }

  const q = questions[current]
  const totalQ = questions.length
  const answeredCount = Object.keys(answers).length
  const markedCount = Object.values(statuses).filter((s) => s === "marked" || s === "answered-marked").length
  const progress = Math.round((answeredCount / totalQ) * 100)
  const isTimeLow = timeLeft < 120

  function selectOption(optIdx: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
    setStatuses((prev) => {
      const cur = prev[q.id]
      if (cur === "marked" || cur === "answered-marked") return { ...prev, [q.id]: "answered-marked" }
      return { ...prev, [q.id]: "answered" }
    })
  }

  function toggleMark() {
    setStatuses((prev) => {
      const cur = prev[q.id] ?? "unattempted"
      if (cur === "answered") return { ...prev, [q.id]: "answered-marked" }
      if (cur === "answered-marked") return { ...prev, [q.id]: "answered" }
      if (cur === "marked") return { ...prev, [q.id]: "unattempted" }
      return { ...prev, [q.id]: "marked" }
    })
  }

  function clearResponse() {
    setAnswers((prev) => { const n = { ...prev }; delete n[q.id]; return n })
    setStatuses((prev) => {
      const cur = prev[q.id]
      if (cur === "answered-marked") return { ...prev, [q.id]: "marked" }
      return { ...prev, [q.id]: "unattempted" }
    })
  }

  const curStatus = statuses[q.id] ?? "unattempted"
  const isMarked = curStatus === "marked" || curStatus === "answered-marked"
  const selectedOption = answers[q.id] ?? -1

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-foreground line-clamp-1">{assignmentMeta.title}</h1>
          <p className="text-sm text-muted-foreground">{assignmentMeta.course}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-lg font-bold transition-all",
              isTimeLow
                ? "bg-red-500/20 border-red-500/40 text-red-300 animate-pulse"
                : "bg-secondary/60 border-white/10 text-foreground"
            )}
          >
            <Clock className={cn("h-5 w-5", isTimeLow ? "text-red-400" : "text-primary")} />
            {formatTime(timeLeft)}
          </div>
          <Button
            onClick={() => setShowSubmitDialog(true)}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1 h-1.5" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {answeredCount}/{totalQ} answered
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Main question panel */}
        <div className="space-y-4">
          <GlassCard className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {current + 1}
                </span>
                <Badge variant="outline" className={cn("text-xs border", statusLabel[curStatus].className)}>
                  {statusLabel[curStatus].label}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleMark}
                className={cn(
                  "gap-1.5 text-xs border",
                  isMarked
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300 hover:bg-violet-500/30"
                    : "bg-secondary/50 border-white/10 text-muted-foreground hover:text-foreground"
                )}
              >
                <BookmarkPlus className="h-3.5 w-3.5" />
                {isMarked ? "Marked" : "Mark for Review"}
              </Button>
            </div>

            <div className="text-foreground font-medium leading-relaxed text-base">
              {q.question}
            </div>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx
                return (
                  <button
                    key={idx}
                    onClick={() => selectOption(idx)}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-all duration-200 flex items-start gap-3 group",
                      isSelected
                        ? "bg-primary/15 border-primary/60 text-foreground"
                        : "bg-secondary/30 border-white/8 text-muted-foreground hover:border-white/20 hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-transparent border-white/20 text-muted-foreground group-hover:border-white/40"
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-sm leading-relaxed pt-0.5">{opt}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />}
                  </button>
                )
              })}
            </div>

            {selectedOption !== -1 && (
              <button
                onClick={clearResponse}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Clear response
              </button>
            )}
          </GlassCard>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-white/10 hover:border-white/20"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Question {current + 1} of {totalQ}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-white/10 hover:border-white/20"
              disabled={current === totalQ - 1}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Question navigator sidebar */}
        <div className="space-y-4">
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Question Navigator</h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const qStatus = statuses[questions[idx].id] ?? "unattempted"
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={getQBtnClass(qStatus, idx === current)}
                    title={`Q${idx + 1}: ${statusLabel[qStatus].label}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              {(Object.keys(statusLabel) as QStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px] font-medium border", statusLabel[s].className)}>
                    {s === "answered" ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                  </span>
                  <span className="text-xs text-muted-foreground">{statusLabel[s].label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Answered</span>
                <span className="text-emerald-400 font-medium">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for review</span>
                <span className="text-violet-400 font-medium">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered</span>
                <span className="text-muted-foreground font-medium">{totalQ - answeredCount}</span>
              </div>
            </div>
          </GlassCard>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            onClick={() => setShowSubmitDialog(true)}
            disabled={submitting}
          >
            <Send className="h-4 w-4" />
            Submit Assignment
          </Button>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-popover border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Submit Assignment?</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Review your progress before submitting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold font-serif text-emerald-400">{answeredCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Answered</p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold font-serif text-violet-400">{markedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Marked</p>
              </div>
              <div className="bg-secondary/50 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold font-serif text-muted-foreground">{totalQ - answeredCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Skipped</p>
              </div>
            </div>
            {totalQ - answeredCount > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  You have {totalQ - answeredCount} unanswered question{totalQ - answeredCount > 1 ? "s" : ""}.
                  Unanswered questions earn zero points.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 flex-row justify-end">
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              className="border-white/10 hover:border-white/20"
            >
              Continue Exam
            </Button>
            <Button
              onClick={() => { setShowSubmitDialog(false); submit() }}
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting ? "Submitting..." : "Submit Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
