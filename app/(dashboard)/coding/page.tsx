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
  AlertTriangle,
  Star,
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

const difficultyColors = {
  Easy: "chip chip-success",
  Medium: "chip chip-warning",
  Hard: "chip chip-danger",
}

const statusColors: Record<string, string> = {
  accepted: "text-success",
  wrong_answer: "text-danger",
  runtime_error: "text-streak",
  time_limit: "text-warning",
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
  const [customInput, setCustomInput] = useState("")
  const [customOutput, setCustomOutput] = useState("")
  const [showConsole, setShowConsole] = useState(false)
  const [consoleTab, setConsoleTab] = useState<"testcases" | "custom">("testcases")

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
    setShowConsole(true)

    if (customInput.trim()) {
      // Custom input mode
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
      // Test cases mode
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
      // Show all test results
      if (test_results) {
        setTestResults(test_results.map((r: any, i: number) => ({
          id: i + 1,
          input: r.input,
          expectedOutput: r.expected,
          actualOutput: r.got,
          status: r.passed ? "passed" : "failed",
        })))
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
                  <span className={cn("text-sm truncate flex-1", idx === currentIndex ? "text-primary" : "text-foreground")}>
                    {idx + 1}. {problem.title}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" className={cn("text-xs", difficultyColors[problem.difficulty])}>
                    {problem.difficulty}
                  </Badge>
                  <span className="flex items-center gap-0.5 text-xs text-warning">
                    <Star className="h-3 w-3 fill-warning" />
                    {problem.points}
                  </span>
                </div>
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
            <div className="ml-auto">
              <FeedbackModal compact triggerClassName="text-muted-foreground hover:text-primary" />
            </div>
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
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant="outline" className={cn("text-sm", difficultyColors[currentProblem.difficulty])}>
                      {currentProblem.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-warning font-medium">
                      <Star className="h-3.5 w-3.5 fill-warning" />
                      {currentProblem.points} pts
                    </span>
                  </div>
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

          {/* Console Panel */}
          <GlassCard className={cn("mt-4 transition-all", showConsole ? "block" : "hidden")}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Console</span>
                <div className="flex gap-1">
                  {(["testcases", "custom"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setConsoleTab(tab)}
                      className={cn(
                        "px-3 py-0.5 rounded text-xs font-medium transition-all",
                        consoleTab === tab
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab === "testcases" ? "Test Cases" : "Custom Input"}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowConsole(false)} className="text-muted-foreground hover:text-foreground">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {consoleTab === "testcases" && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Click Run to see test results
                  </p>
                ) : (
                  testResults.map((tc) => (
                    <div key={tc.id} className={cn(
                      "p-3 rounded-lg border text-sm",
                      tc.status === "passed" ? "bg-success/5 border-success/30" : "bg-danger/5 border-danger/30"
                    )}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">Test {tc.id}</span>
                        {tc.status === "passed"
                          ? <CheckCircle className="h-3.5 w-3.5 text-success" />
                          : <XCircle className="h-3.5 w-3.5 text-danger" />}
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-xs font-mono">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-16 shrink-0">Input:</span>
                          <code className="text-foreground">{tc.input.replace(/\n/g, " | ")}</code>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-16 shrink-0">Expected:</span>
                          <code className="text-primary">{tc.expectedOutput}</code>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-16 shrink-0">Got:</span>
                          <code className={tc.status === "passed" ? "text-success" : "text-danger"}>
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
                  <label className="text-xs text-muted-foreground mb-1 block">Standard Input (stdin)</label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={"Enter your input here...\n(Leave empty to run against test cases)"}
                    className="w-full h-20 bg-secondary/40 border border-white/10 rounded-lg p-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/40"
                  />
                </div>
                {customOutput && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Output</label>
                    <pre className="w-full min-h-12 max-h-32 overflow-auto bg-secondary/40 border border-white/10 rounded-lg p-2 text-sm font-mono text-foreground">
                      {customOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Console toggle when hidden */}
          {!showConsole && (
            <button
              onClick={() => setShowConsole(true)}
              className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Terminal className="h-3.5 w-3.5" />
              Show Console
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
