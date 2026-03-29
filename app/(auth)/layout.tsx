"use client"

import { TopNav } from "@/components/top-nav"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24 relative">
        {/* Subtle grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 w-full max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  )
}
