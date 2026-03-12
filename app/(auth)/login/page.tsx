"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
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

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data)
      const { token, refreshToken, user } = res.data
      setAuth(token, refreshToken, user)
      redirectByUser(user)
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err?.response?.data?.message || "Invalid email or password"
      toast.error("Sign in failed", { description: message })
    }
  }

  const redirectByUser = (user: User) => {
    if (user.first_login) return router.replace("/onboarding")
    if (user.role === "super_admin") return router.replace("/super-admin")
    if (user.role === "college_admin") return router.replace("/admin")
    router.replace("/dashboard")
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card gradient-border rounded-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center primary-glow-sm mb-4">
            <span className="text-2xl font-bold text-primary-foreground font-serif">F</span>
          </div>
          <h1 className="text-2xl font-bold font-serif gradient-text">Fynity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your placement journey starts here
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full gradient-bg hover:brightness-110 text-white font-semibold transition-all primary-glow-hover border-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
