"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring,
} from "framer-motion"
import {
  ArrowLeft, ArrowRight, Brain, BarChart3, Database,
  Cpu, LineChart, Globe, Star, Lock, Loader2,
  CheckCircle2, BookOpen, Zap, Trophy, Target,
  ChevronRight, Briefcase, Sparkles, Play,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import type { LucideIcon } from "lucide-react"

// ── Types ────────────────────────────────────────────────────────────────────
interface Domain {
  id: string; title: string; description: string
  icon: string; icon_color: string; bg_color: string
  skills: string[]; total_points: number; total_courses: number; is_locked: boolean
}
interface Course {
  id: string; title: string; description: string
  category: string; difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string; icon_color: string; total_lessons: number
  lessons_completed: number; points_per_lesson: number
  prerequisite_id: string | null; is_locked: boolean; order_index: number
}
interface DomainDetail { domain: Domain; courses: Course[] }

// ── Static maps ──────────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Database, Brain, BarChart3, Cpu, LineChart, Globe, Star,
}

const difficultyConfig = {
  Beginner:     { cls: "chip chip-success", dot: "bg-success" },
  Intermediate: { cls: "chip chip-warning", dot: "bg-warning" },
  Advanced:     { cls: "chip chip-danger",  dot: "bg-danger"  },
}

// ── Per-domain color tokens (used for glow, borders, SVG strokes) ─────────────
const DOMAIN_THEME: Record<string, {
  hex: string; textCls: string; bgCls: string; borderCls: string
  glowCss: string; gradFrom: string; gradTo: string
}> = {
  "data-analysis":   { hex: "#34d399", textCls: "text-emerald-400", bgCls: "bg-emerald-500/10", borderCls: "border-emerald-400/40", glowCss: "rgba(52,211,153,0.25)",  gradFrom: "#34d399", gradTo: "#059669" },
  "data-science":    { hex: "#60a5fa", textCls: "text-blue-400",    bgCls: "bg-blue-500/10",    borderCls: "border-blue-400/40",    glowCss: "rgba(96,165,250,0.25)",  gradFrom: "#60a5fa", gradTo: "#2563eb" },
  "machine-learning":{ hex: "#c084fc", textCls: "text-purple-400",  bgCls: "bg-purple-500/10",  borderCls: "border-purple-400/40",  glowCss: "rgba(192,132,252,0.25)", gradFrom: "#c084fc", gradTo: "#7c3aed" },
  "web-development": { hex: "#22d3ee", textCls: "text-cyan-400",    bgCls: "bg-cyan-500/10",    borderCls: "border-cyan-400/40",    glowCss: "rgba(34,211,238,0.25)",  gradFrom: "#22d3ee", gradTo: "#0891b2" },
}
const defaultTheme = { hex: "#00d4c8", textCls: "text-primary", bgCls: "bg-primary/10", borderCls: "border-primary/40", glowCss: "rgba(0,212,200,0.25)", gradFrom: "#00d4c8", gradTo: "#00b4aa" }

