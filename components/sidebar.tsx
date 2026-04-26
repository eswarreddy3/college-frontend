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

/* ── Per-item accent colour tokens ─────────────────────────────────────── */
const C = {
  indigo:  { icon: "text-indigo-500",  bg: "bg-indigo-500/10",  text: "text-indigo-500",  hover: "hover:bg-indigo-500/10",  ghIcon: "group-hover:text-indigo-500",  bar: "bg-indigo-500"  },
  blue:    { icon: "text-blue-500",    bg: "bg-blue-500/10",    text: "text-blue-500",    hover: "hover:bg-blue-500/10",    ghIcon: "group-hover:text-blue-500",    bar: "bg-blue-500"    },
  violet:  { icon: "text-violet-500",  bg: "bg-violet-500/10",  text: "text-violet-500",  hover: "hover:bg-violet-500/10",  ghIcon: "group-hover:text-violet-500",  bar: "bg-violet-500"  },
  teal:    { icon: "text-teal-500",    bg: "bg-teal-500/10",    text: "text-teal-500",    hover: "hover:bg-teal-500/10",    ghIcon: "group-hover:text-teal-500",    bar: "bg-teal-500"    },
  orange:  { icon: "text-orange-500",  bg: "bg-orange-500/10",  text: "text-orange-500",  hover: "hover:bg-orange-500/10",  ghIcon: "group-hover:text-orange-500",  bar: "bg-orange-500"  },
  rose:    { icon: "text-rose-500",    bg: "bg-rose-500/10",    text: "text-rose-500",    hover: "hover:bg-rose-500/10",    ghIcon: "group-hover:text-rose-500",    bar: "bg-rose-500"    },
  emerald: { icon: "text-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-500", hover: "hover:bg-emerald-500/10", ghIcon: "group-hover:text-emerald-500", bar: "bg-emerald-500" },
  amber:   { icon: "text-amber-500",   bg: "bg-amber-500/10",   text: "text-amber-500",   hover: "hover:bg-amber-500/10",   ghIcon: "group-hover:text-amber-500",   bar: "bg-amber-500"   },
  slate:   { icon: "text-slate-400",   bg: "bg-slate-500/10",   text: "text-slate-400",   hover: "hover:bg-slate-500/10",   ghIcon: "group-hover:text-slate-400",   bar: "bg-slate-400"   },
} as const
type NavColor = keyof typeof C

/* ── Types ──────────────────────────────────────────────────────────────── */
type NavItem = { href: string; label: string; icon: React.ElementType }
type NavGroup = { label: string; icon: React.ElementType; items: NavItem[] }
type SuperAdminNav = { standalone: NavItem[]; groups: NavGroup[] }
type StudentNavSection = {
  type: "section"; id: string; label: string; icon: React.ElementType
  items: NavItem[]; color: NavColor; highlight?: boolean
}
type StudentNavItemBlock = { type: "item"; item: NavItem; color: NavColor; highlight?: boolean }
type StudentNavBlock = StudentNavItemBlock | StudentNavSection

/* ── Student nav blocks ─────────────────────────────────────────────────── */
const studentNavBlocks: StudentNavBlock[] = [
  { type: "item",    item: { href: "/dashboard",      label: "Dashboard",      icon: LayoutDashboard }, color: "indigo" },
  {
    type: "section", id: "learn", label: "Learn", icon: BookOpen, color: "blue", highlight: true,
    items: [
      { href: "/learn",        label: "Learn",        icon: BookOpen    },
      { href: "/practice-mcq", label: "Practice MCQ", icon: FileQuestion },
      { href: "/assignments",  label: "Assignments",  icon: ClipboardList },
    ],
  },
  {
    type: "section", id: "coding", label: "Coding", icon: Code2, color: "violet",
    items: [
      { href: "/coding", label: "Coding",   icon: Code2       },
      { href: "/lab",    label: "Code Lab", icon: FlaskConical },
    ],
  },
  { type: "item", item: { href: "/domain-programs", label: "Domain Programs", icon: Layers         }, color: "teal",    highlight: true },
  { type: "item", item: { href: "/company-prep",    label: "Company Prep",    icon: Building2      }, color: "orange"  },
  { type: "item", item: { href: "/feed",            label: "College Feed",    icon: Newspaper      }, color: "rose"    },
  { type: "item", item: { href: "/jobs",            label: "Jobs",            icon: BriefcaseBusiness }, color: "emerald" },
  { type: "item", item: { href: "/leaderboard",     label: "Leaderboard",     icon: Trophy         }, color: "amber"   },
  {
    type: "section", id: "personal", label: "Personal", icon: User, color: "slate",
    items: [
      { href: "/resume",  label: "Resume Builder", icon: FileText  },
      { href: "/report",  label: "My Report",      icon: BarChart2 },
      { href: "/profile", label: "Profile",        icon: User      },
    ],
  },
]

