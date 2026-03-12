"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Trophy, Flame, Medal, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface LeaderboardEntry {
  rank: number
  id: number
  name: string
  branch: string
  section: string
  points: number
  streak: number
  is_current_user: boolean
}

const podiumColors = {
  1: "from-amber-400 to-amber-600",
  2: "from-slate-300 to-slate-500",
  3: "from-orange-400 to-orange-600",
}

const podiumBorders = {
  1: "border-amber-400",
  2: "border-slate-400",
  3: "border-orange-400",
}

export default function LeaderboardPage() {
  const [scope, setScope] = useState("college")
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setLoading(true)
    api.get(`/student/leaderboard?scope=${scope}`)
      .then((res) => setEntries(res.data))
      .catch(() => toast.error("Failed to load leaderboard"))
      .finally(() => setLoading(false))
  }, [scope])

  const filtered = entries.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topThree = filtered.slice(0, 3)
  const restOfList = filtered.slice(3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Compete with your peers and climb the ranks</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={scope} onValueChange={setScope}>
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="college" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              College-wide
            </TabsTrigger>
            <TabsTrigger value="branch" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Branch
            </TabsTrigger>
            <TabsTrigger value="section" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Section
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No students found</p>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 2nd Place */}
              <GlassCard className={cn("order-2 md:order-1 relative overflow-hidden", topThree[1]?.is_current_user && "primary-glow")}>
                <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", podiumColors[2])} />
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="relative mb-4">
                    <Avatar className={cn("h-20 w-20 border-4", podiumBorders[2])}>
                      <AvatarFallback className="bg-secondary text-foreground text-xl">
                        {topThree[1]?.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-slate-300 to-slate-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-900">2</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {topThree[1]?.name}
                    {topThree[1]?.is_current_user && <span className="ml-1 text-xs text-primary">(You)</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">{topThree[1]?.branch}{topThree[1]?.section ? ` - ${topThree[1].section}` : ""}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{topThree[1]?.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-foreground">{topThree[1]?.streak}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* 1st Place */}
              <GlassCard className={cn("order-1 md:order-2 relative overflow-hidden", !topThree[0]?.is_current_user && "primary-glow")}>
                <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", podiumColors[1])} />
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="relative mb-4">
                    <Avatar className={cn("h-24 w-24 border-4", podiumBorders[1])}>
                      <AvatarFallback className="bg-secondary text-foreground text-2xl">
                        {topThree[0]?.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <Medal className="h-5 w-5 text-amber-900" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {topThree[0]?.name}
                    {topThree[0]?.is_current_user && <span className="ml-1 text-xs text-primary">(You)</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">{topThree[0]?.branch}{topThree[0]?.section ? ` - ${topThree[0].section}` : ""}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{topThree[0]?.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-foreground">{topThree[0]?.streak}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* 3rd Place */}
              <GlassCard className={cn("order-3 relative overflow-hidden", topThree[2]?.is_current_user && "primary-glow")}>
                <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", podiumColors[3])} />
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="relative mb-4">
                    <Avatar className={cn("h-20 w-20 border-4", podiumBorders[3])}>
                      <AvatarFallback className="bg-secondary text-foreground text-xl">
                        {topThree[2]?.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-900">3</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {topThree[2]?.name}
                    {topThree[2]?.is_current_user && <span className="ml-1 text-xs text-primary">(You)</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">{topThree[2]?.branch}{topThree[2]?.section ? ` - ${topThree[2].section}` : ""}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{topThree[2]?.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-foreground">{topThree[2]?.streak}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Full list */}
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Branch</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Points</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {(topThree.length >= 3 ? restOfList : filtered).map((entry) => (
                    <tr
                      key={entry.id}
                      className={cn(
                        "border-b border-border/50 transition-colors hover:bg-secondary/30",
                        entry.is_current_user && "bg-primary/10"
                      )}
                    >
                      <td className="py-3 px-4">
                        <span className={cn("text-sm font-medium", entry.is_current_user ? "text-primary" : "text-foreground")}>
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary text-foreground text-xs">
                              {entry.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={cn("text-sm font-medium", entry.is_current_user ? "text-primary" : "text-foreground")}>
                              {entry.name}
                              {entry.is_current_user && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {entry.branch}{entry.section ? ` - ${entry.section}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-sm text-muted-foreground">
                        {entry.branch}{entry.section ? ` - ${entry.section}` : ""}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium text-foreground">
                        {entry.points.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-sm text-foreground">{entry.streak}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}
