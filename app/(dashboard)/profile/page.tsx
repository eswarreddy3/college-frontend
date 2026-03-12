"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type PasswordForm = z.infer<typeof passwordSchema>

interface Activity {
  id: number
  action: string
  details: Record<string, any> | null
  created_at: string
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [notifications, setNotifications] = useState({
    email_notifications: user?.email_notifications ?? true,
    assignment_reminders: user?.assignment_reminders ?? true,
    leaderboard_updates: user?.leaderboard_updates ?? false,
  })

  useEffect(() => {
    api.get("/student/dashboard")
      .then((res) => setActivities(res.data.recent_activity ?? []))
      .catch(() => {})
  }, [])

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onPasswordSave = async (data: PasswordForm) => {
    try {
      await api.patch("/student/profile", {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      toast.success("Password updated successfully")
      reset()
    } catch (err: any) {
      toast.error("Failed to update password", {
        description: err?.response?.data?.message || "Please try again",
      })
    }
  }

  const onNotificationSave = async () => {
    try {
      await api.patch("/student/profile", notifications)
      toast.success("Notification settings saved")
    } catch {
      toast.error("Failed to save notification settings")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Profile Info ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center primary-glow">
                  <span className="text-3xl font-bold text-primary font-serif">{initials}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all">
                  <Pencil className="h-3.5 w-3.5 text-primary-foreground" />
                </button>
              </div>

              <h2 className="text-xl font-bold font-serif text-foreground">
                {user?.name || "—"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>

              <Badge
                variant="outline"
                className="mt-2 bg-primary/10 border-primary/30 text-primary"
              >
                {user?.role === "student"
                  ? "Student"
                  : user?.role === "college_admin"
                  ? "College Admin"
                  : "Super Admin"}
              </Badge>
            </div>

            {/* Info rows */}
            <div className="mt-6 space-y-3">
              {[
                { label: "College", value: user?.college_name || "—" },
                { label: "Branch", value: user?.branch || "—" },
                { label: "Section", value: user?.section ? `Section ${user.section}` : "—" },
                { label: "Roll No.", value: user?.roll_number || "—" },
                { label: "Pass-out Year", value: user?.passout_year || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── RIGHT: Tabs ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <Tabs defaultValue="account">
              <TabsList className="bg-secondary/50 mb-6">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Account tab — change password */}
              <TabsContent value="account">
                <div className="max-w-sm">
                  <h3 className="font-semibold font-serif text-foreground mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handleSubmit(onPasswordSave)} className="space-y-4">
                    {/* Current password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("current_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="text-xs text-destructive">{errors.current_password.message}</p>
                      )}
                    </div>

                    {/* New password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("new_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.new_password && (
                        <p className="text-xs text-destructive">{errors.new_password.message}</p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Confirm New Password</Label>
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
                      className="bg-primary hover:brightness-110 text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Save Password
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* Notifications tab */}
              <TabsContent value="notifications">
                <h3 className="font-semibold font-serif text-foreground mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4 max-w-sm">
                  {[
                    {
                      key: "email_notifications" as const,
                      label: "Email Notifications",
                      desc: "Get daily learning reminders via email",
                    },
                    {
                      key: "assignment_reminders" as const,
                      label: "Assignment Reminders",
                      desc: "Reminders for upcoming assignment deadlines",
                    },
                    {
                      key: "leaderboard_updates" as const,
                      label: "Leaderboard Updates",
                      desc: "Get notified when your rank changes",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, [key]: checked }))
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  ))}

                  <Button
                    onClick={onNotificationSave}
                    className="bg-primary hover:brightness-110 text-primary-foreground"
                  >
                    Save Preferences
                  </Button>
                </div>
              </TabsContent>

              {/* Activity tab */}
              <TabsContent value="activity">
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
                  ) : activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{a.action}</p>
                        {a.details?.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{a.details.description}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {a.details?.points && (
                          <p className="text-xs font-medium text-primary">+{a.details.points} pts</p>
                        )}
                        <p className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
