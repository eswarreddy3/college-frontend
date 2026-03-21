"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { FeedbackModal } from "@/components/feedback-modal"
import { Building2, FileQuestion, Code, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface Company {
  id: number
  name: string
  slug: string
  description: string
  industry: string
  logo_color: string
  logo_letter: string
  aptitude_count: number
  coding_count: number
  tips_count: number
  rounds_count: number
}

export default function CompanyPrepPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/company-prep/companies")
      .then((res) => setCompanies(res.data))
      .catch(() => toast.error("Failed to load companies"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Company Preparation</h1>
          <p className="text-muted-foreground mt-1">
            In-depth prep for top recruiters — hiring pattern, aptitude, coding & interview tips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FeedbackModal compact triggerClassName="text-muted-foreground hover:text-primary flex-shrink-0" />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30 border-white/10"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i} className="space-y-4">
              <Skeleton className="h-20 w-20 rounded-2xl mx-auto" />
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
              <div className="flex justify-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            {search ? "No companies found" : "No companies available"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {search ? `No results for "${search}"` : "Check back later for company prep resources"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((company) => (
            <GlassCard
              key={company.id}
              hover
              className="cursor-pointer group flex flex-col items-center text-center gap-4 p-6"
              onClick={() => router.push(`/company-prep/${company.slug}`)}
            >
              {/* Logo */}
              <div className={cn(
                "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white transition-transform group-hover:scale-105",
                company.logo_color
              )}>
                {company.logo_letter}
              </div>

              {/* Name & industry */}
              <div>
                <h3 className="font-bold text-lg font-serif text-foreground">{company.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>
              </div>

              {/* Counts */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileQuestion className="h-3.5 w-3.5 text-blue-400" />
                  {company.aptitude_count} aptitude
                </span>
                <span className="flex items-center gap-1">
                  <Code className="h-3.5 w-3.5 text-primary" />
                  {company.coding_count} coding
                </span>
              </div>

              {/* CTA */}
              <div className="w-full pt-1 border-t border-white/5 text-center">
                <span className="text-xs text-primary font-medium group-hover:underline">
                  View Prep Guide →
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
