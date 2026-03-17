"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Code2, BookOpen, Brain, Trophy, Users, Building2,
  ArrowRight, Check, ChevronDown, Mail, Phone, MapPin,
  Zap, Star, TrendingUp, BarChart2, Globe, Shield,
  Github, Twitter, Linkedin, GraduationCap, HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { TopNav } from "@/components/top-nav"

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

// ─── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}
    >{children}</motion.div>
  )
}

// ─── Floating orb ──────────────────────────────────────────────────────────────
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

// ─── Data ───────────────────────────────────────────────────────────────────────
const stats = [
  { icon: Building2,      label: "Colleges",  value: 50,    suffix: "+", gradient: "from-violet-500 to-purple-600",  glow: "shadow-violet-500/20" },
  { icon: GraduationCap,  label: "Students",  value: 12000, suffix: "+", gradient: "from-cyan-500 to-blue-600",      glow: "shadow-cyan-500/20" },
  { icon: HelpCircle,     label: "Questions", value: 500,   suffix: "+", gradient: "from-pink-500 to-rose-600",      glow: "shadow-pink-500/20" },
  { icon: Trophy,         label: "Companies", value: 30,    suffix: "+", gradient: "from-amber-500 to-orange-600",   glow: "shadow-amber-500/20" },
]

const features = [
  { icon: BookOpen,  color: "text-violet-400",  bg: "bg-violet-500/10",  border: "hover:border-violet-400/50", glow: "hover:shadow-violet-500/10",  title: "Structured Learning",   desc: "Python, SQL, HTML, CSS, JavaScript & more — structured course-by-course with lessons and progress tracking." },
  { icon: Brain,     color: "text-pink-400",    bg: "bg-pink-500/10",    border: "hover:border-pink-400/50",   glow: "hover:shadow-pink-500/10",    title: "MCQ Practice",          desc: "Topic-wise aptitude and programming MCQs with instant feedback, explanations, and points." },
  { icon: Code2,     color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "hover:border-cyan-400/50",   glow: "hover:shadow-cyan-500/10",    title: "Coding IDE",            desc: "In-browser Monaco editor with real test-case execution — practice and submit coding problems." },
  { icon: Building2, color: "text-amber-400",   bg: "bg-amber-500/10",   border: "hover:border-amber-400/50",  glow: "hover:shadow-amber-500/10",   title: "Company Prep",          desc: "Company-wise hiring rounds, aptitude patterns, coding questions, and insider tips." },
  { icon: Users,     color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-400/50",glow: "hover:shadow-emerald-500/10", title: "College Social Feed",   desc: "Post achievements, share blogs, react, comment — a private social network just for your campus." },
  { icon: Trophy,    color: "text-orange-400",  bg: "bg-orange-500/10",  border: "hover:border-orange-400/50", glow: "hover:shadow-orange-500/10",  title: "Leaderboard & Streaks", desc: "Daily streaks, points, college-wide rankings — gamified to keep students consistently active." },
]

const plans = [
  { name: "Free",       price: "₹0",     period: "",               color: "text-muted-foreground", border: "border-border",         glow: false, badge: null,
    features: ["Python Module (Lessons, MCQ & Assignments)", "Aptitude MCQ Bank", "Remaining courses visible (locked)"] },
  { name: "Base Plan",  price: "₹1,000",   period: "/student/year",  color: "text-blue-400",         border: "border-blue-500/30",    glow: false, badge: null,
    features: ["Python, SQL, HTML, CSS Modules", "Aptitude MCQ Bank", "Company Preparation", "College Social Feed", "Admin Dashboard", "Remaining courses locked"] },
  { name: "Pro Plan",   price: "₹1,500", period: "/student/year",  color: "text-primary",          border: "border-primary/40",     glow: true,  badge: "Most Popular",
    features: ["Everything in Base Plan", "1 Domain: Data Analysis or Web Dev", "Admin 1-click inactive-student emails", "Remaining courses locked"] },
  { name: "Enterprise", price: "Custom", period: "",               color: "text-purple-400",       border: "border-purple-500/30",  glow: false, badge: null,
    features: ["Custom domains & courses", "Custom analytics", "Custom integrations", "Dedicated support"] },
]

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()
  const { token, user } = useAuthStore()
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopNav onScrollTo={scrollTo} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden pt-8 pb-16 px-4 sm:px-6">
        {/* Background orbs */}
        <Orb className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-violet-500/20 -top-32 -left-24 sm:-left-32" />
        <Orb className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-cyan-500/15 top-1/3 -right-16 sm:-right-24" />
        <Orb className="w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-pink-500/15 bottom-8 left-1/4" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center w-full max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-6 sm:mb-8 font-medium">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            India's Campus Placement Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif leading-[1.08] mb-5 sm:mb-6 tracking-tight">
            Master Your
            <span className="block gradient-text">Placement Journey</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            A complete placement prep platform for engineering colleges — structured courses, MCQ practice, coding IDE, company insights, and a campus social feed.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/login"
              className="group inline-flex items-center gap-2 w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:brightness-110 transition-all primary-glow text-sm sm:text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={() => scrollTo("features")}
              className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/70 transition-all text-sm sm:text-base font-medium backdrop-blur-sm">
              Explore Features
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/40">
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((s) => (
                <motion.div key={s.label}
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center border border-border hover:border-primary/20 transition-all shadow-lg ${s.glow}`}
                >
                  {/* Icon circle */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-md`}>
                    <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  {/* Number */}
                  <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent leading-none mb-1`}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  {/* Label */}
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-4 font-medium">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Everything You Need
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3 sm:mb-4">
              Built for <span className="gradient-text">Placement Success</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Every feature designed to take students from zero to job-ready.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`glass-card rounded-2xl p-5 sm:p-6 h-full border border-border ${f.border} transition-all hover:shadow-lg ${f.glow} group cursor-default`}
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold font-serif mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-purple-500/10 -left-32 top-0" />
        <Orb className="w-[300px] h-[300px] bg-cyan-500/10 right-0 bottom-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs sm:text-sm mb-5 sm:mb-6 font-medium">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-5 sm:mb-6 leading-tight">
                Bridging the gap between{" "}
                <span className="gradient-text">Campus & Career</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-5">
                Fynity was built to solve a real problem — students graduating with degrees but without the practical skills companies want. We give colleges a complete, managed platform so every student gets access to structured prep, regardless of which tier their institution belongs to.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                From a first-year learning Python basics to a final-year cracking interviews at top product companies — Fynity tracks, motivates, and equips every student at every stage.
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
                  <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border hover:border-primary/20 transition-colors">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed hidden sm:block">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs sm:text-sm mb-4 font-medium">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3 sm:mb-4">
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
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className={`relative glass-card rounded-2xl p-5 sm:p-6 border ${plan.border} flex flex-col h-full ${plan.glow ? "shadow-[0_0_28px_var(--glow-primary)]" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="gradient-bg text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <h3 className={`text-lg sm:text-xl font-bold font-serif mb-2 sm:mb-3 ${plan.color}`}>{plan.name}</h3>
                  <div className="mb-4 sm:mb-5 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                  </div>
                  <ul className="space-y-2 sm:space-y-2.5 flex-1 mb-5 sm:mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => scrollTo("contact")}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                      plan.glow
                        ? "gradient-bg text-white hover:brightness-110 primary-glow-hover"
                        : "border border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}>
                    {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
                  </button>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[350px] h-[350px] bg-violet-500/10 -right-24 top-0" />
        <Orb className="w-[280px] h-[280px] bg-cyan-500/10 -left-16 bottom-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-4 font-medium">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3 sm:mb-4">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Interested in onboarding your college? Reach out — we reply within 24 hours.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
            {/* Contact info */}
            <FadeIn className="lg:col-span-2 space-y-4 sm:space-y-6">
              {[
                { icon: Mail,   label: "Email",    value: "hello@fynity.in" },
                { icon: Phone,  label: "Phone",    value: "+91 98765 43210" },
                { icon: MapPin, label: "Location", value: "Chennai, Tamil Nadu, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Follow us</p>
                <div className="flex gap-2 sm:gap-3">
                  {[
                    { icon: Twitter,  href: "#", label: "Twitter" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Github,   href: "#", label: "GitHub" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a key={href} href={href} title={label}
                      className="w-9 h-9 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.15} className="lg:col-span-3">
              <form onSubmit={handleContact} className="glass-card rounded-2xl p-5 sm:p-8 border border-border space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Your Name</label>
                    <input required value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full bg-secondary/40 border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Email Address</label>
                    <input required type="email" value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="rahul@college.edu"
                      className="w-full bg-secondary/40 border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Message</label>
                  <textarea required rows={4} value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your college and how we can help..."
                    className="w-full bg-secondary/40 border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-primary text-sm font-medium py-3 justify-center bg-primary/10 rounded-xl border border-primary/20">
                      <Check className="w-4 h-4" />
                      Message sent! We'll get back to you soon.
                    </motion.div>
                  ) : (
                    <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3 sm:py-3.5 rounded-xl gradient-bg text-white font-semibold hover:brightness-110 transition-all primary-glow-hover flex items-center justify-center gap-2 text-sm sm:text-base">
                      Send Message
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg primary-glow-sm flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold font-serif gradient-text">Fynity</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                India's campus placement preparation platform. Helping students crack placements with structured learning, practice, and community.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 sm:mb-4">Platform</h4>
              <ul className="space-y-2 sm:space-y-2.5">
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
              <h4 className="text-sm font-semibold mb-3 sm:mb-4">Legal</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-5 sm:pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <p className="text-xs text-muted-foreground">© 2026 Fynity. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ for Indian engineering students</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
