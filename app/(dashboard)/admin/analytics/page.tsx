"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell,
  Area, AreaChart, PieChart, Pie, Label,
} from "recharts"
import {
  Users, Flame, Loader2, Download, Trophy,
  AlertTriangle, BookOpen, Target, Activity,
  UserX, Send, Code2, GitBranch, ClipboardCheck, TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

/* ─── interfaces ─────────────────────────────────────────────────────────── */
interface ReadinessBucket  { range: string; label: string; count: number }
interface WeekPoint        { week: string; active: number }
interface MCQTopicStat     { topic: string; total: number; correct: number; accuracy: number }
interface CourseStat       { course_id: number; course_title: string; students_started: number; total_students: number; avg_completion_pct: number; total_lessons: number }
interface AtRiskStudent    { id: number; name: string; email: string; branch: string | null; section: string | null; roll_number: string | null; points: number; last_active: string | null }
interface TopStudent       { id: number; name: string; points: number; streak: number; branch: string | null }
interface BranchStat       { branch: string; avgPoints: number; count: number }
interface AssignmentMod    { module: string; attempts: number; passed: number; pass_rate: number; avg_score: number }
interface CodingDiff       { difficulty: string; solved: number; total: number }

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  engagement_rate: number
  zero_activity_count: number
  weekly_trend: WeekPoint[]
  mcq_topic_stats: MCQTopicStat[]
  course_completions: CourseStat[]
  readiness_buckets: ReadinessBucket[]
  at_risk_students: AtRiskStudent[]
  at_risk_count: number
  branch_stats: BranchStat[]
  assignment_module_stats: AssignmentMod[]
  coding_summary: CodingDiff[]
  total_coding_submissions: number
  top_students: TopStudent[]
}

/* ─── helpers ────────────────────────────────────────────────────────────── */
const MEDALS = ["🥇", "🥈", "🥉"]
const BRANCH_COLORS = ["#0E8080", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B"]

function daysSince(iso: string | null) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}
function accuracyColor(p: number) { return p >= 70 ? "#10B981" : p >= 40 ? "#F59E0B" : "#EF4444" }
function passColor(p: number)     { return p >= 70 ? "#10B981" : p >= 40 ? "#F59E0B" : "#EF4444" }
function readinessColor(i: number){ return ["#EF4444","#F59E0B","#0E8080","#10B981"][i] }
function diffColor(d: string)     { return d === "Easy" ? "#10B981" : d === "Medium" ? "#F59E0B" : "#EF4444" }

/* ─── count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(end: number, duration = 1100) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (end === 0) { setVal(0); return }
    let t0: number | null = null
    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setVal(Math.round((1 - (1 - p) ** 3) * end))
      if (p < 1) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [end, duration])
  return val
}

/* ─── animated number ────────────────────────────────────────────────────── */
function Num({ value, suffix = "" }: { value: number; suffix?: string }) {
  const v = useCountUp(value)
  return <>{v.toLocaleString()}{suffix}</>
}

/* ─── section wrapper (scroll reveal) ───────────────────────────────────── */
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── loading skeleton ───────────────────────────────────────────────────── */
function Skeleton() {
  const shimmer = "shimmer rounded-xl"
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className={`${shimmer} h-8 w-40`} />
          <div className={`${shimmer} h-4 w-72`} />
        </div>
        <div className={`${shimmer} h-9 w-28`} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${shimmer} h-[72px]`} style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`lg:col-span-3 ${shimmer} h-64`} />
        <div className={`lg:col-span-2 ${shimmer} h-64`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${shimmer} h-72`} />
        <div className={`${shimmer} h-72`} />
      </div>
      <div className={`${shimmer} h-56`} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`lg:col-span-3 ${shimmer} h-64`} />
        <div className={`lg:col-span-2 ${shimmer} h-64`} />
      </div>
    </div>
  )
}

