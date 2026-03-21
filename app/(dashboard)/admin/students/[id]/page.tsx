"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts"
import {
  ArrowLeft, Star, Flame, Brain, Code2, FileText, BookOpen,
  CheckCircle, XCircle, Clock, Github, Linkedin, Phone,
  Mail, Calendar, Activity, Loader2, TrendingUp, Target, Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { generateStudentPDF, type StudentPerformance as Performance } from "@/lib/student-report"

interface ActivityEvent {
  type: string; action: string; details: Record<string, unknown>; timestamp: string
}
interface ActivityDay { date: string; events: ActivityEvent[] }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}
function fmtDayHeader(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (d.getTime() === today.getTime()) return "Today"
  if (d.getTime() === yesterday.getTime()) return "Yesterday"
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
}

const DIFF_COLORS: Record<string, string> = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" }
const BAR_COLORS = ["#8B5CF6", "#3B82F6", "#F59E0B", "#EC4899", "#10B981", "#06B6D4"]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActivityIcon({ type, details }: { type: string; details: Record<string, unknown> }) {
  if (type === "mcq") {
    return details.is_correct
      ? <CheckCircle className="h-4 w-4 text-emerald-400" />
      : <XCircle className="h-4 w-4 text-red-400" />
  }
  if (type === "coding") {
    return (details.status as string) === "accepted"
      ? <CheckCircle className="h-4 w-4 text-emerald-400" />
      : <Code2 className="h-4 w-4 text-orange-400" />
  }
  if (type === "lesson") return <BookOpen className="h-4 w-4 text-blue-400" />
  if (type === "assignment") return <FileText className="h-4 w-4 text-violet-400" />
  return <Activity className="h-4 w-4 text-muted-foreground" />
}

