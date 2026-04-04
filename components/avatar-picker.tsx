"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─── Avatar presets ────────────────────────────────────────────────────── */

const CLASSIC_BG  = ["b6e3f4","c0aede","d1d4f9","ffd5dc","d4edda","fff3cd","e2d9f3","cfe2ff","f8d7da","d1ecf1","fdebd0","e8f5e9"]
const PROFICIENT_BG = ["6366f1","8b5cf6","3b82f6","06b6d4","10b981","f59e0b","ec4899","14b8a6","f97316","6366f1","a855f7","22c55e"]

const CLASSIC_SEEDS  = ["Arjun","Priya","Ravi","Sneha","Kiran","Divya","Arun","Meena","Vikram","Lakshmi","Suresh","Ananya","Rahul","Pooja","Mohan","Kavya"]
const PROFICIENT_SEEDS = ["Apex","Nova","Crest","Vega","Orion","Lyra","Zeal","Nexus","Flux","Sigma","Atlas","Pixel","Prime","Delta","Storm","Cipher"]

const classic = CLASSIC_SEEDS.map((seed, i) => ({
  id: `c${i}`,
  url: `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=${CLASSIC_BG[i % CLASSIC_BG.length]}`,
}))

const proficient = PROFICIENT_SEEDS.map((seed, i) => ({
  id: `p${i}`,
  url: `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=${PROFICIENT_BG[i % PROFICIENT_BG.length]}&backgroundType=gradientLinear`,
}))

const TABS = [
  { key: "classic",    label: "Classic",    desc: "Minimal line-art style",   presets: classic    },
  { key: "proficient", label: "Proficient", desc: "Polished illustrated look", presets: proficient },
] as const

type TabKey = typeof TABS[number]["key"]

/* ─── component ─────────────────────────────────────────────────────────── */

interface AvatarPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  current?: string
}

export function AvatarPicker({ open, onClose, onSelect, current }: AvatarPickerProps) {
  const [tab, setTab]         = useState<TabKey>("classic")
  const [selected, setSelected] = useState<string>(current || "")

  const activePresets = TABS.find(t => t.key === tab)!.presets

  const handleConfirm = () => {
    if (selected) onSelect(selected)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="bg-popover border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Choose your avatar</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/60 rounded-lg">
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all",
                tab === t.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground -mt-1">
          {TABS.find(t => t.key === tab)!.desc}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-2.5 py-1 max-h-72 overflow-y-auto pr-0.5 scrollbar-hide">
          {activePresets.map((a) => {
            const isSel = selected === a.url
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelected(a.url)}
                className={cn(
                  "relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 aspect-square",
                  isSel
                    ? "border-primary ring-2 ring-primary/30 scale-105"
                    : "border-transparent hover:border-primary/40 bg-secondary/40"
                )}
              >
                <img
                  src={a.url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isSel && (
                  <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:brightness-110"
            disabled={!selected}
            onClick={handleConfirm}
          >
            Use this avatar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
