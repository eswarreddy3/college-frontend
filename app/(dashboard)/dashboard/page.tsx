"use client"

import { useEffect, useState, useMemo } from "react"
import { GlassCard } from "@/components/glass-card"
import { StreakCalendar } from "@/components/streak-calendar"
import { FeedbackModal } from "@/components/feedback-modal"
import {
  Trophy, Star, Flame, Code2, Loader2, Quote, Zap,
  BookOpen, ClipboardList, BriefcaseBusiness, Newspaper, MessageSquare,
  ChevronRight, Target, Activity, CheckSquare, Square,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import {
  motion, AnimatePresence, useMotionValue, useTransform, animate,
} from "framer-motion"
import { getDailyQuote } from "@/lib/quotes"
import { getLevelProgress } from "@/lib/levels"
import { getShield } from "@/lib/shields"
import type { LucideIcon } from "lucide-react"

interface DashboardData {
  points: number
  streak: number
  longest_streak: number
  rank: number
  total_in_college: number
  solved_count: number
  active_days: number[]
  activity_map: Record<string, number>
  recent_activity: {
    id: number
    action: string
    details: Record<string, any> | null
    created_at: string
  }[]
  mcq_week_count: number
  mcq_accuracy: number
  best_assignment_pct: number
  lesson_week_count: number
  course_progress: CourseProgress[]
}

interface LeaderboardEntry {
  rank: number
  id: number
  name: string
  points: number
  streak: number
  avatar?: string
  is_current_user: boolean
}

interface CourseProgress {
  course_id: string
  course_title: string
  completed: number
  total: number
  percentage: number
}

interface Job {
  id: number
  title: string
  company: string
  type: string
  deadline: string | null
  is_active: boolean
}

function getActionMeta(action: string): { Icon: LucideIcon; color: string; bg: string } {
  const a = action.toLowerCase()
  if (a.includes("lesson"))                       return { Icon: BookOpen,          color: "text-primary",  bg: "bg-primary/15" }
  if (a.includes("assignment"))                   return { Icon: ClipboardList,     color: "text-warning",  bg: "bg-warning/15" }
  if (a.includes("code") || a.includes("coding")) return { Icon: Code2,             color: "text-coding",   bg: "bg-coding/15"  }
  if (a.includes("job"))                          return { Icon: BriefcaseBusiness, color: "text-primary",  bg: "bg-primary/15" }
  if (a.includes("post"))                         return { Icon: Newspaper,         color: "text-coral",    bg: "bg-coral/15"   }
  if (a.includes("comment"))                      return { Icon: MessageSquare,     color: "text-success",  bg: "bg-success/15" }
  return { Icon: Zap, color: "text-primary", bg: "bg-primary/15" }
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => Math.round(v).toLocaleString())
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 1.4, ease: "easeOut" })
    const unsub = rounded.on("change", setDisplay)
    return () => { controls.stop(); unsub() }
  }, [value]) // eslint-disable-line

  return <span>{display}</span>
}

// ── XP Level card ─────────────────────────────────────────────────────────────
function LevelCard({ points }: { points: number }) {
  const { current, next, progressPct, pointsNeeded } = getLevelProgress(points)
  const R = 48
  const circumference = 2 * Math.PI * R

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: current.barColor }} />
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="currentColor" className="text-secondary/80" strokeWidth="9" />
            <motion.circle cx="60" cy="60" r={R} fill="none" stroke={current.barColor} strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (progressPct / 100) * circumference }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.35 }}
              style={{ filter: `drop-shadow(0 0 6px ${current.barColor}99)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span className="text-3xl leading-none" animate={{ rotate: [0, -12, 12, -6, 6, 0] }} transition={{ delay: 0.65, duration: 0.7 }}>
              {current.emoji}
            </motion.span>
            <span className="text-[10px] text-muted-foreground mt-1">Lv.{current.level}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Level</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <p className={`text-3xl font-bold font-serif leading-tight ${current.color}`}>{current.name}</p>
            {(() => {
              const shield = getShield(points)
              if (shield.tier === 0) return null
              return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border"
                  style={{ background: `linear-gradient(135deg, ${shield.gradientFrom}20, ${shield.gradientTo}15)`, borderColor: `${shield.gradientFrom}50`, color: shield.gradientFrom, boxShadow: `0 0 8px ${shield.glowColor}` }}>
                  {shield.emoji} {shield.name}
                </span>
              )
            })()}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <span className="text-2xl font-bold font-serif text-foreground"><AnimatedNumber value={points} /></span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>
          {next ? (
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${current.barColor}66, ${current.barColor})` }}
                  initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progressPct}% complete</span>
                <span><span style={{ color: next.barColor }}>{next.emoji} {next.name}</span><span className="opacity-60"> in {pointsNeeded} pts</span></span>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>👑</motion.span>
              <p className="text-sm font-semibold text-warning">Maximum level — You&apos;re a Legend.</p>
            </div>
          )}
        </div>
        {next && (
          <div className="hidden lg:flex flex-col items-center px-5 py-4 rounded-2xl border flex-shrink-0"
            style={{ borderColor: `${current.barColor}30`, background: `${current.barColor}0D` }}>
            <Zap className="h-4 w-4 mb-1" style={{ color: current.barColor }} />
            <p className="text-[10px] text-muted-foreground">Next up</p>
            <p className="text-2xl mt-0.5">{next.emoji}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: next.barColor }}>{next.name}</p>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// ── Typewriter quote banner ───────────────────────────────────────────────────
