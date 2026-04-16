"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Users, TrendingUp, Flame, Star, Mail, AlertTriangle,
  Crown, Trophy, Zap,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"

interface Analytics {
  branch: string
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  engagement_rate: number
  inactive_count: number
  section_stats: { section: string; avgPoints: number; count: number }[]
  year_stats: { year: string | number; avgPoints: number; count: number }[]
  inactive_students: { id: number; name: string; email: string; section: string | null; roll_number: string | null; last_active: string | null }[]
  top_students: { id: number; name: string; points: number; streak: number; section: string | null }[]
}

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const MEDALS = ["🥇", "🥈", "🥉"]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function BranchAdminDashboard() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)

  useEffect(() => {
    api.get("/branch-admin/analytics")
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  async function sendReminder(id: number, name: string) {
    setRemindingId(id)
    try {
      await api.post(`/branch-admin/students/${id}/remind`)
      toast.success(`Reminder sent to ${name}`)
    } catch {
      toast.error("Failed to send reminder")
    } finally {
      setRemindingId(null)
    }
  }

  const stats = analytics ? [
    { label: "Total Students", value: analytics.total_students, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active This Week", value: analytics.active_this_week, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
    { label: "Avg Streak", value: `${analytics.avg_streak}d`, icon: Flame, color: "text-streak", bg: "bg-streak/10" },
    { label: "Avg Points", value: analytics.avg_points.toLocaleString(), icon: Star, color: "text-warning", bg: "bg-warning/10" },
    { label: "Engagement Rate", value: `${analytics.engagement_rate}%`, icon: Zap, color: "text-coding", bg: "bg-coding/10" },
    { label: "Inactive Students", value: analytics.inactive_count, icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10" },
  ] : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">
            {analytics?.branch ?? user?.branch ?? "Branch"} Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview for {user?.college_name ?? "your college"} — {analytics?.branch ?? user?.branch} branch
          </p>
        </div>
        <Link href="/branch-admin/students">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Users className="h-4 w-4" />
            View All Students
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <GlassCard key={i} className="animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-secondary/60 mb-3" />
                <div className="h-7 w-16 bg-secondary/60 rounded mb-1.5" />
                <div className="h-3 w-20 bg-secondary/40 rounded" />
              </GlassCard>
            ))
          : stats.map((s, i) => (
              <motion.div key={s.label} variants={cardVariants} initial="hidden" animate="visible" custom={i}>
                <GlassCard hover>
                  <div className={`p-2.5 rounded-xl ${s.bg} w-fit mb-3`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </GlassCard>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top students */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-warning" />
              <h2 className="font-semibold text-foreground">Top Students</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-secondary/60" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-28 bg-secondary/60 rounded" />
                      <div className="h-2 w-16 bg-secondary/40 rounded" />
                    </div>
                    <div className="h-3 w-14 bg-secondary/40 rounded" />
                  </div>
                ))}
              </div>
            ) : analytics?.top_students.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No students yet</p>
            ) : (
              <div className="space-y-2.5">
                {analytics!.top_students.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-lg w-7 text-center flex-shrink-0">
                      {i < 3 ? MEDALS[i] : <span className="text-sm text-muted-foreground font-semibold">{i + 1}</span>}
                    </span>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                      {s.section && <p className="text-xs text-muted-foreground">Section {s.section}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-xs flex-shrink-0">
                      <span className="flex items-center gap-1 text-warning">
                        <Star className="h-3 w-3" />{s.points.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-streak">
                        <Flame className="h-3 w-3" />{s.streak}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Section stats */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Section-wise Performance</h2>
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3 w-20 bg-secondary/60 rounded" />
                      <div className="h-3 w-16 bg-secondary/40 rounded" />
                    </div>
                    <div className="h-2 bg-secondary/60 rounded-full" />
                  </div>
                ))}
              </div>
            ) : analytics?.section_stats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No section data</p>
            ) : (
              <div className="space-y-4">
                {analytics!.section_stats.map((s) => {
                  const maxPts = Math.max(...analytics!.section_stats.map(x => x.avgPoints), 1)
                  return (
                    <div key={s.section}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium text-foreground">Section {s.section}</span>
                        <span className="text-muted-foreground text-xs">{s.count} students · avg {s.avgPoints} pts</span>
                      </div>
                      <Progress value={(s.avgPoints / maxPts) * 100} className="h-2" />
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Inactive students */}
      {!loading && analytics && analytics.inactive_count > 0 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <h2 className="font-semibold text-foreground">Inactive Students</h2>
              <Badge className="bg-danger/15 text-danger border-danger/30 text-xs ml-auto">
                {analytics.inactive_count} students
              </Badge>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {analytics.inactive_students.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/40 transition-colors">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-danger/20 text-danger text-xs font-bold">
                      {s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.section ? `Section ${s.section} · ` : ""}{formatLastActive(s.last_active)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-danger/30 text-danger hover:bg-danger/10 text-xs flex-shrink-0"
                    onClick={() => sendReminder(s.id, s.name)}
                    disabled={remindingId === s.id}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Remind
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