/* ─── page ───────────────────────────────────────────────────────────────── */
export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading]     = useState(true)
  const [reminding, setReminding] = useState<number | null>(null)

  useEffect(() => {
    api.get("/admin/analytics")
      .then(res => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  async function sendRemind(s: AtRiskStudent) {
    setReminding(s.id)
    try {
      await api.post(`/admin/students/${s.id}/remind`)
      toast.success(`Reminder sent to ${s.name}`)
    } catch { toast.error("Failed to send reminder") }
    finally  { setReminding(null) }
  }

  function exportCSV() {
    if (!analytics) return
    const rows = [
      ["Name", "Branch", "Points", "Streak"],
      ...analytics.top_students.map(s => [`"${s.name}"`, `"${s.branch || ""}"`, s.points, s.streak]),
    ]
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a"); a.href = url; a.download = "top_students.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Skeleton />

  const a = { branch_stats: [] as BranchStat[], assignment_module_stats: [] as AssignmentMod[], coding_summary: [] as CodingDiff[], total_coding_submissions: 0, ...analytics! }

  const avgCoursePct = a.course_completions.length
    ? Math.round(a.course_completions.reduce((s, c) => s + c.avg_completion_pct, 0) / a.course_completions.length) : 0
  const totalCodingSolved = a.coding_summary.reduce((s, d) => s + d.solved, 0)
  const maxPts = a.top_students[0]?.points || 1

  const statCards = [
    { label: "Total Students",   value: a.total_students,   suffix: "",  icon: Users,         bg: "bg-blue-500/10",    text: "text-blue-500"    },
    { label: "Active This Week", value: a.active_this_week, suffix: "",  icon: Activity,      bg: "bg-emerald-500/10", text: "text-emerald-500", live: true },
    { label: "Avg Streak",       value: a.avg_streak,       suffix: "d", icon: Flame,         bg: "bg-orange-500/10",  text: "text-orange-500"  },
    { label: "At Risk (14d)",    value: a.at_risk_count,    suffix: "",  icon: AlertTriangle, bg: "bg-red-500/10",     text: "text-red-500"     },
    { label: "Avg Course Done",  value: avgCoursePct,       suffix: "%", icon: BookOpen,      bg: "bg-violet-500/10",  text: "text-violet-500"  },
  ]

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance & engagement insights for your college</p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2 self-start">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
          >
            <GlassCard className="p-4 h-full">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.bg} flex-shrink-0 relative`}>
                  <s.icon className={`h-4 w-4 ${s.text}`} />
                  {"live" in s && s.live && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xl font-bold font-serif text-foreground tabular-nums">
                    <Num value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── Weekly trend + Placement readiness ── */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Area chart — weekly trend */}
          <GlassCard className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Weekly Activity Trend</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Distinct active students per week · last 8 weeks</p>
            {a.weekly_trend.length > 0 ? (
              <ChartContainer config={{ active: { label: "Active Students", color: "#0E8080" } }} className="h-[210px] w-full">
                <AreaChart data={a.weekly_trend} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#0E8080" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0E8080" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "#0E8080", strokeWidth: 1, strokeDasharray: "4 2" }} />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#0E8080"
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ r: 3.5, fill: "#0E8080", strokeWidth: 0 }}
                    activeDot={{ r: 5.5, fill: "#0E8080", stroke: "var(--background)", strokeWidth: 2 }}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[210px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No activity data yet</p>
              </div>
            )}
          </GlassCard>

          {/* Placement readiness */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Placement Readiness</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-5">Students grouped by total points earned</p>
            <div className="space-y-4">
              {a.readiness_buckets.map((b, i) => {
                const pct = a.total_students > 0 ? Math.round(b.count / a.total_students * 100) : 0
                return (
                  <div key={b.range}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: readinessColor(i) }} />
                        <span className="text-xs font-medium text-foreground">{b.label}</span>
                        <span className="text-xs text-muted-foreground">{b.range}</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums" style={{ color: readinessColor(i) }}>
                        <Num value={b.count} />
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: readinessColor(i) }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 55, damping: 14, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {a.zero_activity_count > 0 && (
              <p className="text-xs text-muted-foreground pt-3 mt-3 border-t border-border/50">
                <span className="text-red-500 font-semibold">{a.zero_activity_count}</span> never been active
              </p>
            )}
          </GlassCard>
        </div>
      </Section>

      {/* ── MCQ accuracy + Course completions ── */}
      <Section delay={0.05}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* MCQ accuracy */}
          <GlassCard>
            <h3 className="font-semibold font-serif text-foreground mb-1">MCQ Accuracy by Topic</h3>
            <p className="text-xs text-muted-foreground mb-4">College-wide · sorted weakest first</p>
            {a.mcq_topic_stats.length > 0 ? (
              <>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                  {a.mcq_topic_stats.slice(0, 14).map((t, i) => (
                    <div key={t.topic}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground truncate max-w-[58%]">{t.topic}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-muted-foreground">{t.correct}/{t.total}</span>
                          <span className="text-xs font-bold w-9 text-right tabular-nums" style={{ color: accuracyColor(t.accuracy) }}>
                            {t.accuracy}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: accuracyColor(t.accuracy) }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${t.accuracy}%` }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 60, damping: 16, delay: i * 0.05 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 pt-3 border-t border-border/50">
                  {[["#EF4444","<40% weak"],["#F59E0B","40–69%"],["#10B981","≥70% good"]].map(([c,l]) => (
                    <span key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: c }} />{l}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No MCQ data yet</p>
              </div>
            )}
          </GlassCard>

          {/* Course completions */}
          <GlassCard>
            <h3 className="font-semibold font-serif text-foreground mb-1">Course Completion Rates</h3>
            <p className="text-xs text-muted-foreground mb-4">Avg % completed · among students who started</p>
            {a.course_completions.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                {a.course_completions.map((c, i) => (
                  <div key={c.course_id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate max-w-[58%]">{c.course_title}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-muted-foreground">{c.students_started} students</span>
                        <span className="text-xs font-bold text-primary w-8 text-right tabular-nums">{c.avg_completion_pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.avg_completion_pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 55, damping: 14, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No course progress yet</p>
              </div>
            )}
          </GlassCard>
        </div>
      </Section>

      {/* ── Branch performance ── */}
      {a.branch_stats.length > 0 && (
        <Section delay={0.05}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Branch Performance</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Average points per branch · highest first</p>
            <ChartContainer config={{ avgPoints: { label: "Avg Points", color: "#0E8080" } }} className="h-[220px] w-full">
              <BarChart data={a.branch_stats} layout="vertical" margin={{ left: 8, right: 32, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="branch" type="category" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} width={76} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
                  formatter={(val: number, _name: string, props: { payload?: BranchStat }) =>
                    [`${val.toLocaleString()} pts · ${props.payload?.count ?? 0} students`, "Avg Points"]
                  }
                />
                <Bar dataKey="avgPoints" radius={[0, 6, 6, 0]} maxBarSize={26} animationDuration={900} animationEasing="ease-out">
                  {a.branch_stats.map((_, i) => (
                    <Cell key={i} fill={BRANCH_COLORS[i % BRANCH_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </GlassCard>
        </Section>
      )}

      {/* ── Assignment pass rates + Coding breakdown ── */}
      <Section delay={0.05}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Assignment pass rates */}
          <GlassCard className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Assignment Pass Rates</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">% scoring ≥50% per module · weakest first</p>
            {a.assignment_module_stats.length > 0 ? (
              <ChartContainer
                config={{
                  pass_rate: { label: "Pass Rate %", color: "#10B981" },
                  avg_score: { label: "Avg Score %", color: "#0E8080" },
                }}
                className="h-[260px] w-full"
              >
                <BarChart
                  data={[...a.assignment_module_stats].reverse()}
                  layout="vertical"
                  margin={{ left: 8, right: 32, top: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11}
                    tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false}
                    tickFormatter={v => `${v}%`} />
                  <YAxis dataKey="module" type="category" stroke="var(--muted-foreground)" fontSize={10}
                    tick={{ fill: "var(--muted-foreground)" }} width={118} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
                    formatter={(val: number) => [`${val}%`]} />
                  <Bar dataKey="pass_rate" name="Pass Rate %" radius={[0, 4, 4, 0]} maxBarSize={14} animationDuration={900}>
                    {a.assignment_module_stats.map(s => (
                      <Cell key={s.module} fill={passColor(s.pass_rate)} />
                    ))}
                  </Bar>
                  <Bar dataKey="avg_score" name="Avg Score %" radius={[0, 4, 4, 0]} maxBarSize={14}
                    fill="#0E8080" opacity={0.3} animationDuration={900} animationBegin={200} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No assignment attempts yet</p>
              </div>
            )}
            {a.assignment_module_stats.length > 0 && (
              <div className="flex gap-4 mt-3 pt-3 border-t border-border/50">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-2 rounded inline-block bg-emerald-500" /> Pass Rate
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-2 rounded inline-block bg-primary opacity-40" /> Avg Score
                </span>
              </div>
            )}
          </GlassCard>

          {/* Coding difficulty donut */}
          <GlassCard className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Coding Solved</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Unique problems · across all students</p>

            {a.coding_summary.some(d => d.solved > 0) ? (
              <div className="flex-1 flex flex-col">
                <ChartContainer
                  config={{
                    Easy:   { label: "Easy",   color: "#10B981" },
                    Medium: { label: "Medium", color: "#F59E0B" },
                    Hard:   { label: "Hard",   color: "#EF4444" },
                  }}
                  className="h-[170px] w-full"
                >
                  <PieChart>
                    <Pie
                      data={a.coding_summary}
                      dataKey="solved"
                      nameKey="difficulty"
                      cx="50%" cy="50%"
                      innerRadius={46} outerRadius={72}
                      paddingAngle={4}
                      strokeWidth={0}
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {a.coding_summary.map(d => (
                        <Cell key={d.difficulty} fill={diffColor(d.difficulty)} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox as { cx: number; cy: number }
                          return (
                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={cx} dy="-6" fontSize="20" fontWeight="700" fill="var(--foreground)">{totalCodingSolved}</tspan>
                              <tspan x={cx} dy="16" fontSize="10" fill="var(--muted-foreground)">solved</tspan>
                            </text>
                          )
                        }}
                      />
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} formatter={(val: number, name: string) => [`${val} solved`, name]} />
                  </PieChart>
                </ChartContainer>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-border/50">
                  {a.coding_summary.map(d => (
                    <div key={d.difficulty} className="text-center">
                      <p className="text-lg font-bold font-serif tabular-nums" style={{ color: diffColor(d.difficulty) }}>
                        <Num value={d.solved} />
                        <span className="text-xs font-normal text-muted-foreground">/{d.total}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{d.difficulty}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  <Num value={a.total_coding_submissions} /> total submissions
                </p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No coding submissions yet</p>
              </div>
            )}
          </GlassCard>
        </div>
      </Section>

      {/* ── At-risk students ── */}
      <Section delay={0.05}>
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-500" />
              <h3 className="font-semibold font-serif text-foreground">At-Risk Students</h3>
              {a.at_risk_count > 0 && (
                <Badge variant="destructive" className="text-xs h-5">{a.at_risk_count}</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Inactive 14+ days</p>
          </div>

          {a.at_risk_students.length > 0 ? (
            <div className="space-y-2">
              {a.at_risk_students.map((s, i) => {
                const days = daysSince(s.last_active)
                const urgency = days === null || days > 30 ? "high" : days > 21 ? "med" : "low"
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
                    whileHover={{ x: 2, transition: { duration: 0.12 } }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-default"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">{s.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                        style={{ background: urgency === "high" ? "#EF4444" : urgency === "med" ? "#F59E0B" : "#0E8080" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[s.branch, s.section].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-foreground tabular-nums">{s.points} pts</p>
                        <p className="text-xs" style={{ color: urgency === "high" ? "#EF4444" : urgency === "med" ? "#F59E0B" : "#0E8080" }}>
                          {days === null ? "Never active" : `${days}d ago`}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        disabled={reminding === s.id}
                        onClick={() => sendRemind(s)}
                      >
                        {reminding === s.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <Send className="h-3 w-3" />}
                        Remind
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              All students active in the last 14 days
            </p>
          )}
        </GlassCard>
      </Section>

      {/* ── Top 10 leaderboard ── */}
      <Section delay={0.05}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="h-4 w-4 text-amber-400" />
            <h3 className="font-semibold font-serif text-foreground">Top 10 Students</h3>
          </div>

          {a.top_students.length > 0 ? (
            <div className="space-y-1">
              {a.top_students.map((s, i) => {
                const pct = Math.round(s.points / maxPts * 100)
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg overflow-hidden hover:bg-secondary/40 transition-colors"
                  >
                    {/* rank background bar */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ background: i === 0 ? "rgba(251,191,36,0.07)" : "transparent" }}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 rounded-l-lg opacity-10"
                      style={{ background: i < 3 ? ["#F59E0B","#94A3B8","#CD7F32"][i] : "#0E8080", width: `${pct}%` }}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + 0.15, duration: 0.7, ease: "easeOut" }}
                    />

                    <span className="relative w-7 text-center flex-shrink-0">
                      {i < 3
                        ? <span className="text-base">{MEDALS[i]}</span>
                        : <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>}
                    </span>
                    <div className="relative flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                    </div>
                    <div className="relative flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span className="text-xs text-muted-foreground tabular-nums">{s.streak}d</span>
                      </div>
                      <span className="text-sm font-semibold text-primary w-24 text-right font-mono tabular-nums">
                        {s.points.toLocaleString()} pts
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No students yet</p>
          )}
        </GlassCard>
      </Section>

    </div>
  )
}
