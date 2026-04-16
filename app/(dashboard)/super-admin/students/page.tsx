"use client"

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react"
import { Plus, Upload, UserCheck, UserX, Trash2, FileText, X, Download } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { ModalForm } from "@/components/modal-form"
import { DataTable, type Column } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface Student {
  id: number
  name: string
  email: string
  college_name: string | null
  branch: string | null
  roll_number: string | null
  is_active: boolean
  streak: number
  points: number
}

interface College {
  id: number
  name: string
}

type StudentAction = { type: "activate" | "deactivate" | "delete"; student: Student }

export default function SuperAdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCollegeId, setSelectedCollegeId] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedPassoutYear, setSelectedPassoutYear] = useState("")
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [isBulkUploading, setIsBulkUploading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [confirm, setConfirm] = useState<StudentAction | null>(null)
  const csvRef = useRef<HTMLInputElement>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { per_page: "100" }
      if (collegeFilter !== "all") params.college_id = collegeFilter
      const res = await api.get("/super-admin/students", { params })
      setStudents(res.data.students)
    } catch {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }, [collegeFilter])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  useEffect(() => {
    api.get("/super-admin/colleges", { params: { per_page: 100 } })
      .then((r) => setColleges(r.data.colleges))
      .catch(() => {})
  }, [])

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data: Record<string, string | number> = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (selectedCollegeId) data.college_id = Number(selectedCollegeId)
    if (selectedBranch) data.branch = selectedBranch
    if (selectedSection) data.section = selectedSection
    if (selectedPassoutYear) data.passout_year = Number(selectedPassoutYear)
    if (!selectedCollegeId) { toast.error("Please select a college"); return }
    if (!selectedBranch) { toast.error("Please select a branch"); return }
    if (!selectedSection) { toast.error("Please select a section"); return }
    if (!selectedPassoutYear) { toast.error("Please select a passout year"); return }
    setIsSubmitting(true)
    try {
      await api.post("/super-admin/students", data)
      toast.success("Student created! Welcome email sent.")
      setIsCreateOpen(false)
      setSelectedCollegeId("")
      setSelectedBranch("")
      setSelectedSection("")
      setSelectedPassoutYear("")
      form.reset()
      fetchStudents()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!bulkFile) { toast.error("Please select a CSV or XLSX file"); return }
    const formData = new FormData()
    formData.append("file", bulkFile)
    setIsBulkUploading(true)
    try {
      const res = await api.post("/super-admin/students/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const skippedCount = res.data.skipped?.length ?? 0
      toast.success(`${res.data.created} student${res.data.created !== 1 ? "s" : ""} created`, {
        description: skippedCount ? `${skippedCount} skipped (already exist)` : undefined,
      })
      setIsBulkModalOpen(false)
      setBulkFile(null)
      if (csvRef.current) csvRef.current.value = ""
      fetchStudents()
    } catch (err: any) {
      const detail = err?.response?.data?.details
      toast.error(err?.response?.data?.error || "Failed to upload file", {
        description: detail ? (Array.isArray(detail) ? detail[0] : detail) : undefined,
      })
    } finally {
      setIsBulkUploading(false)
    }
  }

  const handleConfirmedAction = async () => {
    if (!confirm) return
    const { type, student } = confirm
    setConfirm(null)
    setActionLoading(student.id)
    try {
      if (type === "activate") {
        await api.patch(`/super-admin/students/${student.id}`, { is_active: true })
        toast.success(`${student.name} activated`)
        setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, is_active: true } : s))
      } else if (type === "deactivate") {
        await api.patch(`/super-admin/students/${student.id}`, { is_active: false })
        toast.success(`${student.name} deactivated`)
        setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, is_active: false } : s))
      } else if (type === "delete") {
        await api.delete(`/super-admin/students/${student.id}`)
        toast.success(`${student.name} deleted`)
        setStudents((prev) => prev.filter((s) => s.id !== student.id))
      }
    } catch {
      toast.error(`Failed to ${type} student`)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmConfig = confirm ? {
    activate: {
      title: "Activate Student?",
      description: `"${confirm.student.name}" will regain access to the platform.`,
      actionLabel: "Activate",
      actionClass: "bg-success hover:bg-success/90 text-white",
    },
    deactivate: {
      title: "Deactivate Student?",
      description: `"${confirm.student.name}" will be blocked from logging in until reactivated.`,
      actionLabel: "Deactivate",
      actionClass: "bg-warning hover:bg-warning/90 text-white",
    },
    delete: {
      title: "Delete Student?",
      description: `This will permanently delete "${confirm.student.name}" (${confirm.student.email}) and all their data. This cannot be undone.`,
      actionLabel: "Delete",
      actionClass: "bg-danger hover:bg-danger/90 text-white",
    },
  }[confirm.type] : null

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "college_name",
      header: "College",
      render: (row) => <span className="text-sm text-muted-foreground">{row.college_name || "—"}</span>,
    },
    {
      key: "branch",
      header: "Branch",
      render: (row) => <span className="text-sm text-muted-foreground">{row.branch || "—"}</span>,
    },
    {
      key: "roll_number",
      header: "Roll No",
      render: (row) => <span className="text-sm text-muted-foreground">{row.roll_number || "—"}</span>,
    },
    {
      key: "points",
      header: "Points",
      render: (row) => <span className="text-sm text-foreground">{row.points.toLocaleString()}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            row.is_active
              ? "bg-success/20 text-success border-success/30"
              : "bg-danger/20 text-danger border-danger/30"
          )}
        >
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  const downloadSampleCsv = () => {
    const rows = [
      ["name", "email", "roll_number", "branch", "section", "passout_year", "college"],
      ["Arjun Sharma", "arjun@example.com", "21CS001", "CSE", "A", "2025", "Sri Venkateswara Engineering College"],
      ["Priya Menon", "priya@example.com", "21EC042", "ECE", "B", "2026", "Sri Venkateswara Engineering College"],
      ["Rahul Kumar", "rahul@example.com", "21ME015", "MECH", "A", "2025", "Sri Venkateswara Engineering College"],
    ]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students_sample.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage students across all colleges</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            onClick={downloadSampleCsv}
            title="Download sample CSV template"
          >
            <Download className="h-4 w-4 mr-2" />
            Sample CSV
          </Button>
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => setIsBulkModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload CSV
          </Button>
          <Button
            className="bg-primary hover:brightness-110 text-primary-foreground"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Student
          </Button>
        </div>
      </div>

      {/* College filter */}
      <GlassCard className="p-4">
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-64 bg-secondary/50 border-border text-foreground">
            <SelectValue placeholder="All Colleges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            {colleges.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Table */}
      <GlassCard>
        <DataTable
          columns={columns}
          data={students}
          keyField="id"
          searchPlaceholder="Search by name or email..."
          searchKeys={["name", "email", "roll_number"]}
          pageSize={10}
          isLoading={loading}
          emptyMessage="No students found"
          actions={(row) => (
            <div className="flex items-center gap-1">
              {row.is_active ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === row.id}
                  className="h-7 px-2 text-muted-foreground hover:text-warning"
                  onClick={() => setConfirm({ type: "deactivate", student: row })}
                  title="Deactivate student"
                >
                  <UserX className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === row.id}
                  className="h-7 px-2 text-muted-foreground hover:text-success"
                  onClick={() => setConfirm({ type: "activate", student: row })}
                  title="Activate student"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                disabled={actionLoading === row.id}
                className="h-7 px-2 text-muted-foreground hover:text-danger"
                onClick={() => setConfirm({ type: "delete", student: row })}
                title="Delete student"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      </GlassCard>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null) }}>
        <AlertDialogContent className="bg-secondary border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{confirmConfig?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {confirmConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={confirmConfig?.actionClass}
              onClick={handleConfirmedAction}
            >
              {confirmConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Student Modal */}
      <ModalForm
        title="Create Student"
        description="Enter the basics — the student will complete their profile during onboarding."
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setSelectedCollegeId(""); setSelectedBranch(""); setSelectedSection(""); setSelectedPassoutYear("") }}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
        submitLabel="Create & Send Welcome Email"
      >
        <div className="space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Full Name <span className="text-destructive">*</span></Label>
              <Input name="name" placeholder="Rahul Kumar" className="bg-secondary/50 border-border text-foreground" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Email <span className="text-destructive">*</span></Label>
              <Input name="email" type="email" placeholder="student@college.edu" className="bg-secondary/50 border-border text-foreground" required />
            </div>
          </div>

          {/* Roll Number + Branch */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Roll Number <span className="text-destructive">*</span></Label>
              <Input name="roll_number" placeholder="21CS001" className="bg-secondary/50 border-border text-foreground" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Branch <span className="text-destructive">*</span></Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "AIML", "CSD"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section + Passout Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Section <span className="text-destructive">*</span></Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D", "E", "F"].map((s) => (
                    <SelectItem key={s} value={s}>Section {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Passout Year <span className="text-destructive">*</span></Label>
              <Select value={selectedPassoutYear} onValueChange={setSelectedPassoutYear}>
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {["2025", "2026", "2027", "2028", "2029"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* College */}
          <div className="space-y-1.5">
            <Label className="text-foreground">College <span className="text-destructive">*</span></Label>
            <Select value={selectedCollegeId} onValueChange={setSelectedCollegeId}>
              <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-primary/8 border border-primary/20 text-xs text-muted-foreground">
            <span className="text-primary mt-0.5">ℹ️</span>
            <span>Profile photo, DOB, phone, LinkedIn and GitHub will be set by the student during onboarding. Password is set on first login.</span>
          </div>
        </div>
      </ModalForm>

      {/* Bulk Upload Modal */}
      <ModalForm
        title="Bulk Upload Students"
        description="Upload a CSV or XLSX file with student data."
        isOpen={isBulkModalOpen}
        onClose={() => { setIsBulkModalOpen(false); setBulkFile(null); if (csvRef.current) csvRef.current.value = "" }}
        onSubmit={handleBulkUpload}
        isLoading={isBulkUploading}
        submitLabel="Upload"
      >
        <div className="space-y-4">
          {/* File picker */}
          <div className="space-y-1.5">
            <Label className="text-foreground">File <span className="text-destructive">*</span></Label>
            <div
              className="rounded-lg border border-dashed border-border p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => csvRef.current?.click()}
            >
              <input
                ref={csvRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
              />
              {bulkFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground font-medium truncate max-w-[220px]">{bulkFile.name}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={(e) => { e.stopPropagation(); setBulkFile(null); if (csvRef.current) csvRef.current.value = "" }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-7 w-7 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to select a <span className="text-foreground font-medium">CSV</span> or <span className="text-foreground font-medium">XLSX</span> file</p>
                </>
              )}
            </div>
          </div>

          {/* Required columns info */}
          <div className="rounded-lg bg-secondary/40 border border-border px-3 py-2.5 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Required columns:</p>
            <p>
              <code className="text-primary">name</code>, <code className="text-primary">email</code>, <code className="text-primary">roll_number</code>, <code className="text-primary">branch</code>, <code className="text-primary">section</code>, <code className="text-primary">passout_year</code>, <code className="text-primary">college</code>
            </p>
            <p className="mt-1">College must match the exact name in the system. Profile photo, DOB, phone, LinkedIn and GitHub are filled by the student during onboarding. Existing emails are skipped.</p>
          </div>
        </div>
      </ModalForm>
    </div>
  )
}
