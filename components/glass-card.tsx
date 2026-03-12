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
        hover && "card-hover primary-glow-hover cursor-pointer",
        glow && "primary-glow",
        className
      )}
    >
      {children}
    </div>
  )
}