// ── Domain rich metadata (add new domains here — no other code changes needed) ─
const DOMAIN_META: Record<string, {
  tagline: string
  about: string
  bullets: string[]
  roles: string[]
  outcome: string
}> = {
  "data-analysis": {
    tagline: "Turn raw numbers into decisions that move businesses forward.",
    about: "Data Analysis is the art and science of inspecting, cleaning, transforming, and modelling data to discover useful information and support decision-making. From Excel sheets to Python pipelines — every modern company runs on data analysts who can tell the story inside the numbers.",
    bullets: [
      "Write Python scripts to clean, transform, and explore real-world datasets",
      "Query databases with SQL to extract and aggregate business-critical data",
      "Build statistical models and visualisations to communicate insights clearly",
      "Design dashboards and reports stakeholders actually understand and act on",
    ],
    roles: ["Data Analyst", "Business Intelligence Developer", "Product Analyst", "Reporting Analyst"],
    outcome: "Complete this path and you'll be ready to apply for data analyst roles at startups, mid-size companies, and large enterprises.",
  },
  "data-science": {
    tagline: "Predict the future. Build models that learn from the past.",
    about: "Data Science combines statistics, programming, and domain expertise to extract knowledge from structured and unstructured data. Data scientists don't just describe what happened — they build predictive systems that help businesses anticipate what's coming next.",
    bullets: [
      "Build end-to-end data pipelines from raw ingestion to model deployment",
      "Apply statistical methods and hypothesis testing to validate assumptions",
      "Train machine learning models for classification, regression, and clustering",
      "Communicate findings through visualisations and executive-ready reports",
    ],
    roles: ["Data Scientist", "ML Engineer", "Analytics Engineer", "Research Analyst"],
    outcome: "Graduates of this path are equipped to join data science teams and work on real prediction and classification problems.",
  },
  "machine-learning": {
    tagline: "Build intelligent systems that improve with every prediction.",
    about: "Machine Learning is the backbone of modern AI. From recommendation engines to fraud detection, ML models power the most valuable features in today's products. This path takes you from mathematical foundations to training and deploying neural networks in production.",
    bullets: [
      "Understand linear algebra, calculus, and probability as ML foundations",
      "Implement supervised & unsupervised algorithms from scratch and with libraries",
      "Build, tune, and evaluate neural networks using TensorFlow and PyTorch",
      "Deploy models via REST APIs and monitor them in production environments",
    ],
    roles: ["ML Engineer", "AI Researcher", "Deep Learning Engineer", "Computer Vision Engineer"],
    outcome: "By the end you'll have a portfolio of ML projects ready to show in technical interviews.",
  },
  "web-development": {
    tagline: "Design and ship the interfaces millions of people use every day.",
    about: "Web Development is one of the most direct paths from learning to employment. This path covers the full stack — from hand-coding pixel-perfect layouts to building scalable APIs. You'll graduate with real deployed projects that prove your skills to employers.",
    bullets: [
      "Master HTML semantics and CSS layouts including Flexbox and Grid",
      "Build dynamic, interactive UIs with modern JavaScript and React",
      "Create REST APIs and handle authentication with Node.js and Express",
      "Deploy full-stack applications to the cloud with CI/CD pipelines",
    ],
    roles: ["Frontend Developer", "Full Stack Developer", "UI Engineer", "JavaScript Developer"],
    outcome: "Ship a full-stack project as your capstone and walk into interviews with live, working code.",
  },
}

// ── SVG Progress ring ────────────────────────────────────────────────────────
function ProgressRing({ pct, color, size = 52, stroke = 3 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <svg ref={ref} width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      {/* Fill */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={inView ? { strokeDashoffset: circ * (1 - pct / 100) } : {}}
        transition={{ duration: 1.2, ease: [0.34, 1.06, 0.64, 1], delay: 0.3 }}
      />
    </svg>
  )
}

// ── Orbiting particle (active node only) ─────────────────────────────────────
function OrbitParticle({ color, delay, radius }: { color: string; delay: number; radius: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}`, top: "50%", left: "50%" }}
      animate={{
        x: [radius, 0, -radius, 0, radius],
        y: [0, -radius, 0, radius, 0],
        opacity: [0.9, 0.6, 0.9, 0.6, 0.9],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay }}
    />
  )
}

// ── Spine animated line ───────────────────────────────────────────────────────
function RoadmapSpine({ progress, color }: { progress: number; color: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <div ref={ref} className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px flex flex-col pointer-events-none z-0" style={{ top: 32, bottom: 32 }}>
      {/* Base track */}
      <div className="absolute inset-0 bg-white/[0.06]" />
      {/* Completed fill */}
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{ background: `linear-gradient(to bottom, ${color}, ${color}88)`, boxShadow: `0 0 8px ${color}55` }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: progress / 100 } : { scaleY: 0 }}
        transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      />
      {/* Traveling spark */}
      {inView && progress > 0 && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px 3px ${color}` }}
          initial={{ top: "0%" }}
          animate={{ top: `${Math.min(progress, 96)}%` }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        />
      )}
    </div>
  )
}

