"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import { Flame, Trophy, Zap, CalendarDays } from "lucide-react"

interface StreakCalendarProps {
  activeDays: number[]
  currentStreak: number
  longestStreak?: number
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function StreakCalendar({ activeDays, currentStreak, longestStreak = 0 }: StreakCalendarProps) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay() // 0=Sun

  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Stagger animation
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Pad cells with nulls for the weekday offset + trailing nulls
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const activeCount = activeDays.length
  const passedDays = Math.min(todayDate, daysInMonth)
  const activityPct = passedDays > 0 ? Math.round((activeCount / passedDays) * 100) : 0

  const hoveredIsActive = hoveredDay !== null && activeDays.includes(hoveredDay)
  const hoveredIsFuture = hoveredDay !== null && hoveredDay > todayDate
  const hoveredIsToday = hoveredDay === todayDate

  return (
    <GlassCard>
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold font-serif text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Activity Calendar
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {MONTHS[month]} {year}
          </p>
        </div>

        {/* Big streak badge */}
        <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/25 rounded-2xl px-4 py-2.5">
          <Flame className="h-7 w-7 text-orange-500 flame-pulse flex-shrink-0" />
          <div className="text-right">
            <p className="text-2xl font-bold font-serif text-foreground leading-none">
              {currentStreak}
            </p>
            <p className="text-[11px] text-orange-400 font-medium">day streak</p>
          </div>
        </div>
      </div>

      {/* ── Stat chips ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/60">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Current</span>
          </div>
          <p className="text-xl font-bold font-serif text-foreground leading-none">{currentStreak}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">days</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/60">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Best</span>
          </div>
          <p className="text-xl font-bold font-serif text-foreground leading-none">{longestStreak}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">days</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/60">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Month</span>
          </div>
          <p className="text-xl font-bold font-serif text-foreground leading-none">{activeCount}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">/ {passedDays} days</p>
        </div>
      </div>

      {/* ── Calendar grid ─────────────────────────────────────────── */}
      <div ref={gridRef} className="overflow-visible">
        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[10px] text-muted-foreground/70 font-medium py-1 tracking-wider uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />

            const isActive = activeDays.includes(day)
            const isToday = day === todayDate
            const isFuture = day > todayDate
            const isHovered = hoveredDay === day

            // Delay index for stagger (only real days)
            const dayIdx = day - 1
            const animDelay = `${dayIdx * 12}ms`

            return (
              <div
                key={day}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ transitionDelay: mounted ? "0ms" : animDelay }}
                className={cn(
                  "relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5",
                  "text-[11px] font-medium transition-all duration-200 cursor-default select-none",
                  // Mount animation
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                  // Future
                  isFuture && "bg-secondary/15 text-muted-foreground/25 border border-border/10",
                  // Inactive past
                  !isActive && !isFuture && !isToday && [
                    "bg-secondary/40 text-muted-foreground/50 border border-border/30",
                    "hover:bg-secondary/60 hover:text-muted-foreground/80",
                  ],
                  // Active (not today)
                  isActive && !isToday && [
                    "bg-primary/20 text-primary border border-primary/50",
                    "shadow-[0_0_10px_rgba(0,212,200,0.2)]",
                    "hover:bg-primary/30 hover:shadow-[0_0_18px_rgba(0,212,200,0.4)] hover:border-primary/70",
                  ],
                  // Today — active
                  isActive && isToday && [
                    "bg-gradient-to-br from-primary/35 to-primary/15 text-primary",
                    "border-2 border-primary shadow-[0_0_20px_rgba(0,212,200,0.45)]",
                  ],
                  // Today — inactive
                  !isActive && isToday && [
                    "bg-amber-500/10 text-amber-400",
                    "border-2 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
                  ],
                  // Hovered scale
                  isHovered && !isFuture && "scale-110 z-10",
                )}
              >
                {/* Active dot */}
                {isActive && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    isToday ? "bg-primary shadow-[0_0_6px_rgba(0,212,200,0.8)]" : "bg-primary/80",
                  )} />
                )}

                <span className={cn(
                  "leading-none",
                  isActive && "text-[10px]",
                )}>
                  {day}
                </span>

                {/* Tooltip */}
                {isHovered && !isFuture && (
                  <div className={cn(
                    "absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-30",
                    "px-2.5 py-1.5 rounded-lg text-[10px] leading-tight whitespace-nowrap pointer-events-none",
                    "shadow-xl border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary/50"
                      : isToday
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-[#1A1F35] text-foreground border-border",
                  )}>
                    <p className="font-semibold">{MONTHS[month].slice(0, 3)} {day}</p>
                    <p className="opacity-80">{isActive ? "Active day" : isToday ? "Today" : "No activity"}</p>
                    {/* Arrow */}
                    <div className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent",
                      isActive ? "border-t-primary" : isToday ? "border-t-amber-500/20" : "border-t-[#1A1F35]",
                    )} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Hover info bar ────────────────────────────────────────── */}
      <div className={cn(
        "mt-4 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 text-xs",
        hoveredDay && !hoveredIsFuture
          ? hoveredIsActive
            ? "bg-primary/10 border-primary/30 text-primary"
            : hoveredIsToday
            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-secondary/50 border-border text-muted-foreground"
          : "bg-secondary/30 border-border/30 text-muted-foreground/40",
      )}>
        {hoveredDay && !hoveredIsFuture ? (
          <span className="font-medium">
            {MONTHS[month]} {hoveredDay}
            {" — "}
            {hoveredIsActive ? "Active" : hoveredIsToday ? "Today (no activity yet)" : "No activity"}
          </span>
        ) : (
          <span>Hover over a day to see details</span>
        )}
      </div>

      {/* ── Monthly progress bar ──────────────────────────────────── */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Monthly consistency</span>
          <span className={cn(
            "font-semibold",
            activityPct >= 70 ? "text-primary" : activityPct >= 40 ? "text-amber-400" : "text-muted-foreground",
          )}>
            {activityPct}%
          </span>
        </div>
        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              activityPct >= 70
                ? "bg-gradient-to-r from-primary to-cyan-400"
                : activityPct >= 40
                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                : "bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/30",
            )}
            style={{ width: mounted ? `${activityPct}%` : "0%" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground text-right">
          {activeCount} active {activeCount === 1 ? "day" : "days"} out of {passedDays} so far
        </p>
      </div>

      {/* ── Legend ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <div className="w-3 h-3 rounded-md bg-primary/20 border border-primary/50 shadow-[0_0_6px_rgba(0,212,200,0.3)]" />
          Active
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <div className="w-3 h-3 rounded-md bg-amber-500/10 border-2 border-amber-500/60" />
          Today
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <div className="w-3 h-3 rounded-md bg-secondary/40 border border-border/30" />
          Inactive
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <div className="w-3 h-3 rounded-md bg-secondary/15 border border-border/10 opacity-40" />
          Upcoming
        </div>
      </div>
    </GlassCard>
  )
}
