"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import {
  Briefcase, Building2, Clock, ExternalLink, Calendar,
  Search, Filter, Flame
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface Job {
  id: number
  title: string
  company: string
  type: "internship" | "full-time" | "part-time" | "contract"
  experience: string | null
  apply_link: string
  deadline: string | null
  description: string | null
  created_at: string
}

const typeConfig: Record<string, { label: string; color: string }> = {
  "internship":  { label: "Internship",  color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  "full-time":   { label: "Full-Time",   color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  "part-time":   { label: "Part-Time",   color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  "contract":    { label: "Contract",    color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
}

function daysUntil(isoDate: string): number {
  return Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86400000)
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return null
  const days = daysUntil(deadline)
  if (days < 0) return <span className="text-xs text-red-400">Expired</span>
  if (days === 0) return <span className="text-xs font-semibold text-red-400 animate-pulse">Closes today!</span>
  if (days <= 3) return <span className="text-xs font-medium text-amber-400 flex items-center gap-1"><Flame className="h-3 w-3" />{days}d left</span>
  return (
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      {new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
    </span>
  )
}

const ALL_TYPES = ["all", "internship", "full-time", "part-time", "contract"] as const
type Filter = typeof ALL_TYPES[number]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    api.get("/jobs/")
      .then((res) => setJobs(res.data))
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false))
  }, [])

  const visible = jobs.filter((j) => {
    const matchType = filter === "all" || j.type === filter
    const q = search.toLowerCase()
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
    return matchType && matchSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-2">Opportunities shared by your college — apply before the deadline</p>
        </div>
        <FeedbackModal compact triggerClassName="text-muted-foreground hover:text-primary mt-1 flex-shrink-0" />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title or company..."
            className="pl-9 bg-secondary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
                filter === t
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-secondary/30 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              {t === "all" ? "All Types" : typeConfig[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{visible.length} {visible.length === 1 ? "job" : "jobs"} found</span>
        </div>
      )}

      {/* Job cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <GlassCard key={i} className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-8 w-full rounded-lg mt-2" />
              </GlassCard>
            ))
          : visible.map((job) => {
              const tc = typeConfig[job.type] ?? typeConfig["full-time"]
              return (
                <motion.div
                  key={job.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                >
                  <GlassCard hover className="flex flex-col gap-4 h-full">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className={cn("text-xs border ml-auto", tc.color)}>
                        {tc.label}
                      </Badge>
                    </div>

                    {/* Title & company */}
                    <div>
                      <h3 className="font-semibold text-foreground text-base leading-snug">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                        {job.company}
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 text-xs">
                      {job.experience && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.experience}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <DeadlineBadge deadline={job.deadline} />
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    )}

                    {/* Apply button */}
                    <div className="mt-auto pt-2">
                      <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                          Apply Now
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
      </motion.div>

      {!loading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-foreground">No jobs found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || filter !== "all" ? "Try adjusting your filters" : "Your college hasn't posted any jobs yet"}
          </p>
        </div>
      )}
    </div>
  )
}
