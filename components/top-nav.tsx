"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopNavProps {
  /** Pass a scrollTo fn on pages that have in-page sections; omit on auth pages to get href links */
  onScrollTo?: (id: string) => void
}

const navLinks = ["features", "about", "pricing", "contact"]

export function TopNav({ onScrollTo }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLink = (id: string) => {
    setMenuOpen(false)
    if (onScrollTo) {
      onScrollTo(id)
    }
  }

  const linkEl = (id: string) =>
    onScrollTo ? (
      <button
        key={id}
        onClick={() => handleLink(id)}
        className="text-sm text-muted-foreground hover:text-foreground capitalize transition-colors"
      >
        {id}
      </button>
    ) : (
      <Link
        key={id}
        href={`/#${id}`}
        className="text-sm text-muted-foreground hover:text-foreground capitalize transition-colors"
      >
        {id}
      </Link>
    )

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg primary-glow-sm flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold font-serif gradient-text">Fynity</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((id) => linkEl(id))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle collapsed />
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:brightness-110 transition-all primary-glow-hover"
          >
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-muted-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background/95 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((id) => linkEl(id))}
              <div className="flex items-center gap-3 mt-2">
                <ThemeToggle collapsed />
                <Link href="/login" className="flex-1 px-5 py-2 rounded-lg gradient-bg text-white text-sm font-medium text-center">
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
