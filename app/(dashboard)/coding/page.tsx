"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

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
}

interface ProblemListItem {
  id: number
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
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

const difficultyColors = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
}

const statusColors: Record<string, string> = {
  accepted: "text-emerald-400",
  wrong_answer: "text-red-400",
  runtime_error: "text-orange-400",
  time_limit: "text-amber-400",
}

const DEFAULT_CODE: Record<Language, string> = {
  python: "# Write your solution here\n",
  java: "class Solution {\n    // Write your solution here\n}\n",
  cpp: "// Write your solution here\n",
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
  const [problemsList, setProblemsList] = useState<ProblemListItem[]>([])
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingProblems, setLoadingProblems] = useState(true)
  const [loadingProblem, setLoadingProblem] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [language, setLanguage] = useState<Language>("python")
  const [code, setCode] = useState(DEFAULT_CODE.python)
  const [activeTab, setActiveTab] = useState("description")
  const [showProblemList, setShowProblemList] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  // Load problems list
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
    api.get(`/coding/problems/${slug}`)
      .then((res) => {
        const p: Problem = res.data
        setCurrentProblem(p)
        const starterCode = p.starter_code?.[language] || DEFAULT_CODE[language]
        setCode(starterCode)
        // Load submissions for this problem
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
    if (currentIndex < problemsList.length - 1) loadProblem(problemsList[currentIndex + 1].slug, currentIndex + 1)
  }

  async function handleRunCode() {
    if (!currentProblem) return
    setIsRunning(true)
    toast.info("Running test cases...")
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

  async function handleSubmit() {
    if (!currentProblem) return
    setIsRunning(true)
    try {
      const res = await api.post("/coding/submit", {
        problem_slug: currentProblem.slug,
        language,
        code,
      })
      const { status, message } = res.data
      if (status === "accepted") {
        toast.success("Solution Accepted!", { description: message })
      } else {
        toast.error("Submission Failed", { description: message })
      }
      // Refresh submissions tab
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Problem List Sidebar */}
      <div className={cn(
        "absolute lg:relative z-20 h-full transition-all duration-300 bg-background",
        showProblemList ? "w-64" : "w-0 overflow-hidden"
      )}>
        <GlassCard className="h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold font-serif text-foreground">Problems</h3>
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setShowProblemList(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {problemsList.map((problem, idx) => (
              <button
                key={problem.id}
                onClick={() => { loadProblem(problem.slug, idx); setShowProblemList(false) }}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-all hover:bg-secondary/50",
                  idx === currentIndex && "bg-primary/10 border border-primary/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm truncate", idx === currentIndex ? "text-primary" : "text-foreground")}>
                    {idx + 1}. {problem.title}
                  </span>
                </div>
                <Badge variant="outline" className={cn("text-xs mt-1", difficultyColors[problem.difficulty])}>
                  {problem.difficulty}
                </Badge>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-w-0">
        {/* Left Panel — Problem Statement */}
        <div className="w-full lg:w-2/5 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-4">
            {!showProblemList && (
              <Button variant="ghost" size="icon" onClick={() => setShowProblemList(true)} className="text-muted-foreground hover:text-foreground">
                <List className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="text-muted-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentIndex === problemsList.length - 1} className="text-muted-foreground">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <span className="text-xs text-muted-foreground">{currentIndex + 1} / {problemsList.length}</span>
          </div>

          <GlassCard className="flex-1 overflow-y-auto">
            {loadingProblem ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : currentProblem ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-foreground">
                      {currentIndex + 1}. {currentProblem.title}
                    </h2>
                    {currentProblem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentProblem.tags.map(t => (
                          <span key={t} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className={cn("text-sm flex-shrink-0", difficultyColors[currentProblem.difficulty])}>
                    {currentProblem.difficulty}
                  </Badge>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-secondary/50 mb-4">
                    {["description", "examples", "constraints", "submissions"].map((tab) => (
                      <TabsTrigger key={tab} value={tab}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize text-xs">
                        {tab}
                        {tab === "submissions" && submissions.length > 0 && (
                          <span className="ml-1 text-xs">({submissions.length})</span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {currentProblem.description}
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    {currentProblem.examples.map((ex, i) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/50">
                        <h4 className="text-sm font-medium text-foreground mb-2">Example {i + 1}:</h4>
                        <div className="space-y-1.5 text-sm">
                          <p className="text-muted-foreground">
                            <span className="text-foreground font-medium">Input: </span>
                            <code className="font-mono text-primary">{ex.input}</code>
                          </p>
                          <p className="text-muted-foreground">
                            <span className="text-foreground font-medium">Output: </span>
                            <code className="font-mono text-primary">{ex.output}</code>
                          </p>
                          {ex.explanation && (
                            <p className="text-muted-foreground">
                              <span className="text-foreground font-medium">Explanation: </span>
                              {ex.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="constraints">
                    {currentProblem.constraints ? (
                      <ul className="space-y-2">
                        {currentProblem.constraints.split("\n").filter(Boolean).map((c, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <code className="font-mono">{c}</code>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No constraints specified</p>
                    )}
                  </TabsContent>

                  <TabsContent value="submissions">
                    {submissions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">No submissions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {submissions.map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 text-sm">
                            <span className={cn("font-medium capitalize", statusColors[s.status] ?? "text-foreground")}>
                              {s.status.replace("_", " ")}
                            </span>
                            <span className="text-muted-foreground">{s.language}</span>
                            {s.runtime_ms && <span className="text-muted-foreground">{s.runtime_ms}ms</span>}
                            <span className="text-muted-foreground">{timeAgo(s.submitted_at)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            ) : null}
          </GlassCard>
        </div>

        {/* Right Panel — Monaco Editor */}
        <div className="w-full lg:w-3/5 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(v) => handleLanguageChange(v as Language)}>
                <SelectTrigger className="w-40 bg-secondary/50 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={handleReset} className="text-muted-foreground hover:text-foreground" title="Reset to starter code">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning || !currentProblem}
                className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                Run
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isRunning || !currentProblem}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Submit
              </Button>
            </div>
          </div>

          <GlassCard className="flex-1 p-0 overflow-hidden">
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
              }}
            />
          </GlassCard>

          {/* Test Results */}
          {testResults.length > 0 && (
            <GlassCard className="mt-4 max-h-52 overflow-y-auto">
              <h4 className="text-sm font-medium text-foreground mb-3">Test Results</h4>
              <div className="space-y-3">
                {testResults.map((tc) => (
                  <div key={tc.id} className={cn(
                    "p-3 rounded-lg border text-sm",
                    tc.status === "passed" && "bg-emerald-500/5 border-emerald-500/30",
                    tc.status === "failed" && "bg-red-500/5 border-red-500/30",
                    tc.status === "pending" && "bg-secondary/50 border-border",
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Test Case {tc.id}</span>
                      {tc.status === "passed" && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                      {tc.status === "failed" && <XCircle className="h-4 w-4 text-red-400" />}
                      {tc.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Input: </span>
                        <code className="font-mono text-foreground">{tc.input}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected: </span>
                        <code className="font-mono text-primary">{tc.expectedOutput}</code>
                      </div>
                      {tc.actualOutput && (
                        <div>
                          <span className="text-muted-foreground">Got: </span>
                          <code className={cn("font-mono", tc.status === "passed" ? "text-emerald-400" : "text-red-400")}>
                            {tc.actualOutput}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
