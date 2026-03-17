"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Eye, EyeOff, Check, Github, Linkedin } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { fireSchoolPride } from "@/lib/effects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

// ── Schemas ──────────────────────────────────────────────────────────────────
const step1Schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  linkedin_url: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  github_url: z
    .string()
    .url("Enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
})

const step2Schema = z.object({
  branch: z.string().min(1, "Select your branch"),
  section: z.string().min(1, "Select your section"),
  roll_number: z.string().min(1, "Roll number is required"),
  passout_year: z.string().min(1, "Select your pass-out year"),
})

const step3Schema = z
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
type Step3 = z.infer<typeof step3Schema>

// ── Password strength ────────────────────────────────────────────────────────
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

// ── Step indicators ──────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              step < current
                ? "bg-primary text-primary-foreground"
                : step === current
                ? "bg-primary/20 border-2 border-primary text-primary"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {step < current ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < total && (
            <div
              className={cn(
                "h-0.5 w-12 transition-all",
                step < current ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        Step {current} of {total}
      </span>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, token, updateUser } = useAuthStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Step1 & Step2 & Step3>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwdValue, setPwdValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Redirect if not first_login
  useEffect(() => {
    if (!token || !user) {
      router.replace("/login")
      return
    }
    if (!user.first_login) {
      router.replace("/dashboard")
    }
  }, [token, user, router])

  // ── Step 1 ──────────────────────────────────────────────────────────────────
  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { full_name: user?.name || "", phone: "", linkedin_url: "", github_url: "" },
  })

  // ── Step 2 ──────────────────────────────────────────────────────────────────
  const form2 = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      branch: (user as any)?.branch || "",
      section: (user as any)?.section || "",
      roll_number: (user as any)?.roll_number || "",
      passout_year: (user as any)?.passout_year ? String((user as any).passout_year) : "",
    },
  })

  // ── Step 3 ──────────────────────────────────────────────────────────────────
  const form3 = useForm<Step3>({
    resolver: zodResolver(step3Schema),
  })

  const handleStep1 = (data: Step1) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStep2 = (data: Step2) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(3)
  }

  const handleStep3 = async (data: Step3) => {
    setIsSubmitting(true)
    const payload = { ...formData, new_password: data.new_password }
    try {
      await api.patch("/auth/complete-onboarding", payload)
      updateUser({ first_login: false, name: formData.full_name || user!.name })
      toast.success("Setup complete! Welcome to Fynity 🎉")
      setDone(true)
      fireSchoolPride()
      setTimeout(() => router.replace("/dashboard"), 2500)
    } catch (err: any) {
      toast.error("Setup failed", {
        description: err?.response?.data?.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const strength = passwordStrength(pwdValue)

  return (
    <div className="w-full max-w-lg">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              You&apos;re all set!
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Welcome to Fynity. Let&apos;s get you placed! 🚀
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center primary-glow-sm">
              <span className="text-lg font-bold text-primary-foreground font-serif">F</span>
            </div>
            <h1 className="text-xl font-bold font-serif gradient-text">Fynity</h1>
          </div>
          <h2 className="text-2xl font-bold font-serif text-foreground">
            {step === 1
              ? "Personal Information"
              : step === 2
              ? "Academic Details"
              : "Set Your Password"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your profile to get started
          </p>
        </div>

        <StepIndicator current={step} total={3} />

        <AnimatePresence mode="wait">
        {/* ── Step 1: Personal Info ──────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key={1}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
          <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Full Name</Label>
              <Input
                placeholder="Rahul Kumar"
                className="bg-secondary/50 border-border text-foreground"
                {...form1.register("full_name")}
              />
              {form1.formState.errors.full_name && (
                <p className="text-xs text-destructive">
                  {form1.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Phone Number</Label>
              <Input
                placeholder="9876543210"
                className="bg-secondary/50 border-border text-foreground"
                {...form1.register("phone")}
              />
              {form1.formState.errors.phone && (
                <p className="text-xs text-destructive">
                  {form1.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-400" />
                LinkedIn URL{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                placeholder="https://linkedin.com/in/yourname"
                className="bg-secondary/50 border-border text-foreground"
                {...form1.register("linkedin_url")}
              />
              {form1.formState.errors.linkedin_url && (
                <p className="text-xs text-destructive">
                  {form1.formState.errors.linkedin_url.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" />
                GitHub URL{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                placeholder="https://github.com/yourusername"
                className="bg-secondary/50 border-border text-foreground"
                {...form1.register("github_url")}
              />
              {form1.formState.errors.github_url && (
                <p className="text-xs text-destructive">
                  {form1.formState.errors.github_url.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:brightness-110 text-primary-foreground"
            >
              Next →
            </Button>
          </form>
          </motion.div>
        )}

        {/* ── Step 2: Academic Info ──────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key={2}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
          <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-foreground">Branch</Label>
                <Select
                  onValueChange={(v) => form2.setValue("branch", v)}
                  defaultValue={form2.getValues("branch")}
                >
                  <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "AIML", "CSD"].map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form2.formState.errors.branch && (
                  <p className="text-xs text-destructive">
                    {form2.formState.errors.branch.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground">Section</Label>
                <Select
                  onValueChange={(v) => form2.setValue("section", v)}
                  defaultValue={form2.getValues("section")}
                >
                  <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((s) => (
                      <SelectItem key={s} value={s}>
                        Section {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form2.formState.errors.section && (
                  <p className="text-xs text-destructive">
                    {form2.formState.errors.section.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Roll Number</Label>
              <Input
                placeholder="21CS001"
                className="bg-secondary/50 border-border text-foreground"
                {...form2.register("roll_number")}
              />
              {form2.formState.errors.roll_number && (
                <p className="text-xs text-destructive">
                  {form2.formState.errors.roll_number.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Pass-out Year</Label>
              <Select
                onValueChange={(v) => form2.setValue("passout_year", v)}
                defaultValue={form2.getValues("passout_year")}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {["2025", "2026", "2027", "2028"].map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form2.formState.errors.passout_year && (
                <p className="text-xs text-destructive">
                  {form2.formState.errors.passout_year.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border text-foreground"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:brightness-110 text-primary-foreground"
              >
                Next →
              </Button>
            </div>
          </form>
          </motion.div>
        )}

        {/* ── Step 3: Set Password ───────────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            key={3}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
          <form onSubmit={form3.handleSubmit(handleStep3)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="bg-secondary/50 border-border text-foreground pr-10"
                  {...form3.register("new_password", {
                    onChange: (e) => setPwdValue(e.target.value),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {pwdValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all",
                          i <= strength.score ? strength.color : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength:{" "}
                    <span
                      className={cn(
                        strength.score <= 1
                          ? "text-red-400"
                          : strength.score <= 2
                          ? "text-amber-400"
                          : "text-emerald-400"
                      )}
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
              {form3.formState.errors.new_password && (
                <p className="text-xs text-destructive">
                  {form3.formState.errors.new_password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="bg-secondary/50 border-border text-foreground pr-10"
                  {...form3.register("confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form3.formState.errors.confirm_password && (
                <p className="text-xs text-destructive">
                  {form3.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border text-foreground"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:brightness-110 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Complete Setup
              </Button>
            </div>
          </form>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  )
}
