"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Star, ArrowRight, Code, Database, Globe, Terminal, Braces, Server, Loader2, BookOpen } from "lucide-react"
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

const cardPalette = [
  {
    gradient: "from-cyan-500 via-teal-500 to-teal-700",
    btn: "bg-white text-teal-700 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
  {
    gradient: "from-violet-500 via-purple-500 to-purple-700",
    btn: "bg-white text-purple-700 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
  {
    gradient: "from-emerald-400 via-green-500 to-green-700",
    btn: "bg-white text-green-700 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
  {
    gradient: "from-amber-400 via-orange-400 to-orange-600",
    btn: "bg-white text-orange-600 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
  {
    gradient: "from-rose-400 via-pink-500 to-pink-700",
    btn: "bg-white text-pink-700 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
  {
    gradient: "from-blue-400 via-blue-500 to-indigo-700",
    btn: "bg-white text-indigo-700 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
  {
    gradient: "from-fuchsia-500 via-purple-500 to-violet-700",
    btn: "bg-white text-violet-700 hover:bg-white/90",
    badge: "bg-white/20 text-white border-white/30",
    circle1: "bg-white/10",
    circle2: "bg-white/10",
  },
]

const difficultyLabel: Record<string, string> = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
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
        {filtered.map((course, idx) => {
          const Icon = iconMap[course.icon] ?? Code
          const progress = course.total_lessons > 0
            ? Math.round((course.lessons_completed / course.total_lessons) * 100)
            : 0
          const palette = cardPalette[idx % cardPalette.length]

          return (
            <div
              key={course.id}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br shadow-lg",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
                palette.gradient,
                course.is_locked && "opacity-70"
              )}
            >
              {/* Decorative background circles */}
              <div className={cn("absolute -top-8 -right-8 w-40 h-40 rounded-full", palette.circle1)} />
              <div className={cn("absolute -bottom-10 -left-10 w-48 h-48 rounded-full", palette.circle2)} />

              {/* Lock overlay */}
              {course.is_locked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/40 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  {course.lock_reason === "plan" ? (
                    <p className="text-sm text-white/90 text-center px-6 font-medium">
                      Not available in your college plan
                    </p>
                  ) : (
                    <p className="text-sm text-white/90 text-center px-6 font-medium">
                      Complete{" "}
                      <span className="font-bold text-white underline">
                        {courses.find(c => c.id === course.prerequisite_id)?.title ?? course.prerequisite_id}
                      </span>{" "}
                      first
                    </p>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full border",
                    palette.badge
                  )}>
                    {difficultyLabel[course.difficulty]}
                  </span>
                </div>

                {/* Title & description */}
                <h3 className="font-bold text-3xl font-serif text-white mb-1 leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-white/70 mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/80">
                      {course.lessons_completed}/{course.total_lessons} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                    <span className="text-sm font-semibold text-white">
                      {course.points_per_lesson * course.total_lessons} pts
                    </span>
                  </div>
                </div>

                {/* Progress bar — always visible */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-white drop-shadow">Progress</span>
                    <span className="text-xs font-bold text-white drop-shadow">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full border border-white/40 bg-white/10">
                    <div
                      className="h-full rounded-full bg-white shadow transition-all duration-500"
                      style={{ width: `${progress > 0 ? progress : 3}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <button
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
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
                    "font-semibold text-sm transition-all duration-200 shadow-md",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    palette.btn
                  )}
                >
                  {progress > 0 ? "Continue Learning" : "Start Course"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
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