function ActivityCard({ event }: { event: ActivityEvent }) {
  const d = event.details
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-lg bg-secondary/60 flex-shrink-0">
        <ActivityIcon type={event.type} details={d} />
      </div>
      <div className="flex-1 min-w-0">
        {event.type === "mcq" && (
          <>
            <p className="text-sm font-medium text-foreground">
              MCQ — {String(d.topic)}{d.subtopic ? ` › ${String(d.subtopic)}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {d.is_correct ? <span className="text-emerald-400">Correct</span> : <span className="text-red-400">Wrong</span>}
              {typeof d.points_earned === "number" && d.points_earned > 0 && (
                <span className="ml-1 text-amber-400">+{String(d.points_earned)} pts</span>
              )}
            </p>
          </>
        )}
        {event.type === "coding" && (
          <>
            <p className="text-sm font-medium text-foreground">{String(d.problem_title)}</p>
            <p className="text-xs text-muted-foreground">
              <span className={cn(
                d.status === "accepted" ? "text-emerald-400" :
                d.status === "wrong_answer" ? "text-red-400" : "text-orange-400"
              )}>
                {String(d.status).replace("_", " ")}
              </span>
              {" · "}{String(d.language)}{" · "}
              <span style={{ color: DIFF_COLORS[String(d.difficulty)] ?? "#8B92A5" }}>{String(d.difficulty)}</span>
            </p>
          </>
        )}
        {event.type === "lesson" && (
          <>
            <p className="text-sm font-medium text-foreground">{String(d.lesson_title)}</p>
            <p className="text-xs text-muted-foreground">
              Lesson completed
              {typeof d.points_earned === "number" && d.points_earned > 0 && (
                <span className="ml-1 text-amber-400">+{String(d.points_earned)} pts</span>
              )}
            </p>
          </>
        )}
        {event.type === "assignment" && (
          <>
            <p className="text-sm font-medium text-foreground">{String(d.module_id)}</p>
            <p className="text-xs text-muted-foreground">
              Score {String(d.correct_count)}/{String(d.total_questions)} ({String(d.percentage)}%)
            </p>
          </>
        )}
        {event.type === "log" && (
          <p className="text-sm text-muted-foreground">{event.action}</p>
        )}
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0">{fmtTime(event.timestamp)}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentPerformancePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [perf, setPerf] = useState<Performance | null>(null)
  const [perfLoading, setPerfLoading] = useState(true)
  const [activity, setActivity] = useState<ActivityDay[]>([])
  const [activityTotal, setActivityTotal] = useState(0)
  const [activityLoading, setActivityLoading] = useState(false)
  const [days, setDays] = useState(30)

  useEffect(() => {
    api.get(`/admin/students/${id}/performance`)
      .then(res => setPerf(res.data))
      .catch(() => toast.error("Failed to load student performance"))
      .finally(() => setPerfLoading(false))
  }, [id])

  function loadActivity(d: number) {
    setDays(d)
    setActivityLoading(true)
    api.get(`/admin/students/${id}/activity?days=${d}`)
      .then(res => { setActivity(res.data.activity); setActivityTotal(res.data.total_events) })
      .catch(() => toast.error("Failed to load activity"))
      .finally(() => setActivityLoading(false))
  }

  if (perfLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!perf) return null

  const { student, mcq, coding, assignments, lessons } = perf

  return (
    <div className="space-y-6">
      {/* Back + Download */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Students
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => generateStudentPDF(perf)}
        >
          <Download className="h-4 w-4" /> Download Report PDF
        </Button>
      </div>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold font-serif text-foreground">{student.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />{student.email}
                </span>
                {student.roll_number && <span className="text-sm text-muted-foreground">Roll: {student.roll_number}</span>}
                {student.branch && (
                  <span className="text-sm text-muted-foreground">
                    {student.branch}{student.section ? ` / ${student.section}` : ""}
                  </span>
                )}
                {student.passout_year && <span className="text-sm text-muted-foreground">Batch {student.passout_year}</span>}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {student.phone && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />{student.phone}
                  </span>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noreferrer"
                    className="text-xs text-[#0A66C2] flex items-center gap-1 hover:underline">
                    <Linkedin className="h-3 w-3" />LinkedIn
                  </a>
                )}
                {student.github && (
                  <a href={student.github} target="_blank" rel="noreferrer"
                    className="text-xs text-foreground flex items-center gap-1 hover:underline">
                    <Github className="h-3 w-3" />GitHub
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-col gap-2 sm:text-right">
              <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
                <Star className="h-3 w-3" />{student.points.toLocaleString()} pts
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 gap-1">
                <Flame className="h-3 w-3" />{student.streak} day streak
              </Badge>
              {student.last_active && (
                <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3" />Active {fmtDate(student.last_active)}
                </span>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Points", value: student.points.toLocaleString(), icon: Star, color: "text-amber-400", bg: "bg-amber-500/15" },
          { label: "Streak", value: `${student.streak}d`, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/15" },
          { label: "MCQ Accuracy", value: `${mcq.accuracy}%`, icon: Brain, color: "text-violet-400", bg: "bg-violet-500/15" },
          { label: "Lessons Done", value: lessons.completed, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/15" },
          { label: "Problems Solved", value: coding.problems_solved, icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/15" },
          { label: "Assignments", value: assignments.total, icon: FileText, color: "text-pink-400", bg: "bg-pink-500/15" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-4">
              <div className={`p-2 rounded-lg ${s.bg} w-fit mb-2`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-bold font-serif ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" onValueChange={(v) => { if (v === "activity" && activity.length === 0) loadActivity(days) }}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="overview" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" />Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MCQ */}
            <GlassCard className="min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold font-serif text-foreground">MCQ Performance</h3>
                <Badge className="ml-auto bg-violet-500/20 text-violet-400 border-violet-500/30 text-xs">
                  {mcq.correct}/{mcq.total} correct
                </Badge>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8B5CF6" strokeWidth="3"
                      strokeDasharray={`${mcq.accuracy} ${100 - mcq.accuracy}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-violet-400">{mcq.accuracy}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total: <span className="text-foreground font-medium">{mcq.total}</span></p>
                  <p className="text-sm text-muted-foreground">Correct: <span className="text-emerald-400 font-medium">{mcq.correct}</span></p>
                  <p className="text-sm text-muted-foreground">Wrong: <span className="text-red-400 font-medium">{mcq.total - mcq.correct}</span></p>
                </div>
              </div>
              {mcq.topics.length > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Topic-wise accuracy</p>
                  <ChartContainer config={{ accuracy: { label: "Accuracy %", color: "#8B5CF6" } }} className="h-[200px] w-full">
                    <BarChart data={mcq.topics.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                      <XAxis type="number" domain={[0, 100]} stroke="#8B92A5" fontSize={10} tickFormatter={v => `${v}%`} />
                      <YAxis dataKey="topic" type="category" stroke="#8B92A5" fontSize={10} width={70} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="accuracy" radius={[0, 3, 3, 0]}>
                        {mcq.topics.slice(0, 8).map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No MCQ attempts yet</p>
              )}
            </GlassCard>

            {/* Coding */}
            <GlassCard className="min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold font-serif text-foreground">Coding</h3>
                <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  {coding.problems_solved} solved
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {coding.difficulty_breakdown.map(d => (
                  <div key={d.difficulty} className="rounded-lg bg-secondary/50 p-3 text-center">
                    <p className="text-lg font-bold" style={{ color: DIFF_COLORS[d.difficulty] }}>{d.solved}</p>
                    <p className="text-xs text-muted-foreground">{d.difficulty}</p>
                    <p className="text-xs text-muted-foreground/60">{d.attempted} tried</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Recent submissions</p>
              {coding.recent.length > 0 ? (
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {coding.recent.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 text-xs">
                      {s.status === "accepted"
                        ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        : <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                      }
                      <span className="flex-1 truncate text-foreground">{s.problem_title}</span>
                      <span style={{ color: DIFF_COLORS[s.difficulty] ?? "#8B92A5" }} className="flex-shrink-0">{s.difficulty}</span>
                      <span className="text-muted-foreground flex-shrink-0">{s.language}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No submissions yet</p>
              )}
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignments */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-pink-400" />
                <h3 className="font-semibold font-serif text-foreground">Assignments</h3>
                <Badge className="ml-auto bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
                  {assignments.total} attempted · avg {assignments.avg_percentage}%
                </Badge>
              </div>
              {assignments.list.length > 0 ? (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {assignments.list.map((a, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground truncate max-w-[65%]">{a.module_id}</span>
                        <span className={cn("text-xs font-semibold",
                          a.percentage >= 80 ? "text-emerald-400" : a.percentage >= 50 ? "text-amber-400" : "text-red-400"
                        )}>
                          {a.correct_count}/{a.total_questions} ({a.percentage}%)
                        </span>
                      </div>
                      <Progress value={a.percentage} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(a.completed_at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No assignments attempted</p>
              )}
            </GlassCard>

            {/* Course Progress */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold font-serif text-foreground">Course Progress</h3>
                <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {lessons.completed} lessons done
                </Badge>
              </div>
              {lessons.courses.length > 0 ? (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {lessons.courses.map((c, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground truncate max-w-[65%]">{c.course_title}</span>
                        <span className="text-xs text-muted-foreground">{c.completed}/{c.total}</span>
                      </div>
                      <Progress value={c.percentage} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-0.5">{c.percentage}% complete</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No courses started</p>
              )}
            </GlassCard>
          </div>
        </TabsContent>

        {/* Activity Log */}
        <TabsContent value="activity" className="mt-4">
          <GlassCard>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold font-serif text-foreground">Activity Log</h3>
                {activityTotal > 0 && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">{activityTotal} events</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show last:</span>
                {[7, 14, 30, 60].map(d => (
                  <Button key={d} size="sm"
                    variant={days === d ? "default" : "outline"}
                    className={cn("h-7 px-3 text-xs", days === d
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => loadActivity(d)}
                    disabled={activityLoading}
                  >
                    {d}d
                  </Button>
                ))}
              </div>
            </div>

            {activityLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Target className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No activity in the last {days} days</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1">
                {activity.map((day) => (
                  <div key={day.date}>
                    <div className="flex items-center gap-3 mb-2 sticky top-0 bg-card/80 backdrop-blur-sm py-1 z-10">
                      <div className="h-px flex-1 bg-border/50" />
                      <span className="text-xs font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/70 whitespace-nowrap">
                        {fmtDayHeader(day.date)}
                        <span className="ml-1.5 opacity-60">({day.events.length})</span>
                      </span>
                      <div className="h-px flex-1 bg-border/50" />
                    </div>
                    <div>
                      {day.events.map((event, i) => <ActivityCard key={i} event={event} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
