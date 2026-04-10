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
  Package,
  LogOut,
  ChevronDown,
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

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice-mcq", label: "Practice MCQ", icon: FileQuestion },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/coding", label: "Coding", icon: Code2 },
  { href: "/lab", label: "Code Lab", icon: FlaskConical },
  { href: "/company-prep", label: "Company Prep", icon: Building2 },
  { href: "/domain-programs", label: "Domain Programs", icon: Layers },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/feed", label: "College Feed", icon: Newspaper },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/report", label: "My Report", icon: BarChart2 },
  { href: "/profile", label: "Profile", icon: User },
]

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

type NavItem = { href: string; label: string; icon: React.ElementType }
type NavGroup = { label: string; icon: React.ElementType; items: NavItem[] }
type SuperAdminNav = { standalone: NavItem[]; groups: NavGroup[] }

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
        { href: "/super-admin/packages", label: "Packages", icon: Package },
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
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-20 px-4 border-b border-sidebar-border",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link href="/dashboard" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.07, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <Logo size={60} showText={!isCollapsed} />
            </motion.div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden lg:flex text-muted-foreground hover:text-foreground",
              isCollapsed && "hidden"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {role === "super_admin" ? (
            <ul className="space-y-1">
              {/* Standalone items */}
              {superAdminNav.standalone.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isCollapsed && "justify-center px-2",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_16px_var(--glow-primary)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
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
                    {/* Group header */}
                    <button
                      onClick={() => !isCollapsed && toggleGroup(group.label)}
                      title={isCollapsed ? group.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isCollapsed && "justify-center px-2",
                        hasActiveChild
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <group.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          hasActiveChild && "text-primary"
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">{group.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                              isGroupOpen && "rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>

                    {/* Group children */}
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
                                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                                  isCollapsed && "justify-center px-2",
                                  isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_16px_var(--glow-primary)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    "h-4 w-4 flex-shrink-0",
                                    isActive && "text-primary"
                                  )}
                                />
                                {!isCollapsed && (
                                  <span className="text-sm">{item.label}</span>
                                )}
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
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/admin" &&
                    item.href !== "/branch-admin" &&
                    pathname.startsWith(item.href + "/"))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isCollapsed && "justify-center px-2",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_16px_var(--glow-primary)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive && "text-primary"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          {isCollapsed ? (
            /* ── Collapsed ── */
            <div className="flex flex-col items-center gap-2">
              {/* Avatar */}
              <UserAvatar name={user?.name || "U"} photoUrl={user?.avatar} size="sm" className="border-2 border-primary/30" />

              {/* College logo (students) */}
              {role === "student" && user?.college_name && (
                <div
                  className="w-9 h-9 rounded-lg border border-border bg-secondary/50 flex items-center justify-center overflow-hidden"
                  title={user.college_name}
                >
                  {resolveLogoUrl(user.college_logo_url) ? (
                    <img src={resolveLogoUrl(user.college_logo_url)!} alt={user.college_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">{user.college_name[0].toUpperCase()}</span>
                  )}
                </div>
              )}

              {/* Streak + points (students) */}
              {role === "student" && (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-orange-500 flame-pulse" />
                    <span className="text-xs font-bold text-foreground">{user?.streak ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-foreground">
                      {(user?.points ?? 0) >= 1000
                        ? `${((user?.points ?? 0) / 1000).toFixed(1)}k`
                        : (user?.points ?? 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action icons */}
              {role === "student" && <FeedbackModal compact />}
              <ThemeToggle collapsed />
              <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Expand sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* ── Expanded ── */
            <div className="space-y-2.5">
              {/* Profile card */}
              <div className="rounded-xl bg-secondary/40 border border-border p-2.5 space-y-2">
                {/* Avatar + name row */}
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={user?.name || "U"} photoUrl={user?.avatar} size="sm" className="border-2 border-primary/30" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground leading-tight">
                      {user?.name || "User"}
                    </p>
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 mt-0.5 h-4", roleBadge.className)}>
                      {roleBadge.label}
                    </Badge>
                  </div>
                </div>

                {/* College row (students) */}
                {role === "student" && user?.college_name && (
                  <div className="flex items-center gap-2 pt-0.5 border-t border-border/50">
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

                {/* Streak + points (students) */}
                {role === "student" && (
                  <div className="flex items-center gap-2 pt-0.5 border-t border-border/50">
                    <div className="flex-1 flex items-center justify-center gap-1.5 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Flame className="h-3.5 w-3.5 text-orange-500 flame-pulse" />
                      <span className="text-xs font-bold text-orange-400">{user?.streak ?? 0} days</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-400">{(user?.points ?? 0).toLocaleString()} pts</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="flex items-center gap-1">
                {role === "student" && <FeedbackModal compact />}
                <div className="flex-1" />
                <ThemeToggle collapsed />
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
