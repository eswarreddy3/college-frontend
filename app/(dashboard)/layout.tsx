"use client"

import { Sidebar } from "@/components/sidebar"
import { useUIStore } from "@/store/uiStore"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isCollapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen mesh-bg">
      <Sidebar />

      {/* On mobile the sidebar is a full-screen overlay — no margin needed.
          On lg+ we shift right by the sidebar width with a smooth transition. */}
      <main
        className={cn(
          "min-h-screen transition-[padding] duration-300 ease-in-out",
          isCollapsed ? "lg:pl-[68px]" : "lg:pl-64"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
