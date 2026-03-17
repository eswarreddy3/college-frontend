"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"

interface Props {
  points: number
  show: boolean
  onDone?: () => void
}

export function PointsBurst({ points, show, onDone }: Props) {
  useEffect(() => {
    if (show && onDone) {
      const t = setTimeout(onDone, 1800)
      return () => clearTimeout(t)
    }
  }, [show, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-2xl px-6 py-4 backdrop-blur-sm"
            initial={{ scale: 0.4, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Star className="h-7 w-7 text-amber-400 fill-amber-400" />
            <span className="text-2xl font-bold font-serif text-amber-300">+{points} pts</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
