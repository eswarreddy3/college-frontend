"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Briefcase,
  Clock,
  Star,
  Lightbulb,
  Tag,
  Shield,
  BookOpen,
  MessageSquare,
  FileText,
  Code,
  FileQuestion,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────

interface HiringRound {
  id: number
  order: number
  name: string
  description: string
  duration: string
  is_eliminatory: boolean
}

interface CompanyPackage {
  id: number
  role_name: string
  type: "Full Time" | "Internship"
  ctc_min: number | null
  ctc_max: number | null
  location: string
  eligibility: string
}

interface CompanyDetail {
  id: number
  name: string
  slug: string
  description: string
  about_points: string[]
  industry: string
  founded_year: number
  headquarters: string
  employee_count: string
  website: string
  logo_color: string
  logo_letter: string
  hiring_rounds: HiringRound[]
  packages: CompanyPackage[]
}

interface AptitudeQuestion {
  id: number
  section: "Quantitative" | "Logical" | "Verbal" | "Technical"
  question: string
  options: string[]
  correct_answer: number
  explanation: string | null
  difficulty: "Easy" | "Medium" | "Hard"
  year: number | null
}

interface CodingQuestion {
  id: number
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  solution_hint: string | null
  year: number | null
}

interface Tip {
  id: number
  category: "HR" | "Technical" | "GD" | "Resume"
  title: string
  content: string
  order: number
}

type TipsGrouped = Partial<Record<"HR" | "Technical" | "GD" | "Resume", Tip[]>>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const difficultyColors = {
  Easy: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  Hard: "bg-danger/20 text-danger border-danger/30",
}

const sectionColors: Record<string, string> = {
  Quantitative: "bg-primary/20 text-primary border-primary/30",
  Logical: "bg-coding/20 text-coding border-coding/30",
  Verbal: "bg-success/20 text-success border-success/30",
  Technical: "bg-warning/20 text-warning border-warning/30",
}

