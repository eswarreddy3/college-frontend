"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  /** Rendered height in px. Width scales automatically from aspect ratio. */
  size?: number
  /** true = horizontal wordmark, false = square icon only */
  showText?: boolean
  className?: string
}

export function Logo({ size = 36, showText = true, className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/careerezi_logo.png"
      alt="CareerEzi"
      style={showText ? { height: size } : { width: size, height: size }}
      className={cn("flex-shrink-0 object-contain", showText && "w-auto", className)}
    />
  )
}

/** Convenience: icon only, no text */
export function LogoIcon({ size = 36, className }: { size?: number; className?: string }) {
  return <Logo size={size} showText={false} className={className} />
}
