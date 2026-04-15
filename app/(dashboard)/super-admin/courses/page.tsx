"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  BookOpen, Loader2, GripVertical, Layers, FileText,
  Clock, Star, Code2, Database, Globe, Brain, Zap,
  AlertTriangle, X, Check, Upload, Search, Download,
  CheckCircle2, AlertCircle, SkipForward,
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface LessonRow {
  id: number
  course_id: string
  level_id: number | null
  title: string
  duration_mins: number
  order: number
  points: number
  is_active: boolean
  mcq_count: number
}

interface MCQQuestionRow {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e?: string | null
  correct_option: string
  correct_answer: string
  explanation?: string | null
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
}

interface UploadResult {
  imported: number
  skipped: number
  errors: number
  skipped_questions: { row: number; question: string; reason: string }[]
  error_details: { row: number; question?: string; reason: string }[]
}

interface LevelRow {
  id: number
  course_id: string
  name: string
  description: string
  order: number
  lesson_count: number
  lessons: LessonRow[]
}

interface CourseRow {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  icon: string
  icon_color: string
  prerequisite_id: string | null
  points_per_lesson: number
  is_active: boolean
  order: number
  level_count: number
  lesson_count: number
  levels: LevelRow[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"]
const CATEGORY_OPTIONS   = ["programming", "aptitude", "domain"]

const ICON_OPTIONS = [
  { value: "Code",     label: "Code" },
  { value: "Database", label: "Database" },
  { value: "Globe",    label: "Globe" },
  { value: "BookOpen", label: "BookOpen" },
  { value: "Brain",    label: "Brain" },
  { value: "Zap",      label: "Zap" },
  { value: "Layers",   label: "Layers" },
  { value: "FileText", label: "FileText" },
  { value: "Braces",   label: "Braces" },
  { value: "Server",   label: "Server" },
  { value: "Terminal", label: "Terminal" },
]

const COLOR_OPTIONS = [
  { value: "text-blue-400",   label: "Blue"   },
  { value: "text-cyan-400",   label: "Cyan"   },
  { value: "text-green-400",  label: "Green"  },
  { value: "text-yellow-400", label: "Yellow" },
  { value: "text-orange-400", label: "Orange" },
  { value: "text-pink-400",   label: "Pink"   },
  { value: "text-purple-400", label: "Purple" },
  { value: "text-red-400",    label: "Red"    },
  { value: "text-teal-400",   label: "Teal"   },
]

const difficultyColor: Record<string, string> = {
  Beginner:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Advanced:     "bg-red-500/15 text-red-400 border-red-500/30",
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-foreground">{label}</Label>
      {children}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode
}) {
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
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-5 overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  )
}

// ── Course Form ───────────────────────────────────────────────────────────────

interface CourseFormState {
  id: string; title: string; description: string; category: string
  difficulty: string; icon: string; icon_color: string
  points_per_lesson: string; order: string; prerequisite_id: string
}

const emptyCourse: CourseFormState = {
  id: "", title: "", description: "", category: "programming",
  difficulty: "Beginner", icon: "BookOpen", icon_color: "text-blue-400",
  points_per_lesson: "10", order: "0", prerequisite_id: "",
}

