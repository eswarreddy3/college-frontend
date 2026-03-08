import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function GlassCard({ children, className, hover = false, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "glass-card rounded-xl p-6",
        hover && "transition-all duration-300 hover:border-primary/30 teal-glow-hover cursor-pointer",
        glow && "teal-glow",
        className
      )}
    >
      {children}
    </div>
  )
}
