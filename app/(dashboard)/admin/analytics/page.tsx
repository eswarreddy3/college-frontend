"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Users, TrendingUp, Flame, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

interface BranchStat {
  branch: string
  avgPoints: number
  count: number
}

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  branch_stats: BranchStat[]
  top_students: { id: number; name: string; points: number; streak: number; branch: string }[]
}

const COLORS = ["#8B5CF6", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981"]

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/analytics")
      .then((res) => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed performance insights for your college</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.total_students ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.active_this_week ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.avg_streak ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Avg Streak (days)</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Star className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.avg_points?.toLocaleString() ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise avg points */}
        <GlassCard>
          <h3 className="font-semibold font-serif mb-4 text-foreground">Branch-wise Avg Points</h3>
          {analytics && analytics.branch_stats.length > 0 ? (
            <ChartContainer
              config={{ avgPoints: { label: "Avg Points", color: "#8B5CF6" } }}
              className="h-[260px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.branch_stats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#8B92A5" fontSize={12} />
                  <YAxis dataKey="branch" type="category" stroke="#8B92A5" fontSize={12} width={65} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgPoints" radius={[0, 4, 4, 0]}>
                    {analytics.branch_stats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No branch data available</p>
          )}
        </GlassCard>

        {/* Branch student count */}
        <GlassCard>
          <h3 className="font-semibold font-serif mb-4 text-foreground">Students per Branch</h3>
          {analytics && analytics.branch_stats.length > 0 ? (
            <ChartContainer
              config={{ count: { label: "Students", color: "#3B82F6" } }}
              className="h-[260px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.branch_stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="branch" stroke="#8B92A5" fontSize={12} />
                  <YAxis stroke="#8B92A5" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {analytics.branch_stats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No branch data available</p>
          )}
        </GlassCard>
      </div>

      {/* Top 10 leaderboard */}
      <GlassCard>
        <h3 className="font-semibold font-serif mb-4 text-foreground">Top 10 Students by Points</h3>
        {analytics && analytics.top_students.length > 0 ? (
          <div className="space-y-3">
            {analytics.top_students.map((s, i) => (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <span className={`text-sm font-bold w-6 text-center ${i < 3 ? "text-amber-400" : "text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-muted-foreground">{s.streak}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{s.points.toLocaleString()} pts</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">No students yet</p>
        )}
      </GlassCard>
    </div>
  )
}
