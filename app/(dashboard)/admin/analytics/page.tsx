"use client"

import { useEffect, useMemo, useState } from "react"
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
  Filter, RefreshCw, TrendingDown,
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
interface FilterOptions    { branches: string[]; sections: string[]; passout_years: number[] }

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  engagement_rate: number
  previous_engagement_rate: number
  engagement_delta: number
  days: number
  filter_options: FilterOptions
  zero_activity_count: number
  weekly_trend: WeekPoint[]
  mcq_topic_stats: MCQTopicStat[]
  total_mcq_attempts: number
  avg_mcq_accuracy: number
  course_completions: CourseStat[]
  readiness_buckets: ReadinessBucket[]
  at_risk_students: AtRiskStudent[]
  at_risk_count: number
  branch_stats: BranchStat[]
  assignment_module_stats: AssignmentMod[]
  total_assignment_attempts: number
  assignment_avg_score: number
  coding_summary: CodingDiff[]
  total_coding_submissions: number
  top_students: TopStudent[]
}

/* ─── helpers ────────────────────────────────────────────────────────────── */
const MEDALS = ["🥇", "🥈", "🥉"]
const BRANCH_COLORS = ["var(--primary)", "var(--coding)", "#3B82F6", "#06B6D4", "var(--success)", "var(--warning)"]

