"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  Upload, Trash2, Download, CheckCircle2, AlertCircle, SkipForward,
  X, Search, Code2, Loader2, RefreshCw, Plus, Pencil, RefreshCcw,
  Terminal,
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
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

interface TestCase { input: string; expected: string }
interface Example { input: string; output: string; explanation: string }
interface StarterCode { python: string; javascript: string; java: string; cpp: string }

interface CodingProblem {
  id: number
  title: string
  slug: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  examples: Example[]
  constraints: string | null
  starter_code: StarterCode
  test_cases: TestCase[]
  points: number
  is_active: boolean
  created_at: string | null
}

type FormData = Omit<CodingProblem, "id" | "created_at">

interface BulkResult {
  imported: number
  updated: number
  skipped: number
  errors: number
  skipped_problems: { index: number; slug: string; reason: string }[]
  error_details: { index: number; slug: string; reason: string }[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFF_COLOR: Record<string, string> = {
  Easy:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard:   "bg-red-500/15 text-red-400 border-red-500/30",
}

const DIFF_POINTS: Record<string, number> = { Easy: 20, Medium: 30, Hard: 50 }

const LANGS = ["python", "javascript", "java", "cpp"] as const
type Lang = typeof LANGS[number]
const LANG_LABELS: Record<Lang, string> = {
  python: "Python", javascript: "JavaScript", java: "Java", cpp: "C++",
}

const EMPTY_FORM: FormData = {
  title: "", slug: "", description: "", difficulty: "Easy",
  tags: [], examples: [{ input: "", output: "", explanation: "" }],
  constraints: "", starter_code: { python: "", javascript: "", java: "", cpp: "" },
  test_cases: [{ input: "", expected: "" }], points: 20, is_active: true,
}

const TEMPLATE_JSON = [
  {
    slug: "sum-of-array",
    title: "Sum of Array",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description:
      "Given an array of integers, compute and print the sum.\n\n" +
      "Input format:\n  Line 1: n (number of elements)\n  Line 2: n space-separated integers\n\nOutput: A single integer — the sum.",
    examples: [
      { input: "n=3, nums=[1,2,3]", output: "6", explanation: "1+2+3=6" },
    ],
    constraints: "1 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9",
    starter_code: {
      python:
        "n = int(input())\nnums = list(map(int, input().split()))\n\n# Write your solution here\n# print(answer)\n",
      javascript:
        'const lines = require("fs").readFileSync(0,"utf8").trim().split("\\n");\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(" ").map(Number);\n\n// Write your solution here\n// console.log(answer);\n',
      java:
        "import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution here\n    }\n}\n",
      cpp:
        "#include<bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution here\n    return 0;\n}\n",
    },
    test_cases: [
      { input: "3\n1 2 3", expected: "6" },
      { input: "1\n42",    expected: "42" },
      { input: "5\n-1 0 1 2 3", expected: "5" },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function downloadTemplate() {
  const blob = new Blob([JSON.stringify(TEMPLATE_JSON, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "coding_problems_template.json"
  a.click()
  URL.revokeObjectURL(url)
}

// ── Import Modal ──────────────────────────────────────────────────────────────

function ImportModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<BulkResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const { data } = await api.post<BulkResult>("/super-admin/coding-problems/bulk", fd)
      setResult(data)
      if (data.imported > 0 || data.updated > 0) onSuccess()
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
          <h3 className="text-base font-semibold text-foreground">Import Coding Problems</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto">
          {!result ? (
            <>
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
                  accept=".json"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                {file ? (
                  <p className="text-sm font-medium text-primary">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-foreground font-medium">Click to select JSON file</p>
                    <p className="text-xs text-muted-foreground mt-1">Array of problem objects (.json)</p>
                  </>
                )}
              </div>

              <div className="rounded-lg bg-secondary/40 border border-border p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Required fields per problem:</p>
                <p className="font-mono text-[11px]">title, test_cases (array of &#123;input, expected&#125;)</p>
                <p className="font-medium text-foreground mt-2">Optional fields:</p>
                <p className="font-mono text-[11px]">slug, difficulty, tags, description, examples, constraints, starter_code, points</p>
                <p className="mt-2 text-amber-400/80">Existing problems (matched by slug) are updated, not duplicated.</p>
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
                    Import
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-emerald-400">{result.imported}</p>
                  <p className="text-[11px] text-muted-foreground">New</p>
                </div>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-3 text-center">
                  <RefreshCcw className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-400">{result.updated}</p>
                  <p className="text-[11px] text-muted-foreground">Updated</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-center">
                  <SkipForward className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-amber-400">{result.skipped}</p>
                  <p className="text-[11px] text-muted-foreground">Skipped</p>
                </div>
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-red-400">{result.errors}</p>
                  <p className="text-[11px] text-muted-foreground">Errors</p>
                </div>
              </div>

              {result.error_details.length > 0 && (
                <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 max-h-32 overflow-y-auto space-y-1">
                  <p className="text-xs font-medium text-red-400 mb-1">Errors:</p>
                  {result.error_details.map((e, i) => (
                    <p key={i} className="text-xs text-muted-foreground">#{e.index} {e.slug}: {e.reason}</p>
                  ))}
                </div>
              )}

              {result.skipped_problems.length > 0 && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 max-h-28 overflow-y-auto space-y-1">
                  <p className="text-xs font-medium text-amber-400 mb-1">Skipped:</p>
                  {result.skipped_problems.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">#{s.index} {s.slug}: {s.reason}</p>
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

// ── Problem Form Modal ────────────────────────────────────────────────────────

function ProblemFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: CodingProblem | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!initial
  const [form, setForm] = useState<FormData>(() => {
    if (!initial) return EMPTY_FORM
    return {
      title: initial.title,
      slug: initial.slug,
      description: initial.description,
      difficulty: initial.difficulty,
      tags: initial.tags || [],
      examples: initial.examples?.length
        ? initial.examples.map(e => ({ input: e.input, output: e.output, explanation: e.explanation || "" }))
        : [{ input: "", output: "", explanation: "" }],
      constraints: initial.constraints || "",
      starter_code: {
        python: initial.starter_code?.python || "",
        javascript: initial.starter_code?.javascript || "",
        java: initial.starter_code?.java || "",
        cpp: initial.starter_code?.cpp || "",
      },
      test_cases: initial.test_cases?.length
        ? initial.test_cases
        : [{ input: "", expected: "" }],
      points: initial.points,
      is_active: initial.is_active,
    }
  })
  const [tagsInput, setTagsInput] = useState(() =>
    initial?.tags?.join(", ") || ""
  )
  const [activeLang, setActiveLang] = useState<Lang>("python")
  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(isEdit)

  // Auto-generate slug from title (only when not manually set)
  const handleTitleChange = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: slugManual ? f.slug : slugify(title),
    }))
  }

  const setField = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  // Examples helpers
  const addExample = () =>
    setForm(f => ({ ...f, examples: [...f.examples, { input: "", output: "", explanation: "" }] }))
  const removeExample = (i: number) =>
    setForm(f => ({ ...f, examples: f.examples.filter((_, idx) => idx !== i) }))
  const setExample = (i: number, key: keyof Example, val: string) =>
    setForm(f => ({
      ...f,
      examples: f.examples.map((e, idx) => idx === i ? { ...e, [key]: val } : e),
    }))

  // Test case helpers
  const addTestCase = () =>
    setForm(f => ({ ...f, test_cases: [...f.test_cases, { input: "", expected: "" }] }))
  const removeTestCase = (i: number) =>
    setForm(f => ({ ...f, test_cases: f.test_cases.filter((_, idx) => idx !== i) }))
  const setTestCase = (i: number, key: keyof TestCase, val: string) =>
    setForm(f => ({
      ...f,
      test_cases: f.test_cases.map((tc, idx) => idx === i ? { ...tc, [key]: val } : tc),
    }))

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return }
    if (!form.slug.trim()) { toast.error("Slug is required"); return }
    if (form.test_cases.filter(tc => tc.input || tc.expected).length === 0) {
      toast.error("At least one test case is required")
      return
    }

    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    const payload = { ...form, tags }

    setSaving(true)
    try {
      if (isEdit) {
        await api.patch(`/super-admin/coding-problems/${initial!.id}`, payload)
        toast.success("Problem updated")
      } else {
        await api.post("/super-admin/coding-problems", payload)
        toast.success("Problem created")
      }
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const labelCls = "block text-xs font-medium text-muted-foreground mb-1"
  const inputCls = "bg-secondary/40 border-border text-sm"
  const sectionCls = "space-y-3"
  const sectionHeadCls = "text-sm font-semibold text-foreground border-b border-border pb-2"

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/70 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-4xl bg-popover border border-border rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[92vh] my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              {isEdit ? `Edit: ${initial!.title}` : "New Coding Problem"}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 space-y-7">

          {/* ── Section 1: Basic Info ── */}
          <div className={sectionCls}>
            <p className={sectionHeadCls}>Basic Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title *</label>
                <Input
                  className={inputCls}
                  placeholder="Two Sum"
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <Input
                  className={inputCls}
                  placeholder="two-sum"
                  value={form.slug}
                  onChange={e => {
                    setSlugManual(true)
                    setField("slug", e.target.value)
                  }}
                />
              </div>
              <div>
                <label className={labelCls}>Difficulty</label>
                <Select
                  value={form.difficulty}
                  onValueChange={v => {
                    const d = v as "Easy" | "Medium" | "Hard"
                    setForm(f => ({ ...f, difficulty: d, points: DIFF_POINTS[d] }))
                  }}
                >
                  <SelectTrigger className={inputCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={labelCls}>Points</label>
                <Input
                  className={inputCls}
                  type="number"
                  min={1}
                  value={form.points}
                  onChange={e => setField("points", parseInt(e.target.value) || 10)}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <Input
                className={inputCls}
                placeholder="Array, Hash Table, Two Pointers"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={v => setField("is_active", v)}
              />
              <span className="text-sm text-muted-foreground">
                {form.is_active ? "Active — visible to students" : "Inactive — hidden from students"}
              </span>
            </div>
          </div>

          {/* ── Section 2: Problem Statement ── */}
          <div className={sectionCls}>
            <p className={sectionHeadCls}>Problem Statement</p>
            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                className={cn(
                  "w-full rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted-foreground resize-y font-mono min-h-[140px] focus:outline-none focus:ring-1 focus:ring-primary/50"
                )}
                placeholder="Problem description with input/output format..."
                value={form.description}
                onChange={e => setField("description", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Constraints</label>
              <textarea
                className={cn(
                  "w-full rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted-foreground resize-y font-mono min-h-[72px] focus:outline-none focus:ring-1 focus:ring-primary/50"
                )}
                placeholder={"1 <= n <= 10^4\n-10^9 <= nums[i] <= 10^9"}
                value={form.constraints || ""}
                onChange={e => setField("constraints", e.target.value)}
              />
            </div>
          </div>

          {/* ── Section 3: Examples ── */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between">
              <p className={sectionHeadCls}>Examples</p>
              <Button variant="outline" size="sm" onClick={addExample} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />Add
              </Button>
            </div>
            {form.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Example {i + 1}</span>
                  {form.examples.length > 1 && (
                    <button onClick={() => removeExample(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Input</label>
                    <Input
                      className={cn(inputCls, "font-mono text-xs")}
                      placeholder="n=4, nums=[2,7,11,15], target=9"
                      value={ex.input}
                      onChange={e => setExample(i, "input", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Output</label>
                    <Input
                      className={cn(inputCls, "font-mono text-xs")}
                      placeholder="0 1"
                      value={ex.output}
                      onChange={e => setExample(i, "output", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Explanation (optional)</label>
                  <Input
                    className={cn(inputCls, "text-xs")}
                    placeholder="nums[0]+nums[1]=9"
                    value={ex.explanation}
                    onChange={e => setExample(i, "explanation", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Section 4: Starter Code ── */}
          <div className={sectionCls}>
            <p className={sectionHeadCls}>Starter Code</p>
            {/* Language tabs */}
            <div className="flex gap-1 border-b border-border pb-0">
              {LANGS.map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors border border-b-0",
                    activeLang === lang
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
            <textarea
              className={cn(
                "w-full rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground",
                "placeholder:text-muted-foreground resize-y font-mono min-h-[180px] focus:outline-none focus:ring-1 focus:ring-primary/50"
              )}
              placeholder={`Starter code for ${LANG_LABELS[activeLang]}...`}
              value={form.starter_code[activeLang]}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  starter_code: { ...f.starter_code, [activeLang]: e.target.value },
                }))
              }
            />
          </div>

          {/* ── Section 5: Test Cases ── */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between">
              <p className={sectionHeadCls}>Test Cases *</p>
              <Button variant="outline" size="sm" onClick={addTestCase} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Use raw stdin format for input, exact stdout for expected output.
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {form.test_cases.map((tc, i) => (
                <div key={i} className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Test Case {i + 1}</span>
                    {form.test_cases.length > 1 && (
                      <button onClick={() => removeTestCase(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Input (stdin)</label>
                      <textarea
                        className={cn(
                          "w-full rounded-md border border-border bg-secondary/40 px-2 py-1.5 text-xs text-foreground",
                          "placeholder:text-muted-foreground resize-y font-mono min-h-[60px] focus:outline-none focus:ring-1 focus:ring-primary/50"
                        )}
                        placeholder={"4\n2 7 11 15\n9"}
                        value={tc.input}
                        onChange={e => setTestCase(i, "input", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Expected (stdout)</label>
                      <textarea
                        className={cn(
                          "w-full rounded-md border border-border bg-secondary/40 px-2 py-1.5 text-xs text-foreground",
                          "placeholder:text-muted-foreground resize-y font-mono min-h-[60px] focus:outline-none focus:ring-1 focus:ring-primary/50"
                        )}
                        placeholder="0 1"
                        value={tc.expected}
                        onChange={e => setTestCase(i, "expected", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
            {isEdit ? "Save Changes" : "Create Problem"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Problem Row ───────────────────────────────────────────────────────────────

function ProblemRow({
  problem,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  problem: CodingProblem
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors"
    >
      {/* Difficulty dot */}
      <div className={cn(
        "w-2 h-2 rounded-full shrink-0",
        problem.difficulty === "Easy" ? "bg-emerald-400" :
        problem.difficulty === "Medium" ? "bg-amber-400" : "bg-red-400"
      )} />

      {/* Title + slug */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{problem.title}</p>
        <p className="text-xs text-muted-foreground font-mono truncate">{problem.slug}</p>
      </div>

      {/* Difficulty */}
      <Badge variant="outline" className={cn("text-[11px] shrink-0", DIFF_COLOR[problem.difficulty])}>
        {problem.difficulty}
      </Badge>

      {/* Tags */}
      <div className="hidden md:flex gap-1 shrink-0 max-w-[160px] overflow-hidden">
        {(problem.tags || []).slice(0, 2).map(tag => (
          <Badge key={tag} variant="outline" className="text-[10px] border-border text-muted-foreground px-1.5">
            {tag}
          </Badge>
        ))}
        {(problem.tags || []).length > 2 && (
          <span className="text-[10px] text-muted-foreground">+{problem.tags.length - 2}</span>
        )}
      </div>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
        <span>{problem.test_cases?.length || 0} TC</span>
        <span>{problem.points} pts</span>
      </div>

      {/* Active toggle */}
      <Switch
        checked={problem.is_active}
        onCheckedChange={onToggleActive}
        className="shrink-0"
      />

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CodingProblemsAdminPage() {
  const [problems, setProblems] = useState<CodingProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [diffFilter, setDiffFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")

  const [showImport, setShowImport] = useState(false)
  const [editTarget, setEditTarget] = useState<CodingProblem | null | "new">(null)
  const [deleteTarget, setDeleteTarget] = useState<CodingProblem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const loadProblems = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get<CodingProblem[]>("/super-admin/coding-problems")
      setProblems(data)
    } catch {
      toast.error("Failed to load coding problems")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProblems() }, [loadProblems])

  const handleToggleActive = async (problem: CodingProblem) => {
    setTogglingId(problem.id)
    try {
      await api.patch(`/super-admin/coding-problems/${problem.id}`, { is_active: !problem.is_active })
      setProblems(prev =>
        prev.map(p => p.id === problem.id ? { ...p, is_active: !p.is_active } : p)
      )
    } catch {
      toast.error("Failed to update status")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/coding-problems/${deleteTarget.id}`)
      toast.success("Problem deleted")
      setProblems(prev => prev.filter(p => p.id !== deleteTarget.id))
    } catch {
      toast.error("Failed to delete problem")
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // Filtered list
  const filtered = problems.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchDiff = diffFilter === "all" || p.difficulty === diffFilter
    const matchActive =
      activeFilter === "all" ||
      (activeFilter === "active" && p.is_active) ||
      (activeFilter === "inactive" && !p.is_active)
    return matchSearch && matchDiff && matchActive
  })

  const counts = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === "Easy").length,
    medium: problems.filter(p => p.difficulty === "Medium").length,
    hard: problems.filter(p => p.difficulty === "Hard").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Coding Problems</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {counts.total} problems &mdash;{" "}
            <span className="text-emerald-400">{counts.easy} Easy</span>,{" "}
            <span className="text-amber-400">{counts.medium} Medium</span>,{" "}
            <span className="text-red-400">{counts.hard} Hard</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={loadProblems}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-1.5" />
            Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-1.5" />
            Import JSON
          </Button>
          <Button size="sm" onClick={() => setEditTarget("new")}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Problem
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title, slug, or tag..."
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
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Column headers */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center gap-3 px-4 text-xs text-muted-foreground">
          <div className="w-2 shrink-0" />
          <div className="flex-1">Problem</div>
          <div className="w-16 shrink-0">Difficulty</div>
          <div className="hidden md:block w-[160px] shrink-0">Tags</div>
          <div className="hidden lg:flex gap-3 w-24 shrink-0">
            <span>TC</span><span>Pts</span>
          </div>
          <div className="w-10 shrink-0 text-center">Active</div>
          <div className="w-16 shrink-0" />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No problems found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {problems.length === 0
              ? 'Click "Add Problem" or "Import JSON" to get started.'
              : "Try adjusting your filters."}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map(p => (
              <ProblemRow
                key={p.id}
                problem={p}
                onEdit={() => setEditTarget(p)}
                onDelete={() => setDeleteTarget(p)}
                onToggleActive={() => handleToggleActive(p)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showImport && (
          <ImportModal
            onClose={() => setShowImport(false)}
            onSuccess={loadProblems}
          />
        )}
        {editTarget !== null && (
          <ProblemFormModal
            initial={editTarget === "new" ? null : editTarget}
            onClose={() => setEditTarget(null)}
            onSaved={loadProblems}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Problem?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.title}</strong> and all student
              submissions for it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
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
