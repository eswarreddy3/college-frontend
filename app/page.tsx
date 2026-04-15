"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import {
  motion, useInView, useScroll, useTransform,
  AnimatePresence, useMotionValue, useSpring,
} from "framer-motion"
import {
  Code2, BookOpen, Brain, Trophy, Users, Building2,
  ArrowRight, Check, ChevronDown, Mail, Phone, MapPin,
  Zap, Star, TrendingUp, BarChart2, Globe, Shield,
  Github, Twitter, Linkedin, GraduationCap, HelpCircle,
  Flame, Plus, Terminal, CheckCircle2,
  ChevronRight, Rocket, Sparkles, MousePointer,
  PlayCircle, FileText, MessageSquare,
  ChevronLeft, ScrollText, Download, Palette,
  AlertTriangle, XCircle, Clock, Target, Layers,
  Award, Users2, Cpu, PieChart, Activity, Briefcase,
} from "lucide-react"
import Link from "next/link"
import { TopNav } from "@/components/top-nav"
import { Logo } from "@/components/logo"

// ─── Scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] gradient-bg z-[70] origin-left pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// ─── Magnetic link wrapper ──────────────────────────────────────────────────────
function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 500, damping: 30 })
  const sy = useSpring(y, { stiffness: 500, damping: 30 })

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.28)
    y.set((e.clientY - r.top - r.height / 2) * 0.28)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ x: sx, y: sy }}>
      {children}
    </motion.div>
  )
}

// ─── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(to / (1800 / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Fade-in ────────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >{children}</motion.div>
  )
}

// ─── Floating orb ──────────────────────────────────────────────────────────────
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

// ─── Mobile sticky CTA ─────────────────────────────────────────────────────────
function MobileBottomCTA() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  useEffect(() => scrollY.on("change", (v) => setVisible(v > 480)), [scrollY])
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 py-3 pb-safe bg-background border-t border-border"
        >
          <Link href="/login"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-bg text-white font-semibold text-sm primary-glow">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── FAQ item ───────────────────────────────────────────────────────────────────
function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      layout
      className="border border-border rounded-2xl overflow-hidden hover:border-primary/25 transition-colors cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-primary/60 w-5 flex-shrink-0">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="text-sm sm:text-base font-medium leading-snug">{q}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center"
        >
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed pl-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Data ───────────────────────────────────────────────────────────────────────
const heroStats = [
  { value: 2400,  suffix: "+", label: "Active Students",        color: "text-cyan-400" },
  { value: 361,   suffix: "%", label: "Placement Rate Growth",  color: "text-amber-400" },
  { value: 15000, suffix: "+", label: "Practice Questions",     color: "text-violet-400" },
  { value: 50,    suffix: "+", label: "Colleges",               color: "text-pink-400" },
  { value: 120,   suffix: "+", label: "Companies Supported",    color: "text-emerald-400" },
]

const problems = [
  {
    icon: AlertTriangle,
    color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20",
    title: "No Structured Roadmap",
    desc: "Students bounce between random YouTube videos, paid courses, and LeetCode without a clear progression plan tailored to placement requirements.",
  },
  {
    icon: XCircle,
    color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20",
    title: "Zero Accountability",
    desc: "Colleges have no visibility into who's practicing and who's falling behind. By the time campus drives arrive, it's too late to course-correct.",
  },
  {
    icon: Clock,
    color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20",
    title: "Fragmented Tools",
    desc: "Separate apps for coding, MCQ, and resume. Students waste time context-switching and never build the compound habit that drives real placement results.",
  },
]

