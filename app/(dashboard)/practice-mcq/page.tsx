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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

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

function PracticeMCQContent() {
  const searchParams = useSearchParams()
  const [topics, setTopics] = useState<Topic[]>([])
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])
  const [selectedSubtopic, setSelectedSubtopic] = useState<{ topic: string; subtopic: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>([])
  const [serverResult, setServerResult] = useState<{ correct: boolean; correct_answer: number; explanation: string | null; points_earned: number; total_points: number } | null>(null)
  const tryingAgainRef = useRef(false)
  const { updateUser } = useAuthStore()

  useEffect(() => {
    api.get("/mcq/topics")
      .then((res) => {
        setTopics(res.data)
        const firstTopic = res.data[0]?.topic
        if (firstTopic) setExpandedTopics([firstTopic])
      })
      .catch(() => toast.error("Failed to load topics"))
      .finally(() => setLoadingTopics(false))
  }, [])

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
        setQuestionStatuses(qs.map(q => q.attempted ? "answered" : "unattempted"))
        if (qs[0]?.attempted) {
          setSelectedAnswer(qs[0].selected_answer ?? null)
          setIsSubmitted(true)
        }
      })
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoadingQuestions(false))
  }, [])

  // Auto-select topic/subtopic from URL params (e.g. from lesson page links)
  useEffect(() => {
    if (loadingTopics || topics.length === 0) return
    const topicParam = searchParams.get("topic")
    const subtopicParam = searchParams.get("subtopic")
    if (topicParam && subtopicParam) {
      setExpandedTopics(prev => prev.includes(topicParam) ? prev : [...prev, topicParam])
      loadSubtopic(topicParam, subtopicParam)
    }
  }, [loadingTopics, topics, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleTopic(topicName: string) {
    setExpandedTopics(prev =>
      prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
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
      const res = await api.post("/mcq/answer", {
        question_id: q.id,
        selected_answer: selectedAnswer,
      })
      const result = res.data
      setServerResult(result)
      setIsSubmitted(true)

      const newStatuses = [...questionStatuses]
      newStatuses[currentIndex] = "answered"
      setQuestionStatuses(newStatuses)

      const updatedQuestions = [...questions]
      updatedQuestions[currentIndex] = {
        ...q,
        attempted: true,
        selected_answer: selectedAnswer,
        is_correct: result.correct,
        correct_answer: result.correct_answer,
      }
      setQuestions(updatedQuestions)

      updateUser({ points: result.total_points })

      if (result.correct) {
        toast.success(`Correct!${result.points_earned > 0 ? ` +${result.points_earned} pts` : ""}`)
      } else {
        toast.error("Incorrect — check the explanation below")
      }

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

  const currentQuestion = questions[currentIndex]
  // Only show result when submitted. When "Try Again" is active (isSubmitted=false),
  // don't fall back to stale attempted state — let the user pick fresh.
  const displayResult = isSubmitted
    ? (serverResult ?? (currentQuestion?.attempted ? {
        correct: currentQuestion.is_correct ?? false,
        correct_answer: currentQuestion.correct_answer ?? -1,
        explanation: currentQuestion.explanation ?? null,
        points_earned: 0,
        total_points: 0,
      } : null))
    : null

  if (loadingTopics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel - Topic Tree */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <GlassCard className="h-full overflow-y-auto">
          <h2 className="font-semibold font-serif mb-4 text-foreground">Topics</h2>
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
                    : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  }
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
                            <span className="text-xs">
                              {sub.attempted}/{sub.total}
                            </span>
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
        </GlassCard>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {!selectedSubtopic ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <GlassCard className="text-center max-w-sm">
              <CheckCircle className="h-12 w-12 text-primary/40 mx-auto mb-4" />
              <h3 className="font-semibold font-serif text-foreground mb-2">Select a Topic</h3>
              <p className="text-sm text-muted-foreground">Choose a topic from the left panel to start practicing</p>
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
            {/* Progress bar */}
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

            {/* Question Card */}
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

                    return (
                      <button
                        key={index}
                        onClick={() => !isSubmitted && setSelectedAnswer(index)}
                        disabled={isSubmitted}
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
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const s = [...questionStatuses]
                      s[currentIndex] = "marked"
                      setQuestionStatuses(s)
                      toast.info("Marked for review")
                    }}
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    disabled={isSubmitted}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Mark
                  </Button>
                  {isSubmitted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        tryingAgainRef.current = true
                        setIsSubmitted(false)
                        setSelectedAnswer(null)
                        setServerResult(null)
                      }}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateTo(currentIndex - 1)} disabled={currentIndex === 0} className="text-foreground">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                  {!isSubmitted ? (
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={selectedAnswer === null || submitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Submit
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => navigateTo(currentIndex + 1)}
                      disabled={currentIndex === questions.length - 1}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
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
  )
}

export default function PracticeMCQPage() {
  return (
    <Suspense>
      <PracticeMCQContent />
    </Suspense>
  )
}
