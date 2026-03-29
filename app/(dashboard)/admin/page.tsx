"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Users, TrendingUp, Flame, Star, Mail, AlertTriangle, Loader2,
  Crown, ArrowRight, Share2, Trophy, Zap, CheckCircle, Upload, X,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? "http://localhost:5000"

function resolveLogoUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith("blob:") || url.startsWith("http")) return url
  return `${BACKEND}${url}`
}

interface InactiveStudent {
  id: number
  name: string
  email: string
  branch: string
  section: string
  roll_number: string
  last_active: string | null
}

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  engagement_rate: number
  inactive_count: number
  inactive_students: InactiveStudent[]
  top_students: { id: number; name: string; points: number; streak: number; branch: string }[]
}

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const MEDALS = ["🥇", "🥈", "🥉"]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)
  const [remindingAll, setRemindingAll] = useState(false)

  const [linkedin, setLinkedin] = useState("")
  const [linkedinEmbeds, setLinkedinEmbeds] = useState(["", "", ""])
  const [instagram, setInstagram] = useState("")
  const [instagramEmbeds, setInstagramEmbeds] = useState(["", "", ""])
  const [savingSocial, setSavingSocial] = useState(false)

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [savingLogo, setSavingLogo] = useState(false)

  useEffect(() => {
    api.get("/admin/analytics")
      .then((res) => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
    api.get("/admin/college-social").then(res => {
      setLinkedin(res.data.linkedin_url ?? "")
      const li = res.data.linkedin_post_embeds ?? []
      setLinkedinEmbeds([li[0] ?? "", li[1] ?? "", li[2] ?? ""])
      setInstagram(res.data.instagram_url ?? "")
      const ig = res.data.instagram_post_embeds ?? []
      setInstagramEmbeds([ig[0] ?? "", ig[1] ?? "", ig[2] ?? ""])
      if (res.data.logo_url) setLogoPreview(res.data.logo_url)
    }).catch(() => {})
  }, [])

  async function handleSaveSocial() {
    setSavingSocial(true)
    try {
      await api.patch("/admin/college-social", {
        linkedin_url: linkedin.trim() || null,
        linkedin_post_embeds: linkedinEmbeds.map(u => u.trim()).filter(Boolean),
        instagram_url: instagram.trim() || null,
        instagram_post_embeds: instagramEmbeds.map(u => u.trim()).filter(Boolean),
      })
      toast.success("Social links saved")
    } catch {
      toast.error("Failed to save social links")
    } finally {
      setSavingSocial(false)
    }
  }

  async function handleLogoUpload() {
    if (!logoFile) return
    setSavingLogo(true)
    try {
      const form = new FormData()
      form.append("logo", logoFile)
      const res = await api.post("/admin/college-logo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setLogoPreview(res.data.logo_url)
      setLogoFile(null)
      toast.success("College logo updated")
    } catch {
      toast.error("Failed to upload logo")
    } finally {
      setSavingLogo(false)
    }
  }

  async function handleSendReminder(student: InactiveStudent) {
    setRemindingId(student.id)
    try {
      await api.post(`/admin/students/${student.id}/remind`)
      toast.success(`Reminder sent to ${student.name}`)
    } catch {
      toast.error("Failed to send reminder")
    } finally {
      setRemindingId(null)
    }
  }

  async function handleRemindAll() {
    if (!analytics?.inactive_students.length) return
    setRemindingAll(true)
    let sent = 0
    for (const student of analytics.inactive_students) {
      try {
        await api.post(`/admin/students/${student.id}/remind`)
        sent++
      } catch {}
    }
    toast.success(`Reminders sent to ${sent} student${sent !== 1 ? "s" : ""}`)
    setRemindingAll(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const engagementRate = analytics?.engagement_rate ??
    (analytics && analytics.total_students > 0
      ? Math.round((analytics.active_this_week / analytics.total_students) * 100)
      : 0)

  const stats = [
    {
      label: "Total Students",
      value: analytics?.total_students ?? "—",
      icon: Users,
      bg: "bg-blue-500/20",
      text: "text-blue-400",
    },
    {
      label: "Active This Week",
      value: analytics?.active_this_week ?? "—",
      icon: TrendingUp,
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      sub: `of ${analytics?.total_students ?? 0} total`,
      progress: engagementRate,
    },
    {
      label: "Avg Streak",
      value: analytics?.avg_streak ?? "—",
      icon: Flame,
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      sub: "days",
    },
    {
      label: "Avg Points",
      value: typeof analytics?.avg_points === "number" ? analytics.avg_points.toLocaleString() : "—",
      icon: Star,
      bg: "bg-amber-500/20",
      text: "text-amber-400",
    },
    {
      label: "Engagement Rate",
      value: `${engagementRate}%`,
      icon: Zap,
      bg: "bg-violet-500/20",
      text: "text-violet-400",
      progress: engagementRate,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Crown className="h-4 w-4 mr-2" />
            {user?.college_name || "Your College"}
          </Badge>
          <Link href="/admin/analytics">
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Full Analytics
            </Button>
          </Link>
          <Link href="/admin/students">
            <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:text-foreground gap-1">
              <Users className="h-3.5 w-3.5" /> Students
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats — 5 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <GlassCard className="h-full">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg} flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold font-serif text-foreground leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  {stat.sub && <p className="text-xs text-muted-foreground/70">{stat.sub}</p>}
                </div>
              </div>
              {stat.progress !== undefined && (
                <div className="mt-3">
                  <Progress value={stat.progress} className="h-1.5" />
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold font-serif text-foreground">Top Students</h3>
              </div>
              <Link href="/admin/students">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1 text-xs">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {analytics?.top_students.slice(0, 5).map((s, i) => (
                <motion.div
                  key={s.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <span className="w-6 text-center text-base">
                    {i < 3 ? MEDALS[i] : <span className="text-xs text-muted-foreground font-medium">{i + 1}</span>}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs ${
                      i === 0 ? "bg-amber-500/20 text-amber-400" :
                      i === 1 ? "bg-slate-500/20 text-slate-300" :
                      i === 2 ? "bg-orange-700/20 text-orange-600" : "bg-primary/20 text-primary"
                    }`}>
                      {s.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{s.points.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1">
                      <Flame className="h-3 w-3 text-orange-400" />
                      <span className="text-xs text-muted-foreground">{s.streak}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {!analytics?.top_students.length && (
                <p className="text-sm text-muted-foreground text-center py-6">No students yet</p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Inactive Alert */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className={`h-full ${analytics && analytics.inactive_students.length > 0 ? "border-red-500/30 bg-red-500/5" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {analytics?.inactive_students.length === 0
                  ? <CheckCircle className="h-5 w-5 text-emerald-400" />
                  : <AlertTriangle className="h-5 w-5 text-red-400" />
                }
                <h3 className="font-semibold font-serif text-foreground">Inactive Students</h3>
                {analytics && (
                  <Badge variant="outline" className="text-red-400 border-red-400/30 text-xs">
                    {analytics.inactive_students.length}
                  </Badge>
                )}
              </div>
              {analytics && analytics.inactive_students.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs gap-1"
                  onClick={handleRemindAll}
                  disabled={remindingAll}
                >
                  {remindingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                  Remind All
                </Button>
              )}
            </div>

            {analytics && analytics.inactive_students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CheckCircle className="h-10 w-10 text-emerald-400/50" />
                <p className="text-sm text-muted-foreground">All students are active!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {analytics?.inactive_students.slice(0, 8).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-7 w-7 flex-shrink-0">
                        <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Last: {formatLastActive(student.last_active)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 ml-2 flex-shrink-0"
                      onClick={() => handleSendReminder(student)}
                      disabled={remindingId === student.id}
                    >
                      {remindingId === student.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Mail className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                ))}
                {analytics && analytics.inactive_students.length > 8 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{analytics.inactive_students.length - 8} more —{" "}
                    <Link href="/admin/students" className="text-primary hover:underline">view all</Link>
                  </p>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* College Logo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">College Logo</h3>
            <span className="text-xs text-muted-foreground">Shown as your college profile picture</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl border border-border bg-secondary/50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? (
                <img src={resolveLogoUrl(logoPreview)!} alt="College logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground">
                  {user?.college_name?.[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label
                htmlFor="admin-logo-input"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border bg-secondary/30 hover:border-primary/50 cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground"
              >
                <Upload className="h-4 w-4" />
                {logoFile ? logoFile.name : "Choose logo (JPG, PNG, WEBP — max 2 MB)"}
              </label>
              <input
                id="admin-logo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setLogoFile(file)
                  setLogoPreview(URL.createObjectURL(file))
                }}
              />
              {logoFile && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleLogoUpload}
                    disabled={savingLogo}
                    className="bg-primary text-primary-foreground h-8"
                  >
                    {savingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                    Upload Logo
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); setLogoPreview(null) }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                  >
                    <X className="h-3 w-3" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">College Social Links</h3>
            <span className="text-xs text-muted-foreground">Shown in the College Feed for all students</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LinkedIn */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-foreground">
                  <span className="w-4 h-4 rounded bg-[#0A66C2] inline-flex items-center justify-center text-white text-[9px] font-bold">in</span>
                  LinkedIn Profile URL
                </Label>
                <Input value={linkedin} onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://www.linkedin.com/company/college" className="bg-secondary/50" />
              </div>
              <div className="space-y-2 rounded-xl border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-3">
                <p className="text-xs font-semibold text-foreground">LinkedIn Post Embeds (up to 3)</p>
                <p className="text-xs text-muted-foreground">On any post → ··· → Embed this post → copy the <code className="bg-secondary px-1 rounded">src=</code> URL.</p>
                {[0, 1, 2].map(i => (
                  <Input key={i} value={linkedinEmbeds[i]}
                    onChange={e => {
                      let val = e.target.value
                      const m = val.match(/src=["']([^"']+)["']/)
                      if (m) val = m[1]
                      setLinkedinEmbeds(prev => { const n = [...prev]; n[i] = val; return n })
                    }}
                    placeholder="Paste iframe src URL or full <iframe> code"
                    className="bg-secondary/50 text-xs font-mono" />
                ))}
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-foreground">
                  <span className="w-4 h-4 rounded-md inline-flex items-center justify-center text-white text-[9px]"
                    style={{ background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)" }}>◉</span>
                  Instagram Profile URL
                </Label>
                <Input value={instagram} onChange={e => setInstagram(e.target.value)}
                  placeholder="https://www.instagram.com/college_handle/" className="bg-secondary/50" />
              </div>
              <div className="space-y-2 rounded-xl border border-[#E1306C]/20 bg-[#E1306C]/5 p-3">
                <p className="text-xs font-semibold text-foreground">Instagram Post URLs (up to 3)</p>
                <p className="text-xs text-muted-foreground">Open a post → copy its URL from the address bar. e.g. <code className="bg-secondary px-1 rounded">https://www.instagram.com/p/ABC123/</code></p>
                {[0, 1, 2].map(i => (
                  <Input key={i} value={instagramEmbeds[i]}
                    onChange={e => setInstagramEmbeds(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
                    placeholder="https://www.instagram.com/p/..."
                    className="bg-secondary/50 text-xs font-mono" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveSocial} disabled={savingSocial} className="bg-primary text-primary-foreground">
              {savingSocial ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Social Links
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
