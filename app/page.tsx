"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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
  PlayCircle, FileText, MessageSquare, Pause, Play,
  ChevronLeft, ScrollText, Download, Palette,
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

// ─── Typewriter ────────────────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && text === "") {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => setText(deleting ? text.slice(0, -1) : word.slice(0, text.length + 1)),
        deleting ? 35 : 65
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, wordIdx, words])

  return (
    <span className="gradient-text">
      {text}
      <span className="cursor-blink ml-0.5 text-primary">|</span>
    </span>
  )
}

// ─── 3-D tilt card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springX = useSpring(rotX, { stiffness: 260, damping: 28 })
  const springY = useSpring(rotY, { stiffness: 260, damping: 28 })

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width / 2) / r.width
    const dy = (e.clientY - r.top - r.height / 2) / r.height
    rotX.set(dy * -12)
    rotY.set(dx * 12)
  }
  const handleLeave = () => { rotX.set(0); rotY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
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

// ─── Dashboard mockup ──────────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <TiltCard className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        className="glass-card rounded-2xl border border-border p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Good morning,</p>
            <p className="text-sm font-semibold">Rahul Kumar 👋</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Flame className="w-3 h-3 text-amber-500 flame-pulse" />
            <span className="text-xs font-bold text-amber-500">12 day streak</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "Points", value: "2,340", color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Rank", value: "#5", color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { label: "Done", value: "3/8", color: "text-pink-400", bg: "bg-pink-500/10" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-2 text-center`}>
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-3 border border-border mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-medium">Python Fundamentals</p>
              <p className="text-[10px] text-muted-foreground">8 of 12 lessons done</p>
            </div>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ delay: 1.3, duration: 1.2, ease: "easeOut" }}
              className="h-1.5 rounded-full gradient-bg"
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground mb-2">Top Performers</p>
          {[
            { rank: 1, name: "Priya S.", pts: "3,210", color: "text-amber-400" },
            { rank: 2, name: "Arjun R.", pts: "2,890", color: "text-slate-400" },
            { rank: 3, name: "Kavya M.", pts: "2,650", color: "text-orange-400" },
          ].map((r) => (
            <div key={r.rank} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
              <span className={`text-xs font-bold w-5 ${r.color}`}>#{r.rank}</span>
              <span className="text-xs flex-1">{r.name}</span>
              <span className="text-xs text-primary font-medium">{r.pts}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating MCQ badge */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute -right-10 top-6 glass-card rounded-xl border border-pink-500/20 p-3 w-44 shadow-xl hidden sm:block"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Brain className="w-3 h-3 text-pink-400" />
          <span className="text-[10px] font-semibold text-pink-400">MCQ Practice</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">What is Big O notation used for?</p>
        {[
          { text: "Algorithm complexity", correct: true },
          { text: "A sorting method", correct: false },
        ].map((opt) => (
          <div key={opt.text} className={`text-[10px] px-2 py-1 rounded-lg border mb-1 ${opt.correct ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
            {opt.text}
          </div>
        ))}
      </motion.div>

      {/* Floating code badge */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.35, duration: 0.5 }}
        className="absolute -left-8 bottom-24 glass-card rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2.5 shadow-xl hidden sm:flex items-center gap-2"
      >
        <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-semibold text-cyan-400">Submitted ✓</p>
          <p className="text-[10px] text-muted-foreground">All 5 tests passed</p>
        </div>
      </motion.div>

      {/* Points burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 0.8], y: [8, 0, 0, -12] }}
        transition={{ delay: 2.2, duration: 1.8, repeat: Infinity, repeatDelay: 5 }}
        className="absolute -left-2 top-1/3 gradient-bg text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none"
      >
        +10 pts 🎉
      </motion.div>
    </TiltCard>
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
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 py-3 pb-safe bg-background/90 backdrop-blur-xl border-t border-border"
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

// ─── Data ───────────────────────────────────────────────────────────────────────
const stats = [
  { icon: Building2,     label: "Colleges",  value: 50,    suffix: "+", gradient: "from-violet-500 to-purple-600",  glow: "shadow-violet-500/20" },
  { icon: GraduationCap, label: "Students",  value: 12000, suffix: "+", gradient: "from-cyan-500 to-blue-600",      glow: "shadow-cyan-500/20" },
  { icon: HelpCircle,    label: "Questions", value: 500,   suffix: "+", gradient: "from-pink-500 to-rose-600",      glow: "shadow-pink-500/20" },
  { icon: Trophy,        label: "Companies", value: 30,    suffix: "+", gradient: "from-amber-500 to-orange-600",   glow: "shadow-amber-500/20" },
]

const featureTabs = [
  {
    icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/10",
    border: "border-violet-400/40", accent: "from-violet-500 to-purple-600",
    title: "Structured Learning", tagline: "From zero to job-ready, step by step",
    desc: "Courses in Python, SQL, HTML, CSS, JavaScript and more — each broken into bite-sized lessons with progress tracking. Students earn points on every completed lesson.",
    bullets: [
      "8+ programming courses with structured lessons",
      "Lesson completion tracking per student",
      "Points awarded on every lesson",
      "College admins can lock/unlock specific courses",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Python Fundamentals</p>
            <p className="text-xs text-muted-foreground">12 lessons · Beginner</p>
          </div>
          <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">In Progress</span>
        </div>
        {[
          { title: "Variables & Data Types", done: true },
          { title: "Control Flow & Loops", done: true },
          { title: "Functions & Scope", done: false },
          { title: "OOP Concepts", done: false },
        ].map((l) => (
          <div key={l.title} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${l.done ? "border-primary/20 bg-primary/5 hover:border-primary/40" : "border-border hover:border-violet-400/30 hover:bg-violet-500/5"}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${l.done ? "bg-primary" : "border border-border"}`}>
              {l.done && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs flex-1 ${l.done ? "text-foreground" : "text-muted-foreground"}`}>{l.title}</span>
            {l.done && <span className="text-[10px] text-primary font-semibold">+5 pts</span>}
          </div>
        ))}
        <div className="pt-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span><span>2 / 4 lessons</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div className="h-2 rounded-full gradient-bg w-1/2" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Brain, color: "text-pink-400", bg: "bg-pink-500/10",
    border: "border-pink-400/40", accent: "from-pink-500 to-rose-600",
    title: "MCQ Practice", tagline: "Topic-wise practice with instant feedback",
    desc: "500+ MCQ questions across aptitude, reasoning, and core CS topics. Students get instant answer explanations, earn points for correct answers, and track topic-wise progress.",
    bullets: [
      "500+ questions spanning aptitude & programming",
      "Instant correct/wrong feedback with explanations",
      "Points earned per correct answer",
      "Track performance per topic & subtopic",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-semibold">Data Structures · Q14</span>
          <span className="ml-auto text-xs text-muted-foreground">+10 pts on correct</span>
        </div>
        <p className="text-sm leading-relaxed">What is the time complexity of binary search?</p>
        <div className="space-y-2">
          {[
            { text: "O(n)", correct: false, selected: false },
            { text: "O(log n)", correct: true, selected: true },
            { text: "O(n²)", correct: false, selected: false },
            { text: "O(1)", correct: false, selected: false },
          ].map((opt) => (
            <div key={opt.text} className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all cursor-pointer
              ${opt.selected && opt.correct ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
                "border-border hover:border-pink-400/30 hover:bg-pink-500/5 text-muted-foreground"}`}
            >
              <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${opt.selected && opt.correct ? "border-emerald-400 bg-emerald-400" : "border-muted-foreground"}`} />
              {opt.text}
              {opt.selected && opt.correct && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-400">Binary search halves the search space each step → O(log n).</p>
        </div>
      </div>
    ),
  },
  {
    icon: Code2, color: "text-cyan-400", bg: "bg-cyan-500/10",
    border: "border-cyan-400/40", accent: "from-cyan-500 to-blue-600",
    title: "Coding IDE", tagline: "Code, run, submit — all in the browser",
    desc: "A full Monaco editor right in the browser with multi-language support. Real test-case execution, submit for review, and a free Code Lab playground for open-ended exploration.",
    bullets: [
      "Monaco editor (same as VS Code) in browser",
      "Run against hidden & visible test cases",
      "Python, JavaScript, Java, C++ supported",
      "Code Lab: free playground for experiments",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs text-muted-foreground ml-1">solution.py</span>
          <span className="ml-auto text-[10px] text-cyan-400 border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 rounded-full">Python</span>
        </div>
        <div className="p-4 font-mono text-xs space-y-0.5 bg-background/40">
          <p><span className="text-violet-400">def</span> <span className="text-cyan-400">two_sum</span><span className="text-foreground">(nums, target):</span></p>
          <p className="pl-4 text-muted-foreground"># hash map approach — O(n)</p>
          <p className="pl-4"><span className="text-pink-400">seen</span> = {"{}"}</p>
          <p className="pl-4"><span className="text-violet-400">for</span> i, num <span className="text-violet-400">in</span> <span className="text-cyan-400">enumerate</span>(nums):</p>
          <p className="pl-8"><span className="text-pink-400">comp</span> = target - num</p>
          <p className="pl-8"><span className="text-violet-400">if</span> comp <span className="text-violet-400">in</span> seen:</p>
          <p className="pl-12"><span className="text-violet-400">return</span> [seen[comp], i]</p>
          <p className="pl-8">seen[num] = i</p>
        </div>
        <div className="border-t border-border px-4 py-2.5 bg-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 5/5 tests</span>
            <span className="text-xs text-muted-foreground">28ms</span>
          </div>
          <button className="text-xs gradient-bg text-white px-3 py-1.5 rounded-lg font-semibold">Submit</button>
        </div>
      </div>
    ),
  },
  {
    icon: Building2, color: "text-amber-400", bg: "bg-amber-500/10",
    border: "border-amber-400/40", accent: "from-amber-500 to-orange-600",
    title: "Company Prep", tagline: "Crack any company with targeted prep",
    desc: "Company-specific hiring round breakdowns, past aptitude patterns, technical topics, and interview tips — curated for 30+ companies including TCS, Zoho, Infosys, and more.",
    bullets: [
      "30+ companies with detailed round breakdowns",
      "Hiring round structure per company",
      "Aptitude patterns & key technical topics",
      "Interview tips & insider notes",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-sm">Z</div>
          <div>
            <p className="text-sm font-semibold">Zoho Corporation</p>
            <p className="text-xs text-muted-foreground">Chennai-based · Product Company</p>
          </div>
          <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">5 Rounds</span>
        </div>
        {[
          { round: "Round 1", name: "Written Aptitude Test", icon: FileText },
          { round: "Round 2", name: "Programming Test", icon: Code2 },
          { round: "Round 3", name: "Advanced Programming", icon: Terminal },
          { round: "Round 4", name: "Technical Interview", icon: Users },
        ].map((r) => (
          <div key={r.round} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-amber-400/30 hover:bg-amber-500/5 transition-all cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <r.icon className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium">{r.name}</p>
              <p className="text-[10px] text-muted-foreground">{r.round}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10",
    border: "border-emerald-400/40", accent: "from-emerald-500 to-teal-600",
    title: "College Feed", tagline: "A campus social network for achievers",
    desc: "A private, college-scoped social feed where students post achievements, write blogs, react and comment. Think LinkedIn — but only for your campus, focused on growth.",
    bullets: [
      "Post achievements, projects, and blogs",
      "Like, comment, and reply on posts",
      "College-scoped — only your campus sees it",
      "Teal for posts, purple gradient for blogs",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
        {[
          { name: "Priya Sharma", time: "2h ago", type: "achievement", content: "Just cleared Zoho Round 3! 🎉 The Data Structures prep on CareerEzi was super helpful.", likes: 24, comments: 8 },
          { name: "Dev Anand", time: "5h ago", type: "blog", content: "How I went from 0 to solving medium LeetCode problems in 3 weeks — my personal roadmap.", likes: 41, comments: 15 },
        ].map((post) => (
          <div key={post.name} className="p-3 rounded-xl border border-border hover:border-primary/20 transition-colors cursor-pointer space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{post.name[0]}</div>
              <div>
                <p className="text-xs font-semibold">{post.name}</p>
                <p className="text-[10px] text-muted-foreground">{post.time}</p>
              </div>
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border ${post.type === "achievement" ? "border-primary/30 bg-primary/10 text-primary" : "border-purple-500/30 bg-purple-500/10 text-purple-400"}`}>
                {post.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>❤️ {post.likes}</span><span>💬 {post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Trophy, color: "text-orange-400", bg: "bg-orange-500/10",
    border: "border-orange-400/40", accent: "from-orange-500 to-red-600",
    title: "Leaderboard", tagline: "Gamification that actually drives habits",
    desc: "Daily streaks, point systems, and a college-wide leaderboard make consistency fun. Admins can see who's active and send 1-click nudges to inactive students.",
    bullets: [
      "Daily streak tracking with flame indicator",
      "Points for every learning action",
      "College-wide rankings updated in real time",
      "Admin 1-click email reminders to inactive students",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold">Leaderboard</span>
          <span className="ml-auto text-xs text-muted-foreground">Your college</span>
        </div>
        <div className="flex items-end justify-center gap-3 py-2">
          {[
            { rank: 2, name: "Arjun", pts: "2,890", h: "h-16", color: "bg-slate-500/20 border-slate-400/30", badge: "🥈" },
            { rank: 1, name: "Priya", pts: "3,210", h: "h-20", color: "bg-amber-500/20 border-amber-400/30", badge: "🥇" },
            { rank: 3, name: "Kavya", pts: "2,650", h: "h-12", color: "bg-orange-500/20 border-orange-400/30", badge: "🥉" },
          ].map((p) => (
            <div key={p.rank} className="flex flex-col items-center gap-1">
              <span className="text-sm">{p.badge}</span>
              <div className={`w-14 ${p.h} rounded-t-xl border ${p.color} flex flex-col items-center justify-end pb-2`}>
                <span className="text-[10px] font-semibold">{p.name}</span>
                <span className="text-[10px] text-primary">{p.pts}</span>
              </div>
            </div>
          ))}
        </div>
        {[
          { rank: 4, name: "Rohan P.", pts: "2,420" },
          { rank: 5, name: "You →", pts: "2,340", highlight: true },
          { rank: 6, name: "Sneha K.", pts: "2,100" },
        ].map((r) => (
          <div key={r.rank} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${r.highlight ? "border-primary/30 bg-primary/5" : "border-border hover:border-orange-400/20 hover:bg-orange-500/5"} transition-all cursor-pointer`}>
            <span className="text-xs font-bold w-6 text-muted-foreground">#{r.rank}</span>
            <span className={`text-xs flex-1 ${r.highlight ? "text-primary font-medium" : ""}`}>{r.name}</span>
            <span className="text-xs text-primary font-medium">{r.pts} pts</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: ScrollText, color: "text-teal-400", bg: "bg-teal-500/10",
    border: "border-teal-400/40", accent: "from-teal-500 to-cyan-600",
    title: "Resume Builder", tagline: "Build a job-ready resume in minutes",
    desc: "A full resume builder with 5 professional templates, live PDF preview, and cloud save. Students fill in their profile once and export a polished, ATS-friendly resume instantly.",
    bullets: [
      "5 templates: Modern, Classic, Minimal, Sharp, Elegant",
      "Sections for experience, projects, certifications & more",
      "Live split-panel preview — see changes instantly",
      "One-click PDF export via browser print",
    ],
    preview: (
      <div className="glass-card rounded-2xl border border-border overflow-hidden">
        {/* Builder top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-semibold">Resume Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Auto-saved
            </span>
            <button className="flex items-center gap-1 text-[10px] gradient-bg text-white px-2.5 py-1 rounded-lg font-semibold">
              <Download className="w-3 h-3" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0">
          {/* Left — editor panel */}
          <div className="p-3 border-r border-border space-y-2.5 bg-background/40">
            {/* Template picker */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Template
              </p>
              <div className="flex gap-1.5">
                {["Modern", "Classic", "Minimal"].map((t, i) => (
                  <div key={t} className={`flex-1 text-[9px] text-center py-1 rounded-lg border font-medium cursor-pointer transition-all
                    ${i === 0 ? "border-teal-400/50 bg-teal-500/10 text-teal-400" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Personal info */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground">Personal Info</p>
              <div className="bg-secondary/40 rounded-lg px-2 py-1.5 text-[10px] text-foreground">Rahul Kumar</div>
              <div className="bg-secondary/40 rounded-lg px-2 py-1.5 text-[10px] text-muted-foreground">rahul@gmail.com</div>
              <div className="bg-secondary/40 rounded-lg px-2 py-1.5 text-[10px] text-muted-foreground">Chennai, Tamil Nadu</div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {["Python", "SQL", "React", "Java"].map((s) => (
                  <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-400/20">{s}</span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Projects</p>
              <div className="p-2 rounded-lg border border-border bg-secondary/20 space-y-0.5">
                <p className="text-[10px] font-semibold">E-Commerce App</p>
                <p className="text-[9px] text-muted-foreground">React · Node.js · MongoDB</p>
              </div>
            </div>
          </div>

          {/* Right — live preview */}
          <div className="p-3 bg-white/5 space-y-2">
            <div className="text-center border-b border-border/50 pb-2 mb-2">
              <p className="text-xs font-bold text-foreground">Rahul Kumar</p>
              <p className="text-[9px] text-muted-foreground">rahul@gmail.com · Chennai, TN</p>
              <div className="flex justify-center gap-2 mt-1">
                <span className="text-[9px] text-teal-400">github.com/rahul</span>
                <span className="text-[9px] text-teal-400">linkedin.com/in/rahul</span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Skills</p>
              <p className="text-[9px] text-muted-foreground">Python · SQL · React · Java · Git</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Projects</p>
              <div>
                <p className="text-[9px] font-semibold">E-Commerce App</p>
                <p className="text-[9px] text-muted-foreground">Full-stack app with React &amp; Node.js</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Education</p>
              <p className="text-[9px] font-semibold">B.E. Computer Science</p>
              <p className="text-[9px] text-muted-foreground">Anna University · 2025</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

const howItWorks = [
  {
    icon: Building2, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30",
    title: "College Onboards",
    desc: "The college admin activates CareerEzi, picks a plan, and configures which courses and domains students can access.",
  },
  {
    icon: GraduationCap, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30",
    title: "Students Join",
    desc: "Students register with their college email. The platform auto-applies the college's curriculum — no manual setup.",
  },
  {
    icon: Rocket, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30",
    title: "Learn & Get Placed",
    desc: "Students practice daily, climb the leaderboard, crack company-specific prep, and walk into interviews confident.",
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
]

const plans = [
  // {
  //   name: "Free", price: "₹0", period: "", color: "text-muted-foreground", border: "border-border", glow: false, badge: null,
  //   features: ["Python Module (Lessons, MCQ & Assignments)", "Aptitude MCQ Bank", "Remaining courses locked"],
  // },
  {
    name: "Base Plan", price: "₹1,000", period: "/student/year", color: "text-blue-400", border: "border-blue-500/30", glow: false, badge: null,
    features: ["Python, SQL, HTML, CSS Modules", "Aptitude MCQ Bank", "Company Preparation", "College Social Feed", "Admin Dashboard"],
  },
  {
    name: "Pro Plan", price: "₹1,500", period: "/student/year", color: "text-primary", border: "border-primary/40", glow: true, badge: "Most Popular",
    features: ["Everything in Base Plan", "1 Domain: Data Analysis or Web Dev", "Admin 1-click inactive-student emails"],
  },
  {
    name: "Enterprise", price: "Custom", period: "", color: "text-purple-400", border: "border-purple-500/30", glow: false, badge: null,
    features: ["Custom domains & courses", "Custom analytics", "Custom integrations", "Dedicated support"],
  },
]

const faqs = [
  { q: "How do students access the platform?", a: "Students register using their college email address. Once the college is activated, they get instant access to all features under their plan — no manual approval needed." },
  { q: "Can we control which courses students see?", a: "Absolutely. The admin dashboard lets you configure exactly which courses and domain programs are accessible. Lock everything except free-tier, or unlock specific courses for different batches." },
  { q: "Is there a mobile app?", a: "CareerEzi is fully responsive and works great on mobile browsers. A dedicated mobile app is on the roadmap for late 2026." },
  { q: "How does the coding IDE work?", a: "We use Monaco Editor (same as VS Code) embedded in the browser. Students write code, click Run, and it executes against real test cases. Supported: Python, JavaScript, Java, C++." },
  { q: "What does the admin dashboard show?", a: "Admins get analytics on lesson completion, MCQ performance, coding submissions, and student activity. You can also send 1-click email reminders to students who've been inactive." },
  { q: "What is the pricing model exactly?", a: "Pricing is per-student per-year. Free tier lets every student access Python basics. Base (₹1,000) unlocks core courses. Pro (₹1,500) adds a full domain learning path. Enterprise is custom." },
  { q: "How is CareerEzi different from LeetCode or HackerRank?", a: "CareerEzi is built for colleges, not individuals. It bundles structured courses, MCQ practice, a coding IDE, company prep, a campus social feed, and admin analytics — all under one institutional subscription." },
]

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

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()
  const { token, user } = useAuthStore()

  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [tabPaused, setTabPaused] = useState(false)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [dragStart, setDragStart] = useState(0)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Auto-cycle feature tabs
  const advanceTab = useCallback(
    () => setActiveTab((i) => (i + 1) % featureTabs.length),
    []
  )
  useEffect(() => {
    if (tabPaused) return
    const t = setTimeout(advanceTab, 5000)
    return () => clearTimeout(t)
  }, [activeTab, tabPaused, advanceTab])

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 4800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!token || !user) return
    if (user.first_login) { router.replace("/onboarding"); return }
    router.replace(user.role === "super_admin" ? "/super-admin" : user.role === "college_admin" ? "/admin" : "/dashboard")
  }, [token, user, router])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setContactForm({ name: "", email: "", message: "" })
  }

  const goTestimonial = (dir: 1 | -1) =>
    setTestimonialIdx((i) => (i + dir + testimonials.length) % testimonials.length)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <TopNav onScrollTo={scrollTo} />
      <MobileBottomCTA />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden pt-16 pb-20 px-4 sm:px-6">
        <Orb className="w-[500px] h-[500px] bg-violet-500/20 -top-32 -left-24 sm:-left-32" />
        <Orb className="w-[400px] h-[400px] bg-cyan-500/15 top-1/3 -right-16 sm:-right-24" />
        <Orb className="w-[280px] h-[280px] bg-pink-500/15 bottom-8 left-1/4" />

        <div className="absolute inset-0 overflow-hidden opacity-[0.04] dark:opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div className="text-center lg:text-left">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-6 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                India's Campus Placement Platform
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl font-bold font-serif leading-[1.08] mb-5 tracking-tight">
                Master Your
                <span className="block min-h-[1.2em]">
                  <Typewriter words={["Placement Journey", "Dream Career", "First Offer", "Tech Interview"]} />
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Structured courses, MCQ practice, a full coding IDE, company-specific prep, gamified streaks, and a campus social feed — all in one platform built for engineering colleges.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center mb-8">
                <MagneticWrap>
                  <Link href="/login"
                    className="group inline-flex items-center gap-2 w-full sm:w-auto justify-center px-7 py-3.5 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all primary-glow text-sm sm:text-base shadow-lg">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticWrap>
                <button onClick={() => scrollTo("features")}
                  className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-7 py-3.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/70 transition-all text-sm sm:text-base font-medium backdrop-blur-sm">
                  <PlayCircle className="w-4 h-4" />
                  See Features
                </button>
              </motion.div>

              {/* Trust row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start text-xs text-muted-foreground">
                {[
                  { icon: Check, text: "Free to start" },
                  { icon: Shield, text: "No credit card" },
                  { icon: Zap, text: "Live in 24h" },
                  { icon: GraduationCap, text: "12,000+ students" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D dashboard */}
            <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
              <DashboardPreview />
            </div>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/40">
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((s) => (
                <motion.div key={s.label}
                  whileHover={{ y: -5, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320 }}
                  className={`glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center border border-border hover:border-primary/20 transition-all shadow-lg cursor-default ${s.glow}`}
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-md`}>
                    <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold font-serif bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent leading-none mb-1`}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-violet-500/8 -left-32 top-0" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm mb-4 font-medium">
              <MousePointer className="w-3.5 h-3.5" />
              Simple to Start
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
              Up and running in <span className="gradient-text">3 steps</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              No complex setup. Your college can be live on CareerEzi within 24 hours.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-pink-500/30" />
            {howItWorks.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.13}>
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
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-serif mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6"
        onMouseEnter={() => setTabPaused(true)}
        onMouseLeave={() => setTabPaused(false)}
      >
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-4 font-medium">
              <Zap className="w-3.5 h-3.5" />
              Everything You Need
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
              Built for <span className="gradient-text">Placement Success</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Every feature designed to take students from zero to job-ready. Click any feature to explore.
            </p>
          </FadeIn>

          {/* Tab pills — horizontal scroll on mobile */}
          <FadeIn delay={0.1}>
            <div className="relative mb-8 sm:mb-10">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:justify-center">
                {featureTabs.map((f, i) => (
                  <motion.button
                    key={f.title}
                    onClick={() => { setActiveTab(i); setTabPaused(true); setTimeout(() => setTabPaused(false), 8000) }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all overflow-hidden ${
                      activeTab === i
                        ? `${f.bg} ${f.border} ${f.color} shadow-sm`
                        : "border-border text-muted-foreground hover:border-primary/25 hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <f.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{f.title}</span>
                    {/* Progress bar for active tab */}
                    {activeTab === i && !tabPaused && (
                      <motion.div
                        key={`prog-${activeTab}`}
                        className="absolute bottom-0 left-0 h-[3px] gradient-bg"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              {/* Pause indicator */}
              <div className="hidden sm:flex items-center gap-1.5 absolute right-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50">
                {tabPaused ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{tabPaused ? "paused" : "auto"}</span>
              </div>
            </div>
          </FadeIn>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
            >
              {/* Text */}
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${featureTabs[activeTab].bg} border ${featureTabs[activeTab].border} mb-5`}>
                  {(() => { const Icon = featureTabs[activeTab].icon; return <Icon className={`w-4 h-4 ${featureTabs[activeTab].color}`} /> })()}
                  <span className={`text-sm font-bold ${featureTabs[activeTab].color}`}>{featureTabs[activeTab].title}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-3 leading-tight">
                  {featureTabs[activeTab].tagline}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                  {featureTabs[activeTab].desc}
                </p>
                <ul className="space-y-3">
                  {featureTabs[activeTab].bullets.map((b, bi) => (
                    <motion.li key={b}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: bi * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-5 h-5 rounded-full ${featureTabs[activeTab].bg} border ${featureTabs[activeTab].border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={`w-3 h-3 ${featureTabs[activeTab].color}`} />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              {/* Preview */}
              <TiltCard>
                {featureTabs[activeTab].preview}
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────────────── */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-purple-500/10 -left-32 top-0" />
        <Orb className="w-[300px] h-[300px] bg-cyan-500/10 right-0 bottom-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs sm:text-sm mb-5 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight">
                Bridging the gap between{" "}
                <span className="gradient-text">Campus & Career</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-5">
                CareerEzi was built to solve a real problem — students graduating with degrees but without the practical skills companies want. We give colleges a complete, managed platform so every student gets access to structured prep, regardless of which tier their institution belongs to.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                From a first-year learning Python basics to a final-year cracking interviews at top product companies — CareerEzi tracks, motivates, and equips every student at every stage.
              </p>
            </FadeIn>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: Shield,    color: "text-violet-400", bg: "bg-violet-500/10", title: "College-Managed",    desc: "Admins control access, monitor progress, and engage students from one dashboard." },
                { icon: BarChart2, color: "text-amber-400",  bg: "bg-amber-500/10",  title: "Progress Analytics", desc: "Real-time insights on lesson completion, MCQ scores, and coding submissions." },
                { icon: Globe,     color: "text-cyan-400",   bg: "bg-cyan-500/10",   title: "Domain Programs",    desc: "Curated learning paths for Data Analysis and Web Development." },
                { icon: Zap,       color: "text-pink-400",   bg: "bg-pink-500/10",   title: "Gamified Growth",    desc: "Points, streaks, and leaderboards that make daily practice addictive." },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="glass-card rounded-2xl p-4 sm:p-5 border border-border hover:border-primary/20 transition-colors"
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed hidden sm:block">{item.desc}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-pink-500/10 right-0 top-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs sm:text-sm mb-4 font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              Student & Admin Stories
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
              Real results from <span className="gradient-text">real campuses</span>
            </h2>
          </FadeIn>

          {/* Main testimonial — swipeable */}
          <FadeIn>
            <div className="relative select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragStart={(_, info) => setDragStart(info.point.x)}
                  onDragEnd={(_, info) => {
                    const delta = info.point.x - dragStart
                    if (delta < -40) goTestimonial(1)
                    else if (delta > 40) goTestimonial(-1)
                  }}
                  className="glass-card rounded-3xl border border-border p-6 sm:p-10 max-w-3xl mx-auto text-center cursor-grab active:cursor-grabbing"
                >
                  <div className="flex justify-center gap-1 mb-5">
                    {Array.from({ length: testimonials[testimonialIdx].stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed mb-6 italic text-foreground/90">
                    "{testimonials[testimonialIdx].text}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonials[testimonialIdx].color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {testimonials[testimonialIdx].avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{testimonials[testimonialIdx].name}</p>
                      <p className="text-xs text-muted-foreground">{testimonials[testimonialIdx].role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/40 mt-4">Swipe to navigate</p>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows */}
              <button onClick={() => goTestimonial(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-9 h-9 rounded-full glass-card border border-border hover:border-primary/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => goTestimonial(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 w-9 h-9 rounded-full glass-card border border-border hover:border-primary/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIdx(i)}
                    className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-7 h-2 gradient-bg" : "w-2 h-2 bg-border hover:bg-primary/40"}`} />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Mini cards — horizontal scroll on mobile */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-4">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <motion.button
                  onClick={() => setTestimonialIdx(i)}
                  whileHover={{ y: -3 }}
                  className={`flex-shrink-0 w-56 sm:w-auto glass-card rounded-2xl p-3 sm:p-4 border text-left transition-all ${i === testimonialIdx ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{t.role.split("·")[1]?.trim()}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{t.text}</p>
                </motion.button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────────────── */}
      {/* <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs sm:text-sm mb-4 font-medium">
              <Star className="w-3.5 h-3.5" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
              Plans for Every <span className="gradient-text">Campus</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Start free, scale as your college grows. All plans are per-student per-year.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -7, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260 }}
                  className={`relative glass-card rounded-2xl p-5 sm:p-6 border ${plan.border} flex flex-col h-full ${plan.glow ? "shadow-[0_0_30px_var(--glow-primary)]" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="gradient-bg text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <h3 className={`text-lg sm:text-xl font-bold font-serif mb-2 ${plan.color}`}>{plan.name}</h3>
                  <div className="mb-5 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => scrollTo("contact")}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      plan.glow
                        ? "gradient-bg text-white hover:brightness-110 primary-glow-hover"
                        : "border border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}>
                    {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
                  </motion.button>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── FAQ ────────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[350px] h-[350px] bg-cyan-500/8 -left-20 top-0" />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs sm:text-sm mb-4 font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
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

      {/* ── CTA Banner ─────────────────────────────────────────────────────────── */}
      {/* <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <motion.div
              whileHover={{ scale: 1.008 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 gradient-bg opacity-90" />
              <div className="absolute inset-0"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)" }} />
              <div className="absolute inset-0 opacity-[0.08]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-12">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full mb-4 font-medium">
                    <Rocket className="w-3.5 h-3.5" />
                    Ready to get started?
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-2">
                    Transform your placement rates
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base max-w-md">
                    Join 50+ colleges already using CareerEzi. Onboard your students today.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                  <MagneticWrap>
                    <Link href="/login"
                      className="inline-flex items-center gap-2 justify-center w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition-all text-sm sm:text-base shadow-lg">
                      Start Free <ArrowRight className="w-4 h-4" />
                    </Link>
                  </MagneticWrap>
                  <button onClick={() => scrollTo("contact")}
                    className="inline-flex items-center gap-2 justify-center px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-sm sm:text-base">
                    Talk to Us
                  </button>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section> */}

      {/* ── Contact ────────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
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
                      className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all primary-glow-hover flex items-center justify-center gap-2">
                      Send Message <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
            <div className="col-span-2 md:col-span-2">
              <div className="mb-4"><Logo size={34} /></div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                India's campus placement preparation platform. Helping students crack placements with structured learning, practice, and community.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {["features", "pricing", "about"].map((id) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="text-sm text-muted-foreground hover:text-foreground capitalize transition-colors">
                      {id}
                    </button>
                  </li>
                ))}
                <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© 2026 Finity Innovations. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">CareerEzi — Developed by Finity Innovations</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom padding to avoid sticky CTA overlap */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
