"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  /** Rendered height in px. Width scales automatically from aspect ratio. */
  size?: number
  /** true = horizontal wordmark, false = square icon only */
  showText?: boolean
  className?: string
}

export function Logo({ size = 36, showText = true, className }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!showText) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/careerezi-icon-96.jpg"
        alt="CareerEzi"
        width={size}
        height={size}
        className={cn("flex-shrink-0 object-contain", className)}
      />
    )
  }

  // Before mount (SSR), default to dark to avoid flash
  const isLight = mounted && resolvedTheme === "light"
  const src = isLight
    ? "/careerezi-primary-light.jpg"
    : "/careerezi-primary-dark.jpg"

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="CareerEzi"
      style={{ height: size }}
      className={cn("flex-shrink-0 object-contain w-auto", className)}
    />
  )
}

/** Convenience: icon only, no text */
export function LogoIcon({ size = 36, className }: { size?: number; className?: string }) {
  return <Logo size={size} showText={false} className={className} />
}