const tipCategoryConfig = {
  HR: { icon: MessageSquare, color: "text-coding", bg: "bg-coding/10 border-coding/20" },
  Technical: { icon: Code, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  GD: { icon: Users, color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  Resume: { icon: FileText, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
}

function formatCTC(min: number | null, max: number | null): string {
  if (min === null && max === null) return "Confidential"
  if (min !== null && max !== null && min === max) return `₹${min} LPA`
  if (min !== null && max !== null) return `₹${min} – ${max} LPA`
  if (min !== null) return `₹${min}+ LPA`
  return `₹${max} LPA`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OverviewTab({ company }: { company: CompanyDetail }) {
  return (
    <div className="space-y-8">
      {/* About */}
      <GlassCard className="space-y-4">
        <h2 className="font-bold font-serif text-foreground text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> About {company.name}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
        {company.about_points.length > 0 && (
          <ul className="space-y-2">
            {company.about_points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                {pt}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Founded", value: company.founded_year?.toString() ?? "—" },
          { icon: Users, label: "Employees", value: company.employee_count ?? "—" },
          { icon: MapPin, label: "HQ", value: company.headquarters?.split(",")[0] ?? "—" },
          { icon: Briefcase, label: "Industry", value: company.industry ?? "—" },
        ].map(({ icon: Icon, label, value }) => (
          <GlassCard key={label} className="text-center space-y-1 py-4">
            <Icon className="h-5 w-5 text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold text-foreground">{value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Hiring Process */}
      <GlassCard className="space-y-6">
        <h2 className="font-bold font-serif text-foreground text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Hiring Process
        </h2>
        <div className="relative space-y-0">
          {company.hiring_rounds.map((round, i) => (
            <div key={round.id} className="flex gap-4">
              {/* Stepper */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {round.order}
                </div>
                {i < company.hiring_rounds.length - 1 && (
                  <div className="w-0.5 flex-1 bg-white/10 my-1 min-h-[24px]" />
                )}
              </div>
              {/* Content */}
              <div className={cn("pb-6 flex-1", i === company.hiring_rounds.length - 1 && "pb-0")}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{round.name}</span>
                  {round.duration && (
                    <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />{round.duration}
                    </Badge>
                  )}
                  {round.is_eliminatory && (
                    <Badge className="text-[10px] bg-danger/15 text-danger border-danger/30">
                      Eliminatory
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{round.description}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Packages */}
      <GlassCard className="space-y-4">
        <h2 className="font-bold font-serif text-foreground text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-warning" /> Salary & Packages
        </h2>
        <div className="space-y-3">
          {company.packages.map((pkg) => (
            <div key={pkg.id} className="rounded-xl border border-white/8 bg-secondary/30 p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{pkg.role_name}</span>
                  <Badge className={cn("text-[10px]", pkg.type === "Internship" ? "bg-coding/20 text-coding border-coding/30" : "bg-success/20 text-success border-success/30")}>
                    {pkg.type}
                  </Badge>
                </div>
                {pkg.eligibility && (
                  <p className="text-xs text-muted-foreground">{pkg.eligibility}</p>
                )}
                {pkg.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{pkg.location}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-warning">{formatCTC(pkg.ctc_min, pkg.ctc_max)}</p>
                <p className="text-[10px] text-muted-foreground">CTC / Stipend</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function AptitudeTab({ slug }: { slug: string }) {
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState<string>("All")
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}/aptitude`)
      .then((res) => setQuestions(res.data))
      .catch(() => toast.error("Failed to load aptitude questions"))
      .finally(() => setLoading(false))
  }, [slug])

  const sections = ["All", ...Array.from(new Set(questions.map((q) => q.section)))]

  const filtered = section === "All" ? questions : questions.filter((q) => q.section === section)

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Section filter */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => {
          const count = s === "All" ? questions.length : questions.filter((q) => q.section === s).length
          return (
            <button
              key={s}
              onClick={() => { setSection(s); setExpanded(null) }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm border transition-all",
                section === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/30 text-muted-foreground border-white/10 hover:border-white/20"
              )}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filtered.map((q) => {
          const isOpen = expanded === q.id
          return (
            <GlassCard key={q.id} className="cursor-pointer" onClick={() => setExpanded(isOpen ? null : q.id)}>
              {/* Question header */}
              <div className="flex items-start gap-3 justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className={cn("text-[10px] border", sectionColors[q.section])}>{q.section}</Badge>
                    <Badge className={cn("text-[10px] border", difficultyColors[q.difficulty])}>{q.difficulty}</Badge>
                    {q.year && <span className="text-[10px] text-muted-foreground">{q.year}</span>}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{q.question}</p>
                </div>
                <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>

              {/* Expanded: options + answer */}
              {isOpen && (
                <div className="mt-4 space-y-4 border-t border-white/5 pt-4">
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm",
                          idx === q.correct_answer
                            ? "border-success/40 bg-success/10 text-success"
                            : "border-white/8 bg-secondary/20 text-muted-foreground"
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                          idx === q.correct_answer ? "border-success bg-success text-white" : "border-white/20 text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {idx === q.correct_answer && <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                      <p className="text-xs font-semibold text-primary mb-1">Explanation</p>
                      <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No questions in this section yet.
          </div>
        )}
      </div>
    </div>
  )
}

function CodingTab({ slug }: { slug: string }) {
  const [questions, setQuestions] = useState<CodingQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState<string>("All")
  const [expanded, setExpanded] = useState<number | null>(null)
  const [showHint, setShowHint] = useState<number | null>(null)

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}/coding`)
      .then((res) => setQuestions(res.data))
      .catch(() => toast.error("Failed to load coding questions"))
      .finally(() => setLoading(false))
  }, [slug])

  const difficulties = ["All", "Easy", "Medium", "Hard"]
  const filtered = difficulty === "All" ? questions : questions.filter((q) => q.difficulty === difficulty)

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Difficulty filter */}
      <div className="flex flex-wrap gap-2">
        {difficulties.map((d) => {
          const count = d === "All" ? questions.length : questions.filter((q) => q.difficulty === d).length
          return (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setExpanded(null); setShowHint(null) }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm border transition-all",
                difficulty === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/30 text-muted-foreground border-white/10 hover:border-white/20"
              )}
            >
              {d} <span className="opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const isOpen = expanded === q.id
          return (
            <GlassCard key={q.id} className="space-y-0">
              {/* Header */}
              <div
                className="flex items-start gap-3 justify-between cursor-pointer"
                onClick={() => { setExpanded(isOpen ? null : q.id); setShowHint(null) }}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className={cn("text-[10px] border", difficultyColors[q.difficulty])}>{q.difficulty}</Badge>
                    {q.year && <span className="text-[10px] text-muted-foreground">{q.year}</span>}
                    {q.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-white/8 flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" />{t}
                      </span>
                    ))}
                  </div>
                  <p className="font-semibold text-foreground">{q.title}</p>
                </div>
                <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="mt-4 border-t border-white/5 pt-4 space-y-4">
                  <pre className="text-sm text-foreground/85 whitespace-pre-wrap font-mono bg-secondary/30 rounded-xl p-4 border border-white/5 leading-relaxed text-[13px]">
                    {q.description}
                  </pre>

                  {q.solution_hint && (
                    <div>
                      {showHint !== q.id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-muted-foreground gap-2"
                          onClick={(e) => { e.stopPropagation(); setShowHint(q.id) }}
                        >
                          <Lightbulb className="h-4 w-4 text-warning" /> Show Approach Hint
                        </Button>
                      ) : (
                        <div className="p-3 rounded-xl bg-warning/5 border border-warning/20 text-sm">
                          <p className="text-xs font-semibold text-warning mb-1 flex items-center gap-1">
                            <Lightbulb className="h-3.5 w-3.5" /> Approach Hint
                          </p>
                          <p className="text-muted-foreground leading-relaxed">{q.solution_hint}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No coding questions for this difficulty yet.
          </div>
        )}
      </div>
    </div>
  )
}

function TipsTab({ slug }: { slug: string }) {
  const [tips, setTips] = useState<TipsGrouped>({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}/tips`)
      .then((res) => setTips(res.data))
      .catch(() => toast.error("Failed to load tips"))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
    </div>
  )

  const categories = (["HR", "Technical", "GD", "Resume"] as const).filter((c) => tips[c]?.length)

  if (categories.length === 0) return (
    <div className="text-center py-12 text-muted-foreground text-sm">No tips available yet.</div>
  )

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const cfg = tipCategoryConfig[cat]
        const Icon = cfg.icon
        const catTips = tips[cat] ?? []
        return (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-5 w-5", cfg.color)} />
              <h3 className="font-bold font-serif text-foreground">{cat} Tips</h3>
              <span className="text-xs text-muted-foreground">({catTips.length})</span>
            </div>
            {catTips.map((tip) => {
              const isOpen = expanded === tip.id
              return (
                <GlassCard
                  key={tip.id}
                  className="cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : tip.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-foreground text-sm">{tip.title}</p>
                    <div className="flex-shrink-0 text-muted-foreground">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className={cn("mt-3 p-3 rounded-xl border text-sm", cfg.bg)}>
                      <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
                    </div>
                  )}
                </GlassCard>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Track which tabs have been fetched (tab content components handle their own fetch)
  const fetchedTabs = useRef<Set<string>>(new Set(["aptitude", "coding", "tips"]))

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}`)
      .then((res) => setCompany(res.data))
      .catch(() => {
        toast.error("Company not found")
        router.push("/company-prep")
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!company) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mt-1 flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          <div className={cn(
            "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl font-bold text-white flex-shrink-0",
            company.logo_color
          )}>
            {company.logo_letter}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-serif text-foreground">{company.name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm text-muted-foreground">{company.industry}</span>
              {company.headquarters && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />{company.headquarters}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-primary flex items-center gap-1 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: "Hiring Rounds", value: company.hiring_rounds.length, color: "text-primary" },
          { icon: Star, label: "Packages", value: company.packages.length, color: "text-warning" },
          { icon: FileQuestion, label: "Aptitude Qs", value: null, color: "text-primary" },
          { icon: Code, label: "Coding Qs", value: null, color: "text-coding" },
        ].map(({ icon: Icon, label, color }) => (
          <GlassCard key={label} className="text-center py-4">
            <Icon className={cn("h-5 w-5 mx-auto mb-1", color)} />
            <p className="text-xs text-muted-foreground">{label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 flex flex-wrap h-auto gap-1 p-1">
          {[
            { value: "overview", label: "Overview", icon: BookOpen },
            { value: "aptitude", label: "Aptitude", icon: FileQuestion },
            { value: "coding", label: "Coding", icon: Code },
            { value: "tips", label: "Interview Tips", icon: MessageSquare },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 flex items-center"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {activeTab === "overview" && <OverviewTab company={company} />}
          {activeTab === "aptitude" && <AptitudeTab slug={slug} />}
          {activeTab === "coding" && <CodingTab slug={slug} />}
          {activeTab === "tips" && <TipsTab slug={slug} />}
        </div>
      </Tabs>
    </div>
  )
}
