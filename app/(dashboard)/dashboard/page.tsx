"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { StreakCalendar } from "@/components/streak-calendar"
import { FeedbackModal } from "@/components/feedback-modal"
import {
  Trophy, Star, Flame, Code2, FileQuestion, Loader2, Quote, Zap,
  BookOpen, ClipboardList, BriefcaseBusiness, Newspaper, MessageSquare,
  ChevronRight,
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
import { UserAvatar } from "@/components/user-avatar"
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
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const m = Math.floor(diffMs / 60000)
  if (m < 1) return "Just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  return days === 1 ? "Yesterday" : `${days} days ago`
}

function getActionMeta(action: string): { Icon: LucideIcon; color: string; bg: string } {
  const a = action.toLowerCase()
  if (a.includes("lesson"))                       return { Icon: BookOpen,          color: "text-primary",     bg: "bg-primary/15" }
  if (a.includes("assignment"))                   return { Icon: ClipboardList,     color: "text-warning", bg: "bg-warning/15" }
  if (a.includes("code") || a.includes("coding")) return { Icon: Code2,             color: "text-coding",  bg: "bg-coding/15"  }
  if (a.includes("job"))                          return { Icon: BriefcaseBusiness, color: "text-primary", bg: "bg-primary/15" }
  if (a.includes("post"))                         return { Icon: Newspaper,         color: "text-coral",   bg: "bg-coral/15"   }
  if (a.includes("comment"))                      return { Icon: MessageSquare,     color: "text-success", bg: "bg-success/15" }
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

// ── XP Level card with SVG ring ───────────────────────────────────────────────
function LevelCard({ points }: { points: number }) {
  const { current, next, progressPct, pointsNeeded } = getLevelProgress(points)
  const R = 48
  const circumference = 2 * Math.PI * R

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute -top-14 -right-14 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: current.barColor }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Ring */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" className="-rotate-90">
            <circle
              cx="60" cy="60" r={R}
              fill="none"
              stroke="currentColor"
              className="text-secondary/80"
              strokeWidth="9"
            />
            <motion.circle
              cx="60" cy="60" r={R}
              fill="none"
              stroke={current.barColor}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (progressPct / 100) * circumference }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.35 }}
              style={{ filter: `drop-shadow(0 0 6px ${current.barColor}99)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl leading-none"
              animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ delay: 0.65, duration: 0.7 }}
            >
              {current.emoji}
            </motion.span>
            <span className="text-[10px] text-muted-foreground mt-1">Lv.{current.level}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Level</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <p className={`text-3xl font-bold font-serif leading-tight ${current.color}`}>{current.name}</p>
            {(() => {
              const shield = getShield(points)
              if (shield.tier === 0) return null
              return (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    background: `linear-gradient(135deg, ${shield.gradientFrom}20, ${shield.gradientTo}15)`,
                    borderColor: `${shield.gradientFrom}50`,
                    color: shield.gradientFrom,
                    boxShadow: `0 0 8px ${shield.glowColor}`,
                  }}
                >
                  {shield.emoji} {shield.name}
                </span>
              )
            })()}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <span className="text-2xl font-bold font-serif text-foreground">
              <AnimatedNumber value={points} />
            </span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>

          {next ? (
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${current.barColor}66, ${current.barColor})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progressPct}% complete</span>
                <span>
                  <span style={{ color: next.barColor }}>{next.emoji} {next.name}</span>
                  <span className="opacity-60"> in {pointsNeeded} pts</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                👑
              </motion.span>
              <p className="text-sm font-semibold text-warning">Maximum level — You're a Legend.</p>
            </div>
          )}
        </div>

        {/* Next level badge */}
        {next && (
          <div
            className="hidden lg:flex flex-col items-center px-5 py-4 rounded-2xl border flex-shrink-0"
            style={{ borderColor: `${current.barColor}30`, background: `${current.barColor}0D` }}
          >
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
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-coding/5 px-5 py-4">
            {/* Shimmer */}
            <motion.div
              className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
            />

            <div className="flex items-start gap-3">
              <motion.div
                className="flex-shrink-0 p-2 rounded-lg bg-primary/15 mt-0.5"
                animate={{ rotate: [0, -6, 6, -3, 3, 0] }}
                transition={{ delay: 1.8, duration: 0.7 }}
              >
                <Quote className="h-4 w-4 text-primary" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  &ldquo;{typed}
                  {!done && (
                    <motion.span
                      className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 align-middle rounded-sm"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  )}
                  &rdquo;
                </p>
                <motion.p
                  className="text-xs text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: done ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  — {quote.author}
                </motion.p>
              </div>

              <button
                onClick={() => setVisible(false)}
                className="flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground text-xs leading-none mt-0.5 transition-colors"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>

            {streak >= 7 && (
              <motion.div
                className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-15 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🔥
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, updateUser } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/student/dashboard")
      .then((res) => {
        setData(res.data)
        updateUser({
          points: res.data.points,
          streak: res.data.streak,
          college_name: res.data.college_name ?? undefined,
          college_logo_url: res.data.college_logo_url ?? undefined,
        })
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

  const firstName = (() => {
    const n = user?.name?.split(" ")[0] ?? "Student"
    return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()
  })()

  const STAT_CARDS = [
    { title: "Total Points",    value: data?.points ?? 0,       prefix: "",  suffix: "",       icon: Star,          color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { title: "Problems Solved", value: data?.solved_count ?? 0, prefix: "",  suffix: "",       icon: Code2,         color: "text-coding",  bg: "bg-coding/10",  border: "border-coding/20"  },
    { title: "Current Streak",  value: data?.streak ?? 0,       prefix: "",  suffix: " days",  icon: Flame,         color: "text-streak",  bg: "bg-streak/10",  border: "border-streak/20"  },
    { title: "College Rank",    value: data?.rank ?? 0,         prefix: "#", suffix: "",       icon: Trophy,        color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  ]

  const QUICK_ACTIONS = [
    { href: "/coding",       icon: Code2,          color: "text-coding",  bg: "bg-coding/10",  border: "border-coding/20",  label: "Solve Problem",   desc: "Practice coding challenges" },
    { href: "/practice-mcq", icon: FileQuestion,   color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Practice MCQ",    desc: "Test your knowledge" },
    { href: "/learn",        icon: BookOpen,       color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Learn",           desc: "Continue your course" },
    { href: "/leaderboard",  icon: Trophy,         color: "text-streak",  bg: "bg-streak/10",  border: "border-streak/20",  label: "Leaderboard",     desc: `#${data?.rank ?? "—"} in college` },
  ]

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/60 via-background to-background px-6 py-7"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Floating glow orbs */}
        <div className="absolute -top-14 -left-14 w-52 h-52 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-44 h-44 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold font-serif text-foreground leading-tight"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              Welcome back, <span className="gradient-text">{firstName}</span> 👋
            </motion.h1>
            <motion.p
              className="text-sm text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {user?.college_name
                ? `${user.college_name} · Continue your placement preparation`
                : "Continue your placement preparation journey"}
            </motion.p>
          </div>

          {/* Streak badge */}
          {data && (
            <motion.div
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-streak/25 bg-streak/10 self-start sm:self-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 220 }}
            >
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1.5 }}
              >
                🔥
              </motion.span>
              <div>
                <p className="text-sm font-bold text-streak leading-tight">{data.streak} day streak</p>
                <p className="text-[10px] text-streak/60">Best: {data.longest_streak} days</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Quote banner ── */}
      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <QuoteBanner streak={data.streak} />
        </motion.div>
      )}

      {/* ── XP Level card ── */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <LevelCard points={data.points} />
        </motion.div>
      )}

      {/* ── Stat cards ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.38 } } }}
      >
        {STAT_CARDS.map((s) => (
          <motion.div
            key={s.title}
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
          >
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

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity feed */}
        <div className="lg:col-span-2">
          <GlassCard className="flex flex-col h-[420px]">
            <h2 className="text-base font-semibold font-serif text-foreground mb-4 flex-shrink-0">
              Recent Activity
            </h2>

            {data && data.recent_activity.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {data.recent_activity.map((item, i) => {
                  const { Icon, color, bg } = getActionMeta(item.action)
                  return (
                    <motion.div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.42 + i * 0.04 }}
                    >
                      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.action}</p>
                        {item.details?.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.details.description}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.details?.points && (
                          <p className="text-xs font-semibold text-primary">+{item.details.points} pts</p>
                        )}
                        <p className="text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <Zap className="h-7 w-7 text-primary/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Start solving problems to see your progress</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <GlassCard>
            <h3 className="text-base font-semibold font-serif text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((a, i) => (
                <motion.div
                  key={a.href}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                >
                  <Link href={a.href}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${a.border} ${a.bg} hover:brightness-110 transition-all group cursor-pointer`}>
                      <div className="w-8 h-8 rounded-lg bg-background/30 flex items-center justify-center flex-shrink-0">
                        <a.icon className={`h-4 w-4 ${a.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-3">
              <FeedbackModal />
            </div>
          </GlassCard>

          {/* Standing */}
          {data && (
            <GlassCard>
              <h3 className="text-sm font-semibold font-serif text-foreground mb-3">Your Standing</h3>
              <div className="space-y-3">
                {[
                  { label: "Rank in college",  value: `#${data.rank} / ${data.total_in_college}` },
                  { label: "Problems solved",  value: data.solved_count },
                  { label: "Longest streak",   value: `${data.longest_streak} days` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{row.label}</span>
                    <span className="text-xs font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* ── Streak Calendar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <StreakCalendar
          activityMap={data?.activity_map ?? {}}
          currentStreak={data?.streak ?? 0}
          longestStreak={data?.longest_streak ?? 0}
        />
      </motion.div>
    </div>
  )
}
