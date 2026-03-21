"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/forgot-password", { email: data.email })
      setSentEmail(data.email)
      setSent(true)
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

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

        {sent ? (
          /* ── Sent state ── */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto">
              <MailCheck className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold font-serif text-foreground">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">
              If <span className="text-foreground font-medium">{sentEmail}</span> is registered,
              you'll receive a password reset link shortly. The link expires in 1 hour.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't get it? Check your spam folder or{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => setSent(false)}
              >
                try again
              </button>
              .
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h2 className="text-xl font-bold font-serif text-foreground mb-1">Forgot Password?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your registered email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@college.edu"
                  autoComplete="email"
                  className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg hover:brightness-110 text-white font-semibold transition-all primary-glow-hover border-0"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Send Reset Link
              </Button>
            </form>

            <div className="mt-5 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
