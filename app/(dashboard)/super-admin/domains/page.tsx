"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, X,
  Database, Code, Globe, BookOpen, Brain, Zap, Layers,
  FileText, Server, BarChart2, Network, Cpu, Atom,
  GraduationCap, Briefcase, Shield, Palette, Music,
  FlaskConical, Loader2, ArrowRight, ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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

interface DomainRow {
  id: string
  title: string
  description: string | null
  icon: string
  icon_color: string
  bg_color: string
  skills: string[]
  is_active: boolean
  order: number
  course_count: number
  total_points: number
}

interface CourseSimple {
  id: string
  title: string
  category: string
  difficulty: string
  is_active: boolean
}

interface MappedCourse {
  course_id: string
  order_index: number
  title: string
}

// ── Icon map ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Database, Code, Globe, BookOpen, Brain, Zap, Layers,
  FileText, Server, BarChart2, Network, Cpu, Atom,
  GraduationCap, Briefcase, Shield, Palette, Music,
  FlaskConical,
}

const ICON_OPTIONS = Object.keys(ICON_MAP).map(k => ({ value: k, label: k }))

const COLOR_OPTIONS = [
  { value: "text-blue-400",   bg: "bg-blue-400/20",   label: "Blue"   },
  { value: "text-cyan-400",   bg: "bg-cyan-400/20",   label: "Cyan"   },
  { value: "text-green-400",  bg: "bg-green-400/20",  label: "Green"  },
  { value: "text-teal-400",   bg: "bg-teal-400/20",   label: "Teal"   },
  { value: "text-yellow-400", bg: "bg-yellow-400/20", label: "Yellow" },
  { value: "text-orange-400", bg: "bg-orange-400/20", label: "Orange" },
  { value: "text-pink-400",   bg: "bg-pink-400/20",   label: "Pink"   },
  { value: "text-purple-400", bg: "bg-purple-400/20", label: "Purple" },
  { value: "text-red-400",    bg: "bg-red-400/20",    label: "Red"    },
  { value: "text-indigo-400", bg: "bg-indigo-400/20", label: "Indigo" },
]

function colorToBg(iconColor: string): string {
  return COLOR_OPTIONS.find(c => c.value === iconColor)?.bg ?? "bg-blue-400/20"
}

// ── DomainIcon ────────────────────────────────────────────────────────────────

function DomainIcon({ icon, iconColor, bgColor, size = "sm" }: {
  icon: string; iconColor: string; bgColor: string; size?: "sm" | "md"
}) {
  const Ic = ICON_MAP[icon] ?? Database
  return (
    <div className={cn(
      "rounded-lg flex items-center justify-center flex-shrink-0",
      size === "sm" ? "w-8 h-8" : "w-10 h-10",
      bgColor,
    )}>
      <Ic className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", iconColor)} />
    </div>
  )
}

// ── Modal shell ───────────────────────────────────────────────────────────────

function Modal({ title, onClose, wide, children }: {
  title: string; onClose: () => void; wide?: boolean; children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "w-full bg-popover border border-border rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] my-auto",
          wide ? "max-w-3xl" : "max-w-lg",
        )}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-foreground">{label}</Label>
      {children}
    </div>
  )
}

// ── Domain Form Modal ─────────────────────────────────────────────────────────

interface DomainFormState {
  id: string; title: string; description: string
  icon: string; icon_color: string
  skills: string; order: string; is_active: boolean
}

const emptyDomain: DomainFormState = {
  id: "", title: "", description: "",
  icon: "Database", icon_color: "text-blue-400",
  skills: "", order: "0", is_active: true,
}

