"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  RefreshCw, CheckCircle, SlidersHorizontal,
  ArrowUpRight, ArrowDownRight, ChevronDown, X,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

/* ─── interfaces ─────────────────────────────────────────────────────────── */
interface ReadinessBucket { range: string; label: string; count: number }
interface WeekPoint       { week: string; active: number }
interface MCQTopicStat    { topic: string; total: number; correct: number; accuracy: number }
interface CourseStat      { course_id: number; course_title: string; students_started: number; total_students: number; avg_completion_pct: number; total_lessons: number }
interface AtRiskStudent   { id: number; name: string; email: string; branch: string | null; section: string | null; roll_number: string | null; points: number; last_active: string | null }
interface TopStudent      { id: number; name: string; points: number; streak: number; branch: string | null }
interface BranchStat      { branch: string; avgPoints: number; count: number }
interface AssignmentMod   { module: string; attempts: number; passed: number; pass_rate: number; avg_score: number }
interface CodingDiff      { difficulty: string; solved: number; total: number }
interface FilterOptions   { branches: string[]; sections: string[]; passout_years: number[] }

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

/* ─── constants ──────────────────────────────────────────────────────────── */
const MEDALS = ["🥇", "🥈", "🥉"]
const BRANCH_COLORS = ["var(--primary)", "var(--coding)", "var(--success)", "var(--warning)", "var(--streak)", "var(--coral)"]
const READINESS_COLORS = ["var(--danger)", "var(--warning)", "var(--primary)", "var(--success)"]

/* ─── helpers ────────────────────────────────────────────────────────────── */
function daysSince(iso: string | null) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}
function accuracyColor(p: number)  { return p >= 70 ? "var(--success)" : p >= 40 ? "var(--warning)" : "var(--danger)" }
function passColor(p: number)      { return p >= 70 ? "var(--success)" : p >= 40 ? "var(--warning)" : "var(--danger)" }
function readinessColor(i: number) { return READINESS_COLORS[i] }
function diffColor(d: string)      { return d === "Easy" ? "var(--success)" : d === "Medium" ? "var(--warning)" : "var(--danger)" }
function diffBg(d: string)         { return d === "Easy" ? "bg-success/10 border-success/25 text-success" : d === "Medium" ? "bg-warning/10 border-warning/25 text-warning" : "bg-danger/10 border-danger/25 text-danger" }
function accuracyBg(p: number)     { return p >= 70 ? "bg-success/15 text-success" : p >= 40 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger" }

/* ─── count-up ───────────────────────────────────────────────────────────── */
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
function Num({ value, suffix = "" }: { value: number; suffix?: string }) {
  const v = useCountUp(value)
  return <>{v.toLocaleString()}{suffix}</>
}

/* ─── scroll-reveal section ──────────────────────────────────────────────── */
function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.div
      id={id}
      className="scroll-mt-24 space-y-4"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── section header ─────────────────────────────────────────────────────── */
function SectionHead({
  icon: Icon, title, subtitle, gradient, iconClass, bgClass, borderClass, right,
}: {
  icon: React.ElementType; title: string; subtitle: string
  gradient: string; iconClass: string; bgClass: string; borderClass: string
  right?: React.ReactNode
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border ${borderClass} ${bgClass} px-4 py-3`}>
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient}`} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold font-serif text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {right}
      </div>
    </div>
  )
}

/* ─── styled select ──────────────────────────────────────────────────────── */
function StyledSelect({ label, value, onChange, options, icon: Icon, activeColor = "primary" }: {
  label: string; value: string; onChange: (v: string) => void
  options: { label: string; value: string }[]
  icon?: React.ElementType
  activeColor?: string
}) {
  const isActive = value !== ""
  const activeCls = isActive
    ? `border-${activeColor}/50 bg-${activeColor}/5 text-foreground`
    : "border-border bg-background text-foreground"
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className={`h-3 w-3 ${isActive ? `text-${activeColor}` : ""}`} />}
        {label}
      </span>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className={`w-full h-10 rounded-xl border pl-3 pr-8 text-sm appearance-none cursor-pointer outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/15 ${activeCls}`}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}

