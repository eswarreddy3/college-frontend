"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  List,
  RotateCcw,
  Loader2,
  Terminal,
  ChevronDown,
  ChevronUp,
  Star,
  Code2,
  X,
  FileText,
  Layers,
  History,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface Problem {
  id: number
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string | null
  starter_code: Record<string, string>
  points: number
}

interface ProblemListItem {
  id: number
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  points: number
}

interface Submission {
  id: number
  language: string
  status: string
  runtime_ms: number | null
  submitted_at: string
}

interface TestResult {
  id: number
  input: string
  expectedOutput: string
  actualOutput?: string
  status: "passed" | "failed" | "pending"
}

type Language = "python" | "java" | "cpp" | "javascript"

const difficultyConfig = {
  Easy:   { cls: "chip chip-success",  dot: "bg-success" },
  Medium: { cls: "chip chip-warning",  dot: "bg-warning" },
  Hard:   { cls: "chip chip-danger",   dot: "bg-danger" },
}

const statusColors: Record<string, string> = {
  accepted:      "text-success",
  wrong_answer:  "text-danger",
  runtime_error: "text-streak",
  time_limit:    "text-warning",
}

const statusIcons: Record<string, React.ReactNode> = {
  accepted:      <CheckCircle className="h-3.5 w-3.5" />,
  wrong_answer:  <XCircle className="h-3.5 w-3.5" />,
  runtime_error: <Terminal className="h-3.5 w-3.5" />,
  time_limit:    <Clock className="h-3.5 w-3.5" />,
}

const LANG_LABELS: Record<Language, string> = {
  python:     "Python 3",
  java:       "Java",
  cpp:        "C++",
  javascript: "JavaScript",
}

const DEFAULT_CODE: Record<Language, string> = {
  python:     "# Write your solution here\n",
  java:       "class Solution {\n    // Write your solution here\n}\n",
  cpp:        "// Write your solution here\n",
  javascript: "// Write your solution here\n",
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  return `${Math.floor(diffHrs / 24)}d ago`
}

