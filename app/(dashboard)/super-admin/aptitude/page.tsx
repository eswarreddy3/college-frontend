"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  Upload, Trash2, ChevronDown, ChevronRight, Download,
  CheckCircle2, AlertCircle, SkipForward, X, Search,
  Brain, Loader2, RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

// ── Types ─────────────────────────────────────────────────────────────────────

interface AptitudeQuestion {
  id: number
  topic: string
  sub_topic: string | null
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e?: string | null
  correct_option: string
  correct_answer: string
  explanation: string | null
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  tag: string | null
}

interface TopicSummary {
  topic: string
  count: number
}

interface UploadResult {
  imported: number
  skipped: number
  errors: number
  skipped_questions: { row: number; question: string; reason: string }[]
  error_details: { row: number; question?: string; reason: string }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const difficultyColor: Record<string, string> = {
  Easy:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard:   "bg-red-500/15 text-red-400 border-red-500/30",
}

const TEMPLATE_CSV = `topic,sub_topic,question,option_a,option_b,option_c,option_d,option_e,correct_option,correct_answer,explanation,difficulty,points,tag
Number System,,What is the LCM of 4 and 6?,12,24,6,18,,A,12,"LCM(4,6)=12",Easy,2,
Percentages,,30% of 200 is?,40,50,60,70,,C,60,"0.3×200=60",Easy,2,
`

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "aptitude_questions_template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const { data } = await api.post<UploadResult>("/super-admin/aptitude/upload", fd)
      setResult(data)
      if (data.imported > 0) onSuccess()
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-foreground">Upload Aptitude Questions</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto">
          {!result ? (
            <>
              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  file
                    ? "border-primary/60 bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                {file ? (
                  <p className="text-sm font-medium text-primary">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-foreground font-medium">Click to select CSV</p>
                    <p className="text-xs text-muted-foreground mt-1">Only .csv files are supported</p>
                  </>
                )}
              </div>

              {/* CSV format hint */}
              <div className="rounded-lg bg-secondary/40 border border-border p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Required columns:</p>
                <p className="font-mono text-[11px]">topic, question, option_a, option_b, option_c, option_d, correct_option, correct_answer</p>
                <p className="font-medium text-foreground mt-2">Optional columns:</p>
                <p className="font-mono text-[11px]">sub_topic, option_e, explanation, difficulty, points, tag</p>
              </div>

