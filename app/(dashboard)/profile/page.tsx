"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil, Loader2, Eye, EyeOff, Github, Linkedin, ExternalLink, MessageSquarePlus, Camera, Lock } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
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

const personalSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  linkedin: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  github: z.string().url("Enter a valid URL").optional().or(z.literal("")),
})
type PersonalForm = z.infer<typeof personalSchema>

function PersonalInfoSection({ user, updateUser }: { user: any; updateUser: (u: Partial<any>) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      phone: user?.phone || "",
      dob: user?.dob || "",
      linkedin: user?.linkedin || "",
      github: user?.github || "",
    },
  })

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await api.post("/student/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      updateUser({ photo_url: res.data.photo_url } as any)
      toast.success("Profile photo updated")
    } catch {
      toast.error("Failed to upload photo")
      setAvatarPreview(null)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const onSave = async (data: PersonalForm) => {
    try {
      await api.patch("/student/profile", {
        phone: data.phone,
        dob: data.dob || null,
        linkedin: data.linkedin,
        github: data.github,
      })
      updateUser({ phone: data.phone, dob: data.dob, linkedin: data.linkedin, github: data.github } as any)
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  const photoUrl = avatarPreview || user?.photo_url
  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "??"

  return (
    <div>
      <h3 className="font-semibold font-serif text-foreground mb-4">Personal Info</h3>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {/* Avatar */}
        <div className="space-y-1.5">
          <Label className="text-foreground">Profile Photo</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
                {photoUrl
                  ? <img src={photoUrl.startsWith("/static") ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "")}${photoUrl}` : photoUrl} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-xl font-bold text-primary font-serif">{initials}</span>
                }
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50"
              >
                {uploadingAvatar ? <Loader2 className="h-2.5 w-2.5 text-primary-foreground animate-spin" /> : <Camera className="h-2.5 w-2.5 text-primary-foreground" />}
              </button>
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-primary hover:underline">
              {uploadingAvatar ? "Uploading…" : "Change photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="text-foreground">Mobile Number</Label>
          <Input placeholder="9876543210" className="bg-secondary/50 border-border text-foreground" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        {/* DOB */}
        <div className="space-y-1.5">
          <Label className="text-foreground">Date of Birth</Label>
          <Input type="date" className="bg-secondary/50 border-border text-foreground" max={new Date().toISOString().split("T")[0]} {...register("dob")} />
          {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1.5">
            <Linkedin className="h-3.5 w-3.5 text-blue-400" /> LinkedIn URL
          </Label>
          <Input placeholder="https://linkedin.com/in/yourname" className="bg-secondary/50 border-border text-foreground" {...register("linkedin")} />
          {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin.message}</p>}
        </div>

        {/* GitHub */}
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" /> GitHub URL
          </Label>
          <Input placeholder="https://github.com/yourusername" className="bg-secondary/50 border-border text-foreground" {...register("github")} />
          {errors.github && <p className="text-xs text-destructive">{errors.github.message}</p>}
        </div>

        <Button type="submit" className="bg-primary hover:brightness-110 text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save
        </Button>
      </form>
    </div>
  )
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
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  const photoUrl: string | undefined = (user as any)?.photo_url
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? ""

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
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center primary-glow overflow-hidden">
                  {photoUrl
                    ? <img src={photoUrl.startsWith("/static") ? `${apiBase}${photoUrl}` : photoUrl} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-3xl font-bold text-primary font-serif">{initials}</span>
                  }
                </div>
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
              {/* Editable fields */}
              {[
                { label: "Phone", value: (user as any)?.phone || "—" },
                { label: "DOB", value: (user as any)?.dob || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
              {/* Admin-locked fields */}
              {[
                { label: "College", value: user?.college_name || "—" },
                { label: "Branch", value: (user as any)?.branch || "—" },
                { label: "Section", value: (user as any)?.section ? `Section ${(user as any).section}` : "—" },
                { label: "Roll No.", value: (user as any)?.roll_number || "—" },
                { label: "Pass-out Year", value: (user as any)?.passout_year || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <Lock className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            {((user as any)?.linkedin || (user as any)?.github) && (
              <div className="mt-4 space-y-2">
                {(user as any)?.linkedin && (
                  <a
                    href={(user as any).linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">LinkedIn</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-60" />
                  </a>
                )}
                {(user as any)?.github && (
                  <a
                    href={(user as any).github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">GitHub</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-60" />
                  </a>
                )}
              </div>
            )}
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

              {/* Account tab — personal info + change password */}
              <TabsContent value="account">
                <div className="max-w-sm space-y-8">
                  <PersonalInfoSection user={user} updateUser={updateUser} />

                  <div>
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

      {/* Platform Feedback */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold font-serif text-foreground flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4 text-primary" />
              Platform Feedback
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Found a bug? Have a suggestion? We'd love to hear from you.
            </p>
          </div>
          <FeedbackModal triggerClassName="sm:w-auto" />
        </div>
      </GlassCard>
    </div>
  )
}