function daysSince(iso: string | null) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}
function accuracyColor(p: number) { return p >= 70 ? "var(--success)" : p >= 40 ? "var(--warning)" : "var(--danger)" }
function passColor(p: number)     { return p >= 70 ? "var(--success)" : p >= 40 ? "var(--warning)" : "var(--danger)" }
function readinessColor(i: number){ return ["var(--danger)","var(--warning)","var(--primary)","var(--success)"][i] }
function diffColor(d: string)     { return d === "Easy" ? "var(--success)" : d === "Medium" ? "var(--warning)" : "var(--danger)" }

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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label className="space-y-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 min-w-[130px] rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
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
  const [branch, setBranch] = useState("")
  const [section, setSection] = useState("")
  const [passoutYear, setPassoutYear] = useState("")
  const [days, setDays] = useState("30")

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (branch) params.set("branch", branch)
    if (section) params.set("section", section)
    if (passoutYear) params.set("passout_year", passoutYear)
    params.set("days", days)
    return params.toString()
  }, [branch, section, passoutYear, days])

  useEffect(() => {
    setLoading(true)
    api.get(`/admin/analytics?${query}`)
      .then(res => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [query])

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

  const a = {
    ...analytics!,
    branch_stats: analytics?.branch_stats ?? [] as BranchStat[],
    assignment_module_stats: analytics?.assignment_module_stats ?? [] as AssignmentMod[],
    coding_summary: analytics?.coding_summary ?? [] as CodingDiff[],
    weekly_trend: analytics?.weekly_trend ?? [] as WeekPoint[],
    mcq_topic_stats: analytics?.mcq_topic_stats ?? [] as MCQTopicStat[],
    course_completions: analytics?.course_completions ?? [] as CourseStat[],
    readiness_buckets: analytics?.readiness_buckets ?? [] as ReadinessBucket[],
    at_risk_students: analytics?.at_risk_students ?? [] as AtRiskStudent[],
    top_students: analytics?.top_students ?? [] as TopStudent[],
    filter_options: analytics?.filter_options ?? { branches: [], sections: [], passout_years: [] } as FilterOptions,
    total_coding_submissions: analytics?.total_coding_submissions ?? 0,
    total_mcq_attempts: analytics?.total_mcq_attempts ?? 0,
    avg_mcq_accuracy: analytics?.avg_mcq_accuracy ?? 0,
    total_assignment_attempts: analytics?.total_assignment_attempts ?? 0,
    assignment_avg_score: analytics?.assignment_avg_score ?? 0,
    engagement_delta: analytics?.engagement_delta ?? 0,
    days: analytics?.days ?? Number(days),
  }

  const avgCoursePct = a.course_completions.length
    ? Math.round(a.course_completions.reduce((s, c) => s + c.avg_completion_pct, 0) / a.course_completions.length) : 0
  const totalCodingSolved = a.coding_summary.reduce((s, d) => s + d.solved, 0)
  const maxPts = a.top_students[0]?.points || 1
  const activeFilters = [branch, section, passoutYear].filter(Boolean).length
  const resetFilters = () => {
    setBranch("")
    setSection("")
    setPassoutYear("")
    setDays("30")
  }

  const statCards = [
    { label: "Total Students",   value: a.total_students,   suffix: "",  icon: Users,         bg: "bg-primary/10",  text: "text-primary"  },
    { label: `Active ${a.days}d`, value: a.active_this_week, suffix: "",  icon: Activity,      bg: "bg-success/10",  text: "text-success",  live: true },
    { label: "Avg Streak",       value: a.avg_streak,       suffix: "d", icon: Flame,         bg: "bg-streak/10",   text: "text-streak"   },
    { label: "At Risk (14d)",    value: a.at_risk_count,    suffix: "",  icon: AlertTriangle, bg: "bg-danger/10",   text: "text-danger"   },
    { label: "Avg Course Done",  value: avgCoursePct,       suffix: "%", icon: BookOpen,      bg: "bg-coding/10",   text: "text-coding"   },
  ]

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col xl:flex-row xl:items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance & engagement insights for your college</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${a.engagement_delta >= 0 ? "border-success/25 bg-success/10 text-success" : "border-danger/25 bg-danger/10 text-danger"}`}>
              {a.engagement_delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {a.engagement_delta >= 0 ? "+" : ""}{a.engagement_delta}% vs previous {a.days}d
            </span>
            {activeFilters > 0 && <span>{activeFilters} filter{activeFilters > 1 ? "s" : ""} active</span>}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-card/50 p-3">
            <div className="flex h-9 items-center gap-2 px-1 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4 text-primary" /> Filters
            </div>
            <FilterSelect
              label="Period"
              value={days}
              onChange={setDays}
              options={[
                { label: "Last 7 days", value: "7" },
                { label: "Last 30 days", value: "30" },
                { label: "Last 90 days", value: "90" },
                { label: "Last 180 days", value: "180" },
              ]}
            />
            <FilterSelect
              label="Branch"
              value={branch}
              onChange={setBranch}
              options={[
                { label: "All branches", value: "" },
                ...a.filter_options.branches.map((b) => ({ label: b, value: b })),
              ]}
            />
            <FilterSelect
              label="Section"
              value={section}
              onChange={setSection}
              options={[
                { label: "All sections", value: "" },
                ...a.filter_options.sections.map((s) => ({ label: s, value: s })),
              ]}
            />
            <FilterSelect
              label="Year"
              value={passoutYear}
              onChange={setPassoutYear}
              options={[
                { label: "All years", value: "" },
                ...a.filter_options.passout_years.map((y) => ({ label: String(y), value: String(y) })),
              ]}
            />
            <Button variant="outline" size="sm" onClick={resetFilters} className="h-9 gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV} className="h-9 gap-2">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
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
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success">
                      <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "MCQ Accuracy", value: `${a.avg_mcq_accuracy}%`, sub: `${a.total_mcq_attempts.toLocaleString()} attempts`, tone: "text-primary" },
          { label: "Assignment Avg", value: `${a.assignment_avg_score}%`, sub: `${a.total_assignment_attempts.toLocaleString()} attempts`, tone: "text-warning" },
          { label: "Coding Submissions", value: a.total_coding_submissions.toLocaleString(), sub: `${totalCodingSolved} unique problems solved`, tone: "text-coding" },
          { label: "Zero Activity", value: a.zero_activity_count.toLocaleString(), sub: "students need onboarding", tone: "text-danger" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.35 }}
          >
            <GlassCard className="p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`mt-1 text-2xl font-bold font-serif tabular-nums ${item.tone}`}>{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

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
              <ChartContainer config={{ active: { label: "Active Students", color: "var(--primary)" } }} className="h-[210px] w-full">
                <AreaChart data={a.weekly_trend} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 2" }} />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ r: 3.5, fill: "var(--primary)", strokeWidth: 0 }}
                    activeDot={{ r: 5.5, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
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
                <span className="text-danger font-semibold">{a.zero_activity_count}</span> never been active
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
                  {[["var(--danger)","<40% weak"],["var(--warning)","40–69%"],["var(--success)","≥70% good"]].map(([c,l]) => (
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
            <ChartContainer config={{ avgPoints: { label: "Avg Points", color: "var(--primary)" } }} className="h-[220px] w-full">
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
                <Bar
                  dataKey="avgPoints"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={26}
                  animationDuration={900}
                  animationEasing="ease-out"
                  cursor="pointer"
                  onClick={(entry: any) => setBranch(entry.branch === "Unknown" ? "" : entry.branch)}
                >
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
                  pass_rate: { label: "Pass Rate %", color: "var(--success)" },
                  avg_score: { label: "Avg Score %", color: "var(--primary)" },
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
                    fill="var(--primary)" opacity={0.3} animationDuration={900} animationBegin={200} />
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
                  <span className="w-3 h-2 rounded inline-block bg-success" /> Pass Rate
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
                    Easy:   { label: "Easy",   color: "var(--success)" },
                    Medium: { label: "Medium", color: "var(--warning)" },
                    Hard:   { label: "Hard",   color: "var(--danger)" },
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
              <UserX className="h-4 w-4 text-danger" />
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
                      <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-danger">{s.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                        style={{ background: urgency === "high" ? "var(--danger)" : urgency === "med" ? "var(--warning)" : "var(--primary)" }}
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
                        <p className="text-xs" style={{ color: urgency === "high" ? "var(--danger)" : urgency === "med" ? "var(--warning)" : "var(--primary)" }}>
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
            <Trophy className="h-4 w-4 text-warning" />
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
                      style={{ background: i < 3 ? ["var(--warning)","#94A3B8","#CD7F32"][i] : "var(--primary)", width: `${pct}%` }}
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
                        <Flame className="h-3 w-3 text-streak" />
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