              <div className="flex gap-2 justify-between">
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download Template
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                  <Button size="sm" onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Upload className="h-4 w-4 mr-1.5" />}
                    Upload
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Result summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-emerald-400">{result.imported}</p>
                  <p className="text-xs text-muted-foreground">Imported</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-center">
                  <SkipForward className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amber-400">{result.skipped}</p>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-red-400">{result.errors}</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
              </div>

              {result.error_details.length > 0 && (
                <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 max-h-36 overflow-y-auto space-y-1">
                  <p className="text-xs font-medium text-red-400 mb-1">Errors:</p>
                  {result.error_details.map((e, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      Row {e.row}: {e.reason}{e.question ? ` — "${e.question}"` : ""}
                    </p>
                  ))}
                </div>
              )}

              {result.skipped_questions.length > 0 && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 max-h-28 overflow-y-auto space-y-1">
                  <p className="text-xs font-medium text-amber-400 mb-1">Skipped (duplicates):</p>
                  {result.skipped_questions.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">Row {s.row}: "{s.question}"</p>
                  ))}
                </div>
              )}

              <Button className="w-full" onClick={onClose}>Done</Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AptitudeAdminPage() {
  const [topics, setTopics] = useState<TopicSummary[]>([])
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [diffFilter, setDiffFilter] = useState("all")
  const [showUpload, setShowUpload] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "question" | "topic"; id?: number; topic?: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [topicsRes, questionsRes] = await Promise.all([
        api.get<TopicSummary[]>("/super-admin/aptitude/topics"),
        api.get<AptitudeQuestion[]>("/super-admin/aptitude/questions"),
      ])
      setTopics(topicsRes.data)
      setQuestions(questionsRes.data)
    } catch {
      toast.error("Failed to load aptitude data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev)
      next.has(topic) ? next.delete(topic) : next.add(topic)
      return next
    })
  }

  const handleDeleteQuestion = async () => {
    if (!deleteTarget || deleteTarget.type !== "question") return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/aptitude/questions/${deleteTarget.id}`)
      toast.success("Question deleted")
      setQuestions(prev => prev.filter(q => q.id !== deleteTarget.id))
      setTopics(prev => prev.map(t => {
        const q = questions.find(q => q.id === deleteTarget.id)
        if (q && t.topic === q.topic) return { ...t, count: t.count - 1 }
        return t
      }).filter(t => t.count > 0))
    } catch {
      toast.error("Failed to delete question")
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const handleDeleteTopic = async () => {
    if (!deleteTarget || deleteTarget.type !== "topic") return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/aptitude/topics/${encodeURIComponent(deleteTarget.topic!)}`)
      toast.success(`All questions in "${deleteTarget.topic}" deleted`)
      setQuestions(prev => prev.filter(q => q.topic !== deleteTarget.topic))
      setTopics(prev => prev.filter(t => t.topic !== deleteTarget.topic))
    } catch {
      toast.error("Failed to delete topic")
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // Filtered questions grouped by topic
  const filteredQuestions = questions.filter(q => {
    const matchSearch = !search || q.question.toLowerCase().includes(search.toLowerCase())
    const matchDiff = diffFilter === "all" || q.difficulty === diffFilter
    return matchSearch && matchDiff
  })

  const groupedByTopic = topics.reduce<Record<string, AptitudeQuestion[]>>((acc, t) => {
    acc[t.topic] = filteredQuestions.filter(q => q.topic === t.topic)
    return acc
  }, {})

  const visibleTopics = topics.filter(t => groupedByTopic[t.topic]?.length > 0)
  const totalQuestions = topics.reduce((s, t) => s + t.count, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Aptitude Questions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalQuestions} questions across {topics.length} topics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-1.5" />
            Template
          </Button>
          <Button size="sm" onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4 mr-1.5" />
            Upload CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={diffFilter} onValueChange={setDiffFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : visibleTopics.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No questions found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {topics.length === 0 ? "Upload a CSV to get started." : "Try adjusting your filters."}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {visibleTopics.map(topicSummary => {
            const topicQuestions = groupedByTopic[topicSummary.topic] ?? []
            const isExpanded = expandedTopics.has(topicSummary.topic)

            return (
              <GlassCard key={topicSummary.topic} className="overflow-hidden">
                {/* Topic header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => toggleTopic(topicSummary.topic)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    }
                    <span className="font-semibold text-foreground">{topicSummary.topic}</span>
                    <Badge variant="outline" className="text-xs">
                      {topicQuestions.length} question{topicQuestions.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={e => {
                      e.stopPropagation()
                      setDeleteTarget({ type: "topic", topic: topicSummary.topic })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Questions table */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-secondary/20">
                              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Question</th>
                              <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground w-24">Sub-topic</th>
                              <th className="text-center px-3 py-2.5 text-xs font-medium text-muted-foreground w-24">Difficulty</th>
                              <th className="text-center px-3 py-2.5 text-xs font-medium text-muted-foreground w-16">Points</th>
                              <th className="text-center px-3 py-2.5 text-xs font-medium text-muted-foreground w-12">Ans</th>
                              <th className="w-10" />
                            </tr>
                          </thead>
                          <tbody>
                            {topicQuestions.map((q, idx) => (
                              <tr
                                key={q.id}
                                className={cn(
                                  "border-b border-border/50 hover:bg-secondary/10 transition-colors",
                                  idx === topicQuestions.length - 1 && "border-b-0"
                                )}
                              >
                                <td className="px-5 py-3 text-foreground text-sm max-w-xs">
                                  <p className="line-clamp-2">{q.question}</p>
                                </td>
                                <td className="px-3 py-3 text-xs text-muted-foreground">
                                  {q.sub_topic || "—"}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <Badge variant="outline" className={cn("text-xs", difficultyColor[q.difficulty])}>
                                    {q.difficulty}
                                  </Badge>
                                </td>
                                <td className="px-3 py-3 text-center text-xs text-muted-foreground">
                                  {q.points} pts
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span className="text-xs font-bold text-primary">{q.correct_option}</span>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={() => setDeleteTarget({ type: "question", id: q.id })}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onSuccess={loadData}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === "topic"
                ? `Delete all questions in "${deleteTarget.topic}"?`
                : "Delete this question?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "topic"
                ? "This will permanently delete every question in this topic. This cannot be undone."
                : "This will permanently delete the question. This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={deleteTarget?.type === "topic" ? handleDeleteTopic : handleDeleteQuestion}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
