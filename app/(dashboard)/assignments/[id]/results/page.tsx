"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Star,
  Trophy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionResult {
  id: number
  question: string
  options: string[]
  correctIndex: number
  selectedIndex: number
  explanation: string
  isCorrect: boolean
  subtopic?: string
}

interface AssignmentResult {
  assignmentId: string
  title: string
  course: string
  correct: number
  wrong: number
  unanswered: number
  score: number
  maxScore: number
  total_points?: number  // user's total accumulated points (from API)
  results: QuestionResult[]
}

function ScoreCircle({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = pct >= 80 ? "#8B5CF6" : pct >= 50 ? "#F59E0B" : "#EF4444"

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-serif" style={{ color }}>{pct}%</span>
        <span className="text-xs text-muted-foreground mt-0.5">{score}/{max} pts</span>
      </div>
    </div>
  )
}

function getRank(pct: number) {
  if (pct >= 90) return { label: "Outstanding!", color: "text-amber-400" }
  if (pct >= 75) return { label: "Great Job!", color: "text-primary" }
  if (pct >= 60) return { label: "Good Effort", color: "text-emerald-400" }
  if (pct >= 40) return { label: "Keep Practicing", color: "text-amber-400" }
  return { label: "Needs Improvement", color: "text-red-400" }
}

export default function AssignmentResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<AssignmentResult | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "unanswered">("all")

  useEffect(() => {
    const raw = sessionStorage.getItem(`assignment-result-${params.id}`)
    if (raw) {
      try { setResult(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [params.id])

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Trophy className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">No results found. Complete the assignment first.</p>
        <Button variant="outline" onClick={() => router.push("/assignments")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>
      </div>
    )
  }

  const pct = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0
  const rank = getRank(pct)
  const accuracy = result.results.length > 0
    ? Math.round((result.correct / result.results.length) * 100)
    : 0

  const filteredResults = result.results.filter((r) => {
    if (filter === "correct") return r.isCorrect
    if (filter === "wrong") return !r.isCorrect && r.selectedIndex !== -1
    if (filter === "unanswered") return r.selectedIndex === -1
    return true
  })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header nav */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-white/10 hover:border-white/20"
          onClick={() => router.push("/assignments")}
        >
          <ArrowLeft className="h-4 w-4" />
          Assignments
        </Button>
      </div>

      {/* Score hero */}
      <GlassCard className="text-center space-y-4">
        <div className="space-y-1">
          <h1 className={cn("text-3xl font-bold font-serif", rank.color)}>{rank.label}</h1>
          <p className="text-muted-foreground">{result.title} — {result.course}</p>
        </div>

        <ScoreCircle score={result.score} max={result.maxScore} />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-2xl font-bold font-serif text-emerald-400">{result.correct}</span>
            </div>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-2xl font-bold font-serif text-red-400">{result.wrong}</span>
            </div>
            <p className="text-xs text-muted-foreground">Wrong</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <MinusCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold font-serif text-muted-foreground">{result.unanswered}</span>
            </div>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Accuracy</span>
            <span className="font-medium text-foreground">{accuracy}%</span>
          </div>
          <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${accuracy}%`,
                background: accuracy >= 75 ? "#8B5CF6" : accuracy >= 50 ? "#F59E0B" : "#EF4444",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          <span className="text-lg font-bold font-serif text-foreground">+{result.score} points earned</span>
        </div>

        {result.total_points !== undefined && (
          <p className="text-sm text-muted-foreground">
            Your total points: <span className="text-primary font-semibold">{result.total_points}</span>
          </p>
        )}
      </GlassCard>

      {/* Review section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold font-serif text-foreground">Question Review</h2>
          <div className="flex gap-2 flex-wrap">
            {(["all", "correct", "wrong", "unanswered"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium border transition-all capitalize",
                  filter === f
                    ? f === "correct"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : f === "wrong"
                      ? "bg-red-500/20 border-red-500/40 text-red-300"
                      : f === "unanswered"
                      ? "bg-secondary/80 border-white/20 text-muted-foreground"
                      : "bg-primary/20 border-primary/40 text-primary"
                    : "bg-secondary/30 border-white/10 text-muted-foreground hover:border-white/20"
                )}
              >
                {f === "all"
                  ? `All (${result.results.length})`
                  : f === "correct"
                  ? `Correct (${result.correct})`
                  : f === "wrong"
                  ? `Wrong (${result.wrong})`
                  : `Skipped (${result.unanswered})`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredResults.map((qr) => {
            const isExpanded = expandedId === qr.id
            const globalIdx = result.results.findIndex((r) => r.id === qr.id)

            return (
              <GlassCard key={qr.id} className="overflow-hidden">
                <button
                  className="w-full text-left flex items-start gap-3"
                  onClick={() => setExpandedId(isExpanded ? null : qr.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {qr.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : qr.selectedIndex === -1 ? (
                      <MinusCircle className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium text-muted-foreground">Q{globalIdx + 1}</span>
                      {qr.subtopic && (
                        <span className="text-xs text-muted-foreground/60">{qr.subtopic}</span>
                      )}
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs border",
                          qr.isCorrect
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : qr.selectedIndex === -1
                            ? "bg-secondary/50 text-muted-foreground border-white/10"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        )}
                      >
                        {qr.isCorrect ? "Correct" : qr.selectedIndex === -1 ? "Skipped" : "Incorrect"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2 pr-4">
                      {qr.question}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <div className="space-y-2">
                      {qr.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === qr.correctIndex
                        const isSelected = oIdx === qr.selectedIndex
                        const isWrongSelected = isSelected && !isCorrect

                        return (
                          <div
                            key={oIdx}
                            className={cn(
                              "flex items-start gap-3 rounded-lg px-3 py-2.5 border text-sm",
                              isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : isWrongSelected
                                ? "bg-red-500/10 border-red-500/30 text-red-300"
                                : "bg-secondary/20 border-white/5 text-muted-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold",
                                isCorrect
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : isWrongSelected
                                  ? "bg-red-500 border-red-500 text-white"
                                  : "bg-transparent border-white/20"
                              )}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                            {isWrongSelected && <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {qr.selectedIndex !== -1 && (
                        <span>
                          Your answer:{" "}
                          <span className={cn("font-medium", qr.isCorrect ? "text-emerald-400" : "text-red-400")}>
                            {String.fromCharCode(65 + qr.selectedIndex)}
                          </span>
                        </span>
                      )}
                      {!qr.isCorrect && qr.correctIndex >= 0 && (
                        <span>
                          Correct answer:{" "}
                          <span className="font-medium text-emerald-400">
                            {String.fromCharCode(65 + qr.correctIndex)}
                          </span>
                        </span>
                      )}
                    </div>

                    {qr.explanation && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
                        <p className="text-xs font-semibold text-primary mb-1">Explanation</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{qr.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No questions in this category.
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 justify-center pb-8">
        <Button
          variant="outline"
          className="gap-2 border-white/10 hover:border-white/20"
          onClick={() => router.push(`/assignments/${params.id}`)}
        >
          <RotateCcw className="h-4 w-4" />
          Retake
        </Button>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => router.push("/assignments")}
        >
          <ArrowLeft className="h-4 w-4" />
          All Assignments
        </Button>
      </div>
    </div>
  )
}