// ── Roadmap node circle ───────────────────────────────────────────────────────
function NodeCircle({
  idx, status, theme, pct, isActive,
}: {
  idx: number
  status: "completed" | "active" | "next" | "locked"
  theme: typeof defaultTheme
  pct: number
  isActive: boolean
}) {
  const SIZE = 52
  return (
    <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
      {/* Progress ring */}
      <div className="absolute inset-0">
        <ProgressRing pct={pct} color={theme.hex} size={SIZE} stroke={3} />
      </div>

      {/* Pulse ring — active only */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: theme.hex }}
            animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: theme.hex }}
            animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
        </>
      )}

      {/* Inner circle */}
      <div
        className={cn(
          "absolute inset-[5px] rounded-full flex items-center justify-center",
          status === "completed" ? "" : status === "locked" ? "bg-secondary/60" : theme.bgCls,
          "border",
          status === "completed" ? "" : status === "locked" ? "border-border/30" : theme.borderCls,
        )}
        style={status === "completed" ? {
          background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`,
          border: "none",
        } : {}}
      >
        {status === "completed" && <CheckCircle2 className="w-4 h-4 text-white" />}
        {status === "locked"    && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
        {(status === "active" || status === "next") && (
          <span className={cn("text-sm font-bold", theme.textCls)}>{idx + 1}</span>
        )}
      </div>

      {/* Orbiting particles — active only */}
      {isActive && (
        <>
          <OrbitParticle color={theme.hex} delay={0}    radius={28} />
          <OrbitParticle color={theme.hex} delay={1}    radius={22} />
          <OrbitParticle color={theme.hex} delay={1.8}  radius={32} />
        </>
      )}
    </div>
  )
}

// ── Single roadmap step ───────────────────────────────────────────────────────
function RoadmapStep({
  course, idx, totalCourses, theme, isFirst, isLast,
}: {
  course: Course; idx: number; totalCourses: number
  theme: typeof defaultTheme; isFirst: boolean; isLast: boolean
}) {
  const router = useRouter()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [hovered, setHovered] = useState(false)

  const pct = course.total_lessons > 0
    ? Math.round((course.lessons_completed / course.total_lessons) * 100) : 0
  const isCompleted = pct === 100
  const isActive    = !isCompleted && !course.is_locked && course.lessons_completed > 0
  const isNext      = !isCompleted && !course.is_locked && course.lessons_completed === 0 && idx === 0

  const status: "completed" | "active" | "next" | "locked" =
    isCompleted ? "completed" : isActive ? "active" : course.is_locked ? "locked" : "next"

  const isRight = idx % 2 === 1
  const ctaLabel = isCompleted ? "Review" : isActive ? "Continue" : course.is_locked ? "Locked" : "Start"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex items-center justify-center"
      style={{ minHeight: 120, zIndex: 1 }}
    >
      {/* Desktop: 3-column grid, cards close to center node */}
      <div className="hidden lg:grid w-full" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        {/* Left column — card + connector for even items */}
        <div className="flex items-center justify-end">
          {!isRight && (
            <>
              <CourseCard
                course={course} theme={theme} status={status}
                pct={pct} ctaLabel={ctaLabel} hovered={hovered}
                onHover={setHovered} onGo={() => router.push(`/learn/${course.id}`)}
                align="right"
              />
              <div className="w-8 flex-shrink-0 h-px"
                style={{ background: `linear-gradient(to right, ${theme.hex}40, ${theme.hex}cc)` }} />
            </>
          )}
        </div>

        {/* Centre node */}
        <NodeCircle idx={idx} status={status} theme={theme} pct={pct} isActive={isActive || (isNext && idx === 0)} />

        {/* Right column — connector + card for odd items */}
        <div className="flex items-center justify-start">
          {isRight && (
            <>
              <div className="w-8 flex-shrink-0 h-px"
                style={{ background: `linear-gradient(to left, ${theme.hex}40, ${theme.hex}cc)` }} />
              <CourseCard
                course={course} theme={theme} status={status}
                pct={pct} ctaLabel={ctaLabel} hovered={hovered}
                onHover={setHovered} onGo={() => router.push(`/learn/${course.id}`)}
                align="left"
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile: node left, card right */}
      <div className="flex lg:hidden w-full items-center gap-4">
        <NodeCircle idx={idx} status={status} theme={theme} pct={pct} isActive={isActive || (isNext && idx === 0)} />
        <div className="flex-1">
          <CourseCard
            course={course} theme={theme} status={status}
            pct={pct} ctaLabel={ctaLabel} hovered={hovered}
            onHover={setHovered} onGo={() => router.push(`/learn/${course.id}`)}
            align="left"
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── Course card attached to a node ───────────────────────────────────────────
function CourseCard({
  course, theme, status, pct, ctaLabel, hovered, onHover, onGo, align,
}: {
  course: Course; theme: typeof defaultTheme
  status: "completed" | "active" | "next" | "locked"
  pct: number; ctaLabel: string; hovered: boolean
  onHover: (v: boolean) => void; onGo: () => void; align: "left" | "right"
}) {
  const CourseIcon = iconMap[course.icon] ?? Database
  const diff = difficultyConfig[course.difficulty]
  const isLocked = status === "locked"
  const isCompleted = status === "completed"
  const isActive = status === "active"
  const totalPts = course.points_per_lesson * course.total_lessons

  return (
    <motion.div
      whileHover={isLocked ? {} : { y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      onClick={isLocked ? undefined : onGo}
      className={cn(
        "relative rounded-2xl border p-4 cursor-pointer transition-all duration-200",
        "max-w-xs w-full",
        isLocked
          ? "opacity-50 cursor-not-allowed border-border/30 bg-secondary/20"
          : isActive
          ? `border bg-card`
          : isCompleted
          ? "border-border/40 bg-secondary/20"
          : "border-border/40 bg-secondary/30 hover:bg-secondary/50",
      )}
      style={!isLocked && isActive ? {
        borderColor: `${theme.hex}55`,
        boxShadow: `0 0 24px ${theme.glowCss}, inset 0 0 24px ${theme.glowCss}22`,
      } : {}}
    >
      {/* Completed shimmer overlay */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-[0.04]"
            style={{ background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})` }}
          />
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            isLocked ? "bg-secondary/60" : theme.bgCls,
          )}>
            <CourseIcon className={cn("w-4 h-4", isLocked ? "text-muted-foreground" : theme.textCls)} />
          </div>
          <p className="text-sm font-bold text-foreground leading-tight truncate">{course.title}</p>
        </div>
        <span className={cn(
          "text-[10px] font-semibold px-1.5 py-0.5 rounded-md border flex-shrink-0",
          diff.cls
        )}>
          {course.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{course.description}</p>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen className="w-3 h-3" />
          <span>{course.lessons_completed}/{course.total_lessons} lessons</span>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-semibold", theme.textCls)}>
          <Zap className="w-3 h-3" />
          <span>{totalPts} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      {pct > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Progress</span><span>{pct}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.07] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${theme.gradFrom}, ${theme.gradTo})` }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {!isLocked && (
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={e => { e.stopPropagation(); onGo() }}
          className={cn(
            "w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
            isCompleted
              ? "bg-secondary/60 text-muted-foreground hover:bg-secondary"
              : "text-white",
          )}
          style={!isCompleted ? {
            background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`,
            boxShadow: `0 4px 14px ${theme.glowCss}`,
          } : {}}
        >
          {isCompleted
            ? <><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Review</>
            : <><Play className="w-3 h-3" /> {ctaLabel}</>
          }
        </motion.button>
      )}
    </motion.div>
  )
}

