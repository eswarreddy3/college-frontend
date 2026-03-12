"use client"

import { TopNav } from "@/components/top-nav"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen animated-gradient-bg flex flex-col">
      <TopNav />

      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        {children}
      </div>
    </div>
  )
}
