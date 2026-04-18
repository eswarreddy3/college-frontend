"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  ClipboardList,
  Code2,
  Building2,
  Layers,
  Trophy,
  Menu,
  X,
  Flame,
  Star,
  User,
  Users,
  BarChart3,
  Globe,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  FlaskConical,
  FileText,
  BriefcaseBusiness,
  MessageSquare,
  BarChart2,
  Calculator,
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/authStore"
import { useUIStore } from "@/store/uiStore"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeedbackModal } from "@/components/feedback-modal"
import { toast } from "sonner"

type NavItem = { href: string; label: string; icon: React.ElementType }
type NavGroup = { label: string; icon: React.ElementType; items: NavItem[] }
type SuperAdminNav = { standalone: NavItem[]; groups: NavGroup[] }
type StudentNavSection = { type: "section"; id: string; label: string; icon: React.ElementType; items: NavItem[]; highlight?: boolean }
type StudentNavItemBlock = { type: "item"; item: NavItem; highlight?: boolean }
type StudentNavBlock = StudentNavItemBlock | StudentNavSection

const studentNavBlocks: StudentNavBlock[] = [
  { type: "item", item: { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard } },
  {
    type: "section",
    id: "learn",
    label: "Learn",
    icon: BookOpen,
    highlight: true,
    items: [
      { href: "/learn", label: "Learn", icon: BookOpen },
      { href: "/practice-mcq", label: "Practice MCQ", icon: FileQuestion },
      { href: "/assignments", label: "Assignments", icon: ClipboardList },
    ],
  },
  {
    type: "section",
    id: "coding",
    label: "Coding",
    icon: Code2,
    items: [
      { href: "/coding", label: "Coding", icon: Code2 },
      { href: "/lab", label: "Code Lab", icon: FlaskConical },
    ],
  },
  { type: "item", item: { href: "/domain-programs", label: "Domain Programs", icon: Layers }, highlight: true },
  { type: "item", item: { href: "/company-prep", label: "Company Prep", icon: Building2 } },
  { type: "item", item: { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness } },
  { type: "item", item: { href: "/feed", label: "College Feed", icon: Newspaper } },
  { type: "item", item: { href: "/leaderboard", label: "Leaderboard", icon: Trophy } },
  {
    type: "section",
    id: "personal",
    label: "Personal",
    icon: User,
    items: [
      { href: "/resume", label: "Resume Builder", icon: FileText },
      { href: "/report", label: "My Report", icon: BarChart2 },
      { href: "/profile", label: "Profile", icon: User },
    ],
  },
]

const studentNavItems = studentNavBlocks.flatMap((b) =>
  b.type === "item" ? [b.item] : b.items
)

const collegeAdminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/jobs", label: "Job Postings", icon: BriefcaseBusiness },
  { href: "/feed", label: "College Feed", icon: Newspaper },
]

const branchAdminNavItems = [
  { href: "/branch-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/branch-admin/students", label: "Students", icon: Users },
  { href: "/branch-admin/jobs", label: "Job Postings", icon: BriefcaseBusiness },
  { href: "/feed", label: "College Feed", icon: Newspaper },
]

const superAdminNav: SuperAdminNav = {
  standalone: [
    { href: "/super-admin", label: "Overview", icon: Globe },
  ],
  groups: [
    {
      label: "People & Colleges",
      icon: Users,
      items: [
        { href: "/super-admin/colleges", label: "Colleges", icon: Building2 },
        { href: "/super-admin/students", label: "Students", icon: Users },
        { href: "/super-admin/branch-admins", label: "Branch Admins", icon: BarChart3 },
      ],
    },
    {
      label: "Content Management",
      icon: BookOpen,
      items: [
        { href: "/super-admin/courses", label: "Courses", icon: BookOpen },
        { href: "/super-admin/domains", label: "Domain Programs", icon: Layers },
        { href: "/super-admin/aptitude", label: "Aptitude Questions", icon: Calculator },
        { href: "/super-admin/coding", label: "Coding Problems", icon: Code2 },
      ],
    },
    {
      label: "Jobs & Feedback",
      icon: BriefcaseBusiness,
      items: [
        { href: "/super-admin/jobs", label: "Job Postings", icon: BriefcaseBusiness },
        { href: "/super-admin/feedback", label: "Feedback", icon: MessageSquare },
      ],
    },
  ],
}

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? "http://localhost:5000"

function resolveLogoUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith("blob:") || url.startsWith("http")) return url
  return `${BACKEND}${url}`
}

const roleBadgeConfig: Record<string, { label: string; className: string }> = {
  student: { label: "Student", className: "bg-primary/20 text-primary border-primary/30" },
  college_admin: { label: "Admin", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  branch_admin: { label: "Branch Admin", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  super_admin: { label: "Super Admin", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
}

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const { sidebarCollapsed: isCollapsed, setSidebarCollapsed } = useUIStore()
  const setIsCollapsed = setSidebarCollapsed

  const role = user?.role ?? "student"
  const navItems =
    role === "college_admin"
      ? collegeAdminNavItems
      : role === "branch_admin"
      ? branchAdminNavItems
      : studentNavItems

  // Track which super-admin groups are open; default open if any child is active
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {}
    superAdminNav.groups.forEach((g) => {
      state[g.label] = g.items.some(
        (item) =>
          pathname === item.href || pathname.startsWith(item.href + "/")
      )
    })
    return state
  })

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))

  // Track which student nav sections are open; default open if any child is active
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {}
    studentNavBlocks.forEach((block) => {
      if (block.type === "section") {
        state[block.id] = block.items.some(
          (item) => pathname === item.href || pathname.startsWith(item.href + "/")
        )
      }
    })
    return state
  })

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  const roleBadge = roleBadgeConfig[role] ?? roleBadgeConfig.student

  const handleLogout = () => {
    clearAuth()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden text-foreground"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[68px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo / Header */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-sidebar-border flex-shrink-0",
            isCollapsed ? "justify-center px-0" : "px-4 justify-between"
          )}
        >
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center min-w-0">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <Logo size={44} showText={true} />
              </motion.div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
              isCollapsed ? "w-10 h-10" : "w-8 h-8 flex-shrink-0"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 overflow-y-auto py-3", isCollapsed ? "px-2" : "px-3")}>
          {role === "super_admin" ? (
            <ul className="space-y-0.5">
              {/* Standalone items */}
              {superAdminNav.standalone.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg transition-all duration-200",
                        isCollapsed
                          ? "justify-center w-10 h-10 mx-auto"
                          : "px-3 py-2.5",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                      )}
                    >
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                      )}
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}

              {/* Grouped items */}
              {superAdminNav.groups.map((group) => {
                const isGroupOpen = openGroups[group.label] ?? false
                const hasActiveChild = group.items.some(
                  (item) =>
                    pathname === item.href || pathname.startsWith(item.href + "/")
                )

                return (
                  <li key={group.label}>
                    <button
                      onClick={() => !isCollapsed && toggleGroup(group.label)}
                      title={isCollapsed ? group.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg transition-all duration-200",
                        isCollapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5",
                        hasActiveChild
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                      )}
                    >
                      <group.icon className={cn("h-4 w-4 flex-shrink-0", hasActiveChild && "text-primary")} />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">{group.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200",
                              isGroupOpen && "rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>

                    {(isCollapsed || isGroupOpen) && (
                      <ul className={cn("space-y-0.5", !isCollapsed && "mt-0.5 ml-3 pl-3 border-l border-sidebar-border")}>
                        {group.items.map((item) => {
                          const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/")
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                className={cn(
                                  "relative flex items-center gap-3 rounded-lg transition-all duration-200",
                                  isCollapsed
                                    ? "justify-center w-10 h-10 mx-auto"
                                    : "px-3 py-2",
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                                )}
                              >
                                {isActive && !isCollapsed && (
                                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                                )}
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : role === "student" ? (
            /* ── Student nav — mixed standalone + collapsible sections ── */
            <ul className="space-y-0.5">
              {studentNavBlocks.map((block) => {
                if (block.type === "item") {
                  const { item, highlight } = block
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        title={isCollapsed ? item.label : undefined}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg transition-all duration-200",
                          isCollapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : highlight
                            ? "text-foreground hover:bg-primary/8"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                        )}
                      >
                        {isActive && !isCollapsed && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                        )}
                        <item.icon className={cn(
                          "h-4 w-4 flex-shrink-0",
                          highlight && !isActive ? "text-primary" : ""
                        )} />
                        {!isCollapsed && (
                          <span className={cn("text-sm flex-1", highlight ? "font-semibold" : "font-medium")}>
                            {item.label}
                          </span>
                        )}
                        {!isCollapsed && highlight && !isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/15 text-primary leading-none">
                            NEW
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                }

                /* Section block */
                const section = block
                const isSectionOpen = openSections[section.id] ?? false
                const hasActiveChild = section.items.some(
                  (item) => pathname === item.href || pathname.startsWith(item.href + "/")
                )

                return (
                  <li key={section.id}>
                    {/* Section header */}
                    {isCollapsed ? (
                      <div className="h-px bg-border/40 mx-1 my-1.5" />
                    ) : (
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          section.highlight
                            ? "text-foreground hover:bg-primary/8"
                            : hasActiveChild
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                        )}
                      >
                        <section.icon className={cn(
                          "h-4 w-4 flex-shrink-0",
                          section.highlight || hasActiveChild ? "text-primary" : ""
                        )} />
                        <span className={cn(
                          "flex-1 text-left",
                          section.highlight ? "text-sm font-semibold" : "text-sm font-medium"
                        )}>
                          {section.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200",
                            isSectionOpen && "rotate-180"
                          )}
                        />
                      </button>
                    )}

                    {/* Section items */}
                    {(isCollapsed || isSectionOpen) && (
                      <ul className={cn(
                        "space-y-0.5",
                        !isCollapsed && "mt-0.5 ml-3 pl-3 border-l border-sidebar-border"
                      )}>
                        {section.items.map((item) => {
                          const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/")
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                className={cn(
                                  "relative flex items-center gap-3 rounded-lg transition-all duration-200",
                                  isCollapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2",
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                                )}
                              >
                                {isActive && !isCollapsed && (
                                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                                )}
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            /* ── College/Branch admin nav — flat ── */
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    item.href !== "/branch-admin" &&
                    pathname.startsWith(item.href + "/"))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg transition-all duration-200",
                        isCollapsed
                          ? "justify-center w-10 h-10 mx-auto"
                          : "px-3 py-2.5",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                      )}
                    >
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                      )}
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-2 flex-shrink-0">
          {isCollapsed ? (
            /* ── Collapsed user section ── */
            <div className="flex flex-col items-center gap-1.5 py-1">
              <UserAvatar name={user?.name || "U"} photoUrl={user?.avatar} size="sm" points={user?.points} />

              {role === "student" && (
                <>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-orange-500/10"
                    title={`${user?.streak ?? 0} day streak`}
                  >
                    <Flame className="h-3 w-3 text-orange-500 flame-pulse" />
                    <span className="text-[10px] font-bold text-orange-400 leading-none">{user?.streak ?? 0}</span>
                  </div>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10"
                    title={`${(user?.points ?? 0).toLocaleString()} points`}
                  >
                    <Star className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-400 leading-none">
                      {(user?.points ?? 0) >= 1000
                        ? `${((user?.points ?? 0) / 1000).toFixed(1)}k`
                        : (user?.points ?? 0)}
                    </span>
                  </div>
                </>
              )}

              {role === "student" && <FeedbackModal compact />}
              <ThemeToggle collapsed />
              <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* ── Expanded user section ── */
            <div className="space-y-2">
              {/* Profile card */}
              <div className="rounded-xl bg-sidebar-accent/30 border border-border/60 p-3 space-y-2.5">
                {/* Avatar + name + role */}
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={user?.name || "U"} photoUrl={user?.avatar} size="sm" points={user?.points} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground leading-snug">
                      {user?.name || "User"}
                    </p>
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 mt-0.5 h-4 font-medium", roleBadge.className)}>
                      {roleBadge.label}
                    </Badge>
                  </div>
                </div>

                {/* College row */}
                {role === "student" && user?.college_name && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <div className="w-5 h-5 rounded-md border border-border bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                      {resolveLogoUrl(user.college_logo_url) ? (
                        <img src={resolveLogoUrl(user.college_logo_url)!} alt={user.college_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold text-muted-foreground">{user.college_name[0].toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{user.college_name}</span>
                  </div>
                )}

                {/* Streak + points */}
                {role === "student" && (
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-center gap-1.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Flame className="h-3.5 w-3.5 text-orange-500 flame-pulse" />
                      <span className="text-xs font-bold text-orange-400">{user?.streak ?? 0}d</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-400">
                        {(user?.points ?? 0) >= 1000
                          ? `${((user?.points ?? 0) / 1000).toFixed(1)}k`
                          : (user?.points ?? 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="flex items-center gap-1 px-0.5">
                {role === "student" && <FeedbackModal compact />}
                <div className="flex-1" />
                <ThemeToggle collapsed />
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
