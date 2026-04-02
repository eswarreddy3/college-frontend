"use client"

import { useEffect, useState, useCallback } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Search, Mail, Flame, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

interface Student {
  id: number
  name: string
  email: string
  roll_number: string | null
  branch: string | null
  section: string | null
  passout_year: number | null
  points: number
  streak: number
  last_active: string | null
  is_inactive: boolean
}

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays}d ago`
}

export default function BranchAdminStudentsPage() {
  const { user } = useAuthStore()
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [remindingId, setRemindingId] = useState<number | null>(null)

  const fetchStudents = useCallback(async (p: number, s: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), per_page: "20" })
      if (s) params.set("search", s)
      const res = await api.get(`/branch-admin/students?${params}`)
      setStudents(res.data.students)
      setTotal(res.data.total)
      setPage(res.data.page)
      setPages(res.data.pages)
    } catch {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStudents(1, search) }, [search, fetchStudents])

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  async function sendReminder(id: number, name: string) {
    setRemindingId(id)
    try {
      await api.post(`/branch-admin/students/${id}/remind`)
      toast.success(`Reminder sent to ${name}`)
    } catch {
      toast.error("Failed to send reminder")
    } finally {
      setRemindingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">
          {user?.branch} Students
        </h1>
        <p className="text-muted-foreground mt-1">
          {total} students · {user?.college_name}
        </p>
      </div>

      {/* Search */}
      <GlassCard className="border-border/60">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or roll number..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-secondary/40 border-border"
            />
          </div>
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Search
          </Button>
          {search && (
            <Button variant="outline" className="border-border" onClick={() => { setSearchInput(""); setSearch("") }}>
              Clear
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Student list */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <GlassCard key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </GlassCard>
            ))
          : students.length === 0
          ? (
              <div className="flex flex-col items-center py-20 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground">No students found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )
          : students.map(s => (
              <GlassCard key={s.id} className="hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className={cn(
                      "text-sm font-bold",
                      s.is_inactive ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
                    )}>
                      {s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground truncate">{s.name}</p>
                      {s.section && (
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          Section {s.section}
                        </Badge>
                      )}
                      {s.is_inactive && (
                        <Badge variant="outline" className="text-xs border-red-500/30 text-red-400 bg-red-500/10">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span>{s.email}</span>
                      {s.roll_number && <span>· {s.roll_number}</span>}
                      {s.passout_year && <span>· {s.passout_year}</span>}
                      <span>· {formatLastActive(s.last_active)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3 w-3" />{s.points.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        <Flame className="h-3 w-3" />{s.streak}d
                      </span>
                    </div>
                    {s.is_inactive && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                        onClick={() => sendReminder(s.id, s.name)}
                        disabled={remindingId === s.id}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Remind
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => fetchStudents(page - 1, search)}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => fetchStudents(page + 1, search)}
            disabled={page === pages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
