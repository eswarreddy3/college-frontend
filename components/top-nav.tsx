"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X, Zap } from "lucide-react"
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
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [hoveredId,  setHoveredId]  = useState<string | null>(null)
  const [activeId,   setActiveId]   = useState<string>("")
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30))

  // Active section tracker
  useEffect(() => {
    const handler = () => {
      const offset = 100
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id)
        if (el && el.getBoundingClientRect().top <= offset) {
          setActiveId(navLinks[i].id)
          return
        }
      }
      setActiveId("")
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const handleLink = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => onScrollTo?.(id), 300)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        {/* Animated gradient line at top when scrolled */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 left-0 right-0 h-[2px] origin-left"
              style={{ background: "linear-gradient(90deg, transparent, var(--primary), var(--coral), transparent)" }}
            />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          {/* Logo with glow pulse */}
          <Link href="/" className="flex-shrink-0 relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Logo size={60} />
            </motion.div>
            {/* hover glow ring */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 20px rgba(43,189,189,0.25)" }}
            />
          </Link>

          {/* Desktop nav links with floating pill */}
          <div
            className="hidden md:flex items-center gap-1"
            onMouseLeave={() => setHoveredId(null)}
          >
            {navLinks.map(({ id, label }, i) => {
              const isActive  = activeId === id
              const isHovered = hoveredId === id
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.2, duration: 0.45, ease: "easeOut" }}
                  className="relative"
                  onMouseEnter={() => setHoveredId(id)}
                >
                  {/* Floating pill background */}
                  {isHovered && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-lg bg-secondary/70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    />
                  )}

                  {onScrollTo ? (
                    <button
                      onClick={() => onScrollTo(id)}
                      className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      href={`/#${id}`}
                      className={`relative z-10 block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Desktop right CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.45 }}
            className="hidden md:flex items-center gap-2.5"
          >
            <ThemeToggle collapsed />

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link
                href="/login"
                className="relative group px-5 py-2 rounded-xl text-sm font-semibold overflow-hidden border border-primary/40 text-primary hover:text-white transition-colors duration-300"
              >
                {/* fill on hover */}
                <span className="absolute inset-0 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Log In
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-[61] w-72 bg-background/95 backdrop-blur-xl border-l border-border flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--primary), var(--coral))" }} />

              <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
                <Logo size={40} />
                <div className="flex items-center gap-2">
                  <ThemeToggle collapsed />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
                {navLinks.map(({ id, label }, i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
                    onClick={() => handleLink(id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      activeId === id
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {activeId === id && (
                        <motion.span
                          layoutId="mobile-dot"
                          className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                        />
                      )}
                      {label}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <div className="px-4 py-5 border-t border-border flex-shrink-0">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3.5 rounded-xl gradient-bg text-white text-sm font-bold flex items-center justify-center gap-2 primary-glow"
                >
                  <Zap className="w-4 h-4" />
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