const studentNavItems = studentNavBlocks.flatMap((b) =>
  b.type === "item" ? [b.item] : b.items
)

/* ── Admin / super-admin nav ─────────────────────────────────────────────── */
const collegeAdminNavItems = [
  { href: "/admin",          label: "Dashboard",    icon: LayoutDashboard  },
  { href: "/admin/students", label: "Students",     icon: Users            },
  { href: "/admin/analytics",label: "Analytics",    icon: BarChart3        },
  { href: "/admin/jobs",     label: "Job Postings", icon: BriefcaseBusiness },
  { href: "/feed",           label: "College Feed", icon: Newspaper        },
]

const branchAdminNavItems = [
  { href: "/branch-admin",          label: "Dashboard",    icon: LayoutDashboard  },
  { href: "/branch-admin/students", label: "Students",     icon: Users            },
  { href: "/branch-admin/jobs",     label: "Job Postings", icon: BriefcaseBusiness },
  { href: "/feed",                  label: "College Feed", icon: Newspaper        },
]

const superAdminNav: SuperAdminNav = {
  standalone: [{ href: "/super-admin", label: "Overview", icon: Globe }],
  groups: [
    {
      label: "People & Colleges", icon: Users,
      items: [
        { href: "/super-admin/colleges",     label: "Colleges",     icon: Building2      },
        { href: "/super-admin/students",     label: "Students",     icon: Users          },
        { href: "/super-admin/branch-admins",label: "Branch Admins",icon: BarChart3      },
      ],
    },
    {
      label: "Content Management", icon: BookOpen,
      items: [
        { href: "/super-admin/courses",  label: "Courses",            icon: BookOpen  },
        { href: "/super-admin/domains",  label: "Domain Programs",    icon: Layers    },
        { href: "/super-admin/aptitude", label: "Aptitude Questions", icon: Calculator },
        { href: "/super-admin/coding",   label: "Coding Problems",    icon: Code2     },
      ],
    },
    {
      label: "Jobs & Feedback", icon: BriefcaseBusiness,
      items: [
        { href: "/super-admin/jobs",     label: "Job Postings", icon: BriefcaseBusiness },
        { href: "/super-admin/feedback", label: "Feedback",     icon: MessageSquare     },
      ],
    },
  ],
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? "http://localhost:5000"

function resolveLogoUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith("blob:") || url.startsWith("http")) return url
  return `${BACKEND}${url}`
}

const roleBadgeConfig: Record<string, { label: string; className: string }> = {
  student:      { label: "Student",      className: "bg-primary/20 text-primary border-primary/30"             },
  college_admin:{ label: "Admin",        className: "bg-amber-500/20 text-amber-400 border-amber-500/30"       },
  branch_admin: { label: "Branch Admin", className: "bg-blue-500/20 text-blue-400 border-blue-500/30"          },
  super_admin:  { label: "Super Admin",  className: "bg-purple-500/20 text-purple-400 border-purple-500/30"    },
}

