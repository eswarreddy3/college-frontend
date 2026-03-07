"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/stats-card"
import { StreakCalendar } from "@/components/streak-calendar"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Flame, Code, FileQuestion, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

interface DashboardData {
  points: number
  streak: number
  rank: number
  total_in_college: number
  solved_count: number
  active_days: number[]
  recent_activity: {
    id: number
    action: string
    details: Record<string, any> | null
    created_at: string
  }[]
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function DashboardPage() {
  const { user, updateUser } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/student/dashboard")
      .then((res) => {
        setData(res.data)
        // Sync points from DB into authStore so sidebar reflects real value
        updateUser({ points: res.data.points })
      })
      .catch(() => toast.error("Failed to load dashboard"))
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
      {/* Hero Section */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">
          Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] ?? "Student"}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Continue your placement preparation journey</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Points"
          value={data?.points.toLocaleString() ?? "0"}
          icon={Star}
          iconColor="text-amber-500"
        />
        <StatsCard
          title="Problems Solved"
          value={data?.solved_count ?? 0}
          icon={Code}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Current Streak"
          value={data?.streak ?? 0}
          suffix="days"
          icon={Flame}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="College Rank"
          value={data ? `#${data.rank}` : "—"}
          icon={Trophy}
          iconColor="text-primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-lg font-semibold font-serif text-foreground mb-4">Recent Activity</h2>
            {data && data.recent_activity.length > 0 ? (
              <div className="space-y-3">
                {data.recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      {activity.details?.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.details.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {activity.details?.points && (
                        <p className="text-xs font-medium text-primary">+{activity.details.points} pts</p>
                      )}
                      <p className="text-xs text-muted-foreground">{timeAgo(activity.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Code className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No activity yet</p>
                <p className="text-xs text-muted-foreground/70">Start solving problems to see your activity here</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-semibold font-serif mb-4 text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/coding">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                >
                  <Code className="h-5 w-5 text-primary" />
                  Solve a Problem
                </Button>
              </Link>
              <Link href="/practice-mcq">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                >
                  <FileQuestion className="h-5 w-5 text-amber-500" />
                  Practice MCQ
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                >
                  <Trophy className="h-5 w-5 text-purple-400" />
                  View Leaderboard
                  {data && (
                    <span className="ml-auto text-xs text-muted-foreground">#{data.rank}</span>
                  )}
                </Button>
              </Link>
            </div>
          </GlassCard>

          {/* Mini stats */}
          {data && (
            <GlassCard>
              <h3 className="font-semibold font-serif mb-3 text-foreground text-sm">Your Standing</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rank in college</span>
                  <span className="font-medium text-foreground">#{data.rank} / {data.total_in_college}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Problems solved</span>
                  <span className="font-medium text-foreground">{data.solved_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current streak</span>
                  <span className="font-medium text-foreground">{data.streak} days</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar
        activeDays={data?.active_days ?? []}
        currentStreak={data?.streak ?? 0}
      />
    </div>
  )
}