function CourseModal({ initial, isEdit, courses, onSave, onClose }: {
  initial?: CourseFormState
  isEdit: boolean
  courses: CourseRow[]
  onSave: (data: CourseFormState) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<CourseFormState>(initial ?? emptyCourse)
  const [saving, setSaving] = useState(false)

  const set = (k: keyof CourseFormState) => (v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <Modal title={isEdit ? "Edit Course" : "New Course"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <Field label="Course ID *">
            <Input
              placeholder="e.g. python, data-science"
              className="bg-secondary/50 text-xs font-mono"
              value={form.id}
              onChange={e => set("id")(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              required
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Used as content file key: <code className="text-primary">content/courses/{form.id || "..."}.ts</code>
            </p>
          </Field>
        )}
        <Field label="Title *">
          <Input placeholder="Python" className="bg-secondary/50" value={form.title}
            onChange={e => set("title")(e.target.value)} required />
        </Field>
        <Field label="Description">
          <Input placeholder="Short description..." className="bg-secondary/50" value={form.description}
            onChange={e => set("description")(e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={form.category} onValueChange={set("category")}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Difficulty">
            <Select value={form.difficulty} onValueChange={set("difficulty")}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DIFFICULTY_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Icon">
            <Select value={form.icon} onValueChange={set("icon")}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Icon Color">
            <Select value={form.icon_color} onValueChange={set("icon_color")}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className={cn("font-medium", c.value)}>{c.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Points / Lesson">
            <Input type="number" min={1} className="bg-secondary/50" value={form.points_per_lesson}
              onChange={e => set("points_per_lesson")(e.target.value)} />
          </Field>
          <Field label="Display Order">
            <Input type="number" min={0} className="bg-secondary/50" value={form.order}
              onChange={e => set("order")(e.target.value)} />
          </Field>
        </div>
        {courses.length > 0 && (
          <Field label="Prerequisite Course">
            <Select value={form.prerequisite_id || "__none__"} onValueChange={v => set("prerequisite_id")(v === "__none__" ? "" : v)}>
              <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {courses.filter(c => c.id !== (initial?.id ?? "")).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1 border-border" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Level Form ────────────────────────────────────────────────────────────────

function LevelModal({ initial, onSave, onClose }: {
  initial?: { name: string; description: string; order: string }
  onSave: (data: { name: string; description: string; order: string }) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState(initial ?? { name: "", description: "", order: "1" })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <Modal title={initial ? "Edit Level" : "Add Level"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Level Name *">
          <Input placeholder="Basics / Intermediate / Advanced"
            className="bg-secondary/50" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        </Field>
        <Field label="Description">
          <Input placeholder="Optional description"
            className="bg-secondary/50" value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </Field>
        <Field label="Order">
          <Input type="number" min={1} className="bg-secondary/50" value={form.order}
            onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
        </Field>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1 border-border" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {initial ? "Save" : "Add Level"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Lesson Form ───────────────────────────────────────────────────────────────

function LessonModal({ initial, courseId, onSave, onClose }: {
  initial?: { title: string; duration_mins: string; points: string; order: string }
  courseId: string
  onSave: (data: { title: string; duration_mins: string; points: string; order: string }) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState(initial ?? { title: "", duration_mins: "10", points: "10", order: "1" })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <Modal title={initial ? "Edit Lesson" : "Add Lesson"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Lesson Title *">
          <Input placeholder="Introduction to Python" className="bg-secondary/50" value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
        </Field>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          <Field label="Duration (min)">
            <Input type="number" min={1} className="bg-secondary/50" value={form.duration_mins}
              onChange={e => setForm(p => ({ ...p, duration_mins: e.target.value }))} />
          </Field>
          <Field label="Points">
            <Input type="number" min={1} className="bg-secondary/50" value={form.points}
              onChange={e => setForm(p => ({ ...p, points: e.target.value }))} />
          </Field>
          <Field label="Order">
            <Input type="number" min={1} className="bg-secondary/50" value={form.order}
              onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
          </Field>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Content file: <code className="text-primary">content/courses/{courseId}.ts</code> — keyed by lesson order
        </p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1 border-border" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {initial ? "Save" : "Add Lesson"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── MCQ Upload Modal ──────────────────────────────────────────────────────────

const CSV_HEADERS = [
  "question", "option_a", "option_b", "option_c", "option_d", "option_e",
  "correct_option", "correct_answer", "explanation", "difficulty", "points",
  "image_url", "tag",
]

// Two filled sample rows so the user sees exactly what every column expects
const CSV_SAMPLE_ROWS = [
  [
    "What is a variable in Python?",
    "A named memory location",
    "A loop construct",
    "A function definition",
    "A class object",
    "",                                    // option_e — leave blank if unused
    "A",
    "A named memory location",
    "Variables store data values that can be referenced and manipulated in a program.",
    "Easy",
    "2",
    "",                                    // image_url — URL or blank
    "",                                    // tag — e.g. TCS, Infosys, or blank
  ],
  [
    "Which keyword defines a function in Python?",
    "func",
    "def",
    "define",
    "function",
    "",
    "B",
    "def",
    "The def keyword is used to define a function in Python.",
    "Easy",
    "2",
    "",
    "TCS",
  ],
]

function downloadSampleCSV() {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = [
    CSV_HEADERS.join(","),
    ...CSV_SAMPLE_ROWS.map(row => row.map(escape).join(",")),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "mcq_sample.csv"
  a.click()
  URL.revokeObjectURL(url)
}

function MCQUploadModal({ lesson, onClose, onSuccess }: {
  lesson: LessonRow
  onClose: () => void
  onSuccess: (result: UploadResult) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith(".csv")) setFile(f)
    else toast.error("Only CSV files are supported")
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await api.post(`/super-admin/lessons/${lesson.id}/mcq/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResult(res.data)
      onSuccess(res.data)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Upload failed")
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
        className="w-full max-w-xl bg-popover border border-border rounded-2xl shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">Upload MCQ</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-sm">{lesson.title}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto">
          {/* Sample CSV download */}
          <button
            onClick={downloadSampleCSV}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Download Sample CSV</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  13 columns · 2 filled rows · open in Excel or Sheets
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
          </button>

          {/* Upload result */}
          {result ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{result.imported}</p>
                  <p className="text-xs text-emerald-400/70 mt-0.5">Imported</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-400">{result.skipped}</p>
                  <p className="text-xs text-amber-400/70 mt-0.5">Skipped</p>
                </div>
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{result.errors}</p>
                  <p className="text-xs text-red-400/70 mt-0.5">Errors</p>
                </div>
              </div>

              {result.skipped_questions.length > 0 && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5 max-h-32 overflow-y-auto">
                  <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                    <SkipForward className="h-3.5 w-3.5" />Skipped (duplicates)
                  </p>
                  {result.skipped_questions.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      Row {s.row}: <span className="text-foreground/80">{s.question}</span>
                    </p>
                  ))}
                </div>
              )}

              {result.error_details.length > 0 && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 space-y-1.5 max-h-32 overflow-y-auto">
                  <p className="text-xs font-medium text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />Errors
                  </p>
                  {result.error_details.map((e, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      Row {e.row}: <span className="text-red-400">{e.reason}</span>
                      {e.question && <> — <span className="text-foreground/80">{e.question}</span></>}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1 border-border text-sm" onClick={() => { setResult(null); setFile(null) }}>
                  Upload More
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground text-sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                  dragging
                    ? "border-primary bg-primary/10"
                    : file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border hover:border-border/70 hover:bg-white/[0.02]"
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) setFile(f)
                  }}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null) }}
                      className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-foreground">Drop your CSV here or click to browse</p>
                    <p className="text-xs text-muted-foreground">Only .csv files are supported</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-border" onClick={onClose}>Cancel</Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  disabled={!file || uploading}
                  onClick={handleUpload}
                >
                  {uploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Assignment Upload Modal ────────────────────────────────────────────────────

const ASSIGNMENT_SAMPLE_CSV = [
  "question,option_a,option_b,option_c,option_d,correct_option,topic,subtopic,explanation,difficulty,points,tag",
  "What is the output of print(2**3)?,6,8,9,4,B,Python,Operators,2**3 is 2 to the power 3 which equals 8,Easy,5,",
  "Which keyword is used to define a function in Python?,func,def,function,lambda,B,Python,Functions,The 'def' keyword is used to define a function.,Easy,5,",
].join("\n")

function AssignmentUploadModal({ level, onClose, onSuccess }: {
  level: LevelRow
  onClose: () => void
  onSuccess: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      toast.error("Only CSV files are supported")
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await api.post(`/super-admin/levels/${level.id}/assignments/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResult(res.data)
      if (res.data.imported > 0) onSuccess()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const downloadSample = () => {
    const blob = new Blob([ASSIGNMENT_SAMPLE_CSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "assignment_questions_sample.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-popover border border-border rounded-2xl w-full max-w-lg shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">Upload Assignments</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-sm">{level.name}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <Button size="sm" variant="outline" className="border-border text-xs gap-1.5 w-full" onClick={downloadSample}>
            <Download className="h-3.5 w-3.5" />
            Download Sample CSV
          </Button>

          {!result ? (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onClick={() => document.getElementById("assignment-csv-input")?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-white/[0.02]"
                )}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                {file ? (
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-foreground font-medium">Drop CSV here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Required: question, option_a–d, correct_option, topic, subtopic</p>
                  </>
                )}
                <input
                  id="assignment-csv-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="border-border" onClick={onClose}>Cancel</Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                  disabled={!file || uploading}
                  onClick={handleUpload}
                >
                  {uploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-emerald-400">{result.imported}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Imported</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-amber-400">{result.skipped}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Skipped</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-red-400">{result.errors}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Errors</p>
                </div>
              </div>

              {result.error_details.length > 0 && (
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  <p className="text-xs font-semibold text-red-400">Errors:</p>
                  {result.error_details.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Row {e.row}: {e.reason}{e.question ? ` — "${e.question}"` : ""}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.skipped_questions.length > 0 && (
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  <p className="text-xs font-semibold text-amber-400">Skipped (duplicates):</p>
                  {result.skipped_questions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <SkipForward className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Row {s.row}: {s.question}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" className="border-border" onClick={() => { setFile(null); setResult(null) }}>
                  Upload More
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onClose}>
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── MCQ Manage Panel ──────────────────────────────────────────────────────────

const diffMCQ: Record<string, string> = {
  Easy:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard:   "bg-red-500/15 text-red-400 border-red-500/30",
}

function MCQManagePanel({ lesson, onClose, onUploadClick, onChanged }: {
  lesson: LessonRow
  onClose: () => void
  onUploadClick: () => void
  onChanged: () => void
}) {
  const [questions, setQuestions]   = useState<MCQQuestionRow[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [deleteTarget, setDeleteTarget] = useState<MCQQuestionRow | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/super-admin/lessons/${lesson.id}/mcq`)
      setQuestions(res.data)
    } catch {
      toast.error("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }, [lesson.id])

  useEffect(() => { load() }, [load])

  const filtered = questions.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/mcq/${deleteTarget.id}`)
      setQuestions(prev => prev.filter(q => q.id !== deleteTarget.id))
      setDeleteTarget(null)
      onChanged()
      toast.success("Question deleted")
    } catch {
      toast.error("Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  const handleClearAll = async () => {
    setDeleting(true)
    try {
      await api.delete(`/super-admin/lessons/${lesson.id}/mcq`)
      setQuestions([])
      setClearConfirm(false)
      onChanged()
      toast.success("All questions cleared")
    } catch {
      toast.error("Clear failed")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-3xl bg-popover border border-border rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[88vh] my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">MCQ Questions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{lesson.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors ml-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 border-b border-border flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-border h-9 text-xs gap-1.5 flex-1 sm:flex-none"
              onClick={onUploadClick}
            >
              <Upload className="h-3.5 w-3.5" />Upload More
            </Button>
            {questions.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-9 text-xs gap-1.5 flex-1 sm:flex-none"
                onClick={() => setClearConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Question list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-2 p-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Brain className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {search ? "No questions match your search" : "No questions uploaded yet"}
              </p>
              {!search && (
                <Button
                  size="sm"
                  className="mt-4 bg-primary text-primary-foreground text-xs"
                  onClick={onUploadClick}
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />Upload CSV
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((q, idx) => (
                <div key={q.id}>
                  <div
                    className="flex items-start gap-3 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                  >
                    {/* Index */}
                    <span className="text-xs text-muted-foreground w-6 text-right flex-shrink-0 mt-0.5 font-mono">
                      {idx + 1}
                    </span>

                    {/* Question text */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm text-foreground leading-snug",
                        expandedId !== q.id && "line-clamp-2"
                      )}>
                        {q.question}
                      </p>
                      {expandedId === q.id && (
                        <div className="mt-3 space-y-1.5">
                          {(["a","b","c","d","e"] as const).map(letter => {
                            const opt = q[`option_${letter}` as keyof MCQQuestionRow] as string
                            if (!opt) return null
                            const isCorrect = q.correct_option === letter.toUpperCase()
                            return (
                              <div key={letter} className={cn(
                                "flex items-start gap-2 text-xs px-2.5 py-1.5 rounded-lg",
                                isCorrect
                                  ? "bg-emerald-500/10 border border-emerald-500/20"
                                  : "bg-white/[0.03] border border-border/50"
                              )}>
                                <span className={cn(
                                  "font-bold flex-shrink-0 w-4",
                                  isCorrect ? "text-emerald-400" : "text-muted-foreground"
                                )}>{letter.toUpperCase()}.</span>
                                <span className={isCorrect ? "text-emerald-300" : "text-muted-foreground"}>{opt}</span>
                                {isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-auto flex-shrink-0 mt-0.5" />}
                              </div>
                            )
                          })}
                          {q.explanation && (
                            <div className="mt-2 px-2.5 py-2 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-xs text-muted-foreground"><span className="text-primary font-medium">Explanation: </span>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", diffMCQ[q.difficulty])}>
                        {q.difficulty}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        {q.points}pt{q.points !== 1 ? "s" : ""}
                      </span>
                      <ChevronDown className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform flex-shrink-0",
                        expandedId === q.id && "rotate-180"
                      )} />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={e => { e.stopPropagation(); setDeleteTarget(q) }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-border flex-shrink-0 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {search ? `${filtered.length} of ${questions.length}` : questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">Click a row to expand options</p>
          </div>
        )}
      </motion.div>

      {/* Delete single question confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />Delete Question
            </AlertDialogTitle>
            <AlertDialogDescription className="line-clamp-3">
              {deleteTarget?.question}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all confirm */}
      <AlertDialog open={clearConfirm} onOpenChange={o => !o && setClearConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />Clear All Questions
            </AlertDialogTitle>
            <AlertDialogDescription>
              Delete all <strong>{questions.length} questions</strong> for <strong>{lesson.title}</strong>?
              Student attempt history will also be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const [courses, setCourses]             = useState<CourseRow[]>([])
  const [loading, setLoading]             = useState(true)
  const [selectedId, setSelectedId]       = useState<string | null>(null)
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set())

  // Modals
  const [courseModal, setCourseModal]     = useState<"create" | CourseRow | null>(null)
  const [levelModal, setLevelModal]       = useState<{ courseId: string; level?: LevelRow } | null>(null)
  const [lessonModal, setLessonModal]     = useState<{ courseId: string; levelId: number; lesson?: LessonRow } | null>(null)

  // Delete confirmations
  const [deleteCourse, setDeleteCourse]   = useState<CourseRow | null>(null)
  const [deleteLevel, setDeleteLevel]     = useState<{ courseId: string; level: LevelRow } | null>(null)
  const [deleteLesson, setDeleteLesson]   = useState<{ courseId: string; lesson: LessonRow } | null>(null)

  const [deleting, setDeleting]           = useState(false)

  // MCQ modals
  const [mcqManage, setMcqManage]         = useState<LessonRow | null>(null)
  const [mcqUpload, setMcqUpload]         = useState<LessonRow | null>(null)

  // Assignment upload modal
  const [assignmentUpload, setAssignmentUpload] = useState<LevelRow | null>(null)

  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get("/super-admin/courses?manage=true")
      setCourses(res.data)
    } catch {
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const selected = courses.find(c => c.id === selectedId) ?? null

  const toggleLevel = (id: number) => setExpandedLevels(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCreateCourse = async (form: CourseFormState) => {
    await api.post("/super-admin/courses", {
      id: form.id,
      title: form.title,
      description: form.description,
      category: form.category,
      difficulty: form.difficulty,
      icon: form.icon,
      icon_color: form.icon_color,
      points_per_lesson: parseInt(form.points_per_lesson),
      order: parseInt(form.order),
      prerequisite_id: form.prerequisite_id || null,
    })
    toast.success("Course created")
    setCourseModal(null)
    await fetchCourses()
  }

  const handleEditCourse = async (form: CourseFormState) => {
    await api.patch(`/super-admin/courses/${(courseModal as CourseRow).id}`, {
      title: form.title,
      description: form.description,
      category: form.category,
      difficulty: form.difficulty,
      icon: form.icon,
      icon_color: form.icon_color,
      points_per_lesson: parseInt(form.points_per_lesson),
      order: parseInt(form.order),
      prerequisite_id: form.prerequisite_id || null,
    })
    toast.success("Course updated")
    setCourseModal(null)
    await fetchCourses()
  }

  const handleDeleteCourse = async () => {
    if (!deleteCourse) return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/courses/${deleteCourse.id}`)
      toast.success(`Course "${deleteCourse.title}" deleted`)
      if (selectedId === deleteCourse.id) setSelectedId(null)
      setDeleteCourse(null)
      await fetchCourses()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  const handleCreateLevel = async (form: { name: string; description: string; order: string }) => {
    if (!levelModal) return
    await api.post(`/super-admin/courses/${levelModal.courseId}/levels`, {
      name: form.name, description: form.description, order: parseInt(form.order),
    })
    toast.success("Level added")
    setLevelModal(null)
    await fetchCourses()
  }

  const handleEditLevel = async (form: { name: string; description: string; order: string }) => {
    if (!levelModal?.level) return
    await api.patch(`/super-admin/courses/${levelModal.courseId}/levels/${levelModal.level.id}`, {
      name: form.name, description: form.description, order: parseInt(form.order),
    })
    toast.success("Level updated")
    setLevelModal(null)
    await fetchCourses()
  }

  const handleDeleteLevel = async () => {
    if (!deleteLevel) return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/courses/${deleteLevel.courseId}/levels/${deleteLevel.level.id}`)
      toast.success(`Level "${deleteLevel.level.name}" deleted`)
      setDeleteLevel(null)
      await fetchCourses()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  const handleCreateLesson = async (form: { title: string; duration_mins: string; points: string; order: string }) => {
    if (!lessonModal) return
    await api.post(`/super-admin/courses/${lessonModal.courseId}/levels/${lessonModal.levelId}/lessons`, {
      title: form.title,
      duration_mins: parseInt(form.duration_mins),
      points: parseInt(form.points),
      order: parseInt(form.order),
    })
    toast.success("Lesson added")
    setLessonModal(null)
    await fetchCourses()
  }

  const handleEditLesson = async (form: { title: string; duration_mins: string; points: string; order: string }) => {
    if (!lessonModal?.lesson) return
    await api.patch(`/super-admin/courses/${lessonModal.courseId}/lessons/${lessonModal.lesson.id}`, {
      title: form.title,
      duration_mins: parseInt(form.duration_mins),
      points: parseInt(form.points),
      order: parseInt(form.order),
    })
    toast.success("Lesson updated")
    setLessonModal(null)
    await fetchCourses()
  }

  const handleDeleteLesson = async () => {
    if (!deleteLesson) return
    setDeleting(true)
    try {
      await api.delete(`/super-admin/courses/${deleteLesson.courseId}/lessons/${deleteLesson.lesson.id}`)
      toast.success("Lesson deleted")
      setDeleteLesson(null)
      await fetchCourses()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage course structure — levels and lessons. Content files live in <code className="text-primary text-xs">frontend/content/courses/</code>
          </p>
        </div>
        <Button onClick={() => setCourseModal("create")} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />New Course
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : courses.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No courses yet. Create your first course.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── Course list ─────────────────────────────────────── */}
          <div className="space-y-2">
            {courses.map(course => (
              <motion.div key={course.id} layout>
                <GlassCard
                  className={cn(
                    "p-4 cursor-pointer transition-all border",
                    selectedId === course.id
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-white/[0.03]"
                  )}
                  onClick={() => {
                    setSelectedId(selectedId === course.id ? null : course.id)
                    setExpandedLevels(new Set())
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0", course.icon_color)}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">{course.title}</p>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", difficultyColor[course.difficulty])}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{course.id}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Layers className="h-3 w-3" />{course.level_count} levels
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />{course.lesson_count} lessons
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform", selectedId === course.id && "rotate-90")} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* ── Course detail ────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {/* Course header */}
                  <GlassCard className="p-5 border border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", selected.icon_color)}>
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold font-serif text-foreground">{selected.title}</h2>
                          <p className="text-xs text-muted-foreground font-mono">{selected.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border h-8"
                          onClick={() => setCourseModal(selected)}>
                          <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                        </Button>
                        <Button size="sm" variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8"
                          onClick={() => setDeleteCourse(selected)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {selected.description && (
                      <p className="text-sm text-muted-foreground mt-3">{selected.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className={cn("text-xs", difficultyColor[selected.difficulty])}>
                        {selected.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        {selected.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        <Star className="h-3 w-3 mr-1" />{selected.points_per_lesson} pts/lesson
                      </Badge>
                      {selected.prerequisite_id && (
                        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                          Requires: {selected.prerequisite_id}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <p className="text-[11px] text-muted-foreground">
                        Content file: <code className="text-primary">frontend/content/courses/{selected.id}.ts</code>
                      </p>
                    </div>
                  </GlassCard>

                  {/* Levels & Lessons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">Levels & Lessons</h3>
                      <Button size="sm" variant="outline" className="border-border h-7 text-xs"
                        onClick={() => setLevelModal({ courseId: selected.id })}>
                        <Plus className="h-3 w-3 mr-1" />Add Level
                      </Button>
                    </div>

                    {selected.levels.length === 0 ? (
                      <GlassCard className="p-6 text-center border border-dashed border-border">
                        <Layers className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No levels yet.</p>
                        <Button size="sm" className="mt-3 bg-primary text-primary-foreground text-xs"
                          onClick={() => setLevelModal({ courseId: selected.id })}>
                          <Plus className="h-3 w-3 mr-1" />Add First Level
                        </Button>
                      </GlassCard>
                    ) : (
                      selected.levels.map(level => (
                        <GlassCard key={level.id} className="border border-border overflow-hidden">
                          {/* Level header */}
                          <div
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                            onClick={() => toggleLevel(level.id)}
                          >
                            <ChevronDown className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                              !expandedLevels.has(level.id) && "-rotate-90"
                            )} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{level.name}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  {level.lesson_count} lesson{level.lesson_count !== 1 ? "s" : ""}
                                </span>
                              </div>
                              {level.description && (
                                <p className="text-xs text-muted-foreground truncate">{level.description}</p>
                              )}
                            </div>
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <Button size="sm" variant="ghost"
                                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-amber-400 gap-1"
                                title="Upload Assignments"
                                onClick={() => setAssignmentUpload(level)}>
                                <Upload className="h-3 w-3" />
                                <span className="hidden sm:inline">Assignments</span>
                              </Button>
                              <Button size="sm" variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => setLevelModal({ courseId: selected.id, level })}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                                onClick={() => setDeleteLevel({ courseId: selected.id, level })}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Lessons list */}
                          <AnimatePresence>
                            {expandedLevels.has(level.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden border-t border-border"
                              >
                                {level.lessons.length === 0 ? (
                                  <div className="px-4 py-3 text-xs text-muted-foreground">
                                    No lessons yet.
                                  </div>
                                ) : (
                                  level.lessons.map((lesson, idx) => (
                                    <div
                                      key={lesson.id}
                                      className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 group",
                                        idx !== level.lessons.length - 1 && "border-b border-border/50"
                                      )}
                                    >
                                      <span className="text-[11px] text-muted-foreground w-5 text-right flex-shrink-0">
                                        {lesson.order}
                                      </span>
                                      <span className="flex-1 text-sm text-foreground truncate">{lesson.title}</span>
                                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-shrink-0">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />{lesson.duration_mins}m
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Star className="h-3 w-3" />{lesson.points}
                                        </span>
                                      </div>
                                      {/* MCQ count badge — always visible when > 0 */}
                                      {lesson.mcq_count > 0 && (
                                        <button
                                          onClick={() => setMcqManage(lesson)}
                                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-[10px] text-violet-400 hover:bg-violet-500/25 transition-colors flex-shrink-0"
                                        >
                                          <Brain className="h-3 w-3" />
                                          {lesson.mcq_count} MCQ
                                        </button>
                                      )}
                                      {/* Action buttons — appear on hover */}
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <Button size="sm" variant="ghost"
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-violet-400"
                                          title="Upload MCQ"
                                          onClick={() => setMcqUpload(lesson)}>
                                          <Upload className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost"
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                          onClick={() => setLessonModal({
                                            courseId: selected.id,
                                            levelId: level.id,
                                            lesson,
                                          })}>
                                          <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost"
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-400"
                                          onClick={() => setDeleteLesson({ courseId: selected.id, lesson })}>
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))
                                )}
                                <div className="px-4 py-2.5 border-t border-border/50">
                                  <Button size="sm" variant="ghost"
                                    className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                                    onClick={() => setLessonModal({ courseId: selected.id, levelId: level.id })}>
                                    <Plus className="h-3 w-3 mr-1" />Add Lesson
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </GlassCard>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-64 flex items-center justify-center"
                >
                  <div className="text-center">
                    <ChevronRight className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Select a course to manage its structure</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {/* ── MCQ Panels ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mcqManage && (
          <MCQManagePanel
            lesson={mcqManage}
            onClose={() => setMcqManage(null)}
            onUploadClick={() => { setMcqUpload(mcqManage); setMcqManage(null) }}
            onChanged={fetchCourses}
          />
        )}
        {mcqUpload && (
          <MCQUploadModal
            lesson={mcqUpload}
            onClose={() => setMcqUpload(null)}
            onSuccess={() => fetchCourses()}
          />
        )}
        {assignmentUpload && (
          <AssignmentUploadModal
            level={assignmentUpload}
            onClose={() => setAssignmentUpload(null)}
            onSuccess={() => fetchCourses()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {courseModal === "create" && (
          <CourseModal
            isEdit={false}
            courses={courses}
            onSave={handleCreateCourse}
            onClose={() => setCourseModal(null)}
          />
        )}
        {courseModal && courseModal !== "create" && (
          <CourseModal
            isEdit
            initial={{
              id: courseModal.id,
              title: courseModal.title,
              description: courseModal.description || "",
              category: courseModal.category,
              difficulty: courseModal.difficulty,
              icon: courseModal.icon,
              icon_color: courseModal.icon_color,
              points_per_lesson: String(courseModal.points_per_lesson),
              order: String(courseModal.order),
              prerequisite_id: courseModal.prerequisite_id || "",
            }}
            courses={courses}
            onSave={handleEditCourse}
            onClose={() => setCourseModal(null)}
          />
        )}
        {levelModal && !levelModal.level && (
          <LevelModal
            onSave={handleCreateLevel}
            onClose={() => setLevelModal(null)}
          />
        )}
        {levelModal?.level && (
          <LevelModal
            initial={{
              name: levelModal.level.name,
              description: levelModal.level.description || "",
              order: String(levelModal.level.order),
            }}
            onSave={handleEditLevel}
            onClose={() => setLevelModal(null)}
          />
        )}
        {lessonModal && !lessonModal.lesson && (
          <LessonModal
            courseId={lessonModal.courseId}
            onSave={handleCreateLesson}
            onClose={() => setLessonModal(null)}
          />
        )}
        {lessonModal?.lesson && (
          <LessonModal
            courseId={lessonModal.courseId}
            initial={{
              title: lessonModal.lesson.title,
              duration_mins: String(lessonModal.lesson.duration_mins),
              points: String(lessonModal.lesson.points),
              order: String(lessonModal.lesson.order),
            }}
            onSave={handleEditLesson}
            onClose={() => setLessonModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Delete confirmations ──────────────────────────────────────────── */}
      <AlertDialog open={!!deleteCourse} onOpenChange={o => !o && setDeleteCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Delete Course
            </AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deleteCourse?.title}</strong>? This will also delete all its levels and lessons,
              and remove student progress for this course. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteLevel} onOpenChange={o => !o && setDeleteLevel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Level</AlertDialogTitle>
            <AlertDialogDescription>
              Delete level <strong>{deleteLevel?.level.name}</strong>?
              Its lessons will remain in the course but become unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLevel}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete Level
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteLesson} onOpenChange={o => !o && setDeleteLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Delete lesson <strong>{deleteLesson?.lesson.title}</strong>?
              Student progress for this lesson will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete Lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
