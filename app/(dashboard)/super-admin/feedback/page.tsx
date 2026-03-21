"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Star, Loader2, Building2, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface FeedbackItem {
  id: number
  title: string
  message: string
  category: string
  rating: number | null
  created_at: string
  student: {
    id: number
    name: string
    email: string
    roll_number: string
    branch: string
    section: string
    college: string
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  general:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  bug:      "bg-red-500/15 text-red-400 border-red-500/30",
  feature:  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  content:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ui:       "bg-pink-500/15 text-pink-400 border-pink-500/30",
  other:    "bg-secondary text-muted-foreground border-border",
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "General", bug: "Bug Report", feature: "Feature Request",
  content: "Content", ui: "UI / Design", other: "Other",
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-xs text-muted-foreground/50">No rating</span>
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} className={cn("h-3.5 w-3.5", n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20")} />
      ))}
    </div>
  )
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function SuperAdminFeedbackPage() {
  const [items,    setItems]    = useState<FeedbackItem[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState("")
  const [category, setCategory] = useState("all")
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams({ per_page: "200" })
    if (category !== "all") params.set("category", category)
    if (search)             params.set("search", search)

    const t = setTimeout(() => {
      setLoading(true)
      api.get(`/super-admin/feedback?${params}`)
        .then(res => { setItems(res.data.feedback); setTotal(res.data.total) })
        .catch(() => toast.error("Failed to load feedback"))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [search, category])

  const avgRating = useMemo(() => {
    const rated = items.filter(i => i.rating)
    if (!rated.length) return null
    return (rated.reduce((s, i) => s + (i.rating ?? 0), 0) / rated.length).toFixed(1)
  }, [items])

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {}
    items.forEach(i => { m[i.category] = (m[i.category] || 0) + 1 })
    return m
  }, [items])

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-serif text-foreground">Student Feedback</h1>
        <p className="text-muted-foreground mt-1">All feedback submitted by students across colleges</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",      value: total,      color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Avg Rating", value: avgRating ? `★ ${avgRating}` : "—", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Bug Reports",   value: categoryCounts['bug'] || 0,     color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
          { label: "Feature Reqs", value: categoryCounts['feature'] || 0, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
        ].map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-3 p-3 rounded-xl border ${s.bg}`}
          >
            <div>
              <p className={`text-lg font-bold leading-tight ${s.color}`}>{loading ? "—" : s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <GlassCard>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, roll no, title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50 border-border text-foreground"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-secondary/50 border-border text-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <p className="text-muted-foreground text-sm">No feedback yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border border-border/60 rounded-xl overflow-hidden"
              >
                {/* Header row */}
                <button
                  className="w-full p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                >
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-secondary text-xs">
                      {item.student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground">{item.student.name}</span>
                      <span className="text-xs text-muted-foreground">{item.student.roll_number}</span>
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border", CATEGORY_COLORS[item.category])}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Building2 className="h-3 w-3" /> {item.student.college}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <GraduationCap className="h-3 w-3" />
                        {item.student.branch}
                        {item.student.section !== "—" ? ` / ${item.student.section}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StarRating rating={item.rating} />
                    <span className="text-[10px] text-muted-foreground">{fmtDate(item.created_at)}</span>
                  </div>
                </button>

                {/* Expanded message */}
                {expanded === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 pt-0"
                  >
                    <div className="bg-secondary/40 rounded-lg p-3 border border-border/40">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">Message</p>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.student.email}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4 text-right">
            Showing {items.length} of {total} feedback entries
          </p>
        )}
      </GlassCard>
    </div>
  )
}
