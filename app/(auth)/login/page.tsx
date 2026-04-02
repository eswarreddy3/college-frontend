"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Eye, EyeOff, Loader2, Code2, Trophy, BookOpen,
  ClipboardList, ArrowRight, CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore, type User } from "@/store/authStore"
import api from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
type LoginForm = z.infer<typeof loginSchema>

const FEATURES = [
  { icon: BookOpen,      color: "text-primary",        bg: "bg-primary/10",       label: "Structured Learning",   desc: "Domain-wise courses with progress tracking" },
  { icon: Code2,         color: "text-violet-500",      bg: "bg-violet-500/10",    label: "Coding Practice",       desc: "Real interview problems with live execution" },
  { icon: ClipboardList, color: "text-amber-500",       bg: "bg-amber-500/10",     label: "Mock Assignments",      desc: "Timed exams with instant score analysis" },
  { icon: Trophy,        color: "text-orange-500",      bg: "bg-orange-500/10",    label: "Leaderboard & Streaks", desc: "Compete with peers, build daily habits" },
]

const STATS = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Problems" },
  { value: "50+",  label: "Courses" },
  { value: "95%",  label: "Placement" },
]

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data)
      const { token, refreshToken, user } = res.data
      setAuth(token, refreshToken, user)
      redirectByUser(user)
    } catch (err: any) {
      toast.error("Sign in failed", {
        description: err?.response?.data?.error || "Invalid email or password",
      })
    }
  }

  const redirectByUser = (user: User) => {
    if (user.first_login)              return router.replace("/onboarding")
    if (user.role === "super_admin")   return router.replace("/super-admin")
    if (user.role === "college_admin") return router.replace("/admin")
    if (user.role === "branch_admin")  return router.replace("/branch-admin")
    router.replace("/dashboard")
  }

  return (
    <div className="w-full max-w-5xl min-h-[600px] flex rounded-2xl overflow-hidden border border-border shadow-2xl">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-10 bg-secondary/60 relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo size={38} />
        </div>

        {/* Headline + features */}
        <div className="relative z-10 space-y-7">
          <div>
            <h2 className="text-3xl font-bold font-serif text-foreground leading-tight">
              Your placement<br />
              <span className="gradient-text">journey starts here.</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              Everything you need to crack campus placements — learning, practice, and performance tracking in one place.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center flex-shrink-0`}>
                  <f.icon className={`h-4 w-4 ${f.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-4 gap-2 pt-6 border-t border-border">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-base font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 py-10 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm mx-auto space-y-6"
        >
          <div>
            <h1 className="text-2xl font-bold font-serif text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-foreground">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@college.edu"
                autoComplete="email"
                className="h-11 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-0"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-0 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-bg hover:brightness-110 text-white font-semibold border-0 gap-2 mt-1"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>
              }
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>Access is provided by your college admin</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
