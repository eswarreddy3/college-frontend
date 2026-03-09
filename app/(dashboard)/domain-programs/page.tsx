"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BarChart3,
  Database,
  Cpu,
  LineChart,
  Globe,
  Star,
  Lock,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import type { LucideIcon } from "lucide-react"

// ── Types (mirror DB shape) ──────────────────────────────────────────────────

interface Domain {
  id: string
  title: string
  description: string
  icon: string
  icon_color: string
  bg_color: string
  skills: string[]
  total_points: number
  total_courses: number
}

interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  icon_color: string
  total_lessons: number
  lessons_completed: number
  points_per_lesson: number
  prerequisite_id: string | null
  is_locked: boolean
  order_index: number
}

interface DomainDetail {
  domain: Domain
  courses: Course[]
}

// ── Icon map ─────────────────────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
  Database, Brain, BarChart3, Cpu, LineChart, Globe, Star,
}

const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

// ─────────────────────────────────────────────────────────────────────────────

export default function DomainProgramsPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [selected, setSelected] = useState<DomainDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    api.get("/domain-programs/")
      .then((res) => setDomains(res.data))
      .catch(() => toast.error("Failed to load domain programs"))
      .finally(() => setLoading(false))
  }, [])

  const openDomain = (domain: Domain) => {
    setDetailLoading(true)
    api.get(`/domain-programs/${domain.id}/courses`)
      .then((res) => setSelected(res.data))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setDetailLoading(false))
  }

  // ── Domain detail view ───────────────────────────────────────────────────
  if (selected) {
    const { domain, courses } = selected
    const DomainIcon = iconMap[domain.icon] ?? Database
    const completedCourses = courses.filter(
      (c) => c.lessons_completed === c.total_lessons && c.total_lessons > 0
    ).length
    const totalLessons = courses.reduce((s, c) => s + c.total_lessons, 0)
    const completedLessons = courses.reduce((s, c) => s + c.lessons_completed, 0)
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelected(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", domain.bg_color)}>
            <DomainIcon className={cn("h-7 w-7", domain.icon_color)} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">{domain.title}</h1>
            <p className="text-muted-foreground">{domain.description}</p>
          </div>
        </div>

        {/* Progress overview */}
        <GlassCard>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium text-foreground">
                  {completedLessons}/{totalLessons} lessons · {completedCourses}/{courses.length} courses
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-serif text-primary">{domain.total_points}</p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
          </div>
        </GlassCard>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {domain.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="bg-primary/10 border-primary/30 text-primary">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Course list */}
        <div>
          <h2 className="text-xl font-semibold font-serif mb-6 text-foreground">Courses in this Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const Icon = iconMap[course.icon] ?? Database
              const courseProgress = course.total_lessons > 0
                ? Math.round((course.lessons_completed / course.total_lessons) * 100)
                : 0
              const isCompleted = course.lessons_completed === course.total_lessons && course.total_lessons > 0

              return (
                <GlassCard
                  key={course.id}
                  hover={!course.is_locked}
                  className={cn("relative", course.is_locked && "opacity-60")}
                >
                  {course.is_locked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Step number */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : !course.is_locked
                        ? "bg-primary/20 border-2 border-primary text-primary"
                        : "bg-secondary text-muted-foreground border-2 border-border"
                    )}>
                      {course.order_index}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={cn("h-4 w-4", course.icon_color)} />
                        <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                        <Badge variant="outline" className={cn("text-xs border ml-auto flex-shrink-0", difficultyColors[course.difficulty])}>
                          {course.difficulty}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{course.lessons_completed}/{course.total_lessons} lessons</span>
                          <span className="flex items-center gap-1 text-primary">
                            <Star className="h-3 w-3" />
                            {course.points_per_lesson * course.total_lessons} pts
                          </span>
                        </div>

                        <Button
                          size="sm"
                          disabled={course.is_locked}
                          onClick={() => router.push(`/learn/${course.id}`)}
                          className={cn(
                            isCompleted
                              ? "bg-secondary hover:bg-secondary/80 text-foreground"
                              : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          )}
                        >
                          {isCompleted ? "Review" : course.is_locked ? "Locked" : courseProgress > 0 ? "Continue" : "Start"}
                          {!course.is_locked && <ArrowRight className="h-3 w-3 ml-1" />}
                        </Button>
                      </div>

                      {courseProgress > 0 && (
                        <Progress value={courseProgress} className="h-1.5 mt-2" />
                      )}
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── Domain list view ─────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Domain Programs</h1>
        <p className="text-muted-foreground mt-2">Specialized learning paths for in-demand skills</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <GlassCard key={i}>
              <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-9 w-full rounded-md" />
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => {
            const Icon = iconMap[domain.icon] ?? Database

            return (
              <GlassCard
                key={domain.id}
                hover
                className="cursor-pointer group"
                onClick={() => openDomain(domain)}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105",
                  domain.bg_color
                )}>
                  <Icon className={cn("h-7 w-7", domain.icon_color)} />
                </div>

                <h3 className="font-semibold text-lg font-serif text-foreground mb-2">{domain.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{domain.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {domain.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs text-muted-foreground">
                      {skill}
                    </Badge>
                  ))}
                  {domain.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      +{domain.skills.length - 4}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{domain.total_courses} courses</span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <Star className="h-4 w-4" />
                      {domain.total_points} pts
                    </span>
                  </div>
                  <Button
                    size="sm"
                    disabled={detailLoading}
                    onClick={(e) => { e.stopPropagation(); openDomain(domain) }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {detailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>View <ArrowRight className="h-4 w-4 ml-1" /></>}
                  </Button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
