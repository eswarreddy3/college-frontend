"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

const schema = z
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

type FormData = z.infer<typeof schema>

function passwordStrength(pwd: string) {
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

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [tokenState, setTokenState] = useState<"checking" | "valid" | "invalid">("checking")
  const [done, setDone] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwdValue, setPwdValue] = useState("")

  useEffect(() => {
    if (!token) { setTokenState("invalid"); return }
    api.get(`/auth/reset-password?token=${token}`)
      .then(() => setTokenState("valid"))
      .catch(() => setTokenState("invalid"))
  }, [token])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/reset-password", { token, new_password: data.new_password })
      setDone(true)
      toast.success("Password reset! Redirecting to login…")
      setTimeout(() => router.replace("/login"), 2500)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to reset password")
    }
  }

  const strength = passwordStrength(pwdValue)

  return (
    <div className="w-full max-w-md">
      <div className="glass-card gradient-border rounded-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center primary-glow-sm mb-4">
            <span className="text-2xl font-bold text-primary-foreground font-serif">F</span>
          </div>
          <Logo size={44} />
        </div>

        {/* Checking token */}
        {tokenState === "checking" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Validating your reset link…</p>
          </div>
        )}

        {/* Invalid token */}
        {tokenState === "invalid" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/20 border-2 border-destructive/40 flex items-center justify-center mx-auto">
              <XCircle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-xl font-bold font-serif text-foreground">Link expired</h2>
            <p className="text-sm text-muted-foreground">
              This reset link is invalid or has expired. Reset links are valid for 1 hour.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
            >
              Request a new link
            </Link>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          </div>
        )}

        {/* Success */}
        {done && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold font-serif text-foreground">Password updated!</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting you to login…
            </p>
          </div>
        )}

        {/* Reset form */}
        {tokenState === "valid" && !done && (
          <>
            <h2 className="text-xl font-bold font-serif text-foreground mb-1">Set New Password</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-foreground">New Password</Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="bg-secondary/50 border-border text-foreground pr-10"
                    {...register("new_password", {
                      onChange: (e) => setPwdValue(e.target.value),
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                      <span className={cn(
                        strength.score <= 1 ? "text-red-400" :
                        strength.score <= 2 ? "text-amber-400" : "text-emerald-400"
                      )}>
                        {strength.label}
                      </span>
                    </p>
                  </div>
                )}
                {errors.new_password && (
                  <p className="text-xs text-destructive">{errors.new_password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="bg-secondary/50 border-border text-foreground pr-10"
                    {...register("confirm_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg hover:brightness-110 text-white font-semibold transition-all primary-glow-hover border-0"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Reset Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="glass-card gradient-border rounded-2xl p-8 flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
