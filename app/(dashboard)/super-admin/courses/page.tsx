"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  BookOpen, Loader2, GripVertical, Layers, FileText,
  Clock, Star, Code2, Database, Globe, Brain, Zap,
  AlertTriangle, X, Check,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg bg-[#0F1628] border border-border rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
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
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-3 gap-3">
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
                                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />{lesson.duration_mins}m
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Star className="h-3 w-3" />{lesson.points}
                                        </span>
                                      </div>
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
