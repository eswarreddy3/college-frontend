"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, TrendingUp, Flame, Star, Mail, AlertTriangle, Loader2, Crown, ArrowRight, Share2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"

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

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)

  // Social links state
  const [linkedin, setLinkedin] = useState("")
  const [linkedinEmbeds, setLinkedinEmbeds] = useState(["", "", ""])
  const [instagram, setInstagram] = useState("")
  const [instagramEmbeds, setInstagramEmbeds] = useState(["", "", ""])
  const [savingSocial, setSavingSocial] = useState(false)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 self-start">
          <Crown className="h-4 w-4 mr-2" />
          {user?.college_name || "Your College"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.total_students ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.active_this_week ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.avg_streak ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Avg Streak (days)</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Star className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.avg_points?.toLocaleString() ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold font-serif text-foreground">Top Students</h3>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1 text-xs">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {analytics?.top_students.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{s.points.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1">
                    <Flame className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-muted-foreground">{s.streak}</span>
                  </div>
                </div>
              </div>
            ))}
            {!analytics?.top_students.length && (
              <p className="text-sm text-muted-foreground text-center py-4">No students yet</p>
            )}
          </div>
        </GlassCard>

        {/* Inactive Alert */}
        <GlassCard className={analytics && analytics.inactive_students.length > 0 ? "border-red-500/30 bg-red-500/5" : ""}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold font-serif text-foreground">Inactive Students</h3>
            {analytics && (
              <Badge variant="outline" className="text-red-400 border-red-400/30">
                {analytics.inactive_students.length}
              </Badge>
            )}
          </div>
          {analytics && analytics.inactive_students.length === 0 ? (
            <p className="text-sm text-muted-foreground">All students are active. Great job!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analytics?.inactive_students.slice(0, 5).map((student) => (
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
              {analytics && analytics.inactive_students.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{analytics.inactive_students.length - 5} more
                </p>
              )}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Social Links */}
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
    </div>
  )
}
