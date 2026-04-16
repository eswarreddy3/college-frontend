"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Users, Search, Flame, Mail, Loader2, Download,
  ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle, CheckCircle, ExternalLink, FileDown, Pencil,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { generateStudentPDF, StudentPerformance } from "@/lib/student-report"

interface Student {
  id: number
  name: string
  email: string
  roll_number: string
  branch: string
  section: string
  passout_year: number
  points: number
  streak: number
  last_active: string | null
  is_inactive: boolean
}

interface ExportStudent {
  id: number; name: string; email: string; roll_number: string
  branch: string; section: string; passout_year: number | string
  phone: string; linkedin: string; github: string
  status: string; points: number; streak: number; last_active: string | null
  mcq_attempts: number; mcq_correct: number; mcq_accuracy: number
  coding_submissions: number; coding_solved: number
  assignments_completed: number; assignment_avg_score: number
  lessons_completed: number
}

type SortKey = "name" | "points" | "streak" | "last_active"
type SortDir = "asc" | "desc"

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="h-3 w-3 ml-1 opacity-30" />
  return sortDir === "asc"
    ? <ChevronUp className="h-3 w-3 ml-1 text-primary" />
    : <ChevronDown className="h-3 w-3 ml-1 text-primary" />
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)
  const [remindingSelected, setRemindingSelected] = useState(false)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [sortKey, setSortKey] = useState<SortKey>("points")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [editForm, setEditForm] = useState({ name: "", branch: "", section: "", roll_number: "", passout_year: "" })
  const [editSaving, setEditSaving] = useState(false)

  function openEdit(student: Student) {
    setEditStudent(student)
    setEditForm({
      name: student.name,
      branch: student.branch || "",
      section: student.section || "",
      roll_number: student.roll_number || "",
      passout_year: student.passout_year ? String(student.passout_year) : "",
    })
  }

  async function saveEdit() {
    if (!editStudent) return
    setEditSaving(true)
    try {
      const res = await api.patch(`/admin/students/${editStudent.id}`, {
        name: editForm.name.trim(),
        branch: editForm.branch.trim(),
        section: editForm.section.trim(),
        roll_number: editForm.roll_number.trim(),
        passout_year: editForm.passout_year ? parseInt(editForm.passout_year) : null,
      })
      setStudents(prev => prev.map(s => s.id === editStudent.id ? { ...s, ...res.data } : s))
      toast.success("Student updated")
      setEditStudent(null)
    } catch {
      toast.error("Failed to update student")
    } finally {
      setEditSaving(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (branchFilter !== "all") params.set("branch", branchFilter)
    if (sectionFilter !== "all") params.set("section", sectionFilter)
    if (yearFilter !== "all") params.set("passout_year", yearFilter)
    params.set("per_page", "200")

    setLoading(true)
    const timeout = setTimeout(() => {
      api.get(`/admin/students?${params}`)
        .then((res) => {
          setStudents(res.data.students)
          setTotal(res.data.total)
          setSelectedIds(new Set())
        })
        .catch(() => toast.error("Failed to load students"))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, branchFilter, sectionFilter, yearFilter])

  async function handleRemind(student: Student) {
    setRemindingId(student.id)
    try {
      await api.post(`/admin/students/${student.id}/remind`)
      toast.success(`Reminder sent to ${student.name}`)
    } catch {
      toast.error("Failed to send reminder")
    } finally {
      setRemindingId(null)
    }
  }

  async function handleRemindSelected() {
    const toRemind = students.filter(s => selectedIds.has(s.id) && s.is_inactive)
    if (!toRemind.length) {
      toast.info("No inactive students in selection")
      return
    }
    setRemindingSelected(true)
    let sent = 0
    for (const s of toRemind) {
      try {
        await api.post(`/admin/students/${s.id}/remind`)
        sent++
      } catch {}
    }
    toast.success(`Reminders sent to ${sent} student${sent !== 1 ? "s" : ""}`)
    setRemindingSelected(false)
  }

  async function handleDownloadReport(student: Student) {
    setDownloadingId(student.id)
    try {
      const res = await api.get(`/admin/students/${student.id}/performance`)
      generateStudentPDF(res.data as StudentPerformance)
    } catch {
      toast.error("Failed to load report")
    } finally {
      setDownloadingId(null)
    }
  }

  const [exportingCSV, setExportingCSV] = useState(false)

  async function exportCSV() {
    setExportingCSV(true)
    try {
      const res = await api.get("/admin/students/export")
      const all: ExportStudent[] = res.data.students

      const headers = [
        "Roll No", "Name", "Email", "Branch", "Section", "Batch Year",
        "Phone", "LinkedIn", "GitHub",
        "Status", "Points", "Streak", "Last Active",
        "MCQ Attempts", "MCQ Correct", "MCQ Accuracy (%)",
        "Coding Submissions", "Coding Problems Solved",
        "Assignments Completed", "Assignment Avg Score (%)",
        "Lessons Completed",
      ]
      const rows = all.map(s => [
        s.roll_number, s.name, s.email, s.branch, s.section, s.passout_year,
        s.phone, s.linkedin, s.github,
        s.status, s.points, s.streak,
        s.last_active ? new Date(s.last_active).toLocaleDateString("en-IN") : "Never",
        s.mcq_attempts, s.mcq_correct, s.mcq_accuracy,
        s.coding_submissions, s.coding_solved,
        s.assignments_completed, s.assignment_avg_score,
        s.lessons_completed,
      ])

      const csv = [headers, ...rows]
        .map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n")

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `NAC_Student_Report_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exported ${all.length} students`)
    } catch {
      toast.error("Failed to export")
    } finally {
      setExportingCSV(false)
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const sortedStudents = useMemo(() => {
    let list = [...students]
    if (statusFilter === "active") list = list.filter(s => !s.is_inactive)
    if (statusFilter === "inactive") list = list.filter(s => s.is_inactive)
    list.sort((a, b) => {
      let av: string | number, bv: string | number
      if (sortKey === "name") { av = a.name.toLowerCase(); bv = b.name.toLowerCase() }
      else if (sortKey === "points") { av = a.points; bv = b.points }
      else if (sortKey === "streak") { av = a.streak; bv = b.streak }
      else {
        av = a.last_active ? new Date(a.last_active).getTime() : 0
        bv = b.last_active ? new Date(b.last_active).getTime() : 0
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return list
  }, [students, sortKey, sortDir, statusFilter])

  const branches = useMemo(() => Array.from(new Set(students.map(s => s.branch).filter(Boolean))).sort(), [students])
  const sections = useMemo(() => Array.from(new Set(students.map(s => s.section).filter(Boolean))).sort(), [students])
  const years = useMemo(() => Array.from(new Set(students.map(s => s.passout_year).filter(Boolean))).sort(), [students])

  const inactiveCount = students.filter(s => s.is_inactive).length
  const activeCount = students.length - inactiveCount

  const allVisibleIds = sortedStudents.map(s => s.id)
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.has(id))

  function toggleSelectAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(allVisibleIds))
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-serif text-foreground">Students</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor your college students</p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
          { label: "Active", value: activeCount, icon: CheckCircle, color: "text-success", bg: "bg-success/10 border-success/20" },
          { label: "Inactive", value: inactiveCount, icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10 border-danger/20" },
          { label: "Selected", value: selectedIds.size, icon: Users, color: "text-coding", bg: "bg-coding/10 border-coding/20" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={`flex items-center gap-3 p-3 rounded-xl border ${stat.bg}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <stat.icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
            <div>
              <p className={`text-lg font-bold leading-tight ${stat.color}`}>{loading ? "—" : stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <GlassCard>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border text-foreground"
              />
            </div>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[120px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[110px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[100px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[110px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              {selectedIds.size > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-danger/30 text-danger hover:bg-danger/10 gap-1"
                  onClick={handleRemindSelected}
                  disabled={remindingSelected}
                >
                  {remindingSelected
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Mail className="h-3 w-3" />
                  }
                  Remind ({selectedIds.size})
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 gap-1"
                onClick={exportCSV}
                disabled={exportingCSV}
              >
                {exportingCSV
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <Download className="h-3 w-3" />
                }
                {exportingCSV ? "Exporting…" : "Export NAC CSV"}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-3 w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      className="border-border"
                    />
                  </th>
                  <th className="text-left py-3 px-3">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Name <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                    Roll No
                  </th>
                  <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Branch / Sec
                  </th>
                  <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground hidden xl:table-cell">
                    Year
                  </th>
                  <th className="text-right py-3 px-3">
                    <button
                      onClick={() => toggleSort("points")}
                      className="flex items-center justify-end ml-auto text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Points <SortIcon col="points" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="text-right py-3 px-3 hidden xl:table-cell">
                    <button
                      onClick={() => toggleSort("streak")}
                      className="flex items-center justify-end ml-auto text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Streak <SortIcon col="streak" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="text-right py-3 px-3">
                    <button
                      onClick={() => toggleSort("last_active")}
                      className="flex items-center justify-end ml-auto text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Last Active <SortIcon col="last_active" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-sm font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={cn(
                      "border-b border-border/50 transition-colors hover:bg-secondary/30",
                      student.is_inactive && "bg-danger/5",
                      selectedIds.has(student.id) && "bg-primary/5 hover:bg-primary/8",
                    )}
                  >
                    <td className="py-3 px-3">
                      <Checkbox
                        checked={selectedIds.has(student.id)}
                        onCheckedChange={() => toggleSelect(student.id)}
                        className="border-border"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar
                          name={student.name}
                          photoUrl={(student as any).avatar}
                          size="sm"
                          points={student.points}
                          fallbackClassName={student.is_inactive ? "bg-danger/20 text-danger" : undefined}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                          <p className="text-xs text-muted-foreground/70 sm:hidden">
                            {[student.roll_number, student.branch, student.section].filter(Boolean).join(" · ") || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell text-sm text-muted-foreground">
                      {student.roll_number || "—"}
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell text-sm text-muted-foreground">
                      {student.branch || "—"}{student.section ? ` / ${student.section}` : ""}
                    </td>
                    <td className="py-3 px-3 hidden xl:table-cell text-sm text-muted-foreground">
                      {student.passout_year || "—"}
                    </td>
                    <td className="py-3 px-3 text-right text-sm font-medium text-foreground">
                      {student.points.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right hidden xl:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <Flame className={cn("h-3 w-3", student.streak > 0 ? "text-streak" : "text-muted-foreground")} />
                        <span className="text-sm text-foreground">{student.streak}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={cn("text-sm", student.is_inactive ? "text-danger" : "text-muted-foreground")}>
                        {formatLastActive(student.last_active)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {student.is_inactive && (
                          <button
                            title="Send reminder"
                            onClick={() => handleRemind(student)}
                            disabled={remindingId === student.id}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-danger/30 text-danger hover:bg-danger/10 disabled:opacity-50 transition-colors"
                          >
                            {remindingId === student.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Mail className="h-3.5 w-3.5" />
                            }
                          </button>
                        )}
                        <button
                          title="Edit student"
                          onClick={() => openEdit(student)}
                          className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <Link href={`/admin/students/${student.id}`}>
                          <button
                            title="View profile"
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          title="Download report"
                          onClick={() => handleDownloadReport(student)}
                          disabled={downloadingId === student.id}
                          className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-50 transition-colors"
                        >
                          {downloadingId === student.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <FileDown className="h-3.5 w-3.5" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No students found</p>
              </div>
            )}
          </div>
        )}

        {sortedStudents.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-right">
            Showing {sortedStudents.length} of {total} students
          </p>
        )}
      </GlassCard>

      <Dialog open={!!editStudent} onOpenChange={(open) => { if (!open) setEditStudent(null) }}>
        <DialogContent className="bg-popover border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Roll Number</Label>
              <Input
                value={editForm.roll_number}
                onChange={(e) => setEditForm(f => ({ ...f, roll_number: e.target.value }))}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="e.g. 21CS001"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">Branch</Label>
                <Input
                  value={editForm.branch}
                  onChange={(e) => setEditForm(f => ({ ...f, branch: e.target.value }))}
                  className="bg-secondary/50 border-border text-foreground"
                  placeholder="e.g. CSE"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">Section</Label>
                <Input
                  value={editForm.section}
                  onChange={(e) => setEditForm(f => ({ ...f, section: e.target.value }))}
                  className="bg-secondary/50 border-border text-foreground"
                  placeholder="e.g. A"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Passout Year</Label>
              <Input
                type="number"
                value={editForm.passout_year}
                onChange={(e) => setEditForm(f => ({ ...f, passout_year: e.target.value }))}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="e.g. 2026"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-border text-muted-foreground" onClick={() => setEditStudent(null)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={saveEdit}
              disabled={editSaving || !editForm.name.trim()}
            >
              {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
