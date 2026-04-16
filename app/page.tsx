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
            Log In <ChevronRight className="w-4 h-4" />
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

// ─── Hero right-side floating visual ───────────────────────────────────────────
function HeroVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden lg:flex items-center justify-center relative h-[600px] w-full"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/12 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-8 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      {/* ── Main card: Live Coding IDE ── */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 w-[300px] shadow-2xl shadow-black/50"
        style={{ transform: "perspective(900px) rotateY(-9deg) rotateX(3deg)" }}
      >
        <div className="glass-card rounded-2xl border border-border overflow-hidden">
          {/* Editor title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/40">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono ml-1">solution.py</span>
            <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/15 border border-primary/20">
              <Terminal className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-primary font-semibold">Live IDE</span>
            </div>
          </div>
          {/* Code block */}
          <div className="p-4 font-mono text-[11px] leading-relaxed bg-[#040810] space-y-0.5">
            <div><span className="text-violet-400">def</span> <span className="text-cyan-300">two_sum</span><span className="text-foreground/60">(nums, target):</span></div>
            <div className="pl-4"><span className="text-violet-400">seen</span> <span className="text-foreground/50">= {"{}"}</span></div>
            <div className="pl-4"><span className="text-amber-300">for</span> <span className="text-foreground/70">i, n </span><span className="text-amber-300">in</span> <span className="text-cyan-300">enumerate</span><span className="text-foreground/70">(nums):</span></div>
            <div className="pl-8"><span className="text-amber-300">if</span> <span className="text-foreground/70">target - n </span><span className="text-amber-300">in</span> <span className="text-violet-400">seen</span><span className="text-foreground/70">:</span></div>
            <div className="pl-12"><span className="text-amber-300">return</span> <span className="text-foreground/70">[seen[target-n], i]</span></div>
            <div className="pl-8"><span className="text-violet-400">seen</span><span className="text-foreground/70">[n] = i</span></div>
          </div>
          {/* Test result */}
          <div className="px-4 py-2.5 border-t border-border bg-secondary/20 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-[10px] text-emerald-400 font-semibold">All 3 test cases passed</span>
            <span className="ml-auto text-[9px] text-muted-foreground font-mono">12ms</span>
          </div>
        </div>
      </motion.div>

      {/* ── Floating: Course progress ── */}
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-12 left-4 z-30 glass-card rounded-2xl border border-primary/50 dark:border-primary/25 bg-primary/8 dark:bg-primary/5 p-3 w-[156px] shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold leading-tight">Structured Courses</p>
            <p className="text-[9px] text-muted-foreground">8 of 12 lessons done</p>
          </div>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-bg rounded-full"
            initial={{ width: 0 }}
            animate={inView ? { width: "67%" } : { width: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-[9px] text-primary font-bold mt-1">67% complete</p>
      </motion.div>

      {/* ── Floating: MCQ Practice ── */}
      <motion.div
        animate={{ y: [0, 14, 0], rotate: [0.5, -0.5, 0.5] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
        className="absolute bottom-14 right-0 z-30 glass-card rounded-2xl border border-violet-500/50 dark:border-violet-500/25 bg-violet-500/8 dark:bg-violet-500/5 p-3 w-[190px] shadow-xl"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Brain className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-bold text-violet-400">MCQ Practice</span>
          <span className="ml-auto text-[9px] text-muted-foreground">15k+ Qs</span>
        </div>
        <p className="text-[10px] text-foreground/80 leading-snug mb-2">Time complexity of binary search?</p>
        <div className="space-y-1">
          {[{ t: "O(n)", ok: false }, { t: "O(log n)", ok: true }, { t: "O(n²)", ok: false }].map((opt) => (
            <div key={opt.t} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-medium ${opt.ok ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400" : "bg-secondary/40 text-muted-foreground"}`}>
              {opt.ok && <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />}
              <span>{opt.t}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Floating: Gamification ── */}
      <motion.div
        animate={{ y: [0, -10, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        className="absolute top-[36%] -right-2 z-30 glass-card rounded-2xl border border-amber-500/50 dark:border-amber-500/25 bg-amber-500/8 dark:bg-amber-500/5 p-3 shadow-xl"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Flame className="w-3.5 h-3.5 text-amber-400 flame-pulse" />
          <span className="text-[10px] font-bold text-amber-400">Gamification</span>
        </div>
        <div className="flex items-center gap-3">
          {[{ e: "⚡", l: "XP" }, { e: "🪙", l: "Coins" }, { e: "💎", l: "Gems" }].map((g) => (
            <div key={g.l} className="text-center">
              <div className="text-sm">{g.e}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{g.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Floating: Admin Analytics ── */}
      <motion.div
        animate={{ y: [0, 11, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
        className="absolute bottom-8 left-2 z-30 glass-card rounded-2xl border border-emerald-500/50 dark:border-emerald-500/25 bg-emerald-500/8 dark:bg-emerald-500/5 p-3 shadow-xl w-[152px]"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400">Admin Analytics</span>
        </div>
        <div className="flex items-end gap-1 h-8">
          {[45, 62, 58, 80, 91].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm bg-emerald-400/60"
              initial={{ height: 0 }}
              animate={inView ? { height: `${h}%` } : { height: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.07 }}
            />
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">Student activity trend</p>
      </motion.div>

      {/* ── Floating: Resume Builder ── */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
        className="absolute top-6 right-12 z-30 glass-card rounded-xl border border-pink-500/50 dark:border-pink-500/25 bg-pink-500/8 dark:bg-pink-500/5 px-3 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <ScrollText className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-[10px] font-bold text-pink-400">AI Resume Builder</span>
          <span className="text-[9px] bg-pink-500/15 text-pink-400 border border-pink-500/20 px-1.5 rounded-full">PDF</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Platform Features Marquee ──────────────────────────────────────────────────
function MarqueeTicker() {
  const row1 = [
    { icon: Code2,       label: "Live Coding IDE",         color: "text-cyan-400" },
    { icon: Brain,       label: "15,000+ MCQ Questions",   color: "text-violet-400" },
    { icon: BookOpen,    label: "Structured Courses",       color: "text-primary" },
    { icon: Building2,   label: "Company Prep Guides",      color: "text-amber-400" },
    { icon: ScrollText,  label: "AI Resume Builder",        color: "text-pink-400" },
    { icon: Trophy,      label: "Leaderboard & Streaks",    color: "text-orange-400" },
    { icon: Globe,       label: "Domain Mentorship Paths",  color: "text-emerald-400" },
    { icon: MessageSquare, label: "College Social Feed",    color: "text-blue-400" },
  ]
  const row2 = [
    { icon: BarChart2,   label: "Admin Analytics Suite",   color: "text-emerald-400" },
    { icon: Terminal,    label: "Monaco Editor",            color: "text-cyan-400" },
    { icon: Target,      label: "Aptitude Practice",        color: "text-red-400" },
    { icon: Layers,      label: "8+ Learning Courses",      color: "text-violet-400" },
    { icon: Flame,       label: "Daily Streak System",      color: "text-amber-400" },
    { icon: Users,       label: "Batch Progress Tracking",  color: "text-primary" },
    { icon: Award,       label: "XP Points & Rewards",      color: "text-pink-400" },
    { icon: Activity,    label: "Real-time Dashboards",     color: "text-blue-400" },
  ]

  const Sep = () => <span className="w-1 h-1 rounded-full bg-border flex-shrink-0 mx-1" />

  return (
    <div className="py-5 overflow-hidden border-y border-border bg-secondary/5 relative select-none">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Row 1 */}
      <div className="flex mb-3">
        <div className="animate-marquee flex shrink-0">
          {[...row1, ...row1].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-5 whitespace-nowrap">
              <item.icon className={`w-3 h-3 ${item.color} flex-shrink-0`} />
              <span className={`text-[11px] font-semibold ${item.color}`}>{item.label}</span>
              <Sep />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex">
        <div className="animate-marquee-rev flex shrink-0">
          {[...row2, ...row2].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-5 whitespace-nowrap">
              <Sep />
              <item.icon className={`w-3 h-3 ${item.color} flex-shrink-0`} />
              <span className={`text-[11px] font-semibold ${item.color}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 3-D Tilt card wrapper ──────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useTransform(y, [-0.5, 0.5], [7, -7])
  const ry = useTransform(x, [-0.5, 0.5], [-7, 7])
  const sx = useSpring(rx, { stiffness: 300, damping: 30 })
  const sy = useSpring(ry, { stiffness: 300, damping: 30 })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Continuous-loop counter hook ──────────────────────────────────────────────
function useLoopCounter(max: number, step = 1, interval = 80) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setVal(v => (v + step >= max ? 0 : v + step)), interval)
    return () => clearInterval(t)
  }, [max, step, interval])
  return val
}

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
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10 px-4 sm:px-6">

        {/* Background image — dark mode only */}
        <div className="dark:block hidden absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=75&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        <Orb className="w-[500px] h-[500px] bg-violet-500/12 -top-32 -left-24 z-[1]" />
        <Orb className="w-[400px] h-[400px] bg-cyan-500/10 top-1/3 right-0 z-[1]" />

        <div className="absolute inset-0 overflow-hidden opacity-[0.03] z-[1]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* ── Two-column grid ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-80px)] py-12">

          {/* LEFT — text content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="flex flex-col items-start"
          >
            {/* Logo */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 18 }}
              className="mb-6"
            >
              <MagneticWrap>
                <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 350, damping: 18 }}>
                  <Logo size={72} />
                </motion.div>
              </MagneticWrap>
            </motion.div> */}

            {/* Badge */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-5 font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              India's #1 Campus Placement Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif leading-[1.06] mb-5 tracking-tight"
            >
              From Classroom<br />
              To{" "}<span className="gradient-text">Career Offer</span><br />
              In One Platform.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              Learn. Practice. Code. Get Placed — everything your college needs to turn every student into a hire.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-10"
            >
              <MagneticWrap>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                  <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm sm:text-base primary-glow hover:brightness-110 transition-all">
                    Get Started <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </MagneticWrap>
              <MagneticWrap>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                  <button onClick={() => scrollTo("features")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/40 text-sm sm:text-base font-semibold transition-all">
                    Explore Features <ChevronDown className="w-4 h-4" />
                  </button>
                </motion.div>
              </MagneticWrap>
            </motion.div>

            {/* Inline stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap items-center gap-5"
            >
              {[
                { icon: BookOpen,  label: "8+ Courses",          color: "text-primary" },
                { icon: Brain,     label: "15,000+ Questions",    color: "text-violet-400" },
                { icon: Code2,     label: "Live Coding IDE",      color: "text-cyan-400" },
                { icon: Building2, label: "Company Prep Guides",  color: "text-amber-400" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className="flex items-center gap-1.5"
                >
                  <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — animated platform visual */}
          <HeroVisual />
        </div>

        {/* scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/30 z-10"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── Platform Features Marquee ─────────────────────────────────────────── */}
      <MarqueeTicker />

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

      {/* ── Features Bento ────────────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">

        {/* Colorful animated ambient orbs */}
        <motion.div className="absolute w-[900px] h-[900px] rounded-full -top-96 -left-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)" }}
          animate={{ scale: [1,1.12,1], opacity:[0.6,1,0.6] }} transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }} />
        <motion.div className="absolute w-[700px] h-[700px] rounded-full top-1/3 -right-56 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)" }}
          animate={{ scale: [1,1.15,1], opacity:[0.5,0.9,0.5] }} transition={{ duration:8, repeat:Infinity, ease:"easeInOut", delay:2 }} />
        <motion.div className="absolute w-[800px] h-[800px] rounded-full bottom-0 left-1/3 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 65%)" }}
          animate={{ scale: [1,1.2,1], opacity:[0.4,0.8,0.4] }} transition={{ duration:12, repeat:Infinity, ease:"easeInOut", delay:4 }} />
        <motion.div className="absolute w-[600px] h-[600px] rounded-full top-1/2 right-1/4 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)" }}
          animate={{ scale: [1,1.1,1], opacity:[0.3,0.7,0.3] }} transition={{ duration:9, repeat:Infinity, ease:"easeInOut", delay:1 }} />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <FadeIn className="text-center mb-14 sm:mb-20">
            <motion.div initial={{ scale:0.8, opacity:0 }} whileInView={{ scale:1, opacity:1 }} viewport={{ once:true }} transition={{ duration:0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6 font-semibold uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5" /> The Platform
            </motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-5 leading-tight">
              Everything students need.
              <br />
              <span className="gradient-text">One powerful platform.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              9 deeply integrated features built specifically for campus placement. No more juggling tools.
            </p>
          </FadeIn>

          {/* ── Bento grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

            {/* ① Live Coding IDE — wide */}

            <FadeIn delay={0.05} className="lg:col-span-2">
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[280px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(6,182,212,0.10) 0%,rgba(99,102,241,0.07) 100%)", borderColor:"rgba(6,182,212,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(6,182,212,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ boxShadow:["0 0 0px rgba(6,182,212,0)","0 0 22px rgba(6,182,212,0.55)","0 0 0px rgba(6,182,212,0)"] }}
                          transition={{ duration:2.5, repeat:Infinity }}
                          className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                          <Code2 className="w-6 h-6 text-cyan-400" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-base">Live Coding IDE</h3>
                          <p className="text-xs text-muted-foreground">Monaco Editor · Python · Java · C++ · JS</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">VS Code in Browser</span>
                    </div>
                    <div className="flex-1 rounded-2xl border border-cyan-500/15 bg-[#040810] overflow-hidden shadow-lg">
                      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/3">
                        {["bg-red-500/70","bg-amber-500/70","bg-emerald-500/70"].map(c=><div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                        <span className="text-[10px] text-muted-foreground ml-2 font-mono">solution.py</span>
                        <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:0.9, repeat:Infinity }} className="ml-auto text-[10px] text-cyan-400 font-mono">▋</motion.span>
                      </div>
                      <div className="p-4 font-mono text-[11px] leading-[1.7]">
                        {[
                          [<span key="k" className="text-violet-400">def </span>,<span key="f" className="text-cyan-300">two_sum</span>,<span key="a" className="text-foreground/50">(nums, target):</span>],
                          [<span key="s" className="pl-4 inline-block text-violet-400">seen</span>,<span key="e" className="text-foreground/40"> = {"{}"}</span>],
                          [<span key="fr" className="pl-4 inline-block text-amber-300">for </span>,<span key="v" className="text-foreground/60">i, n </span>,<span key="in" className="text-amber-300">in </span>,<span key="en" className="text-cyan-300">enumerate</span>,<span key="aa" className="text-foreground/50">(nums):</span>],
                          [<span key="if" className="pl-8 inline-block text-amber-300">if </span>,<span key="c" className="text-foreground/60">target-n </span>,<span key="in2" className="text-amber-300">in </span>,<span key="s2" className="text-violet-400">seen</span>,<span key="co" className="text-foreground/50">: </span>,<span key="r" className="text-amber-300">return </span>,<span key="rv" className="text-foreground/60">[seen[target-n], i]</span>],
                          [<span key="s3" className="pl-8 inline-block text-violet-400">seen</span>,<span key="as" className="text-foreground/50">[n] = i</span>],
                        ].map((line, i) => (
                          <motion.div key={i}
                            animate={{ opacity:[0.6,1,0.6] }}
                            transition={{ duration:3, repeat:Infinity, delay:i*0.4, ease:"easeInOut" }}
                            className="flex flex-wrap">{line}</motion.div>
                        ))}
                      </div>
                      <motion.div
                        animate={{ opacity:[0,1,1,1,0], y:[6,0,0,0,-4] }}
                        transition={{ duration:4, repeat:Infinity, repeatDelay:2, times:[0,0.15,0.5,0.85,1] }}
                        className="mx-4 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-semibold">All 3 test cases passed · Runtime 12ms</span>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Real-time test execution, multi-language support, and a free playground for open coding.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ② MCQ Practice */}
            <FadeIn delay={0.10}>
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[280px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.10) 0%,rgba(236,72,153,0.07) 100%)", borderColor:"rgba(168,85,247,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(168,85,247,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ boxShadow:["0 0 0px rgba(168,85,247,0)","0 0 22px rgba(168,85,247,0.55)","0 0 0px rgba(168,85,247,0)"] }}
                        transition={{ duration:2.8, repeat:Infinity }}
                        className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-violet-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base">MCQ Practice Banks</h3>
                        <p className="text-xs text-muted-foreground">15,000+ questions</p>
                      </div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-secondary/30 border border-violet-500/15 p-4 space-y-2.5">
                      <p className="text-[11px] text-foreground/80 font-semibold mb-3">What is Big-O of binary search?</p>
                      {[{t:"O(n)",ok:false},{t:"O(log n)",ok:true},{t:"O(n²)",ok:false},{t:"O(1)",ok:false}].map((o,i)=>(
                        <motion.div key={o.t}
                          animate={o.ok
                            ? { boxShadow:["0 0 0px rgba(52,211,153,0)","0 0 14px rgba(52,211,153,0.45)","0 0 0px rgba(52,211,153,0)"] }
                            : { opacity:[1,0.7,1] }}
                          transition={{ duration: o.ok ? 2 : 3+i*0.5, repeat:Infinity, delay:i*0.2 }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-semibold border ${o.ok?"bg-emerald-500/15 border-emerald-500/25 text-emerald-400":"bg-secondary/50 border-border text-muted-foreground"}`}>
                          {o.ok?<CheckCircle2 className="w-3 h-3 flex-shrink-0"/>:<span className="w-3 h-3 flex-shrink-0"/>}<span>{o.t}</span>
                        </motion.div>
                      ))}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div className="h-full bg-violet-400 rounded-full"
                            animate={{ width:["0%","74%","74%","0%"] }}
                            transition={{ duration:4, repeat:Infinity, repeatDelay:1, times:[0,0.4,0.8,1] }} />
                        </div>
                        <span className="text-[9px] text-violet-400 font-bold">74% accuracy</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Aptitude, reasoning, and CS — instant explanations after each answer.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ③ Structured Learning */}
            <FadeIn delay={0.14}>
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[260px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(14,112,112,0.12) 0%,rgba(6,182,212,0.06) 100%)", borderColor:"rgba(14,112,112,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(14,112,112,0.20) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ boxShadow:["0 0 0px rgba(99,102,241,0)","0 0 22px rgba(99,102,241,0.55)","0 0 0px rgba(99,102,241,0)"] }}
                        transition={{ duration:2.6, repeat:Infinity }}
                        className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base">Structured Learning</h3>
                        <p className="text-xs text-muted-foreground">8+ Courses</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[
                        {l:"Python Fundamentals",p:100,c:"bg-primary"},
                        {l:"Data Structures",p:72,c:"bg-cyan-400"},
                        {l:"Web Development",p:45,c:"bg-violet-400"},
                        {l:"System Design",p:18,c:"bg-amber-400"},
                      ].map((course,i)=>(
                        <div key={course.l} className="flex items-center gap-3">
                          <span className="text-[10px] text-foreground/70 w-32 flex-shrink-0 truncate">{course.l}</span>
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div className={`h-full ${course.c} rounded-full`}
                              animate={{ width:["0%",`${course.p}%`,`${course.p}%`,"0%"] }}
                              transition={{ duration:3.5, repeat:Infinity, repeatDelay:0.5, delay:i*0.6, times:[0,0.35,0.75,1], ease:"easeInOut" }} />
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground w-7 text-right">{course.p}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Bite-sized lessons with points per completion, from Python to Web Dev.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ④ Gamification */}
            <FadeIn delay={0.18}>
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[260px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.10) 0%,rgba(251,146,60,0.07) 100%)", borderColor:"rgba(245,158,11,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.20) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ boxShadow:["0 0 0px rgba(245,158,11,0)","0 0 22px rgba(245,158,11,0.6)","0 0 0px rgba(245,158,11,0)"] }}
                        transition={{ duration:2, repeat:Infinity }}
                        className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-amber-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base">Gamification Engine</h3>
                        <p className="text-xs text-muted-foreground">Streaks · XP · Rewards</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/8 border border-amber-500/15">
                        <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-amber-400 flame-pulse" /><span className="text-sm font-bold text-amber-400">Daily Streak</span></div>
                        <div className="flex gap-1">
                          {Array.from({length:7}).map((_,i)=>(
                            <motion.div key={i}
                              animate={i<5 ? { scale:[1,1.3,1], opacity:[0.8,1,0.8] } : { opacity:[0.3,0.5,0.3] }}
                              transition={{ duration:1.2, repeat:Infinity, delay:i*0.15, ease:"easeInOut" }}
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${i<5?"bg-amber-500/20 text-amber-400":"bg-secondary/40 text-muted-foreground/40"}`}>
                              {i<5?"🔥":"·"}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[{e:"⚡",l:"XP",c:"border-amber-400/30 text-amber-400"},{e:"🪙",l:"Coins",c:"border-cyan-400/30 text-cyan-400"},{e:"💎",l:"Gems",c:"border-violet-400/30 text-violet-400"},{e:"🛡️",l:"Shields",c:"border-emerald-400/30 text-emerald-400"}].map((g,i)=>(
                          <motion.div key={g.l}
                            animate={{ scale:[1,1.07,1], y:[0,-2,0] }}
                            transition={{ duration:2, repeat:Infinity, delay:i*0.35, ease:"easeInOut" }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border bg-card ${g.c}`}>
                            <span className="text-base">{g.e}</span>
                            <span className={`text-[9px] font-bold ${g.c.split(" ")[1]}`}>{g.l}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Daily streaks, XP, leaderboards and rewards that make students compete to learn.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ⑤ Company Prep */}
            <FadeIn delay={0.22}>
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[260px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.09) 0%,rgba(234,179,8,0.06) 100%)", borderColor:"rgba(251,191,36,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(251,191,36,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ boxShadow:["0 0 0px rgba(234,179,8,0)","0 0 22px rgba(234,179,8,0.55)","0 0 0px rgba(234,179,8,0)"] }}
                        transition={{ duration:2.4, repeat:Infinity }}
                        className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base">Company Prep</h3>
                        <p className="text-xs text-muted-foreground">120+ company guides</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {["Aptitude Round","Technical Round","Coding Round","HR Interview"].map((round,i)=>(
                        <motion.div key={round}
                          animate={{ x:[0,3,0], opacity:[0.8,1,0.8] }}
                          transition={{ duration:2.5+i*0.4, repeat:Infinity, delay:i*0.3, ease:"easeInOut" }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-yellow-500/8 border border-yellow-500/15">
                          <motion.div
                            animate={{ scale:[1,1.6,1] }}
                            transition={{ duration:1.8, repeat:Infinity, delay:i*0.25 }}
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${["bg-yellow-400","bg-cyan-400","bg-violet-400","bg-emerald-400"][i]}`} />
                          <span className="text-[11px] font-semibold text-foreground/80 flex-1">{round}</span>
                          <Layers className={`w-3 h-3 ${["text-yellow-400","text-cyan-400","text-violet-400","text-emerald-400"][i]}`} />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Detailed hiring round breakdowns, past patterns, and insider tips per company.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ⑥ Admin Analytics — wide */}
            <FadeIn delay={0.26} className="lg:col-span-2">
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[260px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(52,211,153,0.10) 0%,rgba(6,182,212,0.06) 100%)", borderColor:"rgba(52,211,153,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(52,211,153,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ boxShadow:["0 0 0px rgba(52,211,153,0)","0 0 22px rgba(52,211,153,0.55)","0 0 0px rgba(52,211,153,0)"] }}
                          transition={{ duration:2.2, repeat:Infinity }}
                          className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                          <BarChart2 className="w-6 h-6 text-emerald-400" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-base">Admin Analytics Suite</h3>
                          <p className="text-xs text-muted-foreground">Live dashboards · 1-click reminders</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5,repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400">Live</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      {/* Animated bar chart */}
                      <div className="flex items-end gap-1.5 h-24">
                        {[
                          {vals:[42,68,42],c:"bg-violet-400"},
                          {vals:[61,45,61],c:"bg-cyan-400"},
                          {vals:[55,80,55],c:"bg-pink-400"},
                          {vals:[78,55,78],c:"bg-amber-400"},
                          {vals:[88,70,88],c:"bg-emerald-400"},
                          {vals:[95,82,95],c:"bg-primary"},
                        ].map((b,i)=>(
                          <motion.div key={i} className={`flex-1 rounded-t-lg ${b.c} opacity-80`}
                            animate={{ height:[`${b.vals[0]}%`,`${b.vals[1]}%`,`${b.vals[2]}%`] }}
                            transition={{ duration:2.5, repeat:Infinity, delay:i*0.2, ease:"easeInOut", repeatType:"mirror" }} />
                        ))}
                      </div>
                      {/* Metrics with pulse */}
                      <div className="grid grid-cols-2 gap-2 content-center">
                        {[
                          {l:"Completion",v:"87%",c:"text-emerald-400",b:"bg-emerald-500/10",br:"border-emerald-500/20"},
                          {l:"Active",v:"94%",c:"text-cyan-400",b:"bg-cyan-500/10",br:"border-cyan-500/20"},
                          {l:"Avg Score",v:"78",c:"text-violet-400",b:"bg-violet-500/10",br:"border-violet-500/20"},
                          {l:"Submitted",v:"1.2k",c:"text-amber-400",b:"bg-amber-500/10",br:"border-amber-500/20"},
                        ].map((m,i)=>(
                          <motion.div key={m.l}
                            animate={{ scale:[1,1.04,1] }}
                            transition={{ duration:2, repeat:Infinity, delay:i*0.4 }}
                            className={`${m.b} border ${m.br} rounded-xl p-2 text-center`}>
                            <div className={`text-sm font-bold ${m.c}`}>{m.v}</div>
                            <div className="text-[9px] text-muted-foreground mt-0.5">{m.l}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Real-time visibility into every student's journey. See who's thriving and act instantly.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ⑦ AI Resume Builder */}
            <FadeIn delay={0.30}>
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[260px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(244,63,94,0.10) 0%,rgba(251,113,133,0.07) 100%)", borderColor:"rgba(244,63,94,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(244,63,94,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ boxShadow:["0 0 0px rgba(244,63,94,0)","0 0 22px rgba(244,63,94,0.55)","0 0 0px rgba(244,63,94,0)"] }}
                        transition={{ duration:2.3, repeat:Infinity }}
                        className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
                        <ScrollText className="w-6 h-6 text-pink-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base">AI Resume Builder</h3>
                        <p className="text-xs text-muted-foreground">Guided sections · PDF export</p>
                      </div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-secondary/30 border border-pink-500/15 p-3 space-y-2">
                      {["Skills & Tech Stack","Work Experience","Education","Projects"].map((section,i)=>(
                        <motion.div key={section}
                          animate={{ borderColor:["rgba(244,63,94,0.12)","rgba(244,63,94,0.4)","rgba(244,63,94,0.12)"] }}
                          transition={{ duration:2.5, repeat:Infinity, delay:i*0.5 }}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-pink-500/8 border">
                          <motion.div
                            animate={{ scale:[1,1.2,1] }}
                            transition={{ duration:2, repeat:Infinity, delay:i*0.4 }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                          </motion.div>
                          <span className="text-[10px] font-medium text-foreground/80">{section}</span>
                        </motion.div>
                      ))}
                      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                        animate={{ boxShadow:["0 0 0px rgba(244,63,94,0)","0 0 16px rgba(244,63,94,0.5)","0 0 0px rgba(244,63,94,0)"] }}
                        transition={{ duration:2, repeat:Infinity }}
                        className="w-full mt-1 py-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 text-[10px] font-bold flex items-center justify-center gap-1.5">
                        <Download className="w-3 h-3" /> Export PDF
                      </motion.button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Build and export a job-ready resume with guided sections and one-click PDF.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ⑧ Domain Mentorship — wide */}
            <FadeIn delay={0.34} className="lg:col-span-2">
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[240px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(139,92,246,0.10) 0%,rgba(168,85,247,0.07) 100%)", borderColor:"rgba(139,92,246,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(139,92,246,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ boxShadow:["0 0 0px rgba(139,92,246,0)","0 0 22px rgba(139,92,246,0.55)","0 0 0px rgba(139,92,246,0)"], rotate:[0,360] }}
                          transition={{ boxShadow:{ duration:2.7, repeat:Infinity }, rotate:{ duration:8, repeat:Infinity, ease:"linear" } }}
                          className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                          <Globe className="w-6 h-6 text-purple-400" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-base">Domain Mentorship Paths</h3>
                          <p className="text-xs text-muted-foreground">Data Analysis · Web Development</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">2 Paths</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      {[
                        { name:"Data Analysis", steps:["Python","Pandas & NumPy","SQL Basics","Visualization"], color:"text-cyan-400", border:"border-cyan-500/20", bg:"bg-cyan-500/8", dotDone:"bg-emerald-400" },
                        { name:"Web Development", steps:["HTML & CSS","JavaScript","React","Node.js"], color:"text-purple-400", border:"border-purple-500/20", bg:"bg-purple-500/8", dotDone:"bg-emerald-400" },
                      ].map((path,pi)=>(
                        <div key={path.name} className={`rounded-2xl border ${path.border} ${path.bg} p-3`}>
                          <p className={`text-[10px] font-bold ${path.color} mb-2`}>{path.name}</p>
                          <div className="space-y-1.5">
                            {path.steps.map((step,si)=>(
                              <div key={step} className="flex items-center gap-2">
                                <motion.div
                                  animate={si<2
                                    ? { scale:[1,1.5,1], opacity:[0.8,1,0.8] }
                                    : { scale:[0.8,1.2,0.8], opacity:[0.3,0.7,0.3] }}
                                  transition={{ duration:1.8, repeat:Infinity, delay:pi*0.5+si*0.3 }}
                                  className={`w-1.5 h-1.5 rounded-full ${si<2?path.dotDone:"bg-secondary-foreground/20"} flex-shrink-0`} />
                                <span className="text-[10px] text-foreground/70">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Curated learning paths aligned to real job requirements, with step-by-step progression.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

            {/* ⑨ College Social Feed */}
            <FadeIn delay={0.38}>
              <TiltCard>
                <motion.div whileHover={{ scale:1.005 }} className="relative h-full min-h-[240px] rounded-3xl border overflow-hidden group cursor-default"
                  style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.10) 0%,rgba(99,102,241,0.07) 100%)", borderColor:"rgba(59,130,246,0.35)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(59,130,246,0.18) 0%,transparent 60%)" }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ boxShadow:["0 0 0px rgba(59,130,246,0)","0 0 22px rgba(59,130,246,0.55)","0 0 0px rgba(59,130,246,0)"] }}
                        transition={{ duration:2.6, repeat:Infinity }}
                        className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base">College Social Feed</h3>
                        <p className="text-xs text-muted-foreground">Campus-scoped community</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[
                        {avatar:"P",name:"Priya R.",text:"Just finished the DSA module 🎉",likes:12,c:"from-violet-500 to-purple-600"},
                        {avatar:"A",name:"Arjun K.",text:"Streak at 15 days — who's competing?",likes:24,c:"from-cyan-500 to-blue-600"},
                      ].map((post,i)=>(
                        <motion.div key={post.name}
                          animate={{ y:[0,-3,0] }}
                          transition={{ duration:3+i*0.8, repeat:Infinity, delay:i*1.2, ease:"easeInOut" }}
                          className="p-3 rounded-2xl bg-blue-500/8 border border-blue-500/12">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${post.c} flex items-center justify-center text-white text-[9px] font-bold`}>{post.avatar}</div>
                            <span className="text-[10px] font-bold">{post.name}</span>
                          </div>
                          <p className="text-[10px] text-foreground/70 mb-1.5">{post.text}</p>
                          <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                            <motion.span
                              animate={{ scale:[1,1.3,1] }}
                              transition={{ duration:1.5, repeat:Infinity, delay:i*0.6 }}
                              className="text-red-400">♥ {post.likes}</motion.span>
                            <span>💬 3 comments</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Campus feed for posts, blogs, announcements, and peer motivation.</p>
                  </div>
                </motion.div>
              </TiltCard>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Quote ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=75&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-black/62" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-3xl p-8 sm:p-14"
            >
              <div className="text-primary text-6xl font-serif leading-none mb-4 select-none drop-shadow-lg">"</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold font-serif leading-snug text-white drop-shadow-lg">
                The difference between a student who gets placed and one who doesn't is not talent.
                It's{" "}
                <span className="gradient-text">preparation with the right system.</span>
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-white/30" />
                <span className="text-sm text-white/70">CareerEzi Mission</span>
                <div className="w-8 h-px bg-white/30" />
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
        {/* Background image — dark gradient so white text always readable */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=75&auto=format&fit=crop')" }}
          />
          {/* layered dark overlay: centre stays lighter to see the image, edges go dark */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn>
            <div className="p-10 sm:p-16">
              {/* Logo */}
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

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 text-white text-xs sm:text-sm mb-6 font-medium backdrop-blur-sm">
                <Rocket className="w-3.5 h-3.5" />
                Get Started Today
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight text-white drop-shadow-lg">
                Your next batch's placement
                <br />
                record starts{" "}
                <span className="gradient-text">today.</span>
              </h2>

              <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-9 drop-shadow">
                Every great placement record started with one decision. Make yours today — your students are waiting.
              </p>

              {/* CTA buttons */}
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
                      Log In <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </MagneticWrap>
                <MagneticWrap>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                    <button
                      onClick={() => scrollTo("contact")}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-semibold backdrop-blur-sm transition-all"
                    >
                      Contact Us <Mail className="w-4 h-4" />
                    </button>
                  </motion.div>
                </MagneticWrap>
              </motion.div>
            </div>
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
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                © 2026 CareerEzi. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Developed by{" "}
                <a
                  href="https://www.fynityinnovations.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline transition-colors"
                >
                  Fynity Innovations
                </a>
              </p>
            </div>
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
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
      } else {
        setSubmitted(true)
        setContactForm({ name: "", email: "", phone: "", message: "" })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
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
        <label className="text-sm text-muted-foreground font-medium">Phone Number <span className="text-muted-foreground/50">(optional)</span></label>
        <input type="tel" value={contactForm.phone}
          onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="+91 98765 43210"
          className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-medium">Message</label>
        <textarea required rows={4} value={contactForm.message}
          onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
          placeholder="Tell us about your college and how we can help..."
          className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
      </div>
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-primary text-sm font-semibold py-3 justify-center bg-primary/10 rounded-xl border border-primary/20">
            <Check className="w-4 h-4" />
            Message sent! We'll get back to you soon.
          </motion.div>
        ) : (
          <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all primary-glow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? "Sending..." : <><span>Send Message</span> <ArrowRight className="w-4 h-4" /></>}
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  )
}
