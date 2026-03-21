"use client"

import { useState, useMemo, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import { Flame, Trophy, Zap, CalendarDays, ChevronLeft, ChevronRight, BarChart2, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface StreakCalendarProps {
  activityMap?: Record<string, number>
  currentStreak: number
  longestStreak?: number
  activeDays?: number[] // legacy compat
}

const MONTHS       = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const WEEK_DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (!count) return 0
  if (count === 1) return 1
  if (count <= 3)  return 2
  if (count <= 6)  return 3
  return 4
}

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const LEVEL_STYLE: Record<number, string> = {
  0: "bg-white/[0.04] border border-white/[0.07]",
  1: "bg-primary/20 border border-primary/30",
  2: "bg-primary/40 border border-primary/55",
  3: "bg-primary/65 border border-primary/75 shadow-[0_0_7px_rgba(0,212,200,0.3)]",
  4: "bg-primary/90 border border-primary shadow-[0_0_12px_rgba(0,212,200,0.55)]",
}

export function StreakCalendar({
  activityMap = {},
  currentStreak,
  longestStreak = 0,
}: StreakCalendarProps) {
  const [view, setView]         = useState<"year" | "month">("year")
  const [navMonth, setNavMonth] = useState(() => new Date())
  const [hovered, setHovered]   = useState<string | null>(null)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])
  const todayStr = toYMD(today)

  // ── Year heatmap data ───────────────────────────────────────────────────────
  const { weeks, monthLabels } = useMemo(() => {
    const end   = new Date(today)
    const start = new Date(today)
    start.setDate(start.getDate() - 364)
    start.setDate(start.getDate() - start.getDay()) // back to Sunday

    const days: Date[] = []
    const cur = new Date(start)
    while (cur <= end || days.length % 7 !== 0) {
      days.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }

    const weeks: Date[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

    const seen = new Set<number>()
    const monthLabels: { wi: number; label: string }[] = []
    weeks.forEach((week, wi) => {
      week.forEach(d => {
        const m = d.getMonth()
        if (!seen.has(m)) { seen.add(m); monthLabels.push({ wi, label: MONTHS_SHORT[m] }) }
      })
    })
    return { weeks, monthLabels }
  }, [today])

  // ── Month calendar data ─────────────────────────────────────────────────────
  const { calCells, calYear, calMonth } = useMemo(() => {
    const y = navMonth.getFullYear()
    const m = navMonth.getMonth()
    const firstDow    = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const cells: (number | null)[] = [
      ...Array(firstDow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7 !== 0) cells.push(null)
    return { calCells: cells, calYear: y, calMonth: m }
  }, [navMonth])

  // ── This Week strip ─────────────────────────────────────────────────────────
  const thisWeek = useMemo(() => {
    const days: Date[] = []
    const d   = new Date(today)
    const dow = d.getDay() // 0=Sun
    d.setDate(d.getDate() - dow) // rewind to Sunday
    for (let i = 0; i < 7; i++) { days.push(new Date(d)); d.setDate(d.getDate() + 1) }
    return days
  }, [today])

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalContributions = useMemo(() => Object.values(activityMap).reduce((s, v) => s + v, 0), [activityMap])
  const activeCount        = Object.keys(activityMap).length
  const hoveredCount       = hovered ? (activityMap[hovered] ?? 0) : 0

  const canGoNext = !(calYear === today.getFullYear() && calMonth === today.getMonth())

  return (
    <GlassCard>

      {/* ══ Header ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-semibold font-serif text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Activity Graph
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalContributions} contributions · last 365 days
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Year / Month toggle */}
          <div className="flex bg-secondary/60 rounded-lg p-0.5 border border-border/40">
            {(["year", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                  view === v
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "year" ? <BarChart2 className="h-3 w-3" /> : <LayoutGrid className="h-3 w-3" />}
                {v}
              </button>
            ))}
          </div>

          {/* Streak badge */}
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-xl px-3.5 py-2">
            <Flame className="h-5 w-5 text-orange-500 flame-pulse flex-shrink-0" />
            <div>
              <p className="text-lg font-bold font-serif text-foreground leading-none">{currentStreak}</p>
              <p className="text-[10px] text-orange-400 font-medium">day streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Stat chips ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: Flame,  color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", label: "Current", value: currentStreak, sub: "days"   },
          { icon: Trophy, color: "text-amber-500",  bg: "bg-amber-500/10  border-amber-500/20",  label: "Best",    value: longestStreak, sub: "days"   },
          { icon: Zap,    color: "text-primary",    bg: "bg-primary/10    border-primary/20",    label: "Active",  value: activeCount,   sub: "/ year" },
        ].map(({ icon: Icon, color, bg, label, value, sub }) => (
          <div key={label} className={cn("rounded-xl p-3 text-center border", bg)}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon className={cn("h-3.5 w-3.5", color)} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-xl font-bold font-serif text-foreground leading-none">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* ══ This Week strip ═════════════════════════════════════════════════ */}
      <div className="mb-5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-medium">This Week</p>
        <div className="grid grid-cols-7 gap-1.5">
          {thisWeek.map((d) => {
            const ds    = toYMD(d)
            const count = activityMap[ds] ?? 0
            const isT   = ds === todayStr
            const isFut = d > today
            const level = isFut ? -1 : getLevel(count)
            return (
              <div key={ds} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-muted-foreground/50 font-medium">{WEEK_DAYS[d.getDay()]}</span>
                <div
                  onMouseEnter={() => setHovered(ds)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "w-full aspect-square rounded-lg flex items-center justify-center",
                    "text-[11px] font-semibold transition-all duration-150 cursor-default",
                    isFut  && "bg-white/4 text-muted-foreground/20",
                    !isFut && level === 0 && !isT && "bg-secondary/50 border border-border/40 text-muted-foreground/60",
                    !isFut && level > 0   && LEVEL_STYLE[level] + " text-primary",
                    isT    && level === 0 && "bg-amber-500/10 border-2 border-amber-500/50 text-amber-400",
                    isT    && level > 0   && LEVEL_STYLE[level] + " ring-2 ring-amber-400/60 text-primary",
                    hovered === ds && !isFut && "scale-105",
                  )}
                >
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══ Main view (Year / Month) ═════════════════════════════════════════ */}
      <AnimatePresence mode="wait">

        {/* ── Year heatmap ──────────────────────────────────────────────── */}
        {view === "year" && (
          <motion.div
            key="year"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-x-auto pb-1 -mx-1 px-1">
              <div className="inline-flex min-w-0">

                {/* Day-of-week labels (alternating) */}
                <div className="flex flex-col gap-[3px] mr-2 pt-6 flex-shrink-0">
                  {["","Mon","","Wed","","Fri",""].map((lbl, i) => (
                    <div key={i} className="h-[13px] w-7 text-[9px] text-muted-foreground/50 leading-none flex items-center">
                      {lbl}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col">
                  {/* Month labels */}
                  <div className="flex gap-[3px] mb-[3px] h-5">
                    {weeks.map((_, wi) => {
                      const lbl = monthLabels.find(m => m.wi === wi)
                      return (
                        <div key={wi} className="w-[13px] text-[9px] text-muted-foreground/70 font-medium leading-none flex items-end">
                          {lbl?.label ?? ""}
                        </div>
                      )
                    })}
                  </div>

                  {/* Cell columns */}
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((date) => {
                          const ds    = toYMD(date)
                          const isFut = date > today
                          const isT   = ds === todayStr
                          const count = activityMap[ds] ?? 0
                          const level = isFut ? -1 : getLevel(count)
                          const delay = mounted ? 0 : (wi * 2.5) / 1000

                          return (
                            <motion.div
                              key={ds}
                              initial={{ opacity: 0, scale: 0.3 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay, duration: 0.12, ease: "easeOut" }}
                              onMouseEnter={() => setHovered(ds)}
                              onMouseLeave={() => setHovered(null)}
                              className={cn(
                                "w-[13px] h-[13px] rounded-[3px] transition-all duration-150 cursor-default",
                                isFut
                                  ? "bg-white/[0.03] border border-white/[0.05] opacity-25"
                                  : LEVEL_STYLE[level],
                                isT   && "ring-[1.5px] ring-amber-400/75 ring-offset-0",
                                hovered === ds && !isFut && "scale-110 brightness-125",
                              )}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
              <span className="text-[10px] text-muted-foreground">Less</span>
              <div className="flex items-center gap-1.5">
                {([0, 1, 2, 3, 4] as const).map(l => (
                  <div key={l} className={cn("w-[13px] h-[13px] rounded-[3px]", LEVEL_STYLE[l])} />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">More</span>
              <div className="flex items-center gap-1.5 ml-4">
                <div className="w-[13px] h-[13px] rounded-[3px] bg-white/[0.04] border border-white/[0.07] ring-[1.5px] ring-amber-400/75" />
                <span className="text-[10px] text-muted-foreground">Today</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Month calendar ─────────────────────────────────────────────── */}
        {view === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => { const d = new Date(navMonth); d.setMonth(d.getMonth() - 1); setNavMonth(d) }}
                className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h4 className="text-sm font-semibold text-foreground">
                {MONTHS[calMonth]} {calYear}
              </h4>
              <button
                onClick={() => { const d = new Date(navMonth); d.setMonth(d.getMonth() + 1); setNavMonth(d) }}
                disabled={!canGoNext}
                className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1.5">
              {WEEK_DAYS.map(d => (
                <div key={d} className="text-center text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wide py-0.5">
                  {d.slice(0, 2)}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calCells.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} className="aspect-square" />

                const ds    = `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
                const isFut = new Date(ds + "T00:00:00") > today
                const isT   = ds === todayStr
                const count = activityMap[ds] ?? 0
                const level = isFut ? -1 : getLevel(count)

                return (
                  <motion.div
                    key={ds}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.007, duration: 0.15 }}
                    onMouseEnter={() => setHovered(ds)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5",
                      "text-xs font-medium transition-all duration-150 cursor-default select-none",
                      isFut  && "bg-white/[0.03] text-muted-foreground/20",
                      !isFut && level === 0 && !isT && [
                        "bg-secondary/40 border border-border/30 text-muted-foreground/60",
                        "hover:bg-secondary/60",
                      ],
                      !isFut && level > 0 && !isT && [LEVEL_STYLE[level], "text-primary"],
                      isT    && level === 0 && "bg-amber-500/10 border-2 border-amber-500/50 text-amber-400",
                      isT    && level > 0   && [LEVEL_STYLE[level], "ring-2 ring-amber-400/60 text-primary"],
                      hovered === ds && !isFut && "scale-105",
                    )}
                  >
                    <span className="leading-none text-[11px]">{day}</span>
                    {/* dot or count */}
                    {count >= 2 && !isFut && (
                      <span className="text-[8px] opacity-75 leading-none font-bold">{count}</span>
                    )}
                    {count === 1 && !isFut && level > 0 && (
                      <div className="w-1 h-1 rounded-full bg-current opacity-70" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Month stats */}
            {(() => {
              const prefix = `${calYear}-${String(calMonth + 1).padStart(2,"0")}-`
              const monthActive = Object.keys(activityMap).filter(k => k.startsWith(prefix)).length
              const daysGone    = calYear === today.getFullYear() && calMonth === today.getMonth()
                ? today.getDate()
                : new Date(calYear, calMonth + 1, 0).getDate()
              const pct = daysGone ? Math.round((monthActive / daysGone) * 100) : 0
              return (
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Monthly consistency</span>
                    <span className={cn(
                      "font-semibold",
                      pct >= 70 ? "text-primary" : pct >= 40 ? "text-amber-400" : "text-muted-foreground",
                    )}>
                      {monthActive} / {daysGone} days ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        pct >= 70 ? "bg-gradient-to-r from-primary to-cyan-400"
                        : pct >= 40 ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-muted-foreground/40",
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Info bar ════════════════════════════════════════════════════════ */}
      <div className={cn(
        "mt-4 h-9 flex items-center justify-center gap-2 rounded-xl border transition-all duration-150 text-xs px-4",
        hovered
          ? hoveredCount > 0
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-secondary/50 border-border text-muted-foreground"
          : "bg-secondary/30 border-border/30 text-muted-foreground/40",
      )}>
        {hovered ? (
          <>
            {hoveredCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold bg-primary/20 text-primary border border-primary/40 flex-shrink-0">
                {hoveredCount}
              </span>
            )}
            <span className="font-medium">
              {new Date(hovered + "T00:00:00").toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "long", year: "numeric",
              })}
              {" — "}
              {hoveredCount > 0
                ? `${hoveredCount} contribution${hoveredCount !== 1 ? "s" : ""}`
                : "No activity"
              }
            </span>
          </>
        ) : (
          <span>Hover over a day to see activity details</span>
        )}
      </div>

    </GlassCard>
  )
}
