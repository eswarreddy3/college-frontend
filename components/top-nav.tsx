"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopNavProps {
  onScrollTo?: (id: string) => void
}

const navLinks = [
  { label: "Features",     id: "features" },
  { label: "For Colleges", id: "how-it-works" },
  { label: "Gamification", id: "gamification" },
  { label: "Contact",      id: "contact" },
]

export function TopNav({ onScrollTo }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 20)), [scrollY])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const handleLink = (id: string) => {
    setMenuOpen(false)
    // Small delay so the drawer closes before scrolling
    setTimeout(() => onScrollTo?.(id), 300)
  }

  const desktopLink = (id: string, label: string) =>
    onScrollTo ? (
      <button
        key={id}
        onClick={() => onScrollTo(id)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        {label}
      </button>
    ) : (
      <Link
        key={id}
        href={`/#${id}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        {label}
      </Link>
    )

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size={60} />
          </Link>

          {/* Desktop centre links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ id, label }) => desktopLink(id, label))}
          </div>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle collapsed />
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-border hover:border-primary/40 text-sm font-medium transition-all hover:bg-secondary/40"
            >
              Log In
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile right-side drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[61] w-72 bg-background border-l border-border flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
                <Logo size={40} />
                <div className="flex items-center gap-2">
                  <ThemeToggle collapsed />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
                {navLinks.map(({ id, label }, i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                    onClick={() => handleLink(id)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
                  >
                    {label}
                  </motion.button>
                ))}
              </nav>

              {/* Bottom CTAs */}
              <div className="px-5 py-5 border-t border-border flex flex-col gap-2.5 flex-shrink-0">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-xl border border-border text-sm font-medium text-center hover:border-primary/40 hover:bg-secondary/40 transition-all"
                >
                  Log In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
