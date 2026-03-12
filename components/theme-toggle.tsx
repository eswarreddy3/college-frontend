"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  collapsed?: boolean
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — render only after mount
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={cn(
        "h-9 rounded-lg bg-secondary/40 animate-pulse",
        collapsed ? "w-9" : "w-full"
      )} />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border transition-all duration-200",
        "text-sm font-medium",
        collapsed ? "justify-center p-2 w-9 h-9" : "px-3 py-2 w-full",
        isDark
          ? "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/90",
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-4 h-4 flex-shrink-0">
        <Sun
          className={cn(
            "absolute inset-0 h-4 w-4 text-amber-500 transition-all duration-300",
            isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 h-4 w-4 text-primary transition-all duration-300",
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          )}
        />
      </div>
      {!collapsed && (
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      )}
    </button>
  )
}
