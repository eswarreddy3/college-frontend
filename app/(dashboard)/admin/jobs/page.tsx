"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Briefcase, Building2, Calendar, ExternalLink, Loader2,
  Pencil, Plus, Trash2, Clock, Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface Job {
  id: number
  title: string
  company: string
  type: string
  experience: string | null
  apply_link: string
  deadline: string | null
  description: string | null
  is_active: boolean
  created_at: string
}

const typeConfig: Record<string, { label: string; color: string }> = {
  "internship":  { label: "Internship",  color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  "full-time":   { label: "Full-Time",   color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  "part-time":   { label: "Part-Time",   color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  "contract":    { label: "Contract",    color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
}

const schema = z.object({
  title:       z.string().min(1, "Title is required"),
  company:     z.string().min(1, "Company is required"),
  type:        z.enum(["internship", "full-time", "part-time", "contract"]),
  experience:  z.string().optional(),
  apply_link:  z.string().url("Enter a valid URL"),
  deadline:    z.string().optional(),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function JobFormDialog({
  open, onClose, onSaved, editing,
}: {
  open: boolean
  onClose: () => void
  onSaved: (job: Job) => void
  editing: Job | null
}) {
  const [saving,          setSaving]          = useState(false)
  const [notifyStudents,  setNotifyStudents]  = useState(false)
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "full-time" },
  })

  useEffect(() => {
    if (open) {
      setNotifyStudents(false)
      if (editing) {
        reset({
          title: editing.title,
          company: editing.company,
          type: editing.type as FormData["type"],
          experience: editing.experience ?? "",
          apply_link: editing.apply_link,
          deadline: editing.deadline ?? "",
          description: editing.description ?? "",
        })
      } else {
        reset({ type: "full-time", title: "", company: "", experience: "", apply_link: "", deadline: "", description: "" })
      }
    }
  }, [open, editing, reset])

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        deadline: data.deadline || null,
        experience: data.experience || null,
        description: data.description || null,
        notify_students: !editing && notifyStudents,
      }
      const res = editing
        ? await api.patch(`/jobs/${editing.id}`, payload)
        : await api.post("/jobs/", payload)
      toast.success(editing ? "Job updated" : "Job posted!")
      onSaved(res.data)
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save job")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-popover border-border text-foreground max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{editing ? "Edit Job" : "Post a Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Job Title</Label>
            <Input placeholder="Software Engineer Intern" className="bg-secondary/50" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input placeholder="Acme Corp" className="bg-secondary/50" {...register("company")} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v as FormData["type"])}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Experience <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input placeholder="Fresher / 0-1 years" className="bg-secondary/50" {...register("experience")} />
            </div>
            <div className="space-y-1.5">
              <Label>Deadline <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input type="date" className="bg-secondary/50" {...register("deadline")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Apply Link</Label>
            <Input placeholder="https://..." className="bg-secondary/50" {...register("apply_link")} />
            {errors.apply_link && <p className="text-xs text-destructive">{errors.apply_link.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              placeholder="Role overview, skills required, perks..."
              className="bg-secondary/50 resize-none"
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Notify toggle — only on create */}
          {!editing && (
            <button
              type="button"
              onClick={() => setNotifyStudents(v => !v)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                notifyStudents
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                  : "border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Bell className={cn("h-4 w-4 flex-shrink-0", notifyStudents && "fill-amber-400")} />
              <span className="flex-1 text-left">
                {notifyStudents ? "Email notification ON — all students will be notified" : "Notify all students via email"}
              </span>
              <span className={cn(
                "ml-auto w-9 h-5 rounded-full border-2 transition-colors flex items-center px-0.5",
                notifyStudents ? "bg-amber-500 border-amber-500" : "bg-transparent border-border"
              )}>
                <span className={cn(
                  "w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200",
                  notifyStudents ? "translate-x-4" : "translate-x-0"
                )} />
              </span>
            </button>
          )}

          <DialogFooter className="gap-2 flex-row justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editing ? "Save Changes" : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Job | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    api.get("/jobs/admin")
      .then((res) => setJobs(res.data))
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false))
  }, [])

  function handleSaved(job: Job) {
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === job.id)
      if (idx !== -1) { const n = [...prev]; n[idx] = job; return n }
      return [job, ...prev]
    })
  }

  async function handleDelete(job: Job) {
    if (!confirm(`Delete "${job.title}"?`)) return
    setDeletingId(job.id)
    try {
      await api.delete(`/jobs/${job.id}`)
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
      toast.success("Job deleted")
    } catch {
      toast.error("Failed to delete job")
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(job: Job) {
    try {
      const res = await api.patch(`/jobs/${job.id}`, { is_active: !job.is_active })
      handleSaved(res.data)
      toast.success(res.data.is_active ? "Job activated" : "Job deactivated")
    } catch {
      toast.error("Failed to update job")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-1">Post opportunities visible only to your college students</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={() => { setEditing(null); setDialogOpen(true) }}
        >
          <Plus className="h-4 w-4" />
          Post Job
        </Button>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{jobs.filter((j) => j.is_active).length} active</span>
          <span>·</span>
          <span>{jobs.filter((j) => !j.is_active).length} inactive</span>
          <span>·</span>
          <span>{jobs.length} total</span>
        </div>
      )}

      {/* Job list */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </GlassCard>
            ))
          : jobs.length === 0
          ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground">No jobs posted yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-6">Post opportunities for your students</p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => { setEditing(null); setDialogOpen(true) }}
                >
                  <Plus className="h-4 w-4" />
                  Post First Job
                </Button>
              </div>
            )
          : jobs.map((job) => {
              const tc = typeConfig[job.type] ?? typeConfig["full-time"]
              return (
                <GlassCard
                  key={job.id}
                  className={cn("transition-opacity", !job.is_active && "opacity-50")}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0 self-start">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <Badge variant="outline" className={cn("text-xs border", tc.color)}>
                          {tc.label}
                        </Badge>
                        {!job.is_active && (
                          <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {job.company}
                        </span>
                        {job.experience && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {job.experience}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                        <a
                          href={job.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> Apply Link
                        </a>
                      </div>
                      {job.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{job.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 hover:border-white/20 text-xs"
                        onClick={() => handleToggleActive(job)}
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {job.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 hover:border-primary/40 hover:text-primary"
                        onClick={() => { setEditing(job); setDialogOpen(true) }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 hover:border-red-500/40 hover:text-red-400"
                        onClick={() => handleDelete(job)}
                        disabled={deletingId === job.id}
                      >
                        {deletingId === job.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />
                        }
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
      </div>

      <JobFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
        editing={editing}
      />
    </div>
  )
}