// ── Domain detail — full view ─────────────────────────────────────────────────
function DomainDetail({ data, onBack }: { data: DomainDetail; onBack: () => void }) {
  const { domain, courses } = data
  const router = useRouter()
  const DomainIcon = iconMap[domain.icon] ?? Database
  const theme = DOMAIN_THEME[domain.id] ?? defaultTheme
  const meta  = DOMAIN_META[domain.id]

  const totalLessons     = courses.reduce((s, c) => s + c.total_lessons, 0)
  const completedLessons = courses.reduce((s, c) => s + c.lessons_completed, 0)
  const overallPct       = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const completedCourses = courses.filter(c => c.lessons_completed === c.total_lessons && c.total_lessons > 0).length

  const roadmapRef = useRef(null)
  const roadmapInView = useInView(roadmapRef, { once: true, margin: "-100px" })

  return (
    <div className="space-y-0 pb-20">

      {/* ── BACK ── */}
      <motion.button
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All Domains
      </motion.button>

      {/* ── HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-3xl overflow-hidden border mb-8"
        style={{ borderColor: `${theme.hex}33` }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 20% 50%, ${theme.glowCss} 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${theme.glowCss}55 0%, transparent 55%)` }} />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260 }}
              className={cn("w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border", domain.bg_color)}
              style={{ borderColor: `${theme.hex}40`, boxShadow: `0 0 32px ${theme.glowCss}` }}
            >
              <DomainIcon className={cn("w-10 h-10", domain.icon_color)} />
            </motion.div>

            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", theme.bgCls, theme.borderCls, theme.textCls)}>
                    Domain Program
                  </span>
                  {completedCourses === courses.length && courses.length > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/15 border border-success/25 text-success flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">{domain.title}</h1>
                {meta && <p className={cn("text-base font-medium mb-4", theme.textCls)}>{meta.tagline}</p>}
              </motion.div>

              {/* Stat chips */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-2">
                {[
                  { icon: BookOpen, label: `${courses.length} Courses` },
                  { icon: Zap,      label: `${domain.total_points} Points` },
                  { icon: Target,   label: `${domain.skills.length} Skills` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold", theme.bgCls, theme.borderCls, theme.textCls)}>
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Overall progress bar */}
          {overallPct > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="mt-6 pt-5 border-t border-white/[0.06]">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Your progress</span>
                <span className={theme.textCls}>{completedLessons}/{totalLessons} lessons · {overallPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, ${theme.gradFrom}, ${theme.gradTo})`, boxShadow: `0 0 10px ${theme.glowCss}` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── ABOUT ── */}
      {meta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-10"
        >
          {/* About text */}
          <GlassCard className="lg:col-span-3 border-border/50">
            <div className={cn("flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest", theme.textCls)}>
              <Sparkles className="w-3.5 h-3.5" /> What is {domain.title}?
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{meta.about}</p>
            <ul className="space-y-2.5">
              {meta.bullets.map((b, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-sm">
                  <div className={cn("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", theme.bgCls)}>
                    <CheckCircle2 className={cn("w-2.5 h-2.5", theme.textCls)} />
                  </div>
                  <span className="text-muted-foreground leading-snug">{b}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>

          {/* Roles + skills */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <GlassCard className="border-border/50">
              <div className={cn("flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest", theme.textCls)}>
                <Briefcase className="w-3.5 h-3.5" /> Career Roles
              </div>
              <div className="space-y-2">
                {meta.roles.map((role, i) => (
                  <motion.div key={role} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
                    className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium", theme.bgCls, theme.borderCls)}>
                    <ChevronRight className={cn("w-3.5 h-3.5 flex-shrink-0", theme.textCls)} />
                    <span className={theme.textCls}>{role}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="border-border/50">
              <div className={cn("flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest", theme.textCls)}>
                <Target className="w-3.5 h-3.5" /> Skills You'll Gain
              </div>
              <div className="flex flex-wrap gap-2">
                {domain.skills.map((skill) => (
                  <span key={skill} className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", theme.bgCls, theme.borderCls, theme.textCls)}>
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* ── ROADMAP ── */}
      <div ref={roadmapRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className={cn("w-1 h-8 rounded-full", "bg-gradient-to-b")} style={{ background: `linear-gradient(to bottom, ${theme.gradFrom}, ${theme.gradTo})` }} />
          <div>
            <h2 className="text-2xl font-bold font-serif">Your Learning Roadmap</h2>
            <p className="text-sm text-muted-foreground">Follow the path — each course unlocks the next</p>
          </div>
        </motion.div>

        {/* Roadmap container */}
        <div className="relative max-w-3xl mx-auto" style={{ minHeight: courses.length * 140 }}>
          {/* Animated spine line */}
          <RoadmapSpine progress={overallPct} color={theme.hex} />

          {/* Start marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }} animate={roadmapInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="relative z-10 flex justify-center mb-4"
          >
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold", theme.bgCls, theme.borderCls, theme.textCls)}
              style={{ boxShadow: `0 0 16px ${theme.glowCss}` }}>
              <DomainIcon className="w-3.5 h-3.5" />
              Start: {domain.title}
            </div>
          </motion.div>

          {/* Course steps */}
          <div className="space-y-6 relative z-10">
            {courses.map((course, i) => (
              <RoadmapStep
                key={course.id}
                course={course}
                idx={i}
                totalCourses={courses.length}
                theme={theme}
                isFirst={i === 0}
                isLast={i === courses.length - 1}
              />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }} animate={roadmapInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15 + courses.length * 0.12, type: "spring", stiffness: 300 }}
            className="relative z-10 flex justify-center mt-6"
          >
            {completedCourses === courses.length && courses.length > 0 ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-warning/30 bg-warning/10 text-warning text-sm font-bold">
                <Trophy className="w-4 h-4" /> Path Complete — You did it! 🎉
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/30 bg-secondary/20 text-muted-foreground text-xs font-medium">
                <Trophy className="w-3.5 h-3.5" />
                Finish all courses to complete this path
              </div>
            )}
          </motion.div>
        </div>

        {/* Outcome card */}
        {meta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + courses.length * 0.1 }}
            className="mt-10 rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: `${theme.hex}30`, background: `linear-gradient(135deg, ${theme.glowCss}18, transparent)` }}
          >
            <div className="flex items-start gap-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", theme.bgCls)}>
                <Trophy className={cn("w-4 h-4", theme.textCls)} />
              </div>
              <div>
                <p className={cn("text-sm font-bold mb-1", theme.textCls)}>What you'll achieve</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{meta.outcome}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── Domain list view ──────────────────────────────────────────────────────────
export default function DomainProgramsPage() {
  const [domains,       setDomains]       = useState<Domain[]>([])
  const [selected,      setSelected]      = useState<DomainDetail | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    api.get("/domain-programs/")
      .then(r => setDomains(r.data))
      .catch(() => toast.error("Failed to load domain programs"))
      .finally(() => setLoading(false))
  }, [])

  const openDomain = (domain: Domain) => {
    if (domain.is_locked) return
    setDetailLoading(true)
    api.get(`/domain-programs/${domain.id}/courses`)
      .then(r => setSelected(r.data))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setDetailLoading(false))
  }

  // ── Detail view ────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="detail"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DomainDetail data={selected} onBack={() => setSelected(null)} />
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Domain Programs</h1>
          <p className="text-muted-foreground mt-1.5">Specialized learning paths for in-demand skills</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i}>
                <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2 mb-4"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-5 w-16 rounded-full" /></div>
                <Skeleton className="h-9 w-full rounded-md" />
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...domains].sort((a, b) => Number(a.is_locked) - Number(b.is_locked)).map((domain, i) => {
              const Icon  = iconMap[domain.icon] ?? Database
              const theme = DOMAIN_THEME[domain.id] ?? defaultTheme

              if (domain.is_locked) {
                return (
                  <motion.div key={domain.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <GlassCard className="relative opacity-50 select-none">
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10 bg-background/80">
                        <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">Not available in your plan</p>
                      </div>
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", domain.bg_color)}>
                        <Icon className={cn("h-7 w-7", domain.icon_color)} />
                      </div>
                      <h3 className="font-semibold text-lg font-serif mb-2">{domain.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{domain.description}</p>
                    </GlassCard>
                  </motion.div>
                )
              }

              return (
                <motion.div key={domain.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    onClick={() => openDomain(domain)}
                    className="glass-card rounded-2xl border p-5 cursor-pointer group h-full"
                    style={{ borderColor: `${theme.hex}28` }}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                      domain.bg_color
                    )} style={{ boxShadow: `0 0 20px ${theme.glowCss}` }}>
                      <Icon className={cn("h-7 w-7", domain.icon_color)} />
                    </div>

                    <h3 className="font-bold text-lg font-serif mb-1">{domain.title}</h3>
                    {DOMAIN_META[domain.id] && (
                      <p className={cn("text-xs font-medium mb-2", theme.textCls)}>{DOMAIN_META[domain.id].tagline}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{domain.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {domain.skills.slice(0, 4).map(skill => (
                        <span key={skill} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", theme.bgCls, theme.borderCls, theme.textCls)}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{domain.total_courses} courses</span>
                        <span className={cn("flex items-center gap-1 font-semibold", theme.textCls)}>
                          <Star className="h-3.5 w-3.5" />{domain.total_points} pts
                        </span>
                      </div>
                      <button
                        disabled={detailLoading}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all",
                          "hover:brightness-110"
                        )}
                        style={{ background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`, boxShadow: `0 4px 12px ${theme.glowCss}` }}
                      >
                        {detailLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><span>Explore</span><ArrowRight className="h-3 w-3" /></>}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
