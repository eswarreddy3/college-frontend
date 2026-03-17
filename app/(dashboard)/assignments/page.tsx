"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  Star,
  Flame,
  Timer,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface ApiAssignment {
  id: string
  module_id: string
  title: string
  course: string
  icon: string
  due_date: string
  duration_mins: number
  total_questions: number
  completed_questions: number
  status: "pending" | "in-progress" | "completed" | "overdue"
  points: number
  score: number
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-secondary/80 text-muted-foreground border-white/10",
    icon: Clock,
    dot: "bg-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: AlertCircle,
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle,
    dot: "bg-emerald-400",
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: Flame,
    dot: "bg-red-400",
  },
}

function getDueDateUrgency(dueDate: string, status: string) {
  if (status === "completed") return null
  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, className: "text-red-400" }
  if (diffDays === 0) return { label: "Due today!", className: "text-red-400 font-semibold" }
  if (diffDays === 1) return { label: "Due tomorrow", className: "text-amber-400" }
  if (diffDays <= 3) return { label: `${diffDays} days left`, className: "text-amber-400" }
  return { label: `${diffDays} days left`, className: "text-muted-foreground" }
}

type TabFilter = "all" | "pending" | "in-progress" | "completed" | "overdue"

function ModuleSection({
  emoji, title, expanded, onToggle, assignments, loading, onStart,
}: {
  emoji: string
  title: string
  expanded: boolean
  onToggle: () => void
  assignments: ApiAssignment[]
  loading: boolean
  onStart: (id: string, status: string) => void
}) {
  return (
    <div className="space-y-3">
      <button className="flex items-center gap-2 w-full text-left" onClick={onToggle}>
        <span className="text-lg">{emoji}</span>
        <h2 className="text-lg font-bold font-serif text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground ml-1">topic-wise</span>
        <div className="ml-auto text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <GlassCard key={i} className="flex flex-col gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </GlassCard>
              ))
            : assignments.map((a) => {
                const config = statusConfig[a.status]
                const StatusIcon = config.icon
                return (
                  <GlassCard key={a.id} hover className="relative overflow-hidden group flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{a.icon}</span>
                      <span className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full border", config.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Timer className="h-3 w-3" /> {a.duration_mins} min &nbsp;·&nbsp;
                        <FileText className="h-3 w-3" /> {a.total_questions} questions
                      </p>
                    </div>
                    {a.status === "completed" && (
                      <div className="text-xs text-emerald-400 font-medium">
                        Score: {a.score} / {a.points} pts
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-foreground">{a.points} pts</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                        onClick={() => onStart(a.id, a.status)}
                      >
                        {a.status === "completed" ? "Review" : "Start"} <ArrowRight className="h-3.5 w-3.5" />
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

export default function AssignmentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabFilter>("all")
  const [pythonExpanded, setPythonExpanded] = useState(true)
  const [sqlExpanded, setSqlExpanded] = useState(true)
  const [htmlExpanded, setHtmlExpanded] = useState(true)
  const [cssExpanded, setCssExpanded] = useState(true)
  const [allAssignments, setAllAssignments] = useState<ApiAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/assignments/list")
      .then((res) => setAllAssignments(res.data))
      .catch(() => toast.error("Failed to load assignments"))
      .finally(() => setLoading(false))
  }, [])

  const PYTHON_MODULES = ["python-basics", "python-intermediate", "python-advanced"]
  const SQL_MODULES = ["sql-basics", "sql-intermediate", "sql-advanced"]
  const HTML_MODULES = ["html-basics", "html-intermediate", "html-advanced"]
  const CSS_MODULES = ["css-basics", "css-intermediate", "css-advanced"]
  const MODULE_IDS = [...PYTHON_MODULES, ...SQL_MODULES, ...HTML_MODULES, ...CSS_MODULES]

  const pythonModuleAssignments = allAssignments.filter((a) => PYTHON_MODULES.includes(a.module_id))
  const sqlModuleAssignments = allAssignments.filter((a) => SQL_MODULES.includes(a.module_id))
  const htmlModuleAssignments = allAssignments.filter((a) => HTML_MODULES.includes(a.module_id))
  const cssModuleAssignments = allAssignments.filter((a) => CSS_MODULES.includes(a.module_id))
  const generalAssignments = allAssignments.filter((a) => !MODULE_IDS.includes(a.module_id))

  const filtered =
    activeTab === "all"
      ? generalAssignments
      : generalAssignments.filter((a) => a.status === activeTab)

  const pendingCount = allAssignments.filter((a) => a.status === "pending").length
  const inProgressCount = allAssignments.filter((a) => a.status === "in-progress").length
  const completedCount = allAssignments.filter((a) => a.status === "completed").length
  const overdueCount = allAssignments.filter((a) => a.status === "overdue").length
  const totalPoints = allAssignments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.score, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Assignments</h1>
        <p className="text-muted-foreground mt-2">
          Complete timed assessments to earn points and prove your skills
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{pendingCount + inProgressCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg bg-red-500/20">
            <Flame className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{overdueCount}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </div>
        </GlassCard>
      </div>

      {/* Python Module Assignments */}
      <ModuleSection
        emoji="🐍"
        title="Python — Module Assessments"
        expanded={pythonExpanded}
        onToggle={() => setPythonExpanded((p) => !p)}
        assignments={pythonModuleAssignments}
        loading={loading}
        onStart={(id, status) => router.push(status === "completed" ? `/assignments/${id}/results` : `/assignments/${id}`)}
      />

      {/* SQL Module Assignments */}
      <ModuleSection
        emoji="🗄️"
        title="SQL — Module Assessments"
        expanded={sqlExpanded}
        onToggle={() => setSqlExpanded((p) => !p)}
        assignments={sqlModuleAssignments}
        loading={loading}
        onStart={(id, status) => router.push(status === "completed" ? `/assignments/${id}/results` : `/assignments/${id}`)}
      />

      {/* HTML Module Assignments */}
      <ModuleSection
        emoji="🌐"
        title="HTML — Module Assessments"
        expanded={htmlExpanded}
        onToggle={() => setHtmlExpanded((p) => !p)}
        assignments={htmlModuleAssignments}
        loading={loading}
        onStart={(id, status) => router.push(status === "completed" ? `/assignments/${id}/results` : `/assignments/${id}`)}
      />

      {/* CSS Module Assignments */}
      <ModuleSection
        emoji="🎨"
        title="CSS — Module Assessments"
        expanded={cssExpanded}
        onToggle={() => setCssExpanded((p) => !p)}
        assignments={cssModuleAssignments}
        loading={loading}
        onStart={(id, status) => router.push(status === "completed" ? `/assignments/${id}/results` : `/assignments/${id}`)}
      />

      <div className="border-t border-white/5" />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
        <TabsList className="bg-secondary/50 p-1">
          {(["all", "pending", "in-progress", "completed", "overdue"] as const).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize text-xs sm:text-sm"
            >
              {tab === "in-progress" ? "In Progress" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Assignment cards */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i}>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </GlassCard>
            ))
          : filtered.map((assignment) => {
              const config = statusConfig[assignment.status]
              const StatusIcon = config.icon
              const progress =
                assignment.total_questions > 0
                  ? (assignment.completed_questions / assignment.total_questions) * 100
                  : 0
              const urgency = getDueDateUrgency(assignment.due_date, assignment.status)

              return (
                <GlassCard
                  key={assignment.id}
                  hover
                  className={cn(
                    "group relative overflow-hidden",
                    assignment.status === "overdue" && "border-red-500/20"
                  )}
                >
                  {assignment.status === "overdue" && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl" />
                  )}
                  {assignment.status === "in-progress" && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pl-1">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/70 flex items-center justify-center text-2xl">
                        {assignment.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <Badge
                            variant="outline"
                            className={cn("text-xs border flex items-center gap-1", config.color)}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">{assignment.course}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            {assignment.duration_mins} min
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {assignment.total_questions} questions
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 flex-shrink-0">
                      <div className="w-full sm:w-36">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium text-foreground">
                            {assignment.completed_questions}/{assignment.total_questions}
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-0.5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {assignment.due_date}
                        </div>
                        {urgency && (
                          <span className={cn("text-xs font-medium", urgency.className)}>
                            {urgency.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-foreground">
                          {assignment.status === "completed" ? `${assignment.score}/` : ""}
                          {assignment.points} pts
                        </span>
                      </div>

                      <Button
                        size="sm"
                        className={cn(
                          "transition-all min-w-[100px]",
                          assignment.status === "completed"
                            ? "bg-secondary hover:bg-secondary/80 text-foreground"
                            : assignment.status === "overdue"
                            ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                        onClick={() => router.push(`/assignments/${assignment.id}${assignment.status === "completed" ? "/results" : ""}`)}
                      >
                        {assignment.status === "completed"
                          ? "Review"
                          : assignment.status === "in-progress"
                          ? "Continue"
                          : "Start"}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No assignments here</h3>
          <p className="text-sm text-muted-foreground">Try a different filter tab</p>
        </div>
      )}
    </div>
  )
}
