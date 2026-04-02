"use client"

import { useState, useEffect, useCallback } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable, type Column } from "@/components/data-table"
import {
  Plus, Pencil, Trash2, UserX, UserCheck, Loader2, GitBranch, Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface BranchAdmin {
  id: number
  name: string
  email: string
  branch: string | null
  college_id: number | null
  college_name: string | null
  is_active: boolean
  created_at: string | null
}

interface College {
  id: number
  name: string
}

const createSchema = z.object({
  name:       z.string().min(1, "Name is required"),
  email:      z.string().email("Enter a valid email"),
  branch:     z.string().min(1, "Branch is required"),
  college_id: z.string().min(1, "College is required"),
})
type CreateForm = z.infer<typeof createSchema>

const editSchema = z.object({
  name:   z.string().min(1, "Name is required"),
  branch: z.string().min(1, "Branch is required"),
})
type EditForm = z.infer<typeof editSchema>

function CreateDialog({
  open, onClose, colleges, onCreated,
}: {
  open: boolean
  onClose: () => void
  colleges: College[]
  onCreated: (a: BranchAdmin) => void
}) {
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
  })

  useEffect(() => { if (open) reset() }, [open, reset])

  const onSubmit = async (data: CreateForm) => {
    setSaving(true)
    try {
      const res = await api.post("/super-admin/branch-admins", {
        ...data,
        college_id: Number(data.college_id),
      })
      toast.success("Branch admin created! Welcome email sent.")
      onCreated(res.data)
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create branch admin")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-popover border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Create Branch Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input placeholder="Dr. Ramesh Kumar" className="bg-secondary/50" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input placeholder="ramesh@college.edu" className="bg-secondary/50" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>College</Label>
            <Select value={watch("college_id")} onValueChange={(v) => setValue("college_id", v)}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select college..." />
              </SelectTrigger>
              <SelectContent>
                {colleges.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.college_id && <p className="text-xs text-destructive">{errors.college_id.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Branch</Label>
            <Input placeholder="e.g. CSE, ECE, MECH" className="bg-secondary/50" {...register("branch")} />
            {errors.branch && <p className="text-xs text-destructive">{errors.branch.message}</p>}
          </div>

          <DialogFooter className="gap-2 flex-row justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create & Send Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditDialog({
  open, onClose, admin, onSaved,
}: {
  open: boolean
  onClose: () => void
  admin: BranchAdmin | null
  onSaved: (a: BranchAdmin) => void
}) {
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  })

  useEffect(() => {
    if (open && admin) reset({ name: admin.name, branch: admin.branch ?? "" })
  }, [open, admin, reset])

  const onSubmit = async (data: EditForm) => {
    if (!admin) return
    setSaving(true)
    try {
      const res = await api.patch(`/super-admin/branch-admins/${admin.id}`, data)
      toast.success("Branch admin updated")
      onSaved(res.data)
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-popover border-border text-foreground max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">Edit Branch Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input className="bg-secondary/50" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Branch</Label>
            <Input className="bg-secondary/50" {...register("branch")} />
            {errors.branch && <p className="text-xs text-destructive">{errors.branch.message}</p>}
          </div>
          <DialogFooter className="gap-2 flex-row justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10">Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type ConfirmAction = { type: "activate" | "deactivate" | "delete"; admin: BranchAdmin }

export default function BranchAdminsPage() {
  const [admins, setAdmins] = useState<BranchAdmin[]>([])
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BranchAdmin | null>(null)
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [resendingId, setResendingId] = useState<number | null>(null)

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (collegeFilter !== "all") params.college_id = collegeFilter
      const res = await api.get("/super-admin/branch-admins", { params })
      setAdmins(res.data)
    } catch {
      toast.error("Failed to load branch admins")
    } finally {
      setLoading(false)
    }
  }, [collegeFilter])

  useEffect(() => { fetchAdmins() }, [fetchAdmins])

  useEffect(() => {
    api.get("/super-admin/colleges", { params: { per_page: 200 } })
      .then(r => setColleges(r.data.colleges))
      .catch(() => {})
  }, [])

  function handleCreated(a: BranchAdmin) {
    setAdmins(prev => [a, ...prev])
  }

  function handleSaved(a: BranchAdmin) {
    setAdmins(prev => prev.map(x => x.id === a.id ? a : x))
  }

  async function handleResend(id: number, name: string) {
    setResendingId(id)
    try {
      await api.post(`/super-admin/branch-admins/${id}/resend-credentials`)
      toast.success(`New credentials sent to ${name}`)
    } catch {
      toast.error("Failed to resend credentials")
    } finally {
      setResendingId(null)
    }
  }

  const handleConfirmedAction = async () => {
    if (!confirm) return
    const { type, admin } = confirm
    setConfirm(null)
    setActionLoading(admin.id)
    try {
      if (type === "activate") {
        const res = await api.patch(`/super-admin/branch-admins/${admin.id}`, { is_active: true })
        handleSaved(res.data)
        toast.success(`${admin.name} activated`)
      } else if (type === "deactivate") {
        const res = await api.patch(`/super-admin/branch-admins/${admin.id}`, { is_active: false })
        handleSaved(res.data)
        toast.success(`${admin.name} deactivated`)
      } else if (type === "delete") {
        await api.delete(`/super-admin/branch-admins/${admin.id}`)
        setAdmins(prev => prev.filter(x => x.id !== admin.id))
        toast.success(`${admin.name} deleted`)
      }
    } catch {
      toast.error(`Failed to ${type}`)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmConfig = confirm ? {
    activate: {
      title: "Activate Branch Admin?",
      description: `"${confirm.admin.name}" will regain access to the platform.`,
      actionLabel: "Activate",
      actionClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    deactivate: {
      title: "Deactivate Branch Admin?",
      description: `"${confirm.admin.name}" will be blocked from logging in until reactivated.`,
      actionLabel: "Deactivate",
      actionClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    delete: {
      title: "Delete Branch Admin?",
      description: `This will permanently delete "${confirm.admin.name}" (${confirm.admin.email}). This cannot be undone.`,
      actionLabel: "Delete",
      actionClass: "bg-red-600 hover:bg-red-700 text-white",
    },
  }[confirm.type] : null

  const columns: Column<BranchAdmin>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs font-bold">
              {row.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
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
      render: (row) => (
        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs">
          <GitBranch className="h-3 w-3 mr-1" />{row.branch || "—"}
        </Badge>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <Badge variant="outline" className={cn(
          "text-xs",
          row.is_active
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
        )}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Branch Admins</h1>
          <p className="text-muted-foreground mt-1">Manage branch-level administrators across colleges</p>
        </div>
        <Button
          className="bg-primary hover:brightness-110 text-primary-foreground"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Branch Admin
        </Button>
      </div>

      {/* College filter */}
      <GlassCard className="p-4">
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-64 bg-secondary/50 border-border text-foreground">
            <SelectValue placeholder="All Colleges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            {colleges.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Table */}
      <GlassCard>
        <DataTable
          columns={columns}
          data={admins}
          keyField="id"
          searchPlaceholder="Search by name or email..."
          searchKeys={["name", "email", "branch", "college_name"]}
          pageSize={10}
          isLoading={loading}
          emptyMessage="No branch admins found"
          actions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-muted-foreground hover:text-primary"
                onClick={() => setEditTarget(row)}
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={resendingId === row.id}
                className="h-7 px-2 text-muted-foreground hover:text-amber-400"
                onClick={() => handleResend(row.id, row.name)}
                title="Resend credentials"
              >
                {resendingId === row.id
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Mail className="h-3.5 w-3.5" />
                }
              </Button>
              {row.is_active ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === row.id}
                  className="h-7 px-2 text-muted-foreground hover:text-amber-400"
                  onClick={() => setConfirm({ type: "deactivate", admin: row })}
                  title="Deactivate"
                >
                  <UserX className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === row.id}
                  className="h-7 px-2 text-muted-foreground hover:text-emerald-400"
                  onClick={() => setConfirm({ type: "activate", admin: row })}
                  title="Activate"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                disabled={actionLoading === row.id}
                className="h-7 px-2 text-muted-foreground hover:text-red-400"
                onClick={() => setConfirm({ type: "delete", admin: row })}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      </GlassCard>

      {/* Dialogs */}
      <CreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        colleges={colleges}
        onCreated={handleCreated}
      />
      <EditDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        admin={editTarget}
        onSaved={handleSaved}
      />

      {/* Confirm dialog */}
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
            <AlertDialogAction className={confirmConfig?.actionClass} onClick={handleConfirmedAction}>
              {confirmConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