function DomainModal({ initial, isEdit, onSave, onClose }: {
  initial?: DomainFormState
  isEdit: boolean
  onSave: (data: DomainFormState) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<DomainFormState>(initial ?? emptyDomain)
  const [saving, setSaving] = useState(false)

  const set = (k: keyof DomainFormState) => (v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const selectedColor = COLOR_OPTIONS.find(c => c.value === form.icon_color) ?? COLOR_OPTIONS[0]

  return (
    <Modal title={isEdit ? "Edit Domain" : "New Domain"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ID — only on create */}
        {!isEdit ? (
          <Field label="Domain ID *">
            <Input
              placeholder="e.g. data-science, web-dev"
              className="bg-secondary/50 text-xs font-mono"
              value={form.id}
              onChange={e => set("id")(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
              required
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Permanent slug — cannot be changed after creation.
            </p>
          </Field>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 border border-border">
            <span className="text-xs text-muted-foreground">ID</span>
            <code className="text-xs text-primary font-mono">{form.id}</code>
            <Badge variant="outline" className="text-[10px] ml-auto border-amber-500/30 text-amber-400">locked</Badge>
          </div>
        )}

        {/* Title */}
        <Field label="Title *">
          <Input
            placeholder="Data Science"
            className="bg-secondary/50"
            value={form.title}
            onChange={e => set("title")(e.target.value)}
            required
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <Textarea
            placeholder="A short description of this domain..."
            className="bg-secondary/50 resize-none text-sm"
            rows={2}
            value={form.description}
            onChange={e => set("description")(e.target.value)}
          />
        </Field>

        {/* Icon + Color row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Icon">
            <Select value={form.icon} onValueChange={v => set("icon")(v)}>
              <SelectTrigger className="bg-secondary/50">
                <div className="flex items-center gap-2">
                  <DomainIcon icon={form.icon} iconColor={form.icon_color} bgColor={selectedColor.bg} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-52">
                {ICON_OPTIONS.map(o => {
                  const Ic = ICON_MAP[o.value]
                  return (
                    <SelectItem key={o.value} value={o.value}>
                      <div className="flex items-center gap-2">
                        <Ic className="h-4 w-4" />
                        {o.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Color">
            <Select value={form.icon_color} onValueChange={v => set("icon_color")(v)}>
              <SelectTrigger className="bg-secondary/50">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", selectedColor.bg.replace("/20", ""))} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", c.bg.replace("/20", ""))} />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Skills */}
        <Field label="Skills (comma-separated)">
          <Input
            placeholder="Python, Machine Learning, SQL, Data Viz"
            className="bg-secondary/50 text-sm"
            value={form.skills}
            onChange={e => set("skills")(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Tags shown on the student domain card.
          </p>
        </Field>

        {/* Order + Active row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Display Order">
            <Input
              type="number" min={0}
              className="bg-secondary/50"
              value={form.order}
              onChange={e => set("order")(e.target.value)}
            />
          </Field>

          <Field label="Active">
            <div className="flex items-center gap-2 h-9 mt-0.5">
              <Switch
                checked={form.is_active}
                onCheckedChange={v => set("is_active")(v)}
              />
              <span className="text-sm text-muted-foreground">
                {form.is_active ? "Visible to students" : "Hidden"}
              </span>
            </div>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Save Changes" : "Create Domain"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Course Mapping Modal ──────────────────────────────────────────────────────

function CourseMappingModal({ domain, onClose }: {
  domain: DomainRow
  onClose: () => void
}) {
  const [allCourses, setAllCourses] = useState<CourseSimple[]>([])
  const [selected, setSelected] = useState<MappedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // fetch all active courses + current mapping
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [coursesRes, mappingRes] = await Promise.all([
          api.get<CourseSimple[]>("/super-admin/courses"),
          api.get<MappedCourse[]>(`/super-admin/domains/${domain.id}/courses`),
        ])
        if (cancelled) return
        setAllCourses(coursesRes.data.filter(c => c.is_active))
        setSelected(mappingRes.data)
      } catch {
        toast.error("Failed to load course data")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [domain.id])

  const selectedIds = new Set(selected.map(s => s.course_id))
  const available = allCourses.filter(c => !selectedIds.has(c.id))

  function addCourse(course: CourseSimple) {
    setSelected(prev => [
      ...prev,
      { course_id: course.id, order_index: prev.length, title: course.title },
    ])
  }

  function removeCourse(course_id: string) {
    setSelected(prev =>
      prev
        .filter(s => s.course_id !== course_id)
        .map((s, i) => ({ ...s, order_index: i }))
    )
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    setSelected(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next.map((s, i) => ({ ...s, order_index: i }))
    })
  }

  function moveDown(idx: number) {
    setSelected(prev => {
      if (idx === prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next.map((s, i) => ({ ...s, order_index: i }))
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put(`/super-admin/domains/${domain.id}/courses`, {
        courses: selected.map((s, i) => ({ course_id: s.course_id, order_index: i })),
      })
      toast.success("Course mapping saved")
      onClose()
    } catch {
      toast.error("Failed to save mapping")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Manage Courses — ${domain.title}`} onClose={onClose} wide>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Add courses from the left panel and reorder them on the right. The order here determines the roadmap sequence shown to students.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Available courses */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Available ({available.length})
              </p>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {available.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">All courses added</p>
                ) : available.map(course => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{course.title}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{course.id}</p>
                    </div>
                    <button
                      onClick={() => addCourse(course)}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Add to domain"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected / ordered */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Selected & Ordered ({selected.length})
              </p>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {selected.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No courses added yet</p>
                ) : selected.map((s, idx) => (
                  <div
                    key={s.course_id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 border border-border"
                  >
                    <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-foreground flex-1 truncate">{s.title}</p>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === selected.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                        title="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeCourse(s.course_id)}
                        className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Mapping
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DomainsPage() {
  const [domains, setDomains] = useState<DomainRow[]>([])
  const [loading, setLoading] = useState(true)

  // modals
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<DomainRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DomainRow | null>(null)
  const [mappingTarget, setMappingTarget] = useState<DomainRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchDomains = useCallback(async () => {
    try {
      const res = await api.get<DomainRow[]>("/super-admin/domains")
      setDomains(res.data)
    } catch {
      toast.error("Failed to load domains")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDomains() }, [fetchDomains])

  // Create
  async function handleCreate(form: DomainFormState) {
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean)
    await api.post("/super-admin/domains", {
      id: form.id,
      title: form.title,
      description: form.description || null,
      icon: form.icon,
      icon_color: form.icon_color,
      bg_color: colorToBg(form.icon_color),
      skills,
      is_active: form.is_active,
      order: parseInt(form.order) || 0,
    })
    toast.success("Domain created")
    setCreateOpen(false)
    fetchDomains()
  }

  // Edit
  async function handleEdit(form: DomainFormState) {
    if (!editTarget) return
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean)
    await api.patch(`/super-admin/domains/${editTarget.id}`, {
      title: form.title,
      description: form.description || null,
      icon: form.icon,
      icon_color: form.icon_color,
      bg_color: colorToBg(form.icon_color),
      skills,
      is_active: form.is_active,
      order: parseInt(form.order) || 0,
    })
    toast.success("Domain updated")
    setEditTarget(null)
    fetchDomains()
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await api.delete(`/super-admin/domains/${deleteTarget.id}`)
      toast.success("Domain deleted")
      setDeleteTarget(null)
      fetchDomains()
    } catch {
      toast.error("Failed to delete domain")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Active toggle (inline)
  async function toggleActive(domain: DomainRow) {
    try {
      await api.patch(`/super-admin/domains/${domain.id}`, { is_active: !domain.is_active })
      setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, is_active: !d.is_active } : d))
    } catch {
      toast.error("Failed to update status")
    }
  }

  function toFormState(d: DomainRow): DomainFormState {
    return {
      id: d.id,
      title: d.title,
      description: d.description ?? "",
      icon: d.icon,
      icon_color: d.icon_color,
      skills: (d.skills ?? []).join(", "),
      order: String(d.order),
      is_active: d.is_active,
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif gradient-text">Domain Programs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage domains and map courses to each domain roadmap.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Domain
        </Button>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : domains.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layers className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No domains yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Click "New Domain" to create the first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Domain</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Courses</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Active</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {domains.map((domain, idx) => (
                    <motion.tr
                      key={domain.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      {/* Order */}
                      <td className="px-4 py-3 text-muted-foreground text-xs">{domain.order}</td>

                      {/* Title + icon */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <DomainIcon
                            icon={domain.icon}
                            iconColor={domain.icon_color}
                            bgColor={domain.bg_color}
                          />
                          <div>
                            <p className="font-medium text-foreground">{domain.title}</p>
                            {domain.skills?.length > 0 && (
                              <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                                {domain.skills.slice(0, 4).join(" · ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3">
                        <code className="text-xs text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded font-mono">
                          {domain.id}
                        </code>
                      </td>

                      {/* Course count */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setMappingTarget(domain)}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {domain.course_count}
                          <span className="text-muted-foreground">courses</span>
                        </button>
                      </td>

                      {/* Active toggle */}
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={domain.is_active}
                          onCheckedChange={() => toggleActive(domain)}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            title="Manage Courses"
                            onClick={() => setMappingTarget(domain)}
                          >
                            <Layers className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Edit Domain"
                            onClick={() => setEditTarget(domain)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-400"
                            title="Delete Domain"
                            onClick={() => setDeleteTarget(domain)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Modals */}
      <AnimatePresence>
        {createOpen && (
          <DomainModal
            isEdit={false}
            onSave={handleCreate}
            onClose={() => setCreateOpen(false)}
          />
        )}
        {editTarget && (
          <DomainModal
            isEdit
            initial={toFormState(editTarget)}
            onSave={handleEdit}
            onClose={() => setEditTarget(null)}
          />
        )}
        {mappingTarget && (
          <CourseMappingModal
            domain={mappingTarget}
            onClose={() => { setMappingTarget(null); fetchDomains() }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Domain</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.title}</strong> and remove all its course mappings.
              Students who had access to this domain will lose it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