export default function CodingPage() {
  const [problemsList, setProblemsList]     = useState<ProblemListItem[]>([])
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [submissions, setSubmissions]       = useState<Submission[]>([])
  const [loadingProblems, setLoadingProblems] = useState(true)
  const [loadingProblem, setLoadingProblem]   = useState(false)
  const [currentIndex, setCurrentIndex]     = useState(0)

  const [language, setLanguage]       = useState<Language>("python")
  const [code, setCode]               = useState(DEFAULT_CODE.python)
  const [activeTab, setActiveTab]     = useState("description")
  const [showProblemList, setShowProblemList] = useState(false)
  const [isRunning, setIsRunning]     = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [customInput, setCustomInput] = useState("")
  const [customOutput, setCustomOutput] = useState("")
  const [showConsole, setShowConsole] = useState(false)
  const [consoleTab, setConsoleTab]   = useState<"testcases" | "custom">("testcases")

  useEffect(() => {
    api.get("/coding/problems")
      .then((res) => {
        setProblemsList(res.data)
        if (res.data.length > 0) loadProblem(res.data[0].slug, 0)
      })
      .catch(() => toast.error("Failed to load problems"))
      .finally(() => setLoadingProblems(false))
  }, [])

  function loadProblem(slug: string, index: number) {
    setLoadingProblem(true)
    setCurrentIndex(index)
    setTestResults([])
    setShowConsole(false)
    api.get(`/coding/problems/${slug}`)
      .then((res) => {
        const p: Problem = res.data
        setCurrentProblem(p)
        setCode(p.starter_code?.[language] || DEFAULT_CODE[language])
        return api.get(`/coding/problems/${slug}/submissions`)
      })
      .then((res) => setSubmissions(res.data))
      .catch(() => {})
      .finally(() => setLoadingProblem(false))
  }

  function handleLanguageChange(newLang: Language) {
    setLanguage(newLang)
    if (currentProblem) {
      setCode(currentProblem.starter_code?.[newLang] || DEFAULT_CODE[newLang])
    }
  }

  function handleReset() {
    if (currentProblem) {
      setCode(currentProblem.starter_code?.[language] || DEFAULT_CODE[language])
      toast.info("Editor reset to starter code")
    }
  }

  function handlePrev() {
    if (currentIndex > 0) loadProblem(problemsList[currentIndex - 1].slug, currentIndex - 1)
  }

  function handleNext() {
    if (currentIndex < problemsList.length - 1)
      loadProblem(problemsList[currentIndex + 1].slug, currentIndex + 1)
  }

  async function handleRunCode() {
    if (!currentProblem) return
    setIsRunning(true)
    setShowConsole(true)

    if (customInput.trim()) {
      setConsoleTab("custom")
      setCustomOutput("Running...")
      try {
        const res = await api.post("/coding/run", {
          problem_slug: currentProblem.slug,
          language,
          code,
          custom_input: customInput,
        })
        setCustomOutput(res.data.output || res.data.error || "(no output)")
      } catch {
        setCustomOutput("Error: Failed to run code")
      } finally {
        setIsRunning(false)
      }
    } else {
      setConsoleTab("testcases")
      try {
        const res = await api.post("/coding/run", {
          problem_slug: currentProblem.slug,
          language,
          code,
        })
        const results = res.data.test_results ?? []
        setTestResults(results.map((r: any, i: number) => ({
          id: i + 1,
          input: r.input,
          expectedOutput: r.expected,
          actualOutput: r.got,
          status: r.passed ? "passed" : "failed",
        })))
        const allPassed = results.every((r: any) => r.passed)
        if (allPassed) toast.success("All test cases passed!")
        else toast.error("Some test cases failed")
      } catch {
        toast.error("Failed to run code")
      } finally {
        setIsRunning(false)
      }
    }
  }

  async function handleSubmit() {
    if (!currentProblem) return
    setIsRunning(true)
    setShowConsole(true)
    setConsoleTab("testcases")
    try {
      const res = await api.post("/coding/submit", {
        problem_slug: currentProblem.slug,
        language,
        code,
      })
      const { status, message, test_results, points_awarded, milestone_bonus } = res.data
      if (status === "accepted") {
        const baseDesc = points_awarded > 0 ? `+${points_awarded} points earned!` : message
        toast.success("Solution Accepted!", { description: baseDesc })
        if (milestone_bonus > 0) {
          setTimeout(() => toast.success(`Milestone! +${milestone_bonus} pts — 10 problems solved!`), 800)
        }
      } else {
        toast.error(
          status === "runtime_error" ? "Runtime Error"
          : status === "time_limit" ? "Time Limit Exceeded"
          : "Wrong Answer",
          { description: message }
        )
      }
      if (test_results) {
        setTestResults(test_results.map((r: any, i: number) => ({
          id: i + 1,
          input: r.input,
          expectedOutput: r.expected,
          actualOutput: r.got,
          status: r.passed ? "passed" : "failed",
        })))
      }
      const subsRes = await api.get(`/coding/problems/${currentProblem.slug}/submissions`)
      setSubmissions(subsRes.data)
      setActiveTab("submissions")
    } catch {
      toast.error("Failed to submit")
    } finally {
      setIsRunning(false)
    }
  }

  if (loadingProblems) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading problems...</p>
      </div>
    )
  }

  const diff = currentProblem?.difficulty
  const passedCount = testResults.filter(r => r.status === "passed").length

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-0 -mx-4 -mt-4">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
        {/* Left: list + nav */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon"
            onClick={() => setShowProblemList(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Problem list"
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost" size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="h-8 w-8 text-muted-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums select-none">
            {currentIndex + 1} <span className="text-muted-foreground/50">/</span> {problemsList.length}
          </span>
          <Button
            variant="ghost" size="icon"
            onClick={handleNext}
            disabled={currentIndex === problemsList.length - 1}
            className="h-8 w-8 text-muted-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Center: title + difficulty */}
        <div className="hidden sm:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {currentProblem && (
            <>
              <span className="text-sm font-semibold font-serif text-foreground truncate max-w-xs">
                {currentIndex + 1}. {currentProblem.title}
              </span>
              {diff && (
                <span className={cn("chip text-xs", difficultyConfig[diff].cls)}>
                  {diff}
                </span>
              )}
            </>
          )}
        </div>

        {/* Right: feedback */}
        <div className="flex items-center gap-2">
          <FeedbackModal compact triggerClassName="h-8 text-muted-foreground hover:text-primary" />
        </div>
      </div>

      {/* ── Main Panels ── */}
      <div className="flex flex-1 min-h-0 gap-0">

        {/* Problem List Drawer */}
        <AnimatePresence>
          {showProblemList && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowProblemList(false)}
              />
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 35 }}
                className="fixed left-0 top-0 bottom-0 z-40 w-72 bg-background border-r border-border flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">Problems</span>
                    <span className="text-xs text-muted-foreground">({problemsList.length})</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setShowProblemList(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  {problemsList.map((problem, idx) => (
                    <button
                      key={problem.id}
                      onClick={() => { loadProblem(problem.slug, idx); setShowProblemList(false) }}
                      className={cn(
                        "w-full p-3 rounded-xl text-left transition-all hover:bg-secondary/60 group",
                        idx === currentIndex
                          ? "bg-primary/10 border border-primary/25 shadow-sm"
                          : "border border-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={cn(
                          "text-sm font-medium leading-snug",
                          idx === currentIndex ? "text-primary" : "text-foreground group-hover:text-foreground"
                        )}>
                          {idx + 1}. {problem.title}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-warning shrink-0 mt-0.5">
                          <Star className="h-3 w-3 fill-warning" />
                          {problem.points}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={cn("chip text-xs", difficultyConfig[problem.difficulty].cls)}>
                          {problem.difficulty}
                        </span>
                        {problem.tags.slice(0, 1).map(t => (
                          <span key={t} className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Left Panel: Problem Statement ── */}
        <div className="w-full lg:w-[42%] flex flex-col border-r border-border min-h-0">
          {loadingProblem ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading problem...</p>
            </div>
          ) : currentProblem ? (
            <>
              {/* Problem header */}
              <div className="px-5 pt-5 pb-3 border-b border-border shrink-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-lg font-bold font-serif text-foreground leading-tight">
                    {currentIndex + 1}. {currentProblem.title}
                  </h2>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {diff && (
                      <span className={cn("chip text-xs", difficultyConfig[diff].cls)}>
                        {diff}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-warning font-semibold">
                      <Star className="h-3 w-3 fill-warning" />
                      {currentProblem.points} pts
                    </span>
                  </div>
                </div>
                {currentProblem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentProblem.tags.map(t => (
                      <span key={t} className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-md font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
                <TabsList className="shrink-0 bg-transparent border-b border-border rounded-none px-4 h-10 gap-0 justify-start">
                  {[
                    { id: "description", icon: FileText, label: "Description" },
                    { id: "examples",    icon: BookOpen,  label: "Examples" },
                    { id: "constraints", icon: Layers,    label: "Constraints" },
                    { id: "submissions", icon: History,   label: `Submissions${submissions.length > 0 ? ` (${submissions.length})` : ""}` },
                  ].map(({ id, icon: Icon, label }) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      className="rounded-none h-10 px-3 text-xs font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors gap-1.5"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="description" className="m-0 p-5">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                      {currentProblem.description}
                    </p>
                  </TabsContent>

                  <TabsContent value="examples" className="m-0 p-5 space-y-4">
                    {currentProblem.examples.map((ex, i) => (
                      <div key={i} className="rounded-xl border border-border overflow-hidden">
                        <div className="px-4 py-2 bg-secondary/40 border-b border-border">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Example {i + 1}
                          </span>
                        </div>
                        <div className="p-4 space-y-2 text-sm">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground font-medium w-20 shrink-0">Input:</span>
                            <code className="font-mono text-primary text-xs bg-primary/5 px-2 py-0.5 rounded">{ex.input}</code>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground font-medium w-20 shrink-0">Output:</span>
                            <code className="font-mono text-success text-xs bg-success/5 px-2 py-0.5 rounded">{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <div className="flex gap-2 pt-1 border-t border-border">
                              <span className="text-muted-foreground font-medium w-20 shrink-0">Explain:</span>
                              <span className="text-muted-foreground text-xs leading-relaxed">{ex.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="constraints" className="m-0 p-5">
                    {currentProblem.constraints ? (
                      <ul className="space-y-2.5">
                        {currentProblem.constraints.split("\n").filter(Boolean).map((c, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            <code className="font-mono text-foreground/80 text-xs leading-relaxed">{c}</code>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <Layers className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">No constraints specified</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="submissions" className="m-0 p-5">
                    {submissions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <History className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">No submissions yet</p>
                        <p className="text-xs text-muted-foreground/60">Submit your solution to see results here</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {submissions.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className={cn("flex items-center gap-1.5 font-semibold capitalize text-xs", statusColors[s.status] ?? "text-foreground")}>
                                {statusIcons[s.status]}
                                {s.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="font-mono bg-secondary/60 px-2 py-0.5 rounded">{s.language}</span>
                              {s.runtime_ms && <span>{s.runtime_ms}ms</span>}
                              <span>{timeAgo(s.submitted_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </>
          ) : null}
        </div>

        {/* ── Right Panel: Editor ── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/40 shrink-0">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(v) => handleLanguageChange(v as Language)}>
                <SelectTrigger className="h-8 w-36 bg-secondary/50 border-border text-foreground text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(LANG_LABELS) as [Language, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost" size="icon"
                onClick={handleReset}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Reset to starter code"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning || !currentProblem}
                className="h-8 px-4 text-xs bg-secondary/50 border-border text-foreground hover:bg-secondary hover:text-foreground gap-1.5"
              >
                {isRunning && consoleTab === "testcases"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Play className="h-3.5 w-3.5 fill-current" />}
                Run
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isRunning || !currentProblem}
                className="h-8 px-4 text-xs gradient-bg text-white hover:opacity-90 gap-1.5"
              >
                {isRunning && consoleTab !== "custom"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Send className="h-3.5 w-3.5" />}
                Submit
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(val) => setCode(val ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                renderLineHighlight: "line",
                tabSize: 4,
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Console Panel */}
          <div className="shrink-0 border-t border-border">
            {/* Console toggle bar */}
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="w-full flex items-center justify-between px-4 py-2 bg-card/60 hover:bg-secondary/40 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">Console</span>
                {testResults.length > 0 && (
                  <span className={cn(
                    "text-xs font-semibold px-1.5 py-0.5 rounded",
                    passedCount === testResults.length
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  )}>
                    {passedCount}/{testResults.length} passed
                  </span>
                )}
              </div>
              {showConsole
                ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                : <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              }
            </button>

            <AnimatePresence initial={false}>
              {showConsole && (
                <motion.div
                  key="console"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#040810] border-t border-white/5">
                    {/* Console tabs */}
                    <div className="flex items-center gap-0 border-b border-white/8 px-4">
                      {(["testcases", "custom"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setConsoleTab(tab)}
                          className={cn(
                            "px-3 py-2 text-xs font-medium transition-colors border-b-2",
                            consoleTab === tab
                              ? "text-primary border-primary"
                              : "text-muted-foreground border-transparent hover:text-foreground"
                          )}
                        >
                          {tab === "testcases" ? "Test Cases" : "Custom Input"}
                        </button>
                      ))}
                    </div>

                    {/* Console content */}
                    <div className="p-4 max-h-52 overflow-y-auto">
                      {consoleTab === "testcases" && (
                        <div className="space-y-2">
                          {testResults.length === 0 ? (
                            <p className="text-xs text-muted-foreground/60 font-mono py-3">
                              &gt; Click <span className="text-primary">Run</span> to execute against test cases...
                            </p>
                          ) : (
                            testResults.map((tc) => (
                              <div
                                key={tc.id}
                                className={cn(
                                  "rounded-lg border p-3",
                                  tc.status === "passed"
                                    ? "bg-success/5 border-success/20"
                                    : "bg-danger/5 border-danger/20"
                                )}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-foreground/80">Test {tc.id}</span>
                                  {tc.status === "passed"
                                    ? <span className="flex items-center gap-1 text-xs text-success font-medium"><CheckCircle className="h-3 w-3" /> Passed</span>
                                    : <span className="flex items-center gap-1 text-xs text-danger font-medium"><XCircle className="h-3 w-3" /> Failed</span>
                                  }
                                </div>
                                <div className="grid gap-1 text-xs font-mono">
                                  <div className="flex gap-2">
                                    <span className="text-muted-foreground/60 w-16 shrink-0">Input</span>
                                    <code className="text-foreground/80">{tc.input.replace(/\n/g, " | ")}</code>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-muted-foreground/60 w-16 shrink-0">Expected</span>
                                    <code className="text-emerald-400">{tc.expectedOutput}</code>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-muted-foreground/60 w-16 shrink-0">Got</span>
                                    <code className={tc.status === "passed" ? "text-emerald-400" : "text-red-400"}>
                                      {tc.actualOutput}
                                    </code>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {consoleTab === "custom" && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-muted-foreground/60 font-mono mb-1.5 block">
                              &gt; stdin
                            </label>
                            <textarea
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              placeholder={"Enter input here...\n(leave empty to run against test cases)"}
                              className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 resize-none focus:outline-none focus:border-primary/40 transition-colors"
                            />
                          </div>
                          {customOutput && (
                            <div>
                              <label className="text-xs text-muted-foreground/60 font-mono mb-1.5 block">
                                &gt; stdout
                              </label>
                              <pre className="w-full min-h-10 max-h-28 overflow-auto bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm font-mono text-emerald-400">
                                {customOutput}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
