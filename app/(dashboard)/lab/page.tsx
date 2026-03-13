"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import {
  Play, RotateCcw, Terminal, Eye, Plus, Minus, Loader2,
  CheckCircle2, XCircle, Clock, ChevronDown, Copy,
  FlaskConical, Maximize2, Minimize2, WifiOff,
} from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

// ── Language definitions ───────────────────────────────────────────────────────
const LANGS = [
  {
    id: "python",
    label: "Python",
    version: "3.x",
    emoji: "🐍",
    color: "#4ADE80",
    active:  "bg-green-500/15  border-green-500/50  text-green-400",
    inactive:"border-transparent text-muted-foreground",
    pill:    "bg-green-500/10 text-green-400",
    monacoLang: "python",
    ext: ".py",
    comment: "#",
    starter: `# 🐍 Python 3 — Fynity Code Lab
# Press Ctrl+Enter or click ▶ Run

def greet(name: str) -> str:
    return f"Hello, {name}! 👋"

# Fibonacci generator
def fibonacci(n: int):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(greet("World"))
print("Fibonacci:", list(fibonacci(10)))

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)
print("Sum of squares:", sum(squares))
`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    version: "Node.js",
    emoji: "⚡",
    color: "#FBBF24",
    active:  "bg-yellow-500/15 border-yellow-500/50 text-yellow-400",
    inactive:"border-transparent text-muted-foreground",
    pill:    "bg-yellow-500/10 text-yellow-400",
    monacoLang: "javascript",
    ext: ".js",
    comment: "//",
    starter: `// ⚡ JavaScript — Fynity Code Lab
// Press Ctrl+Enter or click ▶ Run

const greet = (name) => \`Hello, \${name}! 👋\`
console.log(greet("World"))

// Fibonacci generator
function* fib() {
  let [a, b] = [0, 1]
  while (true) { yield a;[a, b] = [b, a + b] }
}
const gen = fib()
const first10 = Array.from({ length: 10 }, () => gen.next().value)
console.log("Fibonacci:", first10)

// Array magic
const nums = [1, 2, 3, 4, 5]
console.log("Squares:", nums.map(x => x ** 2))
console.log("Sum:", nums.reduce((a, b) => a + b, 0))
`,
  },
  {
    id: "cpp",
    label: "C++",
    version: "C++17",
    emoji: "⚙️",
    color: "#60A5FA",
    active:  "bg-blue-500/15  border-blue-500/50  text-blue-400",
    inactive:"border-transparent text-muted-foreground",
    pill:    "bg-blue-500/10 text-blue-400",
    monacoLang: "cpp",
    ext: ".cpp",
    comment: "//",
    starter: `// ⚙️ C++ 17 — Fynity Code Lab
// Press Ctrl+Enter or click ▶ Run

#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

vector<int> fibonacci(int n) {
    vector<int> fib = {0, 1};
    for (int i = 2; i < n; i++)
        fib.push_back(fib[i-1] + fib[i-2]);
    return fib;
}

int main() {
    cout << "Hello, World! 👋" << endl;

    auto fib = fibonacci(10);
    cout << "Fibonacci: ";
    for (int x : fib) cout << x << " ";
    cout << endl;

    // iota + accumulate
    vector<int> nums(5);
    iota(nums.begin(), nums.end(), 1);
    cout << "Sum 1-5: " << accumulate(nums.begin(), nums.end(), 0) << endl;

    return 0;
}
`,
  },
  {
    id: "java",
    label: "Java",
    version: "JDK 11+",
    emoji: "☕",
    color: "#FB923C",
    active:  "bg-orange-500/15 border-orange-500/50 text-orange-400",
    inactive:"border-transparent text-muted-foreground",
    pill:    "bg-orange-500/10 text-orange-400",
    monacoLang: "java",
    ext: ".java",
    comment: "//",
    starter: `// ☕ Java — Fynity Code Lab
// Press Ctrl+Enter or click ▶ Run

import java.util.*;
import java.util.stream.*;

public class Solution {
    static List<Integer> fibonacci(int n) {
        List<Integer> fib = new ArrayList<>();
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            fib.add(a);
            int t = a + b; a = b; b = t;
        }
        return fib;
    }

    public static void main(String[] args) {
        System.out.println("Hello, World! 👋");
        System.out.println("Fibonacci: " + fibonacci(10));

        // Streams
        List<Integer> squares = IntStream.rangeClosed(1, 5)
            .map(x -> x * x).boxed().collect(Collectors.toList());
        System.out.println("Squares: " + squares);
        System.out.println("Sum 1-5: " + IntStream.rangeClosed(1, 5).sum());
    }
}
`,
  },
  {
    id: "html",
    label: "HTML",
    version: "Live Preview",
    emoji: "🌐",
    color: "#F87171",
    active:  "bg-red-500/15   border-red-500/50   text-red-400",
    inactive:"border-transparent text-muted-foreground",
    pill:    "bg-red-500/10 text-red-400",
    monacoLang: "html",
    ext: ".html",
    comment: "<!--",
    starter: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fynity Lab 🌐</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0a0f1e, #1a1f35);
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(139,92,246,0.3);
      border-radius: 20px;
      padding: 48px;
      text-align: center;
      backdrop-filter: blur(20px);
      max-width: 460px;
      width: 90%;
    }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
    .g { background: linear-gradient(135deg,#8b5cf6,#06b6d4);
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #94a3b8; margin-bottom: 24px; line-height: 1.6; }
    .counter { font-size: 4rem; font-weight: 900; margin: 12px 0;
               background: linear-gradient(135deg,#8b5cf6,#06b6d4);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .btn {
      background: linear-gradient(135deg,#8b5cf6,#06b6d4);
      color: #fff; border: none; padding: 14px 32px;
      border-radius: 14px; font-size: 1rem; font-weight: 600;
      cursor: pointer; transition: all .2s;
      box-shadow: 0 0 24px rgba(139,92,246,.4);
    }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(139,92,246,.5); }
    .tags { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
    .tag {
      background: rgba(139,92,246,.12); border: 1px solid rgba(139,92,246,.3);
      padding: 4px 12px; border-radius: 999px; font-size: .75rem; color: #a78bfa;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1><span class="g">Hello, Lab!</span> 🌐</h1>
    <p>Edit HTML, CSS &amp; JS then click <strong>Run</strong> to see it live!</p>
    <div class="counter" id="n">0</div>
    <button class="btn" onclick="document.getElementById('n').textContent=+document.getElementById('n').textContent+1">
      Click me! 🎉
    </button>
    <div class="tags">
      <span class="tag">HTML5</span>
      <span class="tag">CSS3</span>
      <span class="tag">JavaScript</span>
      <span class="tag">Fynity Lab</span>
    </div>
  </div>
</body>
</html>`,
  },
] as const

type LangId = typeof LANGS[number]["id"]
type Lang   = typeof LANGS[number]

interface RunResult {
  output: string
  runtime_ms: number
  ok: boolean
  errorType?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ERROR_LABELS: Record<string, string> = {
  compile_error:  "Compile Error",
  runtime_error:  "Runtime Error",
  timeout:        "Time Limit Exceeded",
}

function StatusBadge({ ok, errorType }: { ok: boolean; errorType?: string }) {
  if (ok) return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="h-3 w-3" /> Success
    </span>
  )
  const label = errorType ? (ERROR_LABELS[errorType] ?? errorType) : "Error"
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">
      <XCircle className="h-3 w-3" /> {label}
    </span>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LabPage() {
  const [langId, setLangId] = useState<LangId>("python")
  const [codes, setCodes]   = useState<Record<LangId, string>>(
    Object.fromEntries(LANGS.map(l => [l.id, l.starter])) as Record<LangId, string>
  )
  const [stdin,       setStdin]       = useState("")
  const [showStdin,   setShowStdin]   = useState(false)
  const [result,      setResult]      = useState<RunResult | null>(null)
  const [htmlSrc,     setHtmlSrc]     = useState<string | null>(null)
  const [running,     setRunning]     = useState(false)
  const [fontSize,    setFontSize]    = useState(14)
  const [outputFull,  setOutputFull]  = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  const lang   = LANGS.find(l => l.id === langId) as Lang
  const isHtml = langId === "html"

  // Switch language
  const switchLang = (id: LangId) => {
    setLangId(id)
    setResult(null)
    setHtmlSrc(null)
  }

  // Run code
  const run = useCallback(async () => {
    if (running) return
    setRunning(true)
    setResult(null)

    if (isHtml) {
      setHtmlSrc(codes[langId])
      setResult({ output: "HTML rendered in preview →", runtime_ms: 0, ok: true })
      setRunning(false)
      return
    }

    try {
      const res = await api.post("/coding/run", {
        language: langId === "cpp" ? "cpp" : langId,
        code: codes[langId],
        custom_input: stdin,
      })
      const d = res.data
      const ok = d.status === "success" || d.status === "passed"
      setResult({
        output:     ok ? (d.output || "(no output)") : (d.output || d.error || "Unknown error"),
        runtime_ms: d.runtime_ms ?? 0,
        ok,
        errorType:  ok ? undefined : (d.error ?? undefined),
      })
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to execute — is the backend running?"
      setResult({ output: msg, runtime_ms: 0, ok: false, errorType: "runtime_error" })
    } finally {
      setRunning(false)
    }
  }, [running, isHtml, langId, codes, stdin])

  // Keyboard shortcut: Ctrl/Cmd + Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run() }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [run])

  const copyOutput = () => {
    if (!result) return
    navigator.clipboard.writeText(result.output)
    toast.success("Output copied!")
  }

  const copyCode = () => {
    navigator.clipboard.writeText(codes[langId])
    toast.success("Code copied!")
  }

  const resetCode = () => {
    setCodes(prev => ({ ...prev, [langId]: lang.starter }))
    setResult(null)
    setHtmlSrc(null)
    toast.info("Code reset to starter")
  }

  return (
    <div
      className="flex flex-col gap-0"
      style={{ height: "calc(100vh - 8rem)", margin: "-1rem", marginTop: "-0.5rem" }}
    >
      {/* ─── Header row ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-background/90 backdrop-blur-xl flex-shrink-0 gap-3">

        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center primary-glow-sm flex-shrink-0">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold font-serif gradient-text text-base leading-none">Code Lab</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">Free Practice Compiler</p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Font size */}
          <div className="hidden sm:flex items-center gap-1 bg-secondary/40 border border-border/50 rounded-lg px-2 py-1.5">
            <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="text-muted-foreground hover:text-foreground transition-colors">
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-mono text-foreground w-5 text-center select-none">{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(22, s + 1))} className="text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Run button */}
          <button
            onClick={run}
            disabled={running}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all duration-200 primary-glow-hover select-none",
              running
                ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                : "gradient-bg text-white hover:opacity-90 active:scale-95"
            )}
          >
            {running
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Play className="h-4 w-4 fill-white" />
            }
            <span>Run</span>
            <kbd className="hidden lg:inline text-[10px] opacity-60 bg-white/15 px-1.5 py-0.5 rounded font-mono">⌘↵</kbd>
          </button>
        </div>
      </div>

      {/* ─── Language nav bar (full-width, tab style) ─────────────────────────── */}
      <div className="flex items-stretch border-b border-border/60 bg-background/70 backdrop-blur overflow-x-auto flex-shrink-0 scrollbar-hide">
        {LANGS.map(l => {
          const isActive = langId === l.id
          return (
            <button
              key={l.id}
              onClick={() => switchLang(l.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0 relative group",
                isActive
                  ? "bg-secondary/30"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              )}
              style={isActive ? { borderBottomColor: l.color, color: l.color } : {}}
            >
              <span className="text-lg leading-none">{l.emoji}</span>
              <span>{l.label}</span>
              <span
                className={cn(
                  "text-[10px] font-normal transition-opacity",
                  isActive ? "opacity-70" : "opacity-0 group-hover:opacity-50"
                )}
                style={isActive ? { color: l.color } : {}}
              >
                {l.version}
              </span>
              {/* Active glow underline */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 blur-sm"
                  style={{ backgroundColor: l.color }}
                />
              )}
            </button>
          )
        })}
        {/* Spacer */}
        <div className="flex-1 border-b-2 border-transparent" />
      </div>

      {/* ─── Editor + Output ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left — Editor panel */}
        <div className={cn(
          "flex flex-col border-r border-border/50 overflow-hidden transition-all duration-300",
          outputFull ? "w-0 overflow-hidden" : "flex-1"
        )}>

          {/* Editor file tab */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary/20 border-b border-border/40 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Traffic lights */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">{`solution${lang.ext}`}</span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-semibold", lang.pill)}>
                {lang.version}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={copyCode} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary/60">
                <Copy className="h-3 w-3" /> Copy
              </button>
              <button onClick={resetCode} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary/60">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={lang.monacoLang}
              value={codes[langId]}
              onChange={val => setCodes(prev => ({ ...prev, [langId]: val ?? "" }))}
              theme="vs-dark"
              options={{
                fontSize,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                padding: { top: 14, bottom: 14 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                renderWhitespace: "selection",
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                wordWrap: "on",
                overviewRulerLanes: 0,
                scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                renderLineHighlight: "gutter",
                suggest: { showStatusBar: true },
              }}
            />
          </div>

          {/* STDIN panel */}
          {!isHtml && (
            <div className="border-t border-border/40 bg-secondary/10 flex-shrink-0">
              <button
                onClick={() => setShowStdin(!showStdin)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5" />
                  <span className="font-mono font-bold tracking-wider">STDIN</span>
                  {stdin.trim() && (
                    <span className="bg-primary/15 text-primary px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {stdin.trim().split("\n").length} line{stdin.trim().split("\n").length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", showStdin && "rotate-180")} />
              </button>
              {showStdin && (
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder={"Enter program input here…\n(one value per line)"}
                  rows={5}
                  className="w-full px-4 pb-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none border-t border-border/30 leading-relaxed"
                />
              )}
            </div>
          )}
        </div>

        {/* Right — Output / Preview panel */}
        <div className={cn(
          "flex flex-col bg-[#0d1117] overflow-hidden transition-all duration-300",
          outputFull ? "flex-1" : "w-[44%]"
        )}>

          {/* Output header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-secondary/20 flex-shrink-0">
            <div className="flex items-center gap-2">
              {isHtml && htmlSrc
                ? <Eye className="h-4 w-4 text-red-400" />
                : <Terminal className="h-4 w-4 text-primary" />
              }
              <span className="text-sm font-bold text-foreground">
                {isHtml && htmlSrc ? "Live Preview" : "Console"}
              </span>
              {result && <StatusBadge ok={result.ok} errorType={result.errorType} />}
            </div>

            <div className="flex items-center gap-2">
              {result && result.runtime_ms > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{result.runtime_ms}ms</span>
                </div>
              )}
              {result && !isHtml && (
                <button onClick={copyOutput} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setOutputFull(!outputFull)}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                title={outputFull ? "Restore" : "Maximize output"}
              >
                {outputFull ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Output body */}
          <div ref={outputRef} className="flex-1 overflow-auto">

            {/* Running state */}
            {running && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-2xl animate-pulse">{lang.emoji}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Compiling {lang.label}…</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">executing your code</p>
                </div>
              </div>
            )}

            {/* HTML iframe preview */}
            {!running && isHtml && htmlSrc && (
              <iframe
                srcDoc={htmlSrc}
                title="HTML Preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
              />
            )}

            {/* Console output */}
            {!running && result && !htmlSrc && (
              <div className="p-4 h-full flex flex-col">
                {/* Output text */}
                <pre className={cn(
                  "whitespace-pre-wrap break-words text-sm font-mono leading-relaxed flex-1",
                  result.ok ? "text-green-300" : "text-red-300"
                )}>
                  {result.output}
                </pre>

                {/* Footer */}
                <div className="border-t border-border/30 pt-3 mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  {result.ok
                    ? <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="h-3.5 w-3.5" /> Executed successfully</span>
                    : <span className="flex items-center gap-1 text-red-400"><XCircle className="h-3.5 w-3.5" /> {ERROR_LABELS[result.errorType ?? ""] ?? "Execution failed"}</span>
                  }
                  {result.runtime_ms > 0 && (
                    <span className="ml-auto font-mono">{result.runtime_ms}ms</span>
                  )}
                </div>
              </div>
            )}

            {/* Empty / welcome state */}
            {!running && !result && (
              <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
                {/* Big language icon */}
                <div
                  className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                  style={{ background: `${lang.color}15`, border: `1px solid ${lang.color}30` }}
                >
                  <span>{lang.emoji}</span>
                  <div
                    className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
                    style={{ backgroundColor: lang.color }}
                  />
                </div>

                <div>
                  <p className="font-bold text-foreground text-base">{lang.label} ready</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Press{" "}
                    <kbd className="font-mono bg-secondary/60 border border-border px-1.5 py-0.5 rounded text-[11px]">Ctrl</kbd>
                    {" + "}
                    <kbd className="font-mono bg-secondary/60 border border-border px-1.5 py-0.5 rounded text-[11px]">↵</kbd>
                    {" to run"}
                  </p>
                </div>

                {/* Quick-switch other langs */}
                <div className="w-full max-w-xs">
                  <p className="text-xs text-muted-foreground mb-3">Or switch language:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGS.filter(l => l.id !== langId).map(l => (
                      <button
                        key={l.id}
                        onClick={() => switchLang(l.id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-xs font-semibold hover:border-border hover:bg-secondary/60 transition-all text-muted-foreground hover:text-foreground"
                      >
                        <span className="text-base">{l.emoji}</span>
                        <div className="text-left">
                          <p>{l.label}</p>
                          <p className="text-[10px] opacity-60 font-normal">{l.version}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="w-full max-w-xs bg-secondary/20 border border-border/40 rounded-xl p-4 text-left">
                  <p className="text-xs font-bold text-foreground mb-2">💡 Lab Tips</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• <kbd className="font-mono bg-secondary/60 border border-border/40 px-1 rounded text-[10px]">Ctrl+Enter</kbd> — Run code</li>
                    <li>• Open STDIN to provide program input</li>
                    <li>• HTML mode renders a live preview</li>
                    <li>• Click Reset to restore starter code</li>
                    <li>• Your code is saved per language</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
