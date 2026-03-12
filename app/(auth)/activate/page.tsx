"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

function ActivateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "set-password" | "success" | "error">("loading")
  const [collegeName, setCollegeName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const calledRef = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("No activation token found in the link.")
      return
    }

    if (calledRef.current) return
    calledRef.current = true

    api.get(`/auth/activate?token=${token}`)
      .then((res) => {
        setCollegeName(res.data.college || "")
        setStatus("set-password")
      })
      .catch((err) => {
        setStatus("error")
        setErrorMessage(err?.response?.data?.error || "Activation failed. The link may be expired or invalid.")
      })
  }, [token])

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setErrorMessage("Passwords do not match.")
      return
    }
    setErrorMessage("")
    setSubmitting(true)
    try {
      await api.post("/auth/activate", { token, password })
      setStatus("success")
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || "Activation failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center primary-glow-sm mb-4">
            <span className="text-2xl font-bold text-primary-foreground font-serif">F</span>
          </div>
          <h1 className="text-2xl font-bold font-serif gradient-text">Fynity</h1>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Verifying your link...</p>
          </div>
        )}

        {status === "set-password" && (
          <form onSubmit={handleSetPassword} className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">Set Your Password</h2>
              {collegeName && (
                <p className="text-muted-foreground text-sm mt-1">{collegeName}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-foreground">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm" className="text-foreground">Confirm Password</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:brightness-110 text-primary-foreground font-semibold"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activate Account"}
            </Button>
          </form>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
            <h2 className="text-xl font-semibold text-foreground">Account Activated!</h2>
            <p className="text-muted-foreground text-sm">
              Your password has been set. You can now log in.
            </p>
            <Button
              className="w-full mt-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold"
              onClick={() => router.replace("/login")}
            >
              Go to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <XCircle className="h-12 w-12 text-red-400" />
            <h2 className="text-xl font-semibold text-foreground">Activation Failed</h2>
            <p className="text-muted-foreground text-sm">{errorMessage}</p>
            <Button
              variant="outline"
              className="w-full mt-2 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => router.replace("/login")}
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ActivatePage() {
  return (
    <Suspense>
      <ActivateContent />
    </Suspense>
  )
}
