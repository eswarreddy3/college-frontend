"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Loader2, Eye, EyeOff, Check, Github, Linkedin, Camera,
  BookOpen, Trophy, Zap, Users, Code2, Target,
} from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { motion, AnimatePresence } from "framer-motion"
import { fireSchoolPride } from "@/lib/effects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

// ── Schemas ───────────────────────────────────────────────────────────────────
const step1Schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  dob: z.string().min(1, "Date of birth is required"),
  linkedin_url: z.string().url("Enter a valid LinkedIn URL").optional().or(z.literal("")),
  github_url: z.string().url("Enter a valid GitHub URL").optional().or(z.literal("")),
})

const step2Schema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type Step1 = z.infer<typeof step1Schema>
type Step2 = z.infer<typeof step2Schema>

// ── Password strength ─────────────────────────────────────────────────────────
function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" }
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" }
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-400" }
  return { score, label: "Strong", color: "bg-emerald-500" }
}

// ── Left panel feature items ──────────────────────────────────────────────────
const features = [
  { icon: BookOpen,  label: "Structured Learning",   desc: "Course roadmaps built for placements" },
  { icon: Code2,     label: "Live Coding IDE",        desc: "Practice problems with real test cases" },
  { icon: Trophy,    label: "Leaderboard & Points",   desc: "Compete with your college peers" },
  { icon: Target,    label: "MCQ & Assignments",      desc: "Track your exam readiness daily" },
  { icon: Users,     label: "Company Prep",           desc: "Interview guides for top recruiters" },
  { icon: Zap,       label: "Streak & Gamification",  desc: "Build habits that last till placement" },
]

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
              step < current
                ? "bg-primary text-primary-foreground"
                : step === current
                ? "bg-primary/20 border-2 border-primary text-primary"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {step < current ? <Check className="h-3.5 w-3.5" /> : step}
          </div>
          {step < total && (
            <div className={cn("h-0.5 w-10 transition-all", step < current ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
      <span className="ml-1 text-xs text-muted-foreground">Step {current} of {total}</span>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, token, updateUser } = useAuthStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Step1 & Step2>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwdValue, setPwdValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token || !user) { router.replace("/login"); return }
    if (!user.first_login) router.replace("/dashboard")
  }, [token, user, router])

  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { phone: "", dob: "", linkedin_url: "", github_url: "" },
  })
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleStep1 = (data: Step1) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStep2 = async (data: Step2) => {
    setIsSubmitting(true)
    try {
      let photo_url: string | undefined
      if (avatarFile) {
        setUploadingAvatar(true)
        const fd = new FormData()
        fd.append("file", avatarFile)
        const uploadRes = await api.post("/student/profile/avatar", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        photo_url = uploadRes.data.photo_url
        setUploadingAvatar(false)
      }
      await api.patch("/auth/complete-onboarding", {
        phone: formData.phone,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        dob: formData.dob,
        new_password: data.new_password,
        photo_url,
      })
      updateUser({ first_login: false })
      toast.success("Setup complete! Welcome to CareerEzi 🎉")
      setDone(true)
      fireSchoolPride()
      setTimeout(() => router.replace("/dashboard"), 2500)
    } catch (err: any) {
      toast.error("Setup failed", {
        description: err?.response?.data?.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
      setUploadingAvatar(false)
    }
  }

  const strength = passwordStrength(pwdValue)
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  return (
    <>
      {/* Success overlay */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <motion.h2
              className="text-4xl font-bold font-serif gradient-text mb-2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              You&apos;re all set!
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            >
              Welcome to CareerEzi. Let&apos;s get you placed! 🚀
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-panel layout — fixed to escape auth layout wrapper */}
      <div className="flex min-h-screen w-full">

        {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between w-[52%] min-h-screen bg-secondary/30 border-r border-border px-10 py-10 relative overflow-hidden">
          {/* Background glow blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10">
            <Logo size={36} />
          </div>

          {/* Main copy */}
          <motion.div
            className="relative z-10 space-y-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <h1 className="text-4xl font-bold font-serif text-foreground leading-tight">
                Your placement journey<br />
                <span className="gradient-text">starts here.</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed max-w-sm">
                Set up your profile once — then focus entirely on getting placed. Everything you need is in one place.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background/40 border border-border/60"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom student info pill */}
          <motion.div
            className="relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/50 border border-border w-fit"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          >
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary font-serif">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{user?.name || "—"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "—"}</p>
            </div>
            <div className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs text-primary font-medium">Student</span>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL (form) ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center px-5 sm:px-8 lg:px-12 py-8 overflow-y-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size={32} />
          </div>

          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif text-foreground">
                {step === 1 ? "Personal Information" : "Set Your Password"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 1
                  ? "Tell us a bit about yourself to complete your profile."
                  : "Choose a strong password to secure your account."}
              </p>
            </div>

            <StepIndicator current={step} total={2} />

            <AnimatePresence mode="wait">
              {/* ── Step 1 ──────────────────────────────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-4">
                    {/* Admin-set info banner */}
                    <div className="rounded-xl bg-secondary/50 border border-border px-3.5 py-3 space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Confirmed by your college</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        {[
                          ["Roll No.", (user as any)?.roll_number],
                          ["Branch",   (user as any)?.branch],
                          ["Section",  (user as any)?.section],
                          ["Batch",    (user as any)?.passout_year],
                        ].map(([k, v]) => (
                          <div key={k as string} className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">{k}</span>
                            <span className="text-xs font-medium text-foreground">{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
                          {avatarPreview
                            ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                            : <span className="text-xl font-bold text-primary font-serif">{initials}</span>
                          }
                        </div>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all"
                        >
                          <Camera className="h-2.5 w-2.5 text-primary-foreground" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="text-xs text-primary hover:underline mt-0.5"
                        >
                          {avatarPreview ? "Change photo" : "Upload profile photo"}
                          <span className="text-muted-foreground ml-1">(optional)</span>
                        </button>
                      </div>
                      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">Mobile Number</Label>
                      <Input placeholder="9876543210" className="bg-secondary/50 border-border text-foreground h-10" {...form1.register("phone")} />
                      {form1.formState.errors.phone && (
                        <p className="text-xs text-destructive">{form1.formState.errors.phone.message}</p>
                      )}
                    </div>

                    {/* DOB */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">Date of Birth</Label>
                      <Input type="date" className="bg-secondary/50 border-border text-foreground h-10" max={new Date().toISOString().split("T")[0]} {...form1.register("dob")} />
                      {form1.formState.errors.dob && (
                        <p className="text-xs text-destructive">{form1.formState.errors.dob.message}</p>
                      )}
                    </div>

                    {/* LinkedIn + GitHub side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-foreground text-sm flex items-center gap-1.5">
                          <Linkedin className="h-3.5 w-3.5 text-blue-400" />LinkedIn
                          <span className="text-muted-foreground text-[10px]">(optional)</span>
                        </Label>
                        <Input placeholder="linkedin.com/in/you" className="bg-secondary/50 border-border text-foreground h-10 text-xs" {...form1.register("linkedin_url")} />
                        {form1.formState.errors.linkedin_url && (
                          <p className="text-xs text-destructive">{form1.formState.errors.linkedin_url.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-foreground text-sm flex items-center gap-1.5">
                          <Github className="h-3.5 w-3.5" />GitHub
                          <span className="text-muted-foreground text-[10px]">(optional)</span>
                        </Label>
                        <Input placeholder="github.com/you" className="bg-secondary/50 border-border text-foreground h-10 text-xs" {...form1.register("github_url")} />
                        {form1.formState.errors.github_url && (
                          <p className="text-xs text-destructive">{form1.formState.errors.github_url.message}</p>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:brightness-110 text-primary-foreground h-10">
                      Continue →
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* ── Step 2 ──────────────────────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          className="bg-secondary/50 border-border text-foreground pr-10 h-10"
                          {...form2.register("new_password", { onChange: (e) => setPwdValue(e.target.value) })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {pwdValue && (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= strength.score ? strength.color : "bg-border")} />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Strength:{" "}
                            <span className={cn(strength.score <= 1 ? "text-red-400" : strength.score <= 2 ? "text-amber-400" : "text-emerald-400")}>
                              {strength.label}
                            </span>
                          </p>
                        </div>
                      )}
                      {form2.formState.errors.new_password && (
                        <p className="text-xs text-destructive">{form2.formState.errors.new_password.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter your password"
                          className="bg-secondary/50 border-border text-foreground pr-10 h-10"
                          {...form2.register("confirm_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {form2.formState.errors.confirm_password && (
                        <p className="text-xs text-destructive">{form2.formState.errors.confirm_password.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-border text-foreground h-10"
                        onClick={() => setStep(1)}
                        disabled={isSubmitting}
                      >
                        ← Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary hover:brightness-110 text-primary-foreground h-10"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {uploadingAvatar ? "Uploading…" : "Complete Setup"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
