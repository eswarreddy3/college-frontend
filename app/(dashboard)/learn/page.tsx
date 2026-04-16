"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Star, ArrowRight, Code, Database, Globe, Terminal, Braces, Server, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import type { LucideIcon } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  category: "programming" | "aptitude" | "domain"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  icon_color: string
  total_lessons: number
  lessons_completed: number
  points_per_lesson: number
  prerequisite_id: string | null
  is_locked: boolean
  lock_reason: "plan" | "prerequisite" | null
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Database,
  Globe,
  Terminal,
  Braces,
  Server,
}

const difficultyColors = {
  Beginner: "chip chip-success",
  Intermediate: "chip chip-warning",
  Advanced: "chip chip-danger",
}

export default function LearnPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    api.get("/learn/courses")
      .then((res) => setCourses(res.data))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = (activeTab === "all" ? courses : courses.filter(c => c.category === activeTab))
    .sort((a, b) => Number(a.is_locked) - Number(b.is_locked))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Course Library</h1>
        <p className="text-muted-foreground mt-2">Master programming, aptitude, and domain skills</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 p-1">
          {["all", "programming", "aptitude"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const Icon = iconMap[course.icon] ?? Code
          const progress = course.total_lessons > 0
            ? Math.round((course.lessons_completed / course.total_lessons) * 100)
            : 0

          return (
            <GlassCard key={course.id} hover className="relative overflow-hidden group">
              {course.is_locked && (
                <div className="absolute inset-0 locked-overlay z-10 flex flex-col items-center justify-center gap-3 rounded-xl">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                  {course.lock_reason === "plan" ? (
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Not available in your college plan
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Complete{" "}
                      <span className="text-primary font-medium">
                        {courses.find(c => c.id === course.prerequisite_id)?.title ?? course.prerequisite_id}
                      </span>{" "}
                      first to unlock
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-secondary/50")}>
                  <Icon className={cn("h-6 w-6", course.icon_color)} />
                </div>
                <Badge variant="outline" className={cn("text-xs border", difficultyColors[course.difficulty])}>
                  {course.difficulty}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg mb-1 font-serif text-foreground">{course.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {course.lessons_completed} of {course.total_lessons} lessons completed
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="text-sm font-medium text-foreground">
                    {course.points_per_lesson * course.total_lessons} pts
                  </span>
                </div>
                {progress > 0 && <ProgressRing progress={progress} size={48} strokeWidth={4} />}
              </div>

              <Button
                className={cn(
                  "w-full transition-all duration-300",
                  progress > 0
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
                disabled={course.is_locked}
                onClick={() => {
                  if (course.is_locked) {
                    if (course.lock_reason === "plan") {
                      toast.error("Course Locked", { description: "This course is not available in your college plan." })
                    } else {
                      toast.error("Course Locked", {
                        description: `Complete ${courses.find(c => c.id === course.prerequisite_id)?.title ?? course.prerequisite_id} first.`,
                      })
                    }
                    return
                  }
                  router.push(`/learn/${course.id}`)
                }}
              >
                {progress > 0 ? "Continue" : "Start"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </GlassCard>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
          <p className="text-sm text-muted-foreground">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}
