"use client"

import { useState, useEffect, useCallback } from "react"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  Package,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Code2,
  ClipboardList,
  UserPlus,
  Globe,
  Brain,
  Layers,
  FileQuestion,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface Stats {
  total_colleges: number
  active_colleges: number
  total_students: number
  total_packages: number
  content: {
    courses: number
    lessons: number
    domains: number
    mcq_questions: number
    aptitude_questions: number
    coding_problems: number
  }
  top_colleges: { id: number; name: string; location: string; package: string | null; student_count: number }[]
  activity_week: {
    new_students: number
    lessons_completed: number
    code_submissions: number
    assignment_submissions: number
  }
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/super-admin/overview")
      setStats(res.data)
    } catch {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const statCards = [
    { label: "Total Colleges", value: stats?.total_colleges ?? "—", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Active Colleges", value: stats?.active_colleges ?? "—", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { label: "Total Students", value: stats?.total_students?.toLocaleString() ?? "—", icon: Users, color: "text-primary", bg: "bg-primary/20" },
    { label: "Active Packages", value: stats?.total_packages ?? "—", icon: Package, color: "text-purple-400", bg: "bg-purple-500/20" },
  ]

  const activityItems = [
    { label: "New Students", value: stats?.activity_week.new_students ?? "—", icon: UserPlus, color: "text-primary" },
    { label: "Lessons Completed", value: stats?.activity_week.lessons_completed ?? "—", icon: BookOpen, color: "text-blue-400" },
    { label: "Code Submissions", value: stats?.activity_week.code_submissions ?? "—", icon: Code2, color: "text-purple-400" },
    { label: "Assignments Submitted", value: stats?.activity_week.assignment_submissions ?? "—", icon: ClipboardList, color: "text-amber-400" },
  ]

  const contentItems = [
    { label: "Courses", value: stats?.content.courses ?? "—", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Lessons", value: stats?.content.lessons ?? "—", icon: Layers, color: "text-indigo-400", bg: "bg-indigo-500/20" },
    { label: "Domains", value: stats?.content.domains ?? "—", icon: Globe, color: "text-teal-400", bg: "bg-teal-500/20" },
    { label: "MCQ Questions", value: stats?.content.mcq_questions ?? "—", icon: FileQuestion, color: "text-amber-400", bg: "bg-amber-500/20" },
    { label: "Aptitude Questions", value: stats?.content.aptitude_questions ?? "—", icon: Brain, color: "text-pink-400", bg: "bg-pink-500/20" },
    { label: "Coding Problems", value: stats?.content.coding_problems ?? "—", icon: Code2, color: "text-purple-400", bg: "bg-purple-500/20" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Super Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform-wide management and monitoring</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <GlassCard key={label}>
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", bg)}>
                <Icon className={cn("h-6 w-6", color)} />
              </div>
              <div>
                {loading ? (
                  <div className="h-7 w-16 bg-secondary/50 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
                )}
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Content Library */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-semibold font-serif text-foreground">Content Library</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {contentItems.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 text-center">
              <div className={cn("p-2 rounded-lg", bg)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              {loading ? (
                <div className="h-7 w-10 bg-secondary/50 rounded animate-pulse" />
              ) : (
                <p className="text-xl font-bold font-serif text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
              )}
              <p className="text-xs text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Colleges by Students */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">Top Colleges by Students</h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-secondary/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !stats?.top_colleges?.length ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No active colleges yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.top_colleges.map((college, idx) => (
                <div key={college.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/20 transition-colors">
                  <span className={cn(
                    "text-xs font-bold w-5 text-center",
                    idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-orange-400" : "text-muted-foreground"
                  )}>
                    #{idx + 1}
                  </span>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {college.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{college.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{college.location || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {college.package && (
                      <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30">
                        {college.package}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {college.student_count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Platform Activity — Last 7 Days */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold font-serif text-foreground">Platform Activity</h3>
            <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 ml-auto text-xs">
              Last 7 days
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {activityItems.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-4 rounded-xl bg-secondary/30 flex flex-col gap-2">
                <Icon className={cn("h-5 w-5", color)} />
                {loading ? (
                  <div className="h-8 w-12 bg-secondary/50 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
                )}
                <p className="text-xs text-muted-foreground leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
