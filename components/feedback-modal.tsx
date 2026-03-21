"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquarePlus, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

const CATEGORIES = [
  { value: "general",   label: "General" },
  { value: "bug",       label: "Bug Report" },
  { value: "feature",   label: "Feature Request" },
  { value: "content",   label: "Course / Content" },
  { value: "ui",        label: "UI / Design" },
  { value: "other",     label: "Other" },
]

interface FeedbackModalProps {
  compact?: boolean        // icon-only trigger (for collapsed sidebar)
  triggerClassName?: string
}

export function FeedbackModal({ compact, triggerClassName }: FeedbackModalProps = {}) {
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [title,    setTitle]    = useState("")
  const [message,  setMessage]  = useState("")
  const [category, setCategory] = useState("general")
  const [rating,   setRating]   = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in title and message")
      return
    }
    setLoading(true)
    try {
      await api.post("/student/feedback", { title, message, category, rating })
      toast.success("Thank you! Your feedback has been submitted.")
      setOpen(false)
      setTitle(""); setMessage(""); setCategory("general"); setRating(null)
    } catch {
      toast.error("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button
            variant="ghost"
            size="icon"
            className={cn("w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10", triggerClassName)}
            title="Share Feedback"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className={cn("w-full justify-start gap-3 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground", triggerClassName)}
          >
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            Share Feedback
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-secondary border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-foreground flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            Share Your Feedback
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background/50 border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Rating <span className="normal-case text-muted-foreground/60">(optional)</span>
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(rating === n ? null : n)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star className={cn(
                    "h-6 w-6 transition-colors",
                    rating !== null && n <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40 hover:text-amber-400/60",
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Title</label>
            <Input
              placeholder="Brief summary of your feedback"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
              className="bg-background/50 border-border text-foreground"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Message</label>
            <Textarea
              placeholder="Tell us more — what's working, what's not, what you'd love to see..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="bg-background/50 border-border text-foreground resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />}
              Submit Feedback
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