/* ── Shared nav link class builder ─────────────────────────────────────── */
function navItemCls(isActive: boolean, isCollapsed: boolean, c: (typeof C)[NavColor], extra?: string) {
  return cn(
    "group relative flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer",
    isCollapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5",
    isActive
      ? cn(c.bg, c.text)
      : cn("text-muted-foreground", c.hover, "hover:text-foreground"),
    extra
  )
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const { sidebarCollapsed: isCollapsed, setSidebarCollapsed } = useUIStore()
  const setIsCollapsed = setSidebarCollapsed

  const role = user?.role ?? "student"
  const navItems =
    role === "college_admin" ? collegeAdminNavItems
    : role === "branch_admin" ? branchAdminNavItems
    : studentNavItems

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {}
    superAdminNav.groups.forEach((g) => {
      s[g.label] = g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    })
    return s
  })
  const toggleGroup = (label: string) =>
    setOpenGroups((p) => ({ ...p, [label]: !p[label] }))

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {}
    studentNavBlocks.forEach((b) => {
      if (b.type === "section")
        s[b.id] = b.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    })
    return s
  })
  const toggleSection = (id: string) =>
    setOpenSections((p) => ({ ...p, [id]: !p[id] }))

  const roleBadge = roleBadgeConfig[role] ?? roleBadgeConfig.student

  const handleLogout = () => {
    clearAuth()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile button */}
      <Button
        variant="ghost" size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden text-foreground"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[68px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ── Header ── */}
        <div className={cn(
          "flex items-center border-b border-sidebar-border flex-shrink-0",
          isCollapsed ? "flex-col justify-center gap-0.5 py-2 h-auto min-h-[4rem]" : "h-16 px-4 justify-between"
        )}>
          {isCollapsed ? (
            <>
              <Link href="/dashboard" className="flex items-center justify-center">
                <img src="/c_logo.png" alt="CareerEzi" className="w-7 h-7 object-contain" />
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                title="Expand sidebar"
                className="hidden lg:flex items-center justify-center rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 w-7 h-7"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center min-w-0">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Logo size={52} showText={true} />
                </motion.div>
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                title="Collapse sidebar"
                className="hidden lg:flex items-center justify-center rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 w-8 h-8 flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className={cn("flex-1 overflow-y-auto py-3", isCollapsed ? "px-2" : "px-3")}>

          {/* Super-admin */}
          {role === "super_admin" ? (
            <ul className="space-y-0.5">
              {superAdminNav.standalone.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={navItemCls(isActive, isCollapsed, C.indigo)}>
                      {isActive && !isCollapsed && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />}
                      <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-colors", isActive ? C.indigo.icon : cn("text-muted-foreground", C.indigo.ghIcon))} />
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
              {superAdminNav.groups.map((group) => {
                const isGroupOpen = openGroups[group.label] ?? false
                const hasActiveChild = group.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
                return (
                  <li key={group.label}>
                    <button onClick={() => !isCollapsed && toggleGroup(group.label)}
                      title={isCollapsed ? group.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl transition-all duration-200",
                        isCollapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5",
                        hasActiveChild ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                      )}>
                      <group.icon className={cn("h-4 w-4 flex-shrink-0", hasActiveChild && "text-primary")} />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">{group.label}</span>
                          <ChevronDown className={cn("h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200", isGroupOpen && "rotate-180")} />
                        </>
                      )}
                    </button>
                    {(isCollapsed || isGroupOpen) && (
                      <ul className={cn("space-y-0.5", !isCollapsed && "mt-0.5 ml-3 pl-3 border-l border-sidebar-border")}>
                        {group.items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                          return (
                            <li key={item.href}>
                              <Link href={item.href} onClick={() => setIsMobileOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                className={navItemCls(isActive, isCollapsed, C.indigo)}>
                                {isActive && !isCollapsed && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-indigo-500 rounded-r-full" />}
                                <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-colors", isActive ? C.indigo.icon : cn("text-muted-foreground", C.indigo.ghIcon))} />
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

          /* Student nav */
          ) : role === "student" ? (
            <ul className="space-y-0.5">
              {studentNavBlocks.map((block) => {
                const c = C[block.color]

                /* ── Standalone item ── */
                if (block.type === "item") {
                  const { item, highlight } = block
                  const isActive = pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setIsMobileOpen(false)}
                        title={isCollapsed ? item.label : undefined}
                        className={navItemCls(isActive, isCollapsed, c)}>
                        {isActive && !isCollapsed && <span className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full", c.bar)} />}
                        <item.icon className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? c.icon : cn("text-muted-foreground", c.ghIcon)
                        )} />
                        {!isCollapsed && (
                          <span className={cn("text-sm flex-1 transition-colors", highlight ? "font-semibold" : "font-medium")}>
                            {item.label}
                          </span>
                        )}
                        {!isCollapsed && highlight && !isActive && (
                          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none", c.bg, c.text)}>
                            NEW
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                }

                /* ── Section block ── */
                const section = block
                const isSectionOpen = openSections[section.id] ?? false
                const hasActiveChild = section.items.some(
                  (i) => pathname === i.href || pathname.startsWith(i.href + "/")
                )

                return (
                  <li key={section.id}>
                    {/* Section header */}
                    {isCollapsed
                      ? <div className="h-px bg-border/40 mx-1 my-1.5" />
                      : (
                        <button onClick={() => toggleSection(section.id)}
                          className={cn(
                            "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                            section.highlight
                              ? cn("text-foreground", c.hover)
                              : hasActiveChild
                              ? "text-foreground"
                              : cn("text-muted-foreground", c.hover, "hover:text-foreground")
                          )}>
                          <section.icon className={cn(
                            "h-4 w-4 flex-shrink-0 transition-colors",
                            section.highlight || hasActiveChild ? c.icon : cn("text-muted-foreground", c.ghIcon)
                          )} />
                          <span className={cn("flex-1 text-left transition-colors", section.highlight ? "text-sm font-semibold" : "text-sm font-medium")}>
                            {section.label}
                          </span>
                          <ChevronDown className={cn(
                            "h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 text-muted-foreground",
                            isSectionOpen && "rotate-180"
                          )} />
                        </button>
                      )
                    }

                    {/* Section items */}
                    {(isCollapsed || isSectionOpen) && (
                      <ul className={cn("space-y-0.5", !isCollapsed && "mt-0.5 ml-3 pl-3 border-l border-sidebar-border/70")}>
                        {section.items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                          return (
                            <li key={item.href}>
                              <Link href={item.href} onClick={() => setIsMobileOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                className={navItemCls(isActive, isCollapsed, c, !isCollapsed ? "py-2" : undefined)}>
                                {isActive && !isCollapsed && <span className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full", c.bar)} />}
                                <item.icon className={cn(
                                  "h-4 w-4 flex-shrink-0 transition-colors",
                                  isActive ? c.icon : cn("text-muted-foreground", c.ghIcon)
                                )} />
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

          /* College / branch admin nav */
          ) : (
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/admin" && item.href !== "/branch-admin" &&
                   pathname.startsWith(item.href + "/"))
                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={navItemCls(isActive, isCollapsed, C.indigo)}>
                      {isActive && !isCollapsed && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />}
                      <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-colors", isActive ? C.indigo.icon : cn("text-muted-foreground", C.indigo.ghIcon))} />
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </nav>

        {/* ── User / footer section ── */}
        <div className="border-t border-sidebar-border p-2 flex-shrink-0">
          {isCollapsed ? (
            /* Collapsed — avatar + theme + logout only */
            <div className="flex flex-col items-center gap-1.5 py-1">
              <UserAvatar name={user?.name || "U"} photoUrl={user?.avatar} size="sm" points={user?.points} />
              <ThemeToggle collapsed />
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Expanded */
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
                      {resolveLogoUrl(user.college_logo_url)
                        ? <img src={resolveLogoUrl(user.college_logo_url)!} alt={user.college_name} className="w-full h-full object-cover" />
                        : <span className="text-[9px] font-bold text-muted-foreground">{user.college_name[0].toUpperCase()}</span>
                      }
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
                  title="Logout"
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