function QuoteBanner({ streak }: { streak: number }) {
  const quote = getDailyQuote(streak)
  const [visible, setVisible] = useState(true)
  const [typed, setTyped] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setTyped("")
    setDone(false)
    const id = setInterval(() => {
      i++
      setTyped(quote.text.slice(0, i))
      if (i >= quote.text.length) { clearInterval(id); setDone(true) }
    }, 18)
    return () => clearInterval(id)
  }, [quote.text])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-coding/5 px-5 py-4">
            <motion.div className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full"
              initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 4 }} />
            <div className="flex items-start gap-3">
              <motion.div className="flex-shrink-0 p-2 rounded-lg bg-primary/15 mt-0.5"
                animate={{ rotate: [0, -6, 6, -3, 3, 0] }} transition={{ delay: 1.8, duration: 0.7 }}>
                <Quote className="h-4 w-4 text-primary" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  &ldquo;{typed}
                  {!done && <motion.span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 align-middle rounded-sm" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />}
                  &rdquo;
                </p>
                <motion.p className="text-xs text-muted-foreground mt-1" initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.5 }}>
                  — {quote.author}
                </motion.p>
              </div>
              <button onClick={() => setVisible(false)} className="flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground text-xs leading-none mt-0.5 transition-colors" aria-label="Dismiss">✕</button>
            </div>
            {streak >= 7 && (
              <motion.div className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-15 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>🔥</motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Placement Readiness Card ──────────────────────────────────────────────────
function PlacementReadinessCard({ data }: { data: DashboardData }) {
  const streakPct  = Math.min(100, Math.round((data.streak / 30) * 100))
  const codingPct  = Math.min(100, Math.round((data.solved_count / 50) * 100))
  const basePct    = Math.min(100, Math.round((data.points / 5000) * 100))
  const mcqPct     = Math.min(100, data.mcq_accuracy > 0 ? data.mcq_accuracy : Math.round(basePct * 0.85))
  const assignPct  = Math.min(100, data.best_assignment_pct > 0 ? data.best_assignment_pct : Math.round(basePct * 0.75))
  const modulePct  = Math.min(100, data.course_progress.length > 0
    ? Math.round(data.course_progress.reduce((s, c) => s + c.percentage, 0) / data.course_progress.length)
    : Math.round(basePct * 0.80))
  const overall    = Math.round(modulePct * 0.25 + mcqPct * 0.25 + codingPct * 0.20 + assignPct * 0.15 + streakPct * 0.15)

  const R = 52
  const circ = 2 * Math.PI * R
  const scoreGlow = overall >= 80 ? "#22c55e" : overall >= 60 ? "#f59e0b" : "#ef4444"
  const scoreClass = overall >= 80 ? "text-success" : overall >= 60 ? "text-warning" : "text-danger"
  const badgeClass = overall >= 80 ? "bg-success/15 text-success" : overall >= 60 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"
  const label      = overall >= 80 ? "Excellent" : overall >= 60 ? "Good Progress" : overall >= 40 ? "Improving" : "Needs Work"

  const cats = [
    { label: "Modules",      pct: modulePct, icon: "📚" },
    { label: "MCQ Accuracy", pct: mcqPct,    icon: "❓" },
    { label: "Coding",       pct: codingPct, icon: "💻" },
    { label: "Assignments",  pct: assignPct, icon: "📋" },
    { label: "Streak",       pct: streakPct, icon: "🔥" },
  ]

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-serif text-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Placement Readiness
        </h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>{label}</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" className="-rotate-90">
            <circle cx="55" cy="55" r={R} fill="none" stroke="currentColor" className="text-secondary/60" strokeWidth="10" />
            <motion.circle cx="55" cy="55" r={R} fill="none" stroke={scoreGlow} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ - (overall / 100) * circ }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              style={{ filter: `drop-shadow(0 0 8px ${scoreGlow}88)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold font-serif ${scoreClass}`}>{overall}</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {cats.map((c, i) => (
            <div key={c.label}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] text-muted-foreground">{c.icon} {c.label}</span>
                <span className="text-[11px] font-semibold text-foreground">{c.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${c.pct >= 80 ? "bg-success" : c.pct >= 60 ? "bg-warning" : "bg-danger"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.08 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {overall < 80 && (
        <div className="text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
          💡 <span className="text-primary font-semibold">+{80 - overall} pts</span> this week can get you to <span className="text-primary font-semibold">Elite</span> badge
        </div>
      )}
    </GlassCard>
  )
}

// ── Activity Heatmap Card ─────────────────────────────────────────────────────
function ActivityHeatmapCard({ data }: { data: DashboardData }) {
  const now = new Date()

  const days = useMemo(() => Array.from({ length: 35 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (34 - i))
    const key = d.toISOString().split("T")[0]
    return { key, count: data.activity_map[key] || 0 }
  }), [data.activity_map]) // eslint-disable-line

  const weeklyData = useMemo(() => Array.from({ length: 8 }, (_, w) => {
    let total = 0
    for (let d = 0; d < 7; d++) {
      const date = new Date(now)
      date.setDate(now.getDate() - ((7 - w) * 7 + d))
      total += data.activity_map[date.toISOString().split("T")[0]] || 0
    }
    return total
  }), [data.activity_map]) // eslint-disable-line

  const maxW = Math.max(...weeklyData, 1)

  const activeCount = useMemo(() => Object.keys(data.activity_map).filter(k => {
    return (now.getTime() - new Date(k).getTime()) / 86400000 <= 31
  }).length, [data.activity_map]) // eslint-disable-line

  const cellColor = (count: number) => {
    if (count === 0) return "bg-secondary/40"
    if (count === 1) return "bg-primary/30"
    if (count === 2) return "bg-primary/55"
    if (count <= 4) return "bg-primary/75"
    return "bg-primary"
  }

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-serif text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> Activity Heatmap
        </h3>
        <span className="text-xs text-muted-foreground">{activeCount}/31 days</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Current Streak", value: data.streak,          icon: "🔥", color: "text-streak"  },
          { label: "Best Streak",    value: data.longest_streak,  icon: "⚡", color: "text-warning" },
          { label: "Days Active",    value: activeCount,          icon: "📅", color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="text-center bg-secondary/30 rounded-lg py-2 px-1">
            <div className="text-base font-bold font-serif">
              <span>{s.icon} </span><span className={s.color}>{s.value}</span>
            </div>
            <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((d, i) => (
          <motion.div key={d.key}
            className={`aspect-square rounded-sm cursor-default transition-all hover:scale-110 hover:brightness-125 ${cellColor(d.count)}`}
            title={`${d.key}: ${d.count} activities`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.008 }}
          />
        ))}
      </div>

      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Weekly Activity</p>
        <div className="flex items-end gap-1" style={{ height: 52 }}>
          {weeklyData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5" style={{ height: "100%" }}>
              <motion.div
                className="w-full rounded-sm bg-primary/40 hover:bg-primary/70 transition-colors cursor-default"
                style={{ height: `${Math.max(4, (val / maxW) * 100)}%` }}
                initial={{ scaleY: 0, originY: "100%" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                title={`${val} activities`}
              />
              <span className="text-[8px] text-muted-foreground/60">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

// ── College Leaderboard Card ──────────────────────────────────────────────────
function CollegeLeaderboardCard({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  const top3 = leaderboard.slice(0, 3)

  const listStudents = useMemo(() => {
    if (!leaderboard.length) return []
    const idx = leaderboard.findIndex(s => s.is_current_user)
    if (idx === -1) return leaderboard.slice(0, 6)
    const start = Math.max(0, Math.min(idx - 2, leaderboard.length - 6))
    return leaderboard.slice(start, start + 6)
  }, [leaderboard])

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3
  const podiumH = ["h-12", "h-20", "h-8"]
  const podiumLabel = ["#2", "#1", "#3"]
  const podiumColor = ["text-muted-foreground", "text-warning", "text-streak"]

  const initials = (name: string) => name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-serif text-foreground flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" /> College Leaderboard
        </h3>
        <Link href="/leaderboard" className="text-xs text-primary hover:underline">View all</Link>
      </div>

      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-2 mb-4">
          {podiumOrder.map((s, i) => (
            <div key={s.rank} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ${s.is_current_user ? "ring-2 ring-primary bg-primary/20 text-primary" : i === 1 ? "bg-warning/20 text-warning" : "bg-secondary text-foreground"}`}>
                {s.is_current_user ? "You" : initials(s.name)}
              </div>
              <div className={`w-12 rounded-t flex items-end justify-center pb-1 ${podiumH[i]} ${i === 1 ? "bg-warning/20" : "bg-secondary/40"}`}>
                <span className={`text-[10px] font-bold ${podiumColor[i]}`}>{podiumLabel[i]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {leaderboard.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No leaderboard data yet</p>
      ) : (
        <div className="space-y-1.5">
          {listStudents.map((s, i) => (
            <motion.div key={s.rank}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${s.is_current_user ? "bg-primary/10 border border-primary/20" : "bg-secondary/20 hover:bg-secondary/40"} transition-colors`}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
              <span className={`text-xs font-bold w-6 text-center ${s.rank <= 3 ? "text-warning" : "text-muted-foreground"}`}>#{s.rank}</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${s.is_current_user ? "bg-primary/20 text-primary" : "bg-secondary text-foreground"}`}>
                {s.is_current_user ? "You" : initials(s.name)}
              </div>
              <span className={`flex-1 text-xs font-medium truncate ${s.is_current_user ? "text-primary" : "text-foreground"}`}>
                {s.is_current_user ? "You" : s.name}
              </span>
              <span className="text-xs text-warning font-semibold">🔥 {s.points.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}

// ── Active Courses ────────────────────────────────────────────────────────────
function ActiveCoursesCard({ courses }: { courses: CourseProgress[] }) {
  const barColors = ["bg-success", "bg-primary", "bg-warning"]
  const activeCourses = courses.filter(c => c.percentage < 100).slice(0, 3)

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-serif text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Active Courses
        </h3>
        <Link href="/learn" className="text-xs text-primary hover:underline">All courses</Link>
      </div>
      {activeCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <p className="text-sm text-muted-foreground">No courses in progress yet</p>
          <Link href="/learn">
            <button className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
              Browse Courses →
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCourses.map((c, i) => (
            <motion.div key={c.course_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <Link href="/learn">
                <div className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{c.course_title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.completed} of {c.total} lessons complete</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{c.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                      <motion.div className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                        initial={{ width: 0 }} animate={{ width: `${c.percentage}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.1 }} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}

// ── Upcoming Drives ───────────────────────────────────────────────────────────
function UpcomingDrivesCard({ jobs, data }: { jobs: Job[]; data: DashboardData }) {
  const base = Math.min(100, Math.round(data.points / 50))

  const driveColors = [
    "bg-primary/15 text-primary",
    "bg-success/15 text-success",
    "bg-coding/15 text-coding",
    "bg-warning/15 text-warning",
  ]

  const drives = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const withDeadline = jobs
      .filter(j => j.deadline)
      .map(j => {
        const dl = new Date(j.deadline!)
        dl.setHours(0, 0, 0, 0)
        const daysAway = Math.ceil((dl.getTime() - today.getTime()) / 86400000)
        return { ...j, daysAway }
      })
      .filter(j => j.daysAway > 0)
      .sort((a, b) => a.daysAway - b.daysAway)
      .slice(0, 3)

    if (withDeadline.length > 0) return withDeadline

    // Fallback: show recent jobs even without deadline
    return jobs.slice(0, 3).map(j => ({ ...j, daysAway: null as number | null }))
  }, [jobs])

  const abbr = (company: string) =>
    company.split(" ").slice(0, 3).map(w => w[0]).join("").toUpperCase().slice(0, 4)

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-serif text-foreground flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-primary" /> Upcoming Drives
        </h3>
        <span className="text-xs bg-warning/15 text-warning px-2 py-0.5 rounded-full font-semibold">{drives.length} upcoming</span>
      </div>
      {drives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <p className="text-sm text-muted-foreground">No upcoming drives posted yet</p>
          <Link href="/jobs">
            <button className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
              View Jobs →
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {drives.map((d, i) => {
            const ready = Math.min(100, base + (i === 0 ? 4 : i === 1 ? 11 : -5 < 0 ? 0 : base - 5))
            return (
              <motion.div key={d.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${driveColors[i % driveColors.length]}`}>
                    {abbr(d.company)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{d.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.daysAway != null ? `⚡ ${d.daysAway} days away` : "📋 Applications open"}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${ready >= 70 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                    {ready}% Ready
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </GlassCard>
  )
}

// ── Weekly Missions ───────────────────────────────────────────────────────────
function WeeklyMissionsCard({ data }: { data: DashboardData }) {
  const missions = [
    { label: "Solve 3 coding problems",          done: data.solved_count >= 3 },
    { label: "Score 80%+ on any assignment",      done: data.best_assignment_pct >= 80 },
    { label: "Practice 20 MCQs this week",        done: data.mcq_week_count >= 20 },
    { label: "Complete 1 lesson this week",       done: data.lesson_week_count >= 1 },
    { label: "Maintain a daily streak",           done: data.streak >= 1 },
  ]
  const done = missions.filter(m => m.done).length
  const pct  = Math.round((done / missions.length) * 100)
  const daysLeft = 7 - new Date().getDay()

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-serif text-foreground">🎯 Weekly Missions</h3>
        <span className="text-xs text-muted-foreground">{done} of {missions.length} done</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">{pct}% · {daysLeft} days left</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {missions.map((m, i) => (
          <motion.div key={m.label}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${m.done ? "bg-success/8 border border-success/15" : "bg-secondary/20 hover:bg-secondary/40"}`}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
            {m.done
              ? <CheckSquare className="h-4 w-4 text-success flex-shrink-0" />
              : <Square className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />}
            <span className={`text-xs leading-snug ${m.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{m.label}</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

// ── Intelligence & Insights ───────────────────────────────────────────────────
function InsightsRow({ data }: { data: DashboardData }) {
  const pointItems = [
    { label: "Assignment due", pts: 30, icon: "📋" },
    { label: "5 MCQs",         pts: 15, icon: "❓" },
    { label: "1 Problem",      pts: 30, icon: "💻" },
    { label: "Streak bonus",   pts: 25, icon: "🔥" },
    ...(data.mcq_accuracy < 70 && data.mcq_accuracy > 0
      ? [{ label: "Weak area practice", pts: 40, icon: "⚠️" }]
      : [{ label: "Extra credit",       pts: 20, icon: "⭐" }]),
  ]
  const totalAvail = pointItems.reduce((s, p) => s + p.pts, 0)

  const codingPct = Math.min(100, Math.round((data.solved_count / 50) * 100))
  const weakerArea = codingPct <= data.mcq_accuracy ? "Coding Practice" : "MCQ Practice"
  const weakerPct  = codingPct <= data.mcq_accuracy ? codingPct : data.mcq_accuracy

  // Derived achievements from real stats
  const achievements = useMemo(() => {
    const list: { name: string; emoji: string; pts: number; desc: string }[] = []
    if (data.streak >= 7)              list.push({ name: `${data.streak}-Day Streak`,    emoji: "🔥", pts: 25, desc: "Active streak" })
    if (data.streak >= 30)             list.push({ name: "30-Day Warrior",               emoji: "⚡", pts: 100, desc: "Monthly streak" })
    if (data.solved_count >= 1)        list.push({ name: "First Problem Solved",         emoji: "💻", pts: 30, desc: `${data.solved_count} solved total` })
    if (data.solved_count >= 10)       list.push({ name: "10 Problems Solved",           emoji: "🧠", pts: 50, desc: "Coding milestone" })
    if (data.best_assignment_pct >= 80) list.push({ name: "Assignment Star",             emoji: "📋", pts: 50, desc: `${data.best_assignment_pct}% best score` })
    if (data.mcq_accuracy >= 80)       list.push({ name: "MCQ Master",                  emoji: "❓", pts: 40, desc: `${data.mcq_accuracy}% accuracy` })
    if (list.length === 0)             list.push({ name: "Getting Started",             emoji: "🌱", pts: 0,  desc: "Keep going!" })
    return list.slice(0, 4)
  }, [data])

  const badgeGap = Math.max(0, 5000 - data.points)

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Intelligence &amp; Insights</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Points Available Today */}
        <GlassCard>
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">⚡ Points Available Today</h4>
          <motion.p className="text-3xl font-bold font-serif text-warning mb-1"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}>
            +{totalAvail}
          </motion.p>
          <p className="text-xs text-muted-foreground mb-3">pts waiting to be earned</p>
          <div className="space-y-1.5">
            {pointItems.map((p) => (
              <div key={p.label} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{p.icon} {p.label}</span>
                <span className="text-xs font-semibold text-warning">+{p.pts}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Needs Attention */}
        <GlassCard>
          <h4 className="text-xs font-semibold text-foreground mb-3">⚠️ Needs Attention</h4>
          <span className="inline-block px-2.5 py-1 rounded-full bg-danger/15 text-danger text-xs font-semibold mb-2">🎯 {weakerArea}</span>
          <motion.p className="text-3xl font-bold font-serif text-danger mb-1"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35, type: "spring" }}>
            {weakerPct}%
          </motion.p>
          <p className="text-xs text-muted-foreground mb-3">
            {data.mcq_accuracy > 0
              ? `MCQ accuracy: ${data.mcq_accuracy}% · Coding: ${codingPct}%`
              : "Start practicing to see your accuracy"}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            10 minutes of focused practice can push you above 70%.
          </p>
          <Link href={weakerArea === "Coding Practice" ? "/coding" : "/practice-mcq"}>
            <button className="w-full py-2 rounded-lg bg-danger/15 hover:bg-danger/25 text-danger text-xs font-semibold transition-colors">
              Practice Now · +{data.mcq_accuracy < 70 && data.mcq_accuracy > 0 ? 40 : 30} pts
            </button>
          </Link>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-foreground">📋 Recent Activity</h4>
            <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">{data.recent_activity.length} events</span>
          </div>
          {data.recent_activity.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No activity yet — start learning!</p>
          ) : (
            <div className="space-y-2.5 mb-3">
              {data.recent_activity.slice(0, 4).map((a) => {
                const { Icon, color, bg } = getActionMeta(a.action)
                const timeAgo = (() => {
                  const diff = Date.now() - new Date(a.created_at).getTime()
                  const mins = Math.floor(diff / 60000)
                  if (mins < 60) return `${mins}m ago`
                  const hrs = Math.floor(mins / 60)
                  if (hrs < 24) return `${hrs}h ago`
                  return `${Math.floor(hrs / 24)}d ago`
                })()
                return (
                  <div key={a.id} className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-3.5 w-3.5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{a.action}</p>
                      <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>

        {/* Achievements */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-foreground">🏅 Achievements</h4>
            <span className="text-xs text-primary cursor-pointer hover:underline">{achievements.length} earned</span>
          </div>
          <div className="space-y-2.5 mb-3">
            {achievements.map((b, i) => (
              <motion.div key={b.name} className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <span className="text-lg flex-shrink-0">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                </div>
                {b.pts > 0 && <span className="text-xs text-success font-semibold">+{b.pts}</span>}
              </motion.div>
            ))}
          </div>
          {badgeGap > 0 && (
            <div className="text-[10px] text-muted-foreground bg-secondary/30 rounded px-2 py-1.5">
              Next: <span className="text-primary font-semibold">Placement Warrior</span> at 5,000 pts — {badgeGap.toLocaleString()} away
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, updateUser } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/student/dashboard"),
      api.get("/student/leaderboard?scope=college"),
      api.get("/jobs/"),
    ])
      .then(([dashRes, lbRes, jobsRes]) => {
        setData(dashRes.data)
        setLeaderboard(lbRes.data)
        setJobs(jobsRes.data)
        updateUser({
          points: dashRes.data.points,
          streak: dashRes.data.streak,
          college_name: dashRes.data.college_name ?? undefined,
          college_logo_url: dashRes.data.college_logo_url ?? undefined,
        })
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const firstName = (() => {
    const n = user?.name?.split(" ")[0] ?? "Student"
    return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()
  })()

  const readinessScore = data
    ? Math.min(100, Math.round((data.solved_count / 50) * 30 + (data.streak / 30) * 20 + (data.points / 5000) * 50))
    : 0

  const STAT_CARDS = [
    { title: "Readiness Score", value: readinessScore,          prefix: "",  suffix: "",       icon: Target, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { title: "Total Points",    value: data?.points ?? 0,       prefix: "",  suffix: "",       icon: Star,   color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { title: "Day Streak",      value: data?.streak ?? 0,       prefix: "",  suffix: " days",  icon: Flame,  color: "text-streak",  bg: "bg-streak/10",  border: "border-streak/20"  },
    { title: "Problems Solved", value: data?.solved_count ?? 0, prefix: "",  suffix: "",       icon: Code2,  color: "text-coding",  bg: "bg-coding/10",  border: "border-coding/20"  },
  ]

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <motion.div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/60 via-background to-background px-6 py-7"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="absolute -top-14 -left-14 w-52 h-52 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-44 h-44 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground leading-tight"
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              {(() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })()}, <span className="gradient-text">{firstName}</span> 👋
            </motion.h1>
            <motion.p className="text-sm text-muted-foreground mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              {user?.college_name
                ? `${user.college_name} · Continue your placement preparation`
                : "Continue your placement preparation journey"}
            </motion.p>
          </div>
          {data && (
            <motion.div className="flex items-center gap-2 flex-wrap" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 220 }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-warning/25 bg-warning/10">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-sm font-bold text-warning">{data.points.toLocaleString()} pts</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-streak/25 bg-streak/10">
                <motion.span className="text-lg" animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1.5 }}>🔥</motion.span>
                <div>
                  <p className="text-sm font-bold text-streak leading-tight">{data.streak}-day streak</p>
                  <p className="text-[10px] text-streak/60">Best: {data.longest_streak} days</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Rank alert banner ── */}
      {data && data.rank > 1 && (
        <motion.div className="relative overflow-hidden rounded-xl border border-warning/20 bg-gradient-to-r from-warning/8 via-warning/5 to-primary/5 px-5 py-4"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <motion.div className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-warning to-transparent w-full"
            initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">
                You&apos;re ranked <span className="text-primary">#{data.rank}</span> in your college 👀
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keep solving problems — every point counts toward climbing the leaderboard!
              </p>
            </div>
            <Link href="/leaderboard" className="flex-shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:bg-secondary/50 text-xs font-semibold text-foreground transition-colors">
                <Trophy className="h-3.5 w-3.5 text-warning" /> View Leaderboard
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Quote banner ── */}
      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <QuoteBanner streak={data.streak} />
        </motion.div>
      )}

      {/* ── XP Level card ── */}
      {data && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
          <LevelCard points={data.points} />
        </motion.div>
      )}

      {/* ── Stat cards ── */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.38 } } }}>
        {STAT_CARDS.map((s) => (
          <motion.div key={s.title} variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}>
            <GlassCard hover className={`relative overflow-hidden border ${s.border}`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">{s.title}</p>
              <p className="text-2xl font-bold font-serif text-foreground mt-1">
                {s.prefix}<AnimatedNumber value={s.value} />{s.suffix}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 3-col: Placement Readiness | Heatmap | Leaderboard ── */}
      {data && (
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <PlacementReadinessCard data={data} />
          <ActivityHeatmapCard data={data} />
          <CollegeLeaderboardCard leaderboard={leaderboard} />
        </motion.div>
      )}

      {/* ── 2-col: Active Courses | Upcoming Drives ── */}
      {data && (
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ActiveCoursesCard courses={data.course_progress} />
          <UpcomingDrivesCard jobs={jobs} data={data} />
        </motion.div>
      )}

      {/* ── Weekly Missions ── */}
      {data && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <WeeklyMissionsCard data={data} />
        </motion.div>
      )}

      {/* ── Intelligence & Insights ── */}
      {data && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <InsightsRow data={data} />
        </motion.div>
      )}

      {/* ── Streak Calendar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        <StreakCalendar
          activityMap={data?.activity_map ?? {}}
          currentStreak={data?.streak ?? 0}
          longestStreak={data?.longest_streak ?? 0}
        />
      </motion.div>

    </div>
  )
}