const features = [
  {
    icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20",
    title: "Structured Learning",
    desc: "8+ courses from Python to Web Dev, broken into bite-sized lessons with points per completion.",
    tag: "Courses & Lessons",
  },
  {
    icon: Brain, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20",
    title: "MCQ Practice Banks",
    desc: "15,000+ questions spanning aptitude, reasoning, and core CS — with instant explanations.",
    tag: "Aptitude & Technical",
  },
  {
    icon: Code2, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20",
    title: "Live Coding IDE",
    desc: "Monaco editor (VS Code in browser) with multi-language support, real test cases, and a free playground.",
    tag: "Monaco Editor",
  },
  {
    icon: Building2, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20",
    title: "Company Preparation",
    desc: "120+ companies with detailed hiring round breakdowns, past patterns, and insider tips.",
    tag: "TCS · Zoho · Infosys",
  },
  {
    icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
    title: "Domain Mentorship Paths",
    desc: "Curated learning paths for Data Analysis and Web Development aligned to real job requirements.",
    tag: "Data · Web Dev",
  },
  {
    icon: ScrollText, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20",
    title: "AI Resume Builder",
    desc: "Build, preview, and export a professional resume with guided sections and PDF export.",
    tag: "PDF Export",
  },
  {
    icon: Trophy, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20",
    title: "Gamification Engine",
    desc: "Daily streaks, XP points, leaderboards, and rewards that make students compete to learn more.",
    tag: "Streaks · Leaderboard",
  },
  {
    icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20",
    title: "College Social Feed",
    desc: "Campus-scoped feed for posts, blogs, placement announcements, and peer motivation.",
    tag: "College Community",
  },
  {
    icon: BarChart2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20",
    title: "Admin Analytics Suite",
    desc: "Real-time dashboards showing lesson completion, MCQ scores, and 1-click student reminders.",
    tag: "Live Insights",
  },
]

const howItWorks = [
  {
    icon: Building2, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30", num: "01",
    title: "College Registers",
    desc: "Admin activates CareerEzi, picks a plan, and configures which courses and domains students can access.",
  },
  {
    icon: GraduationCap, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", num: "02",
    title: "Students Learn",
    desc: "Students register with college email. The platform auto-applies the curriculum — no manual setup.",
  },
  {
    icon: Users, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30", num: "03",
    title: "Online Mentors",
    desc: "Company-specific prep, domain mentors paths, and peer community keep students on track daily.",
  },
  {
    icon: Rocket, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", num: "04",
    title: "Students Get Placed",
    desc: "Students crack interviews confidently, and admins celebrate measurable placement rate growth.",
  },
]

const testimonials = [
  {
    name: "Kavitha M.", role: "Student · SRMIST Chennai", avatar: "K",
    text: "CareerEzi's company prep section is insanely detailed. I knew exactly what to expect in Zoho rounds before I even walked in. Cleared all 5 rounds on my first attempt!",
    stars: 5, color: "from-violet-500 to-purple-600",
  },
  {
    name: "Prof. Anand Raj", role: "Placement Officer · KEC Erode", avatar: "A",
    text: "The admin dashboard gives me a live view of every student's progress. I can see who's slacking and send reminders in one click. Placement rates went up 23% this year.",
    stars: 5, color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Rohan P.", role: "Student · Anna University", avatar: "R",
    text: "The streak system got me. Literally couldn't stop my 30-day streak. Ended up solving 80+ coding problems without realising it. Got placed at Infosys!",
    stars: 5, color: "from-pink-500 to-rose-600",
  },
  {
    name: "Deepa S.", role: "Student · PSG Tech", avatar: "D",
    text: "I love the college feed. My friends hyped me up when I posted about clearing TCS NQT. That community energy is something no YouTube course gives you.",
    stars: 5, color: "from-amber-500 to-orange-600",
  },
  {
    name: "Vikram N.", role: "Student · Coimbatore Institute of Technology", avatar: "V",
    text: "The MCQ bank is massive. 15,000+ questions with instant explanations — I practiced every day for 3 months and my aptitude scores jumped by 40%.",
    stars: 5, color: "from-emerald-500 to-green-600",
  },
  {
    name: "Dr. Meena Devi", role: "Principal · Kongu Engineering College", avatar: "M",
    text: "We saw a measurable jump in our placement percentage within one semester. The structured approach and admin controls are exactly what we needed.",
    stars: 5, color: "from-teal-600 to-teal-400",
  },
]

const faqs = [
  { q: "How do students access the platform?", a: "Students register using their college email address. Once the college is activated, they get instant access to all features under their plan — no manual approval needed." },
  { q: "Can we control which courses students see?", a: "Absolutely. The admin dashboard lets you configure exactly which courses and domain programs are accessible. Lock everything except free-tier, or unlock specific courses for different batches." },
  { q: "Is there a mobile app?", a: "CareerEzi is fully responsive and works great on mobile browsers. A dedicated mobile app is on the roadmap for late 2026." },
  { q: "How does the coding IDE work?", a: "We use Monaco Editor (same as VS Code) embedded in the browser. Students write code, click Run, and it executes against real test cases. Supported: Python, JavaScript, Java, C++." },
  { q: "What does the admin dashboard show?", a: "Admins get analytics on lesson completion, MCQ performance, coding submissions, and student activity. You can also send 1-click email reminders to students who've been inactive." },
  { q: "How is CareerEzi different from LeetCode or HackerRank?", a: "CareerEzi is built for colleges, not individuals. It bundles structured courses, MCQ practice, a coding IDE, company prep, a campus social feed, and admin analytics — all under one institutional subscription." },
]