/* ─── skeleton ───────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-8">
      <div className="shimmer rounded-2xl h-36" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="shimmer rounded-xl h-24" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shimmer rounded-xl h-28" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="shimmer rounded-xl h-80" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shimmer rounded-xl h-72" />
        <div className="shimmer rounded-xl h-72" />
      </div>
    </div>
  )
}

/* ─── page ───────────────────────────────────────────────────────────────── */
export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading]     = useState(true)
  const [reminding, setReminding] = useState<number | null>(null)
  const [branch, setBranch]       = useState("")
  const [section, setSection]     = useState("")
  const [passoutYear, setPassoutYear] = useState("")
  const [days, setDays]           = useState("30")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = useMemo(() => {
    const p = new URLSearchParams()
    if (branch) p.set("branch", branch)
    if (section) p.set("section", section)
    if (passoutYear) p.set("passout_year", passoutYear)
    p.set("days", days)
    return p.toString()
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
    finally { setReminding(null) }
  }

  function exportCSV() {
    if (!analytics) return
    const rows = [
      ["Name", "Branch", "Points", "Streak"],
      ...analytics.top_students.map(s => [`"${s.name}"`, `"${s.branch || ""}"`, s.points, s.streak]),
    ]
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "top_students.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Skeleton />

  const a = {
    ...analytics!,
    branch_stats:            analytics?.branch_stats            ?? [] as BranchStat[],
    assignment_module_stats: analytics?.assignment_module_stats ?? [] as AssignmentMod[],
    coding_summary:          analytics?.coding_summary          ?? [] as CodingDiff[],
    weekly_trend:            analytics?.weekly_trend            ?? [] as WeekPoint[],
    mcq_topic_stats:         analytics?.mcq_topic_stats         ?? [] as MCQTopicStat[],
    course_completions:      analytics?.course_completions      ?? [] as CourseStat[],
    readiness_buckets:       analytics?.readiness_buckets       ?? [] as ReadinessBucket[],
    at_risk_students:        analytics?.at_risk_students        ?? [] as AtRiskStudent[],
    top_students:            analytics?.top_students            ?? [] as TopStudent[],
    filter_options:          analytics?.filter_options          ?? { branches: [], sections: [], passout_years: [] } as FilterOptions,
    total_coding_submissions:    analytics?.total_coding_submissions    ?? 0,
    total_mcq_attempts:          analytics?.total_mcq_attempts          ?? 0,
    avg_mcq_accuracy:            analytics?.avg_mcq_accuracy            ?? 0,
    total_assignment_attempts:   analytics?.total_assignment_attempts   ?? 0,
    assignment_avg_score:        analytics?.assignment_avg_score        ?? 0,
    engagement_delta:            analytics?.engagement_delta            ?? 0,
    days:                        analytics?.days                        ?? Number(days),
  }

  const avgCoursePct      = a.course_completions.length
    ? Math.round(a.course_completions.reduce((s, c) => s + c.avg_completion_pct, 0) / a.course_completions.length) : 0
  const totalCodingSolved = a.coding_summary.reduce((s, d) => s + d.solved, 0)
  const maxPts            = a.top_students[0]?.points || 1
  const weakestTopic      = a.mcq_topic_stats[0]
  const weakestAssignment = a.assignment_module_stats[0]
  const strongestBranch   = a.branch_stats[0]
  const activeFilters     = [branch, section, passoutYear].filter(Boolean).length
  const engagementRate    = a.engagement_rate ?? (a.total_students > 0 ? Math.round((a.active_this_week / a.total_students) * 100) : 0)

  const resetFilters = () => { setBranch(""); setSection(""); setPassoutYear(""); setDays("30") }

  return (
    <div className="space-y-8">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-card to-coding/10 px-6 py-5 shadow-2xl"
      >
        <motion.div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ x: "-100%" }} animate={{ x: "100%" }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)] pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-36 h-36 rounded-full bg-coding/8 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Deep Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">College Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Engagement · Learning · Assessments · Coding · Students</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold
              ${a.engagement_delta >= 0 ? "border-success/25 bg-success/10 text-success" : "border-danger/25 bg-danger/10 text-danger"}`}>
              {a.engagement_delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {a.engagement_delta >= 0 ? "+" : ""}{a.engagement_delta}% vs prev {a.days}d
            </span>
            <Button variant="outline" size="sm" onClick={exportCSV} className="h-8 gap-1.5 border-border/60 text-muted-foreground hover:text-foreground">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── FILTER PANEL ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard className="relative overflow-hidden border-primary/15 p-0">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-coding to-success" />

          {/* ── Always-visible bar ── */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Filters</span>
                {activeFilters > 0 && (
                  <motion.span
                    key={activeFilters}
                    initial={{ scale: 0.6 }} animate={{ scale: 1 }}
                    className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
                  >
                    {activeFilters}
                  </motion.span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeFilters > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={resetFilters}
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-danger hover:text-danger/80 font-medium transition-colors"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </motion.button>
              )}
              {/* Mobile toggle */}
              <motion.button
                onClick={() => setFiltersOpen(v => !v)}
                className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                animate={{ borderColor: filtersOpen ? "var(--primary)" : undefined }}
              >
                <span className="text-xs font-medium">{filtersOpen ? "Hide" : "Show"}</span>
                <motion.div animate={{ rotate: filtersOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* ── Desktop: always visible ── */}
          <div className="hidden lg:block border-t border-border/50 px-4 py-4">
            <div className="grid grid-cols-5 gap-4 items-end">
              {/* Period tabs */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Period</span>
                <div className="flex gap-1 p-1 rounded-xl bg-secondary border border-border/60 h-10">
                  {[{v:"7",l:"7d"},{v:"30",l:"30d"},{v:"90",l:"3mo"},{v:"180",l:"6mo"}].map(opt => (
                    <button key={opt.v} onClick={() => setDays(opt.v)}
                      className={`flex-1 rounded-lg text-xs font-semibold transition-all ${
                        days === opt.v
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                      }`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <StyledSelect label="Branch" value={branch} onChange={setBranch} icon={GitBranch} activeColor="primary"
                options={[{ label: "All branches", value: "" }, ...a.filter_options.branches.map(b => ({ label: b, value: b }))]} />
              <StyledSelect label="Section" value={section} onChange={setSection} activeColor="coding"
                options={[{ label: "All sections", value: "" }, ...a.filter_options.sections.map(s => ({ label: s, value: s }))]} />
              <StyledSelect label="Passout Year" value={passoutYear} onChange={setPassoutYear} activeColor="success"
                options={[{ label: "All years", value: "" }, ...a.filter_options.passout_years.map(y => ({ label: String(y), value: String(y) }))]} />
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground opacity-0 select-none">Actions</span>
                <Button variant="outline" size="sm" onClick={resetFilters} className="h-10 gap-2 w-full border-border/70 hover:border-danger/40 hover:text-danger transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Reset all
                </Button>
              </div>
            </div>
          </div>

          {/* ── Mobile: collapsible panel ── */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="lg:hidden overflow-hidden border-t border-border/50"
              >
                <div className="px-4 py-4 space-y-4">
                  {/* Period tabs */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Period</span>
                    <div className="flex gap-1.5 p-1 rounded-xl bg-secondary border border-border/60 h-11">
                      {[{v:"7",l:"7 days"},{v:"30",l:"30 days"},{v:"90",l:"3 months"},{v:"180",l:"6 months"}].map(opt => (
                        <button key={opt.v} onClick={() => setDays(opt.v)}
                          className={`flex-1 rounded-lg text-xs font-semibold transition-all ${
                            days === opt.v
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}>
                          {opt.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StyledSelect label="Branch" value={branch} onChange={setBranch} icon={GitBranch} activeColor="primary"
                      options={[{ label: "All branches", value: "" }, ...a.filter_options.branches.map(b => ({ label: b, value: b }))]} />
                    <StyledSelect label="Section" value={section} onChange={setSection} activeColor="coding"
                      options={[{ label: "All sections", value: "" }, ...a.filter_options.sections.map(s => ({ label: s, value: s }))]} />
                    <StyledSelect label="Passout Year" value={passoutYear} onChange={setPassoutYear} activeColor="success"
                      options={[{ label: "All years", value: "" }, ...a.filter_options.passout_years.map(y => ({ label: String(y), value: String(y) }))]} />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { resetFilters(); setFiltersOpen(false) }}
                    className="w-full h-9 gap-2 border-danger/30 text-danger hover:bg-danger/5">
                    <RefreshCw className="h-3.5 w-3.5" /> Reset all filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Active filter chips ── */}
          <AnimatePresence>
            {activeFilters > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-border/50 px-4 py-2.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Active:</span>
                  {branch && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 text-xs font-medium">
                      <GitBranch className="h-3 w-3" /> {branch}
                      <button onClick={() => setBranch("")} className="opacity-60 hover:opacity-100 ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  )}
                  {section && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coding/15 text-coding border border-coding/25 text-xs font-medium">
                      Section {section}
                      <button onClick={() => setSection("")} className="opacity-60 hover:opacity-100 ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  )}
                  {passoutYear && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 text-success border border-success/25 text-xs font-medium">
                      Batch {passoutYear}
                      <button onClick={() => setPassoutYear("")} className="opacity-60 hover:opacity-100 ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  )}
                  <button onClick={resetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-danger/10 text-danger border border-danger/20 text-xs font-medium hover:bg-danger/15 transition-colors ml-auto">
                    <X className="h-3 w-3" /> Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <div className="sticky top-3 z-20">
        <GlassCard className="p-2 border-primary/15 bg-card/85 backdrop-blur-xl">
          <div className="flex flex-wrap gap-1">
            {[
              { label: "Engagement", href: "#engagement", icon: Activity,      color: "hover:text-primary hover:bg-primary/10 hover:border-primary/30"   },
              { label: "Learning",   href: "#learning",   icon: BookOpen,      color: "hover:text-success hover:bg-success/10 hover:border-success/30"   },
              { label: "Branches",   href: "#branches",   icon: GitBranch,     color: "hover:text-coding hover:bg-coding/10 hover:border-coding/30"      },
              { label: "Assessments",href: "#assessments",icon: ClipboardCheck,color: "hover:text-warning hover:bg-warning/10 hover:border-warning/30"   },
              { label: "Coding",     href: "#coding",     icon: Code2,         color: "hover:text-coral hover:bg-coral/10 hover:border-coral/30"         },
              { label: "Students",   href: "#students",   icon: Users,         color: "hover:text-danger hover:bg-danger/10 hover:border-danger/30"      },
            ].map(item => (
              <a key={item.href} href={item.href}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-transparent px-3 text-sm font-medium text-muted-foreground transition-all ${item.color}`}>
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── STAT CARDS ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {([
          { label: "Total Students",   value: a.total_students,   suffix: "",  icon: Users,         gradient: "from-primary/20 to-primary/5",  accent: "from-primary to-coding",          iconClass: "bg-primary/20 text-primary", live: false },
          { label: `Active (${a.days}d)`, value: a.active_this_week, suffix: "",  icon: Activity,      gradient: "from-success/20 to-success/5",  accent: "from-success to-primary",         iconClass: "bg-success/20 text-success", live: true  },
          { label: "Avg Streak",       value: a.avg_streak,       suffix: "d", icon: Flame,         gradient: "from-streak/20 to-streak/5",    accent: "from-streak to-warning",          iconClass: "bg-streak/20 text-streak",   live: false },
          { label: "At-Risk (14d)",    value: a.at_risk_count,    suffix: "",  icon: AlertTriangle, gradient: a.at_risk_count > 0 ? "from-danger/20 to-danger/5" : "from-success/20 to-success/5", accent: a.at_risk_count > 0 ? "from-danger to-warning" : "from-success to-primary", iconClass: a.at_risk_count > 0 ? "bg-danger/20 text-danger" : "bg-success/20 text-success", live: false },
          { label: "Avg Course Done",  value: avgCoursePct,       suffix: "%", icon: BookOpen,      gradient: "from-coding/20 to-coding/5",    accent: "from-coding to-primary",          iconClass: "bg-coding/20 text-coding",   live: false },
        ] as const).map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.15 } }}
          >
            <GlassCard className={`p-4 h-full relative overflow-hidden border-border/60 bg-gradient-to-br ${s.gradient}`}>
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`} />
              <div className="mb-3">
                <div className={`inline-flex p-2.5 rounded-xl ${s.iconClass} relative`}>
                  <s.icon className="h-4 w-4" />
                  {s.live && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success">
                      <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
                    </span>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold font-serif text-foreground tabular-nums">
                <Num value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── SPOTLIGHT CARDS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Weakest MCQ Signal", icon: Target,
            value: weakestTopic ? `${weakestTopic.accuracy}%` : "—",
            sub: weakestTopic ? `${weakestTopic.topic} · ${weakestTopic.total} attempts` : "No MCQ attempts yet",
            tone: "text-danger", bg: "from-danger/15 to-danger/5", border: "border-danger/25",
            accent: "from-danger via-warning to-transparent", bar: weakestTopic?.accuracy ?? 0, barVar: "var(--danger)",
          },
          {
            label: "Assignment Bottleneck", icon: ClipboardCheck,
            value: weakestAssignment ? `${weakestAssignment.pass_rate}%` : "—",
            sub: weakestAssignment ? `${weakestAssignment.module} · ${weakestAssignment.attempts} attempts` : "No attempts yet",
            tone: "text-warning", bg: "from-warning/15 to-warning/5", border: "border-warning/25",
            accent: "from-warning via-streak to-transparent", bar: weakestAssignment?.pass_rate ?? 0, barVar: "var(--warning)",
          },
          {
            label: "Top Branch", icon: GitBranch,
            value: strongestBranch ? strongestBranch.branch : "—",
            sub: strongestBranch ? `${strongestBranch.avgPoints.toLocaleString()} avg pts · ${strongestBranch.count} students` : "No branch data yet",
            tone: "text-success", bg: "from-success/15 to-success/5", border: "border-success/25",
            accent: "from-success via-primary to-transparent", bar: 100, barVar: "var(--success)",
          },
        ].map((item, i) => (
          <motion.div key={item.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <GlassCard className={`relative h-full overflow-hidden border ${item.border} bg-gradient-to-br ${item.bg}`}>
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2.5 border ${item.border} bg-card/40 flex-shrink-0`}>
                  <item.icon className={`h-5 w-5 ${item.tone}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`mt-1 text-2xl font-bold font-serif truncate ${item.tone}`}>{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{item.sub}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: item.barVar }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(3, Math.min(100, item.bar))}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: "easeOut" }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── SECTION: Engagement ───────────────────────────────────────────── */}
      <Section id="engagement">
        <SectionHead icon={Activity} title="Engagement" subtitle={`Weekly activity trend · ${a.days}-day window`}
          gradient="from-primary via-primary/50 to-transparent"
          iconClass="bg-primary/20 text-primary" bgClass="bg-gradient-to-r from-primary/8 to-transparent" borderClass="border-primary/20"
          right={
            <Badge className={`${a.engagement_delta >= 0 ? "bg-success/15 text-success border-success/30" : "bg-danger/15 text-danger border-danger/30"}`}>
              {a.engagement_delta >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1 inline" /> : <ArrowDownRight className="h-3 w-3 mr-1 inline" />}
              {a.engagement_delta >= 0 ? "+" : ""}{a.engagement_delta}%
            </Badge>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <GlassCard className="lg:col-span-3 relative overflow-hidden border-primary/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-coding to-success" />
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Weekly Activity Trend</h3>
              <Badge variant="outline" className="ml-auto border-primary/30 text-primary text-xs">{engagementRate}% active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Distinct active students per week · last 8 weeks</p>
            {a.weekly_trend.length > 0 ? (
              <ChartContainer config={{ active: { label: "Active Students", color: "var(--primary)" } }} className="h-[220px] w-full">
                <AreaChart data={a.weekly_trend} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 2" }} />
                  <Area type="monotone" dataKey="active" stroke="var(--primary)" strokeWidth={2.5} fill="url(#engGrad)"
                    dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
                    animationDuration={1200} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No activity data yet</p>
              </div>
            )}
          </GlassCard>

          <GlassCard className="lg:col-span-2 relative overflow-hidden border-primary/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger via-warning to-success" />
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">Placement Readiness</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-5">Points-based placement bands</p>
            <div className="space-y-4">
              {a.readiness_buckets.map((b, i) => {
                const pct = a.total_students > 0 ? Math.round(b.count / a.total_students * 100) : 0
                return (
                  <div key={b.range}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <motion.span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: readinessColor(i) }}
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }} />
                        <span className="text-xs font-medium text-foreground">{b.label}</span>
                        <span className="text-xs text-muted-foreground">{b.range}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                        <span className="text-sm font-bold tabular-nums" style={{ color: readinessColor(i) }}>
                          <Num value={b.count} />
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: readinessColor(i) }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 55, damping: 14, delay: i * 0.1 }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {a.zero_activity_count > 0 && (
              <p className="text-xs text-muted-foreground pt-3 mt-3 border-t border-border/50">
                <span className="text-danger font-bold">{a.zero_activity_count}</span> students never been active
              </p>
            )}
          </GlassCard>
        </div>
      </Section>

      {/* ── SECTION: Learning ─────────────────────────────────────────────── */}
      <Section id="learning">
        <SectionHead icon={BookOpen} title="Learning Performance"
          subtitle="MCQ accuracy & course completion · weakest areas first"
          gradient="from-success via-success/50 to-transparent"
          iconClass="bg-success/20 text-success" bgClass="bg-gradient-to-r from-success/8 to-transparent" borderClass="border-success/20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MCQ accuracy */}
          <GlassCard className="relative overflow-hidden border-success/15">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger via-warning to-success" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold font-serif text-foreground">MCQ Accuracy by Topic</h3>
                <p className="text-xs text-muted-foreground">Sorted weakest first</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-serif tabular-nums" style={{ color: accuracyColor(a.avg_mcq_accuracy) }}>
                  <Num value={Math.round(a.avg_mcq_accuracy)} suffix="%" />
                </p>
                <p className="text-xs text-muted-foreground">avg</p>
              </div>
            </div>
            {a.mcq_topic_stats.length > 0 ? (
              <>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                  {a.mcq_topic_stats.slice(0, 14).map((t, i) => (
                    <motion.div key={t.topic}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground truncate max-w-[55%]">{t.topic}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-muted-foreground">{t.correct}/{t.total}</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full tabular-nums ${accuracyBg(t.accuracy)}`}>
                            {t.accuracy}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: accuracyColor(t.accuracy) }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${t.accuracy}%` }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 60, damping: 16, delay: i * 0.04 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 pt-3 border-t border-border/50">
                  {([["var(--danger)","<40% Weak"],["var(--warning)","40–69%"],["var(--success)","≥70% Strong"]] as const).map(([c, l]) => (
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
          <GlassCard className="relative overflow-hidden border-success/15">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success via-primary to-coding" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold font-serif text-foreground">Course Completion Rates</h3>
                <p className="text-xs text-muted-foreground">Avg % completed per course</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-serif text-success tabular-nums">
                  <Num value={avgCoursePct} suffix="%" />
                </p>
                <p className="text-xs text-muted-foreground">avg all courses</p>
              </div>
            </div>
            {a.course_completions.length > 0 ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                {a.course_completions.map((c, i) => (
                  <motion.div key={c.course_id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate max-w-[55%]">{c.course_title}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-muted-foreground">{c.students_started} started</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full tabular-nums ${accuracyBg(c.avg_completion_pct)}`}>
                          {c.avg_completion_pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: accuracyColor(c.avg_completion_pct) }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.avg_completion_pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 55, damping: 14, delay: i * 0.05 }} />
                    </div>
                  </motion.div>
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

      {/* ── SECTION: Branches ─────────────────────────────────────────────── */}
      {a.branch_stats.length > 0 && (
        <Section id="branches">
          <SectionHead icon={GitBranch} title="Branch Performance"
            subtitle="Average points per branch · click a bar to filter"
            gradient="from-coding via-coding/50 to-transparent"
            iconClass="bg-coding/20 text-coding" bgClass="bg-gradient-to-r from-coding/8 to-transparent" borderClass="border-coding/20" />

          <GlassCard className="relative overflow-hidden border-coding/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coding via-primary to-success" />
            <ChartContainer config={{ avgPoints: { label: "Avg Points", color: "var(--primary)" } }} className="h-[220px] w-full">
              <BarChart data={a.branch_stats} layout="vertical" margin={{ left: 8, right: 48, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="branch" type="category" stroke="var(--muted-foreground)" fontSize={11} width={80} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />}
                  cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
                  formatter={(val: number, _: string, props: { payload?: BranchStat }) =>
                    [`${val.toLocaleString()} pts · ${props.payload?.count ?? 0} students`, "Avg Points"]
                  } />
                <Bar dataKey="avgPoints" radius={[0, 8, 8, 0]} maxBarSize={28} animationDuration={900} cursor="pointer"
                  onClick={(entry: any) => setBranch(entry.branch === "Unknown" ? "" : entry.branch)}>
                  {a.branch_stats.map((_, i) => (
                    <Cell key={i} fill={BRANCH_COLORS[i % BRANCH_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">Click a bar to filter all analytics to that branch</p>
          </GlassCard>
        </Section>
      )}

      {/* ── SECTION: Assessments ──────────────────────────────────────────── */}
      <Section id="assessments">
        <SectionHead icon={ClipboardCheck} title="Assessments & Coding"
          subtitle="Assignment pass rates · coding problem breakdown by difficulty"
          gradient="from-warning via-warning/50 to-transparent"
          iconClass="bg-warning/20 text-warning" bgClass="bg-gradient-to-r from-warning/8 to-transparent" borderClass="border-warning/20" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <GlassCard className="lg:col-span-3 relative overflow-hidden border-warning/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger via-warning to-success" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold font-serif text-foreground">Assignment Pass Rates</h3>
                <p className="text-xs text-muted-foreground">% scoring ≥50% per module · weakest first</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-serif tabular-nums" style={{ color: passColor(a.assignment_avg_score) }}>
                  <Num value={Math.round(a.assignment_avg_score)} suffix="%" />
                </p>
                <p className="text-xs text-muted-foreground">overall avg</p>
              </div>
            </div>
            {a.assignment_module_stats.length > 0 ? (
              <>
                <ChartContainer
                  config={{
                    pass_rate: { label: "Pass Rate %", color: "var(--success)" },
                    avg_score: { label: "Avg Score %", color: "var(--primary)" },
                  }}
                  className="h-[260px] w-full"
                >
                  <BarChart data={[...a.assignment_module_stats].reverse()} layout="vertical"
                    margin={{ left: 8, right: 40, top: 0, bottom: 0 }} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11}
                      tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="module" type="category" stroke="var(--muted-foreground)" fontSize={10}
                      width={120} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />}
                      cursor={{ fill: "var(--secondary)", opacity: 0.5 }} formatter={(val: number) => [`${val}%`]} />
                    <Bar dataKey="pass_rate" name="Pass Rate %" radius={[0, 5, 5, 0]} maxBarSize={14} animationDuration={900}>
                      {a.assignment_module_stats.map(s => (
                        <Cell key={s.module} fill={passColor(s.pass_rate)} />
                      ))}
                    </Bar>
                    <Bar dataKey="avg_score" name="Avg Score %" radius={[0, 5, 5, 0]} maxBarSize={14}
                      fill="var(--primary)" opacity={0.35} animationDuration={900} animationBegin={200} />
                  </BarChart>
                </ChartContainer>
                <div className="flex gap-4 mt-3 pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-3 h-2 rounded bg-success inline-block" /> Pass Rate
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-3 h-2 rounded bg-primary opacity-40 inline-block" /> Avg Score
                  </span>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No assignment attempts yet</p>
              </div>
            )}
          </GlassCard>

          {/* Coding donut */}
          <GlassCard id="coding" className="scroll-mt-24 lg:col-span-2 relative overflow-hidden border-coral/20 flex flex-col">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success via-warning to-danger" />
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="h-4 w-4 text-coding" />
              <h3 className="font-semibold font-serif text-foreground">Coding Solved</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Unique problems · by difficulty</p>

            {a.coding_summary.some(d => d.solved > 0) ? (
              <div className="flex-1 flex flex-col">
                <ChartContainer
                  config={{
                    Easy:   { label: "Easy",   color: "var(--success)" },
                    Medium: { label: "Medium", color: "var(--warning)" },
                    Hard:   { label: "Hard",   color: "var(--danger)"  },
                  }}
                  className="h-[170px] w-full"
                >
                  <PieChart>
                    <Pie data={a.coding_summary} dataKey="solved" nameKey="difficulty"
                      cx="50%" cy="50%" innerRadius={46} outerRadius={72}
                      paddingAngle={4} strokeWidth={0} animationDuration={1000}>
                      {a.coding_summary.map(d => <Cell key={d.difficulty} fill={diffColor(d.difficulty)} />)}
                      <Label content={({ viewBox }) => {
                        const { cx, cy } = viewBox as { cx: number; cy: number }
                        return (
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={cx} dy="-6" fontSize="20" fontWeight="700" fill="var(--foreground)">{totalCodingSolved}</tspan>
                            <tspan x={cx} dy="16" fontSize="10" fill="var(--muted-foreground)">solved</tspan>
                          </text>
                        )
                      }} />
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} formatter={(val: number, name: string) => [`${val} solved`, name]} />
                  </PieChart>
                </ChartContainer>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-border/50">
                  {a.coding_summary.map(d => (
                    <motion.div key={d.difficulty}
                      className={`text-center p-2 rounded-xl border ${diffBg(d.difficulty)}`}
                      whileHover={{ scale: 1.06 }}
                    >
                      <p className="text-lg font-bold font-serif tabular-nums">
                        <Num value={d.solved} />
                      </p>
                      <p className="text-[10px] font-medium">{d.difficulty}</p>
                      <p className="text-[10px] text-muted-foreground">/{d.total}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-3">
                  <span className="font-semibold text-coding tabular-nums"><Num value={a.total_coding_submissions} /></span> total submissions
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

      {/* ── SECTION: Students ─────────────────────────────────────────────── */}
      <Section id="students">
        <SectionHead icon={Users} title="Students"
          subtitle="At-risk students · top performers leaderboard"
          gradient="from-danger via-danger/50 to-transparent"
          iconClass="bg-danger/20 text-danger" bgClass="bg-gradient-to-r from-danger/8 to-transparent" borderClass="border-danger/20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* At-risk */}
          <GlassCard className="relative overflow-hidden border-danger/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger via-warning to-transparent" />
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <UserX className="h-4 w-4 text-danger" />
                <h3 className="font-semibold font-serif text-foreground">At-Risk Students</h3>
                {a.at_risk_count > 0 && (
                  <Badge className="bg-danger/15 text-danger border-danger/30 text-xs">{a.at_risk_count}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Inactive 14+ days</p>
            </div>

            {a.at_risk_students.length > 0 ? (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {a.at_risk_students.map((s, i) => {
                  const d = daysSince(s.last_active)
                  const urgency = d === null || d > 30 ? "high" : d > 21 ? "med" : "low"
                  const rowCls  = urgency === "high" ? "bg-danger/8 border-danger/20"   : urgency === "med" ? "bg-warning/8 border-warning/20" : "bg-primary/5 border-primary/15"
                  const nameCls = urgency === "high" ? "text-danger"                     : urgency === "med" ? "text-warning"                   : "text-primary"
                  const avatarCls = urgency === "high" ? "bg-danger/15 text-danger"      : urgency === "med" ? "bg-warning/15 text-warning"      : "bg-primary/15 text-primary"
                  return (
                    <motion.div key={s.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ x: 3, transition: { duration: 0.12 } }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${rowCls}`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${avatarCls}`}>
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        {urgency === "high" && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card bg-danger">
                            <span className="absolute inset-0 rounded-full bg-danger animate-ping opacity-60" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[s.branch, s.section].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className={`text-xs font-bold tabular-nums ${nameCls}`}>
                            {d === null ? "Never" : `${d}d ago`}
                          </p>
                          <p className="text-xs text-muted-foreground">{s.points} pts</p>
                        </div>
                        <Button size="sm" variant="outline"
                          className="h-7 w-7 p-0 border-danger/30 text-danger hover:bg-danger/10"
                          disabled={reminding === s.id}
                          onClick={() => sendRemind(s)}
                          title={`Send reminder to ${s.name}`}
                        >
                          {reminding === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <p className="text-sm font-medium text-foreground">All students active!</p>
                <p className="text-xs text-muted-foreground">No one inactive for 14+ days</p>
              </div>
            )}
          </GlassCard>

          {/* Top 10 leaderboard */}
          <GlassCard className="relative overflow-hidden border-warning/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-warning via-primary to-coding" />
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-warning" />
                <h3 className="font-semibold font-serif text-foreground">Top 10 Students</h3>
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV} className="h-7 gap-1.5 text-xs">
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>

            {a.top_students.length > 0 ? (
              <div className="space-y-1">
                {a.top_students.map((s, i) => {
                  const pct      = Math.round(s.points / maxPts * 100)
                  const rankColor = i === 0 ? "var(--warning)" : i === 1 ? "#94A3B8" : i === 2 ? "#CD7F32" : "var(--primary)"
                  return (
                    <motion.div key={s.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 3, transition: { duration: 0.12 } }}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden hover:bg-secondary/40 transition-colors"
                    >
                      <motion.div className="absolute left-0 top-0 bottom-0 rounded-xl opacity-[0.07]"
                        style={{ background: rankColor }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }} />
                      <span className="relative w-7 text-center flex-shrink-0">
                        {i < 3 ? <span className="text-base">{MEDALS[i]}</span>
                          : <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>}
                      </span>
                      <div className="relative flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                      </div>
                      <div className="relative flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-streak" />
                          <span className="text-xs text-muted-foreground tabular-nums">{s.streak}d</span>
                        </div>
                        <span className="text-sm font-bold tabular-nums" style={{ color: rankColor }}>
                          {s.points.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Users className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No students yet</p>
              </div>
            )}
          </GlassCard>
        </div>
      </Section>

    </div>
  )
}
