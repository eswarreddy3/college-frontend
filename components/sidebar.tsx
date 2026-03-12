"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
} from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/authStore"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice-mcq", label: "Practice MCQ", icon: FileQuestion },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/coding", label: "Coding", icon: Code2 },
  { href: "/company-prep", label: "Company Prep", icon: Building2 },
  { href: "/domain-programs", label: "Domain Programs", icon: Layers },
  { href: "/feed", label: "College Feed", icon: Newspaper },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
]

const collegeAdminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/feed", label: "College Feed", icon: Newspaper },
]

const superAdminNavItems = [
  { href: "/super-admin", label: "Overview", icon: Globe },
  { href: "/super-admin/colleges", label: "Colleges", icon: Building2 },
  { href: "/super-admin/students", label: "Students", icon: Users },
  { href: "/super-admin/packages", label: "Packages", icon: Package },
]

const roleBadgeConfig = {
  student: { label: "Student", className: "bg-primary/20 text-primary border-primary/30" },
  college_admin: { label: "Admin", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  super_admin: { label: "Super Admin", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()

  const role = user?.role ?? "student"
  const navItems =
    role === "super_admin"
      ? superAdminNavItems
      : role === "college_admin"
      ? collegeAdminNavItems
      : studentNavItems

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
    toast.success("Logged out successfully")
    router.replace("/login")
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
            "flex items-center h-16 px-4 border-b border-sidebar-border",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-xl gradient-bg flex items-center justify-center primary-glow-sm">
              <span className="text-xl font-bold text-primary-foreground font-serif">F</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold font-serif gradient-text">Fynity</span>
            )}
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
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  item.href !== "/admin" &&
                  item.href !== "/super-admin" &&
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
        </nav>

        {/* User section */}
        <div
          className={cn(
            "p-4 border-t border-sidebar-border space-y-3",
            isCollapsed && "px-2"
          )}
        >
          {/* Avatar + name */}
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "flex-col gap-2"
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-primary/30 flex-shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {user?.name || "User"}
                </p>
                <Badge
                  variant="outline"
                  className={cn("text-xs mt-0.5", roleBadge.className)}
                >
                  {roleBadge.label}
                </Badge>
              </div>
            )}
          </div>

          {/* Streak + Points (students only) */}
          {role === "student" && (
            <div
              className={cn(
                "flex items-center gap-4",
                isCollapsed ? "flex-col gap-2" : "justify-center"
              )}
            >
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500 flame-pulse" />
                <span className="text-sm font-semibold text-foreground">
                  {user?.streak ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-foreground">
                  {(user?.points ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Theme toggle */}
          <ThemeToggle collapsed={isCollapsed} />

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              "w-full text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors",
              isCollapsed ? "px-2 justify-center" : "justify-start gap-2"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>

        {/* Collapse button for desktop */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto mb-4 text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(false)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </aside>
    </>
  )
}