// ─── Admin Analytics Mockup ─────────────────────────────────────────────────────
function AnalyticsMockup() {
  const bars = [
    { label: "Week 1", val: 42, color: "bg-violet-500" },
    { label: "Week 2", val: 61, color: "bg-cyan-500" },
    { label: "Week 3", val: 55, color: "bg-pink-500" },
    { label: "Week 4", val: 78, color: "bg-amber-500" },
    { label: "Week 5", val: 88, color: "bg-emerald-500" },
    { label: "Week 6", val: 95, color: "bg-primary" },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="glass-card rounded-2xl border border-border p-5 space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Placement Analytics</p>
          <p className="text-sm font-bold">Batch 2025–26</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">+361%</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-28 pt-2">
        {bars.map((b, i) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className={`w-full rounded-t-lg ${b.color} opacity-80`}
              initial={{ height: 0 }}
              animate={inView ? { height: `${b.val}%` } : { height: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
            />
            <span className="text-[9px] text-muted-foreground">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Metric row */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: "Placed", value: "87%", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Active", value: "94%", color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
          { label: "Avg Score", value: "78",  color: "text-violet-400", bg: "bg-violet-500/10",  border: "border-violet-500/20" },
        ].map((m) => (
          <div key={m.label} className={`${m.bg} border ${m.border} rounded-xl p-2.5 text-center`}>
            <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Student list */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Top Students</p>
        {[
          { name: "Priya Sharma",  pts: "3,210", placed: true,  company: "Google" },
          { name: "Arjun Kumar",   pts: "2,890", placed: true,  company: "Zoho" },
          { name: "Kavya Mehta",   pts: "2,650", placed: false, company: null },
        ].map((s, i) => (
          <div key={s.name} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-secondary/30">
            <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              {s.name[0]}
            </div>
            <span className="text-xs flex-1 font-medium">{s.name}</span>
            {s.placed
              ? <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">{s.company}</span>
              : <span className="text-[10px] text-muted-foreground">In Progress</span>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Gamification Bar Chart ─────────────────────────────────────────────────────
// Each tier has 4 grouped bars: XP, Coins, Gems, Shields
const TIERS = [
  { label: "Striving\nStarter",    xp: 22, coins: 14, gems: 8,  shields: 5  },
  { label: "Curious\nLearner",     xp: 40, coins: 28, gems: 16, shields: 10 },
  { label: "Active\nAchiever",     xp: 62, coins: 48, gems: 30, shields: 20 },
  { label: "Champion",             xp: 80, coins: 65, gems: 50, shields: 38 },
  { label: "Legend",               xp: 95, coins: 85, gems: 72, shields: 60 },
]
const REWARD_COLORS = {
  xp:      { bar: "bg-amber-400",   pill: "bg-amber-400/15 border-amber-400/30 text-amber-400" },
  coins:   { bar: "bg-cyan-400",    pill: "bg-cyan-400/15 border-cyan-400/30 text-cyan-400" },
  gems:    { bar: "bg-violet-400",  pill: "bg-violet-400/15 border-violet-400/30 text-violet-400" },
  shields: { bar: "bg-emerald-400", pill: "bg-emerald-400/15 border-emerald-400/30 text-emerald-400" },
}

const CHART_H = 180 // px — fixed chart area height

function GamificationChart() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="glass-card rounded-2xl border border-border p-5 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold">Reward Progress by Tier</p>
          <p className="text-xs text-muted-foreground mt-0.5">Points earned across all students</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Flame className="w-3.5 h-3.5 text-amber-400 flame-pulse" />
          <span className="text-xs font-bold text-amber-400">Live</span>
        </div>
      </div>

      {/* Chart area — fixed height, bars grow from bottom */}
      <div className="flex items-end gap-2 sm:gap-4" style={{ height: CHART_H }}>
        {TIERS.map((tier, ti) => (
          <div key={tier.label} className="flex-1 flex items-end gap-0.5 h-full">
            {(["xp","coins","gems","shields"] as const).map((key, ki) => {
              const targetH = Math.round((tier[key] / 100) * CHART_H)
              return (
                <motion.div
                  key={key}
                  className={`flex-1 rounded-t-md ${REWARD_COLORS[key].bar}`}
                  style={{ minHeight: 4 }}
                  initial={{ height: 0 }}
                  animate={inView ? { height: targetH } : { height: 0 }}
                  transition={{ duration: 0.65, delay: ti * 0.1 + ki * 0.04, ease: [0.34, 1.06, 0.64, 1] }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* X-axis tier labels */}
      <div className="flex gap-2 sm:gap-4 mt-3 mb-5">
        {TIERS.map((tier) => (
          <div key={tier.label} className="flex-1 text-center">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight whitespace-pre-line">
              {tier.label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-border">
        {(["xp","coins","gems","shields"] as const).map((key) => {
          const labels = { xp: "XP", coins: "Coins", gems: "Gems", shields: "Shields" }
          const icons  = { xp: "⚡", coins: "🪙", gems: "💎", shields: "🛡️" }
          return (
            <div key={key}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${REWARD_COLORS[key].pill}`}>
              <span>{icons[key]}</span>
              <span>{labels[key]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()
  const { token, user } = useAuthStore()
  const [dragStart, setDragStart] = useState(0)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (!token || !user) return
    if (user.first_login) { router.replace("/onboarding"); return }
    router.replace(
      user.role === "super_admin" ? "/super-admin"
      : user.role === "college_admin" ? "/admin"
      : user.role === "branch_admin" ? "/branch-admin"
      : "/dashboard"
    )
  }, [token, user, router])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 64
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <TopNav onScrollTo={scrollTo} />
      <MobileBottomCTA />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-4 sm:px-6">
        <Orb className="w-[600px] h-[600px] bg-violet-500/15 -top-48 -left-32" />
        <Orb className="w-[500px] h-[500px] bg-cyan-500/12 top-1/3 -right-32" />
        <Orb className="w-[350px] h-[350px] bg-pink-500/10 bottom-16 left-1/4" />

        <div className="absolute inset-0 overflow-hidden opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-5xl mx-auto text-center">

          {/* Logo — hero centrepiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 18 }}
            className="flex justify-center mb-7"
          >
            <MagneticWrap>
              <motion.div
                whileHover={{ scale: 1.07, rotate: [-1, 1, -1, 0] }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="relative"
              >
                <Logo size={80} />
                {/* subtle glow ring on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  whileHover={{ boxShadow: "0 0 40px rgba(99,102,241,0.35)" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </MagneticWrap>
          </motion.div>

          {/* Badge */}
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-7 font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            India's #1 Campus Placement Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-[1.06] mb-6 tracking-tight">
            From Classroom<br />
            To{" "}
            <span className="gradient-text">Career Offer</span>
            <br />
            In One Platform.
          </motion.h1>

          {/* Tagline */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.6 }}
            className="text-sm sm:text-base font-semibold tracking-wide text-muted-foreground/70 uppercase mb-3">
            Built for India's 40 Million Engineering Students
          </motion.p>

          {/* Subtext */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-9 leading-relaxed">
            persistence. <strong className="text-foreground/80">Learn.</strong> Practice. Code. Get Placed — everything your college needs to turn every student into a hire.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <MagneticWrap>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm sm:text-base primary-glow hover:brightness-110 transition-all"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </MagneticWrap>
            <MagneticWrap>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/40 text-sm sm:text-base font-semibold transition-all"
                >
                  Log In <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </MagneticWrap>
          </motion.div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.7 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 max-w-2xl mx-auto"
          >
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.72 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="flex flex-col items-center gap-1 glass-card rounded-xl py-3 px-2 border border-border hover:border-primary/30 transition-colors cursor-default select-none"
              >
                <span className={`text-lg sm:text-xl font-bold font-mono ${stat.color}`}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground text-center leading-tight">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/40">
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>


      {/* ── Problem ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-red-500/8 -right-24 top-0" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs sm:text-sm mb-5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
              Your students are{" "}
              <span className="text-red-400">not</span> getting placed.
              <br />
              Here's exactly why.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Most colleges see the same pattern year after year. The root cause is always the same three things.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {problems.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280 }}
                  className={`glass-card rounded-2xl p-6 border ${p.border} h-full`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${p.bg} border ${p.border} flex items-center justify-center mb-5`}>
                    <p.icon className={`w-6 h-6 ${p.color}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${p.color}`}>{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-violet-500/8 -left-48 top-0" />
        <Orb className="w-[400px] h-[400px] bg-cyan-500/6 -right-32 bottom-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-5 font-medium">
              <Zap className="w-3.5 h-3.5" />
              The Solution
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              Everything.{" "}
              <span className="gradient-text">One Platform.</span>
              <br />
              Zero Excuses.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Connect to your college curriculum. No more fragmented prep tools. Everything a student needs, one login.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`glass-card rounded-2xl p-5 sm:p-6 border ${f.border} h-full flex flex-col group cursor-default`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${f.bg} ${f.color} border ${f.border}`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                  <div className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-cyan-500/8 left-1/4 top-0" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass-card rounded-3xl border border-primary/20 p-8 sm:p-14"
            >
              <div className="text-primary/40 text-6xl font-serif leading-none mb-4 select-none">"</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold font-serif leading-snug text-foreground/90">
                The difference between a student who gets placed and one who doesn't is not talent.
                It's{" "}
                <span className="gradient-text">preparation with the right system.</span>
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-border" />
                <span className="text-sm text-muted-foreground">CareerEzi Mission</span>
                <div className="w-8 h-px bg-border" />
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-violet-500/8 -left-32 top-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm mb-5 font-medium">
              <MousePointer className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              From day one to{" "}
              <span className="gradient-text">dream offer.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Simple to set up. Powerful in practice. Your college can be live within 24 hours.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
            {/* Animated chevron arrows — appear between columns, not through icons */}
            {[25, 50, 75].map((pct, i) => (
              <motion.div
                key={pct}
                className="hidden lg:flex absolute items-center justify-center"
                style={{ left: `${pct}%`, top: "40px", transform: "translate(-50%, -50%)" }}
                animate={{ x: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              >
                <ChevronRight className="w-7 h-7 text-primary" />
              </motion.div>
            ))}
            {howItWorks.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative mb-5">
                    <div className={`w-20 h-20 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="text-base font-bold font-serif mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analytics / Dashboard ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[450px] h-[450px] bg-emerald-500/8 -right-24 top-0" />
        <Orb className="w-[350px] h-[350px] bg-violet-500/8 -left-16 bottom-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm mb-5 font-medium">
                <Activity className="w-3.5 h-3.5" />
                Admin Analytics Suite
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight">
                Stop chasing.{" "}
                <br />
                Start{" "}
                <span className="gradient-text">controlling.</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-7">
                Your admin dashboard gives you a real-time view into every student's journey. See who's thriving, who's falling behind, and act instantly — without leaving the platform.
              </p>
              <div className="space-y-3">
                {[
                  { icon: BarChart2,    color: "text-emerald-400", text: "Live placement analytics & trend charts" },
                  { icon: Users,        color: "text-cyan-400",    text: "Per-student progress tracking across all modules" },
                  { icon: Mail,         color: "text-violet-400",  text: "1-click email reminders to inactive students" },
                  { icon: PieChart,     color: "text-amber-400",   text: "MCQ accuracy, coding submissions, lesson completion" },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            {/* Right */}
            <FadeIn delay={0.2}>
              <AnalyticsMockup />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Gamification ──────────────────────────────────────────────────────── */}
      <section id="gamification" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-amber-500/8 left-1/4 -top-16" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs sm:text-sm mb-5 font-medium">
              <Trophy className="w-3.5 h-3.5" />
              Gamification Engine
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
              Students don't need{" "}
              <span className="text-muted-foreground">motivation lectures.</span>
              <br />
              They need a{" "}
              <span className="gradient-text">reason to open the app.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Streaks, XP, leaderboards, and rewards that make daily practice feel less like work and more like a game worth winning.
            </p>
          </FadeIn>

          {/* Full-width chart */}
          <FadeIn className="max-w-3xl mx-auto w-full">
            <GamificationChart />
          </FadeIn>

          {/* Streak card below chart */}
          <FadeIn delay={0.15} className="max-w-3xl mx-auto w-full mt-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl border border-amber-500/20 p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Flame className="w-6 h-6 text-amber-400 flame-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">21-day streak active</p>
                <p className="text-xs text-muted-foreground">Keep going — 7 more days to unlock the Gems badge!</p>
              </div>
              <div className="text-2xl">🔥</div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-pink-500/8 right-0 top-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs sm:text-sm mb-5 font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              Student & Admin Stories
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4">
              They said it.{" "}
              <span className="gradient-text">We didn't make it up.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Real results from real campuses across India.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 280 }}
                  className="glass-card rounded-2xl border border-border p-5 sm:p-6 h-full flex flex-col"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-cyan-500/10 left-1/4 top-0" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn>
            <motion.div
              className="glass-card rounded-3xl border border-primary/20 p-10 sm:p-16 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative z-10">
                {/* Logo in CTA */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 220, damping: 18 }}
                  className="flex justify-center mb-6"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Logo size={56} />
                  </motion.div>
                </motion.div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-6 font-medium">
                  <Rocket className="w-3.5 h-3.5" />
                  Get Started Today
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight">
                  Your next batch's placement
                  <br />
                  record starts{" "}
                  <span className="gradient-text">today.</span>
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-9">
                  Every great placement record started with one decision. Make yours today — your students are waiting.
                </p>

                {/* CTA action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <MagneticWrap>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm sm:text-base primary-glow hover:brightness-110 transition-all"
                      >
                        Get Started Free <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </MagneticWrap>
                  <MagneticWrap>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                      <button
                        onClick={() => scrollTo("contact")}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/40 text-sm sm:text-base font-semibold transition-all"
                      >
                        Contact Us <Mail className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </MagneticWrap>
                </motion.div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs sm:text-sm mb-4 font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-3">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} idx={i} />
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[350px] h-[350px] bg-violet-500/10 -right-24 top-0" />
        <Orb className="w-[280px] h-[280px] bg-cyan-500/10 -left-16 bottom-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-4 font-medium">
              <Mail className="w-3.5 h-3.5" />
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Interested in onboarding your college? Reach out — we reply within 24 hours.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
            <FadeIn className="lg:col-span-2 space-y-5">
              {[
                { icon: Mail,   label: "Email",    value: "hello@careerezi.in" },
                { icon: Phone,  label: "Phone",    value: "+91 98765 43210" },
                { icon: MapPin, label: "Location", value: "Chennai, Tamil Nadu, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Follow us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Twitter,  href: "#", label: "Twitter" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Github,   href: "#", label: "GitHub" },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a key={label} href={href} title={label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:col-span-3">
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background pt-14 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Top grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-12">

            {/* Brand col */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-2">
              <div className="mb-4"><Logo size={32} /></div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
                India's campus placement preparation platform. Structured learning, practice, and community — all in one place.
              </p>
              <div className="flex gap-2.5">
                {[
                  { icon: Twitter,  href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Github,   href: "#", label: "GitHub" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label} href={href} title={label}
                    whileHover={{ scale: 1.12, y: -2 }}
                    className="w-9 h-9 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Platform</h4>
              <ul className="space-y-3">
                {[
                  { label: "Features",     id: "features" },
                  { label: "For Colleges", id: "how-it-works" },
                  { label: "Gamification", id: "gamification" },
                  { label: "Contact",      id: "contact" },
                ].map(({ label, id }) => (
                  <li key={label}>
                    <button
                      onClick={() => scrollTo(id)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                {["Blog", "Case Studies", "Help Centre", "Status"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2026 <span className="text-foreground/70 font-medium">Finity Innovations</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Student Login
              </Link>
              <span className="text-border">·</span>
              <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                College Admin
              </Link>
              <span className="text-border">·</span>
              <p className="text-xs text-muted-foreground">Made with ❤️ in India</p>
            </div>
          </div>

        </div>
      </footer>

      <div className="h-20 md:hidden" />
    </div>
  )
}

// ─── Contact Form (extracted to avoid hook-in-callback issues) ─────────────────
function ContactForm() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setContactForm({ name: "", email: "", message: "" })
  }

  return (
    <form onSubmit={handleContact} className="glass-card rounded-2xl p-5 sm:p-8 border border-border space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Your Name</label>
          <input required value={contactForm.name}
            onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Rahul Sharma"
            className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Email Address</label>
          <input required type="email" value={contactForm.email}
            onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="rahul@college.edu"
            className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-medium">Message</label>
        <textarea required rows={4} value={contactForm.message}
          onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
          placeholder="Tell us about your college and how we can help..."
          className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
      </div>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-primary text-sm font-semibold py-3 justify-center bg-primary/10 rounded-xl border border-primary/20">
            <Check className="w-4 h-4" />
            Message sent! We'll get back to you soon.
          </motion.div>
        ) : (
          <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all primary-glow flex items-center justify-center gap-2">
            Send Message <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  )
}
