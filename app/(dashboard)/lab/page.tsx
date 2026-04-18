"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import {
  Play, RotateCcw, Terminal, Eye, Plus, Minus, Loader2,
  CheckCircle2, XCircle, Clock, ChevronDown, Copy,
  FlaskConical, Maximize2, Minimize2, Code2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const LANGS = [
  {
    id: "python", label: "Python", version: "3.x", emoji: "🐍", color: "#4ADE80",
    pill: "bg-green-500/10 text-green-400", monacoLang: "python", ext: ".py",
    starter: `# Python 3
print("Hello, World!")

nums = [1, 2, 3, 4, 5]
print("Squares:", [x**2 for x in nums])
`,
  },
  {
    id: "javascript", label: "JavaScript", version: "Node.js", emoji: "⚡", color: "#FBBF24",
    pill: "bg-yellow-500/10 text-yellow-400", monacoLang: "javascript", ext: ".js",
    starter: `// JavaScript (Node.js)
console.log("Hello, World!")

const nums = [1, 2, 3, 4, 5]
console.log("Squares:", nums.map(x => x ** 2))
`,
  },
  {
    id: "cpp", label: "C++", version: "C++17", emoji: "⚙️", color: "#60A5FA",
    pill: "bg-blue-500/10 text-blue-400", monacoLang: "cpp", ext: ".cpp",
    starter: `// C++ 17
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    vector<int> v = {1, 4, 9, 16, 25};
    for (int x : v) cout << x << " ";
    cout << endl;
    return 0;
}
`,
  },
  {
    id: "java", label: "Java", version: "JDK 11+", emoji: "☕", color: "#FB923C",
    pill: "bg-orange-500/10 text-orange-400", monacoLang: "java", ext: ".java",
    starter: `// Java
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        int[] nums = {1, 4, 9, 16, 25};
        for (int x : nums) System.out.print(x + " ");
        System.out.println();
    }
}
`,
  },
  {
    id: "html", label: "HTML", version: "Live Preview", emoji: "🌐", color: "#F87171",
    pill: "bg-red-500/10 text-red-400", monacoLang: "html", ext: ".html",
    starter: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lab</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: linear-gradient(135deg, #0a0f1e, #1a1f35); color: #f1f5f9; }
    .card { background: rgba(255,255,255,.06); border: 1px solid rgba(139,92,246,.3);
            border-radius: 20px; padding: 40px; text-align: center; max-width: 400px; width: 90%; }
    h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 8px;
         background: linear-gradient(135deg,#8b5cf6,#06b6d4);
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #94a3b8; margin: 0 0 20px; }
    .count { font-size: 3rem; font-weight: 900; margin: 8px 0;
             background: linear-gradient(135deg,#8b5cf6,#06b6d4);
             -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    button { background: linear-gradient(135deg,#8b5cf6,#06b6d4); color: #fff;
             border: none; padding: 12px 28px; border-radius: 12px; font-size: .95rem;
             font-weight: 600; cursor: pointer; transition: .2s; }
    button:hover { opacity: .85; transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, Lab! 🌐</h1>
    <p>Edit &amp; click Run to preview</p>
    <div class="count" id="n">0</div>
    <button onclick="document.getElementById('n').textContent=+document.getElementById('n').textContent+1">
      Click me! 🎉
    </button>
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

const ERROR_LABELS: Record<string, string> = {
  compile_error: "Compile Error",
  runtime_error: "Runtime Error",
  timeout:       "Time Limit Exceeded",
}

// panel expand state: "split" | "code" | "output"
type PanelMode = "split" | "code" | "output"

function StatusBadge({ ok, errorType }: { ok: boolean; errorType?: string }) {
  if (ok) return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-success/15 text-success px-2 py-0.5 rounded-full">
      <CheckCircle2 className="h-3 w-3" /> OK
    </span>
  )
  const label = errorType ? (ERROR_LABELS[errorType] ?? errorType) : "Error"
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-danger/15 text-danger px-2 py-0.5 rounded-full">
      <XCircle className="h-3 w-3" /> {label}
    </span>
  )
}

export default function LabPage() {
  const [langId, setLangId]   = useState<LangId>("python")
  const [codes, setCodes]     = useState<Record<LangId, string>>(
    Object.fromEntries(LANGS.map(l => [l.id, l.starter])) as Record<LangId, string>
  )
  const [stdin,     setStdin]     = useState("")
  const [showStdin, setShowStdin] = useState(false)
  const [result,    setResult]    = useState<RunResult | null>(null)
  const [htmlSrc,   setHtmlSrc]   = useState<string | null>(null)
  const [running,   setRunning]   = useState(false)
  const [fontSize,  setFontSize]  = useState(14)
  const [panelMode, setPanelMode] = useState<PanelMode>("split")
  // Mobile panel
  const [mobilePanel, setMobilePanel] = useState<"editor" | "output">("editor")

  const lang   = LANGS.find(l => l.id === langId) as Lang
  const isHtml = langId === "html"

  const switchLang = (id: LangId) => { setLangId(id); setResult(null); setHtmlSrc(null) }

  const run = useCallback(async () => {
    if (running) return
    setRunning(true)
    setResult(null)
    setMobilePanel("output")

    if (isHtml) {
      setHtmlSrc(codes[langId])
      setResult({ output: "", runtime_ms: 0, ok: true })
      setRunning(false)
      return
    }

    try {
      const res = await api.post("/coding/run", {
        language: langId,
        code: codes[langId],
        custom_input: stdin,
      })
      const d  = res.data
      const ok = d.status === "success" || d.status === "passed"
      setResult({
        output:     ok ? (d.output || "(no output)") : (d.output || d.error || "Unknown error"),
        runtime_ms: d.runtime_ms ?? 0,
        ok,
        errorType:  ok ? undefined : (d.error ?? undefined),
      })
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to execute"
      setResult({ output: msg, runtime_ms: 0, ok: false, errorType: "runtime_error" })
    } finally {
      setRunning(false)
    }
  }, [running, isHtml, langId, codes, stdin])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run() }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [run])

  const togglePanel = (target: "code" | "output") => {
    setPanelMode(prev => prev === target ? "split" : target)
  }

  return (
    <div className="flex flex-col -mx-4 -mt-4" style={{ height: "calc(100vh - 5rem)" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60 backdrop-blur-sm shrink-0 gap-3">

        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center shrink-0">
            <FlaskConical className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold font-serif gradient-text text-sm hidden sm:block">Code Lab</span>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex lg:hidden items-center gap-1 bg-secondary/50 rounded-xl p-1">
          <button
            onClick={() => setMobilePanel("editor")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              mobilePanel === "editor" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Code2 className="h-3.5 w-3.5" /> Code
          </button>
          <button
            onClick={() => setMobilePanel("output")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              mobilePanel === "output" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Terminal className="h-3.5 w-3.5" /> Output
            {result && <span className={cn("w-1.5 h-1.5 rounded-full", result.ok ? "bg-success" : "bg-danger")} />}
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Font size */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/40 border border-border/50 rounded-lg px-2 py-1.5">
            <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="text-muted-foreground hover:text-foreground transition-colors">
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-mono text-foreground w-5 text-center select-none">{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(22, s + 1))} className="text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Run */}
          <button
            onClick={run}
            disabled={running}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 select-none",
              running ? "bg-primary/60 text-primary-foreground cursor-not-allowed" : "gradient-bg text-white hover:opacity-90 active:scale-95"
            )}
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
            <span>Run</span>
            <kbd className="hidden lg:inline text-[10px] opacity-60 bg-white/15 px-1.5 py-0.5 rounded font-mono">⌘↵</kbd>
          </button>
        </div>
      </div>

      {/* ── Language tabs ── */}
      <div className="flex items-stretch border-b border-border bg-background overflow-x-auto shrink-0 scrollbar-hide">
        {LANGS.map(l => {
          const active = langId === l.id
          return (
            <button
              key={l.id}
              onClick={() => switchLang(l.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 shrink-0 relative",
                !active && "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              )}
              style={active ? { borderBottomColor: l.color, color: l.color, background: `${l.color}0d` } : {}}
            >
              <span className="text-sm leading-none">{l.emoji}</span>
              <span>{l.label}</span>
              {active && (
                <span className="hidden sm:inline text-[10px] font-normal opacity-60" style={{ color: l.color }}>
                  {l.version}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 blur-sm" style={{ backgroundColor: l.color }} />
              )}
            </button>
          )
        })}
        <div className="flex-1 border-b-2 border-transparent" />
      </div>

      {/* ── Panels ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── Code panel ── */}
        <div className={cn(
          "flex flex-col border-r border-border/50 overflow-hidden transition-all duration-300",
          mobilePanel === "editor" ? "flex-1 lg:flex-none" : "hidden lg:flex",
          panelMode === "output" ? "lg:w-0 lg:overflow-hidden" : panelMode === "code" ? "lg:flex-1" : "lg:flex-1"
        )}>

          {/* File tab */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-white/8 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs font-mono text-white/50">{`solution${lang.ext}`}</span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-semibold hidden sm:inline", lang.pill)}>
                {lang.version}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => navigator.clipboard.writeText(codes[langId]).then(() => toast.success("Copied!"))}
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white/80 px-2 py-1 rounded hover:bg-white/8 transition-colors">
                <Copy className="h-3 w-3" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button onClick={() => { setCodes(p => ({ ...p, [langId]: lang.starter })); setResult(null); setHtmlSrc(null); toast.info("Reset") }}
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white/80 px-2 py-1 rounded hover:bg-white/8 transition-colors">
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              {/* Maximize code panel */}
              <button
                onClick={() => togglePanel("code")}
                className="hidden lg:flex items-center p-1.5 rounded text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors ml-1"
                title={panelMode === "code" ? "Restore split" : "Maximize editor"}
              >
                {panelMode === "code" ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Monaco */}
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            <MonacoEditor
              height="100%"
              language={lang.monacoLang}
              value={codes[langId]}
              onChange={val => setCodes(prev => ({ ...prev, [langId]: val ?? "" }))}
              theme="vs-dark"
              options={{
                fontSize,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                padding: { top: 12, bottom: 12 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                wordWrap: "on",
                overviewRulerLanes: 0,
                scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                renderLineHighlight: "gutter",
              }}
            />
          </div>

          {/* STDIN */}
          {!isHtml && (
            <div className="border-t border-border/40 bg-secondary/10 shrink-0">
              <button
                onClick={() => setShowStdin(!showStdin)}
                className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3" />
                  <span className="font-mono font-bold tracking-wider">STDIN</span>
                  {stdin.trim() && (
                    <span className="bg-primary/15 text-primary px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {stdin.trim().split("\n").length}L
                    </span>
                  )}
                </div>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", showStdin && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {showStdin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      value={stdin}
                      onChange={e => setStdin(e.target.value)}
                      placeholder={"Enter input here…\n(one value per line)"}
                      rows={3}
                      className="w-full px-4 pb-2 pt-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none border-t border-border/30 leading-relaxed"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Output panel ── */}
        <div className={cn(
          "flex flex-col bg-[#0d1117] overflow-hidden transition-all duration-300",
          mobilePanel === "output" ? "flex-1 lg:flex-none" : "hidden lg:flex",
          panelMode === "code" ? "lg:w-0 lg:overflow-hidden" : panelMode === "output" ? "lg:flex-1" : "lg:w-[42%]"
        )}>

          {/* Output header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8 bg-[#161b22] shrink-0">
            <div className="flex items-center gap-2">
              {isHtml && htmlSrc
                ? <Eye className="h-3.5 w-3.5 text-red-400" />
                : <Terminal className="h-3.5 w-3.5 text-primary" />
              }
              <span className="text-xs font-bold text-white/90">
                {isHtml && htmlSrc ? "Preview" : "Output"}
              </span>
              {result && <StatusBadge ok={result.ok} errorType={result.errorType} />}
            </div>
            <div className="flex items-center gap-1">
              {result && result.runtime_ms > 0 && (
                <div className="flex items-center gap-1 text-xs text-white/40 font-mono">
                  <Clock className="h-3 w-3" />{result.runtime_ms}ms
                </div>
              )}
              {result && !isHtml && (
                <button onClick={() => navigator.clipboard.writeText(result.output).then(() => toast.success("Copied!"))}
                  className="p-1.5 rounded text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors">
                  <Copy className="h-3 w-3" />
                </button>
              )}
              {/* Maximize output panel */}
              <button
                onClick={() => togglePanel("output")}
                className="hidden lg:flex p-1.5 rounded text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors"
                title={panelMode === "output" ? "Restore split" : "Maximize output"}
              >
                {panelMode === "output" ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Output body */}
          <div className="flex-1 overflow-auto">

            {/* Running */}
            {running && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-xl">{lang.emoji}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-sm font-semibold text-foreground">Running…</p>
              </div>
            )}

            {/* HTML preview */}
            {!running && isHtml && htmlSrc && (
              <iframe srcDoc={htmlSrc} title="HTML Preview" className="w-full h-full border-0 bg-white" sandbox="allow-scripts" />
            )}

            {/* Console output */}
            {!running && result && !htmlSrc && (
              <div className="p-4 h-full flex flex-col">
                <pre className={cn(
                  "whitespace-pre-wrap break-words text-sm font-mono leading-relaxed flex-1",
                  result.ok ? "text-green-300" : "text-red-300"
                )}>
                  {result.output}
                </pre>
                <div className="border-t border-white/8 pt-2 mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {result.ok
                    ? <span className="flex items-center gap-1 text-success"><CheckCircle2 className="h-3 w-3" /> Done</span>
                    : <span className="flex items-center gap-1 text-danger"><XCircle className="h-3 w-3" /> {ERROR_LABELS[result.errorType ?? ""] ?? "Failed"}</span>
                  }
                  {result.runtime_ms > 0 && <span className="ml-auto font-mono">{result.runtime_ms}ms</span>}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!running && !result && (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative"
                  style={{ background: `${lang.color}15`, border: `1px solid ${lang.color}30` }}
                >
                  <span>{lang.emoji}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{lang.label} ready</p>
                  <p className="text-xs text-white/40 mt-1">
                    <kbd className="font-mono bg-white/10 border border-white/15 px-1.5 py-0.5 rounded text-[11px] text-white/60">Ctrl</kbd>
                    {" + "}
                    <kbd className="font-mono bg-white/10 border border-white/15 px-1.5 py-0.5 rounded text-[11px] text-white/60">↵</kbd>
                    {" to run"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
