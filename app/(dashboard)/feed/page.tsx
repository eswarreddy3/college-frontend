"use client"

import { useState, useEffect, useCallback, useRef, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import {
  PenLine, BookOpen, Clock, ChevronLeft, ChevronRight,
  Loader2, Trash2, ImagePlus, Tag, Newspaper,
  Share2, X, Sparkles, Globe, MessageCircle, ExternalLink, Bell,
  ShieldCheck, Megaphone, TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Author {
  id: number; name: string; role: string; branch: string | null
  passout_year: number | null; avatar?: string | null; points?: number
}
interface Post {
  id: number; type: "post" | "blog"; title: string | null; content: string
  cover_image_url: string | null; reading_time: number; tags: string[]
  like_count: number; comment_count: number; liked_by_me: boolean
  is_published: boolean; author: Author; created_at: string
}

// ── Reactions ─────────────────────────────────────────────────────────────────
const REACTIONS = [
  { id: "like",      emoji: "👍", label: "Like",      color: "#8B5CF6" },
  { id: "love",      emoji: "❤️", label: "Love",      color: "#EF4444" },
  { id: "celebrate", emoji: "🎉", label: "Celebrate", color: "#F59E0B" },
  { id: "fire",      emoji: "🔥", label: "Fire",      color: "#F97316" },
  { id: "clap",      emoji: "👏", label: "Clap",      color: "#10B981" },
] as const
type ReactionId = typeof REACTIONS[number]["id"]
type Reaction   = typeof REACTIONS[number]

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function richToast(emoji: string, title: string, sub: string) {
  toast.custom(() => (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-popover shadow-2xl min-w-[290px]">
      <div className="text-2xl leading-none flex-shrink-0">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
        {sub && <p className="text-xs text-muted-foreground truncate mt-0.5">{sub}</p>}
      </div>
    </div>
  ), { duration: 3000 })
}

function isAdminAuthor(role: string) {
  return role === "college_admin" || role === "branch_admin"
}
function adminLabel(role: string) {
  return role === "branch_admin" ? "Branch Admin" : "College Admin"
}

// ── Reaction Picker Button ────────────────────────────────────────────────────
function ReactionPickerButton({
  liked, likeCount, activeReaction, onReact,
}: {
  liked: boolean
  likeCount: number
  activeReaction: Reaction | null
  onReact: (rid: ReactionId) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [bouncing,   setBouncing]   = useState(false)
  const openTimer  = useRef<ReturnType<typeof setTimeout>>()
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()

  const openPicker  = () => { clearTimeout(closeTimer.current); openTimer.current  = setTimeout(() => setShowPicker(true),  450) }
  const closePicker = () => { clearTimeout(openTimer.current);  closeTimer.current = setTimeout(() => setShowPicker(false), 220) }

  const fireBounce = () => { setBouncing(true); setTimeout(() => setBouncing(false), 600) }

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (showPicker) return
    fireBounce()
    onReact(activeReaction?.id ?? "like")
  }

  const handlePickerSelect = (e: MouseEvent, rid: ReactionId) => {
    e.stopPropagation()
    setShowPicker(false)
    fireBounce()
    onReact(rid)
  }

  const display = activeReaction ?? REACTIONS[0]

  return (
    <div className="relative" onMouseEnter={openPicker} onMouseLeave={closePicker}>
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="absolute bottom-full left-0 mb-2 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl bg-popover border border-border shadow-2xl z-50"
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={closePicker}
          >
            {REACTIONS.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.045, type: "spring", stiffness: 480, damping: 18 }}
                whileHover={{ scale: 1.38, y: -5 }}
                className="relative p-1.5 text-xl rounded-xl hover:bg-secondary/60 group"
                onClick={e => handlePickerSelect(e, r.id as ReactionId)}
              >
                {r.emoji}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-foreground text-background px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {r.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        animate={bouncing ? { scale: [1, 1.38, 0.82, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-xl select-none overflow-hidden",
          liked ? "" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
        )}
        style={liked ? {
          color: activeReaction?.color ?? "var(--primary)",
          backgroundColor: `${activeReaction?.color ?? "var(--primary)"}18`,
        } : {}}
      >
        <span className="text-base leading-none">{liked ? display.emoji : "👍"}</span>
        <span>{likeCount > 0 ? likeCount : "Like"}</span>
      </motion.button>
    </div>
  )
}

// ── Trending Topics ───────────────────────────────────────────────────────────
const TAG_EMOJIS: Record<string, string> = {
  placement: "💼", event: "🎉", events: "🎉", doubt: "🤔", doubts: "🤔",
  technical: "💻", coding: "💻", interview: "🎯", resume: "📄",
  internship: "🏢", job: "💼", jobs: "💼", exam: "📝", result: "🏆",
  sports: "⚽", cultural: "🎭", hackathon: "🚀", project: "🔧", news: "📰",
}
const DEFAULT_TOPICS = [
  { tag: "placement", emoji: "💼" }, { tag: "events", emoji: "🎉" },
  { tag: "coding", emoji: "💻" },    { tag: "internship", emoji: "🏢" },
  { tag: "hackathon", emoji: "🚀" }, { tag: "interview", emoji: "🎯" },
]

function TrendingTopics({ posts, loading }: { posts: Post[]; loading: boolean }) {
  const topics = loading ? [] : (() => {
    const counts = new Map<string, number>()
    posts.forEach(p => p.tags.forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1)))
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    if (sorted.length === 0) return DEFAULT_TOPICS.map(t => ({ ...t, count: 0 }))
    return sorted.map(([tag, count]) => ({ tag, count, emoji: TAG_EMOJIS[tag.toLowerCase()] ?? "🏷️" }))
  })()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm font-bold text-foreground">Trending in College</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {loading
          ? [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-2xl flex-shrink-0" />
            ))
          : topics.map((topic, i) => (
              <motion.div
                key={topic.tag}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 320, damping: 24 }}
                whileHover={{ scale: 1.06, y: -2 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-secondary/50 border border-border/60 hover:border-primary/40 hover:bg-primary/8 transition-colors cursor-pointer flex-shrink-0 group"
              >
                <span className="text-sm leading-none">{topic.emoji}</span>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                  #{topic.tag}
                </span>
                {"count" in topic && (topic as any).count > 0 && (
                  <span className="text-[10px] text-muted-foreground/50">{(topic as any).count}</span>
                )}
              </motion.div>
            ))
        }
      </div>
    </div>
  )
}

// ── Featured Announcement Card ────────────────────────────────────────────────
function FeaturedAnnouncementCard({
  post, onLike, onDelete, currentUserId, reactions, onShare, collegeLogoUrl,
}: {
  post: Post
  onLike: (id: number, rid: ReactionId) => void
  onDelete: (id: number) => void
  currentUserId: number
  reactions: Map<number, Reaction>
  onShare: (post: Post) => void
  collegeLogoUrl?: string | null
}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const limit = 280
  const shouldTruncate = post.content.length > limit
  const displayContent = !expanded && shouldTruncate ? post.content.slice(0, limit) + "…" : post.content
  const activeReaction = reactions.get(post.id) ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      whileHover={{ scale: 1.008 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => router.push(`/feed/post/${post.id}`)}
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.07) 50%, rgba(99,102,241,0.05) 100%)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.25), 0 0 40px rgba(99,102,241,0.1), 0 0 60px rgba(139,92,246,0.06)",
      }}
    >
      {/* Animated gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #8b5cf6, #6366f1)" }} />

      {/* College logo watermark */}
      {collegeLogoUrl && (
        <div className="absolute right-5 top-5 opacity-[0.05] pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={collegeLogoUrl} alt="" className="w-20 h-20 object-contain" />
        </div>
      )}

      <div className="p-5">
        {/* Banner chip */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/20 to-coding/20 border border-primary/30">
            <Megaphone className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#a78bfa" }}>
              Official Announcement
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <UserAvatar
              name={post.author.name}
              photoUrl={post.author.avatar}
              size="md"
              points={post.author.points}
              fallbackClassName="bg-primary/20 text-primary"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-primary ring-2 ring-card">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-bold text-foreground">{post.author.name}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary">
                {adminLabel(post.author.role)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-2.5 w-2.5 opacity-60" />
              <span>All students</span>
            </div>
          </div>
          {post.author.id === currentUserId && (
            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
              onClick={e => { e.stopPropagation(); onDelete(post.id) }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Cover image */}
        {post.cover_image_url && (
          <div className="relative -mx-5 mb-4 h-44 overflow-hidden" style={{ width: "calc(100% + 2.5rem)", marginLeft: "-1.25rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Title */}
        {post.title && (
          <h3 className="font-bold font-serif text-foreground text-xl mb-2 leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        )}

        {/* Content */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {displayContent}
          {shouldTruncate && (
            <button
              className="text-primary font-semibold ml-1 hover:underline"
              onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
            >
              {expanded ? " see less" : " see more"}
            </button>
          )}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-medium border text-primary/80 bg-primary/10 border-primary/15">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction stats */}
        {post.like_count > 0 && (
          <div className="flex items-center gap-2 py-2.5 mb-2 border-t border-primary/15">
            <span className="flex -space-x-0.5">{REACTIONS.slice(0, 2).map(r => <span key={r.id} className="text-sm">{r.emoji}</span>)}</span>
            <span className="text-xs text-muted-foreground">{post.like_count} reaction{post.like_count !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
          <ReactionPickerButton
            liked={post.liked_by_me}
            likeCount={post.like_count}
            activeReaction={activeReaction}
            onReact={rid => onLike(post.id, rid)}
          />
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all px-3 py-1.5 rounded-xl"
            onClick={() => router.push(`/feed/post/${post.id}`)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comment_count > 0 ? post.comment_count : "Comment"}</span>
          </button>
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all px-3 py-1.5 rounded-xl ml-auto"
            onClick={() => onShare(post)}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Create Post Panel ─────────────────────────────────────────────────────────
function CreatePostPanel({ user, onCreated }: { user: any; onCreated: (p: Post) => void }) {
  const [tab,            setTab]            = useState<"post" | "blog">("post")
  const [open,           setOpen]           = useState(false)
  const [content,        setContent]        = useState("")
  const [title,          setTitle]          = useState("")
  const [tags,           setTags]           = useState("")
  const [coverUrl,       setCoverUrl]       = useState("")
  const [notifyStudents, setNotifyStudents] = useState(false)
  const [submitting,     setSubmitting]     = useState(false)

  const isAdmin = user?.role === "college_admin" || user?.role === "branch_admin"
  const notifyLabel   = user?.role === "branch_admin" ? "Notify branch students via email" : "Notify all students via email"
  const notifyOnLabel = user?.role === "branch_admin" ? "Email ON — branch students notified" : "Email ON — all students notified"

  const submit = async (publish: boolean) => {
    if (!content.trim()) { toast.error("Content is required"); return }
    if (tab === "blog" && !title.trim()) { toast.error("Blog title is required"); return }
    setSubmitting(true)
    try {
      const res = await api.post("/feed/posts", {
        type: tab,
        content: content.trim(),
        title: tab === "blog" ? title.trim() : undefined,
        cover_image_url: tab === "blog" && coverUrl.trim() ? coverUrl.trim() : undefined,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        is_published: publish,
        notify_students: publish && isAdmin ? notifyStudents : false,
      })
      const { points_earned, ...postData } = res.data
      onCreated(postData)
      setContent(""); setTitle(""); setTags(""); setCoverUrl(""); setNotifyStudents(false); setOpen(false)
      const desc = publish && points_earned > 0
        ? `Your college community can see it now — +${points_earned} pts`
        : publish ? "Your college community can see it now" : "You can publish it anytime"
      richToast(publish ? "✨" : "📝", publish ? "Your post is live!" : "Draft saved", desc)
    } catch {
      toast.error("Failed to publish")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GlassCard className="border-border/60 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(true)}
            className="w-full flex items-center gap-3 text-left"
          >
            <UserAvatar name={user?.name ?? "U"} photoUrl={user?.avatar} size="md" points={user?.points} />
            <span className="flex-1 px-4 py-3 rounded-full bg-secondary/40 border border-border text-muted-foreground text-sm hover:border-primary/40 hover:bg-secondary/60 transition-all">
              What&apos;s on your mind, {user?.name?.split(" ")[0] ?? "there"}?
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, opacity: { duration: 0.2 } }}
            className="space-y-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar name={user?.name ?? "U"} photoUrl={user?.avatar} size="md" points={user?.points} />
                <div>
                  <p className="text-sm font-bold text-foreground">{user?.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Globe className="h-3 w-3" />
                    <span>Anyone in your college</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2">
              {([
                { val: "post" as const, label: "Post", icon: PenLine },
                { val: "blog" as const, label: "Blog", icon: BookOpen },
              ] as const).map(t => (
                <button
                  key={t.val}
                  onClick={() => setTab(t.val)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",
                    tab === t.val && t.val === "post"
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : tab === t.val && t.val === "blog"
                      ? "bg-coding/15 border-coding/40 text-coding"
                      : "border-border text-muted-foreground hover:bg-secondary/60"
                  )}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Blog-specific */}
            <AnimatePresence>
              {tab === "blog" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-0 overflow-hidden divide-y divide-border/50 rounded-xl border border-border/50 bg-secondary/20"
                >
                  {/* Blog title — writing element, px-4 */}
                  <Input
                    placeholder="Blog title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="bg-transparent border-0 rounded-none px-4 py-3 text-xl font-bold font-serif placeholder:text-muted-foreground/40 focus-visible:ring-0 h-auto"
                  />
                  {/* Cover URL — metadata, icon inside, pl-10 */}
                  {/* <div className="relative">
                    <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Cover image URL (optional)"
                      value={coverUrl}
                      onChange={e => setCoverUrl(e.target.value)}
                      className="pl-10 bg-transparent border-0 rounded-none focus-visible:ring-0"
                    />
                  </div> */}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content — writing element, px-4 aligns with blog title */}
            <Textarea
              placeholder={tab === "post" ? "Share something with your college..." : "Write your blog content here..."}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={tab === "blog" ? 8 : 4}
              className="bg-transparent border-0 resize-none px-4 py-0 text-base placeholder:text-muted-foreground/50 focus-visible:ring-0"
            />

            {/* Tags — metadata, icon inside, pl-10 aligns with cover URL */}
            <div className="relative pt-1 border-t border-border/60">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" style={{ top: "calc(50% + 2px)" }} />
              <Input
                placeholder="Tags: placement, event, doubt (comma separated)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="pl-10 bg-transparent border-0 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-0 h-auto py-2"
              />
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setNotifyStudents(v => !v)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                  notifyStudents
                    ? "bg-warning/15 border-warning/40 text-warning"
                    : "border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Bell className={cn("h-4 w-4 flex-shrink-0", notifyStudents && "fill-warning")} />
                <span className="flex-1 text-left">{notifyStudents ? notifyOnLabel : notifyLabel}</span>
                <span className={cn(
                  "ml-auto w-9 h-5 rounded-full border-2 transition-colors flex items-center px-0.5",
                  notifyStudents ? "bg-warning border-warning" : "bg-transparent border-border"
                )}>
                  <span className={cn(
                    "w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200",
                    notifyStudents ? "translate-x-4" : "translate-x-0"
                  )} />
                </span>
              </button>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              {tab === "blog" && (
                <Button variant="outline" size="sm" onClick={() => submit(false)} disabled={submitting} className="rounded-full border-border">
                  Save Draft
                </Button>
              )}
              <Button
                size="sm" onClick={() => submit(true)} disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
              >
                {submitting
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Sparkles className="h-4 w-4 mr-1.5" />Publish</>
                }
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({
  post, onLike, onDelete, currentUserId, reactions, onShare,
}: {
  post: Post
  onLike: (id: number, rid: ReactionId) => void
  onDelete: (id: number) => void
  currentUserId: number
  reactions: Map<number, Reaction>
  onShare: (post: Post) => void
}) {
  const router = useRouter()
  const isBlog     = post.type === "blog"
  const isOfficial = isAdminAuthor(post.author.role)
  const [expanded, setExpanded] = useState(false)
  const limit = 220
  const shouldTruncate = post.content.length > limit
  const displayContent = !expanded && shouldTruncate ? post.content.slice(0, limit) + "…" : post.content
  const activeReaction = reactions.get(post.id) ?? null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.012, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group",
        "bg-card border backdrop-blur-sm transition-shadow duration-300",
        isOfficial
          ? "border-warning/30 hover:border-warning/50 shadow-[0_0_20px_rgba(245,158,11,0.06)] hover:shadow-[0_0_32px_rgba(245,158,11,0.12)]"
          : "border-border/70 hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
      )}
      onClick={() => router.push(`/feed/post/${post.id}`)}
    >
      {/* Top gradient accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px]",
        isOfficial
          ? "bg-gradient-to-r from-warning/80 via-warning/40 to-warning/80"
          : isBlog
          ? "bg-gradient-to-r from-coding via-coral/60 to-coding"
          : "bg-gradient-to-r from-primary/80 via-primary/40 to-primary/80"
      )} />

      {/* Official announcement chip */}
      {isOfficial && (
        <div className="px-5 pt-4 pb-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Megaphone className="h-3 w-3 text-warning" />
            <span className="text-[10px] font-bold text-warning tracking-wider uppercase">Official Announcement</span>
          </div>
        </div>
      )}

      <div className={cn("p-5", isOfficial && "pt-2")}>
        {/* Cover image */}
        {isBlog && post.cover_image_url && (
          <div className="relative -mx-5 -mt-1 mb-4 h-44 overflow-hidden" style={{ width: "calc(100% + 2.5rem)", marginLeft: "-1.25rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url} alt={post.title ?? ""}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        )}

        {/* Author row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <UserAvatar
                name={post.author.name}
                photoUrl={post.author.avatar}
                size="md"
                points={post.author.points}
                fallbackClassName={cn(isOfficial ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary")}
              />
              {isOfficial && (
                <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-warning ring-2 ring-card">
                  <ShieldCheck className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none mb-1">
                <p className="text-sm font-bold text-foreground">{post.author.name}</p>
                {isOfficial && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-warning/15 border border-warning/30 text-warning">
                    {adminLabel(post.author.role)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {!isOfficial && <span>{post.author.branch ?? "Student"}</span>}
                {!isOfficial && <span className="opacity-40">·</span>}
                <span>{timeAgo(post.created_at)}</span>
                <span className="opacity-40">·</span>
                <Globe className="h-2.5 w-2.5 opacity-60" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(
              "text-xs flex items-center gap-1 rounded-full",
              isBlog ? "bg-coding/10 border-coding/30 text-coding" : "bg-primary/10 border-primary/30 text-primary"
            )}>
              {isBlog ? <BookOpen className="h-3 w-3" /> : <PenLine className="h-3 w-3" />}
              {isBlog ? "Blog" : "Post"}
            </Badge>
            {post.author.id === currentUserId && (
              <button
                className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
                onClick={e => { e.stopPropagation(); onDelete(post.id) }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        {post.title && (
          <h3 className={cn(
            "font-bold font-serif text-foreground text-lg mb-2 leading-snug transition-colors",
            isOfficial ? "group-hover:text-warning" : "group-hover:text-primary"
          )}>
            {post.title}
          </h3>
        )}

        {/* Content */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {displayContent}
          {shouldTruncate && (
            <button
              className="text-primary font-semibold ml-1 hover:underline"
              onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
            >
              {expanded ? " see less" : " see more"}
            </button>
          )}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className={cn(
                "text-xs px-2.5 py-0.5 rounded-full font-medium border",
                isOfficial
                  ? "text-warning/80 bg-warning/10 border-warning/15"
                  : "text-primary/80 bg-primary/10 border-primary/15"
              )}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction stats row with hover breakdown */}
        {(post.like_count > 0 || post.comment_count > 0) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-3 mb-3 border-t border-border/40 pt-3">
            {post.like_count > 0 && (
              <div className="flex items-center gap-1.5 relative group/rxn cursor-default">
                <span className="flex -space-x-0.5">
                  {REACTIONS.slice(0, 2).map(r => (
                    <span key={r.id} className="text-sm leading-none">{r.emoji}</span>
                  ))}
                </span>
                <span className="font-medium">{post.like_count}</span>
                {/* Hover breakdown */}
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 rounded-xl bg-popover border border-border shadow-xl opacity-0 group-hover/rxn:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <p className="text-xs font-semibold text-foreground mb-1.5">{post.like_count} reaction{post.like_count !== 1 ? "s" : ""}</p>
                  <div className="flex gap-2">
                    {REACTIONS.map(r => (
                      <span key={r.id} className="text-base">{r.emoji}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {post.comment_count > 0 && (
              <span>{post.comment_count} comment{post.comment_count !== 1 ? "s" : ""}</span>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
          <ReactionPickerButton
            liked={post.liked_by_me}
            likeCount={post.like_count}
            activeReaction={activeReaction}
            onReact={rid => onLike(post.id, rid)}
          />
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all px-3 py-1.5 rounded-xl"
            onClick={() => router.push(`/feed/post/${post.id}`)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comment_count > 0 ? post.comment_count : "Comment"}</span>
          </button>
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all px-3 py-1.5 rounded-xl ml-auto"
            onClick={() => onShare(post)}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          {isBlog && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2 ml-1">
              <Clock className="h-3.5 w-3.5" />
              {post.reading_time}m
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-1.5" />
      <Skeleton className="h-4 w-5/6 mb-5" />
      <div className="flex gap-2 pt-3 border-t border-border/40">
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-16 rounded-xl ml-auto" />
      </div>
    </div>
  )
}

// ── Animated Tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { value: "all",  label: "✦ All"  },
  { value: "post", label: "Posts"  },
  { value: "blog", label: "Blogs"  },
]

function AnimatedTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-2xl">
      {TABS.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative px-4 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200",
            value === tab.value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === tab.value && (
            <motion.div
              layoutId="tab-active-bg"
              className="absolute inset-0 rounded-xl bg-primary"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Social panel types & helpers ──────────────────────────────────────────────
interface CollegeInfo {
  id: number; name: string; location: string | null
  linkedin_url: string | null; linkedin_post_embeds: string[]
  instagram_url: string | null; instagram_post_embeds: string[]
  logo_url?: string | null
}
interface IgPost {
  shortcode: string; url: string; thumbnail: string
  caption: string; likes: number; is_video: boolean; timestamp: number
}
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

function igProxy(src: string) {
  return `${API_URL}/student/ig-image?url=${encodeURIComponent(src)}`
}
function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

// ── Instagram tile ────────────────────────────────────────────────────────────
function IgTile({ post }: { post: IgPost }) {
  const [broken, setBroken] = useState(false)
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer"
      className="relative aspect-square overflow-hidden group block bg-secondary/20 rounded-sm">
      {!broken ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={igProxy(post.thumbnail)} alt={post.caption || "Post"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setBroken(true)} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex flex-col items-center justify-center gap-1 p-2">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
              {post.is_video && <div className="text-white text-lg mb-1">▶</div>}
              {post.likes > 0 && <span className="text-white text-xs font-bold drop-shadow">❤ {fmtNum(post.likes)}</span>}
              {post.caption && <p className="text-white text-[10px] leading-tight mt-1 line-clamp-2 drop-shadow">{post.caption}</p>}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2"
          style={{ background: "linear-gradient(135deg,rgba(240,148,51,0.18),rgba(188,24,136,0.18))" }}>
          <span className="text-xl mb-1">{post.is_video ? "▶" : "🖼"}</span>
          {post.likes > 0 && <span className="text-[10px] font-bold text-foreground/60">❤ {fmtNum(post.likes)}</span>}
        </div>
      )}
    </a>
  )
}

function toIgEmbedUrl(url: string): string {
  const match = url.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/)
  if (match) return `https://www.instagram.com/p/${match[1]}/embed/`
  if (url.includes("/embed/")) return url
  return url.endsWith("/") ? url + "embed/" : url + "/embed/"
}

// ── Instagram panel ───────────────────────────────────────────────────────────
function InstagramPanel({
  collegeInfo, igPosts, loading, height = 600,
}: { collegeInfo: CollegeInfo; igPosts: IgPost[]; loading: boolean; height?: number }) {
  const profileUrl = collegeInfo.instagram_url!
  const embeds = collegeInfo.instagram_post_embeds ?? []
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#E1306C]/25 shadow-xl"
      style={{ height, background: "linear-gradient(160deg,rgba(240,148,51,0.06),rgba(188,24,136,0.06),rgba(10,15,30,0.8))" }}>
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#E1306C]/15"
        style={{ background: "linear-gradient(90deg,rgba(240,148,51,0.12),rgba(188,24,136,0.12))" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow"
            style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
            <span className="text-white text-xs font-bold leading-none">◉</span>
          </div>
          <span className="text-sm font-bold" style={{ color: "#E1306C" }}>Instagram</span>
          {collegeInfo.name && (
            <span className="text-[11px] text-muted-foreground">· {collegeInfo.name}</span>
          )}
        </div>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white hover:opacity-80 transition-opacity"
          style={{ background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)" }}>
          Follow <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-3 gap-0.5 p-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-secondary/40 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : igPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-0.5 p-0.5">
              {igPosts.map(p => <IgTile key={p.shortcode} post={p} />)}
            </div>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-t border-[#E1306C]/15 hover:bg-[#E1306C]/8 transition-colors"
              style={{ color: "#E1306C" }}>
              View all on Instagram <ExternalLink className="h-3 w-3" />
            </a>
          </>
        ) : embeds.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 p-2">
              {embeds.map((url, i) => (
                <iframe key={i} src={toIgEmbedUrl(url)} className="w-full rounded-xl border-0"
                  style={{ minHeight: 480 }} scrolling="no" allowFullScreen />
              ))}
            </div>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-t border-[#E1306C]/15 hover:bg-[#E1306C]/8 transition-colors"
              style={{ color: "#E1306C" }}>
              View all on Instagram <ExternalLink className="h-3 w-3" />
            </a>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
            <div className="text-4xl">📷</div>
            <p className="text-xs text-muted-foreground text-center">Posts temporarily unavailable — try again shortly.</p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)" }}>
              Open on Instagram
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ── LinkedIn panel ────────────────────────────────────────────────────────────
function LinkedInPanel({ collegeInfo, height = 600 }: { collegeInfo: CollegeInfo; height?: number }) {
  const embeds = collegeInfo.linkedin_post_embeds ?? []
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#0A66C2]/25 shadow-xl"
      style={{ height, background: "linear-gradient(160deg,rgba(10,102,194,0.06),rgba(10,15,30,0.85))" }}>
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#0A66C2]/15 bg-[#0A66C2]/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center shadow">
            <span className="text-white text-xs font-extrabold leading-none">in</span>
          </div>
          <span className="text-sm font-bold text-[#0A66C2]">LinkedIn</span>
        </div>
        {collegeInfo.linkedin_url && (
          <a href={collegeInfo.linkedin_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2] border border-[#0A66C2]/40 px-3 py-1.5 rounded-full hover:bg-[#0A66C2]/15 transition-colors">
            View Profile <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {embeds.length > 0 ? (
          <div className="flex flex-col gap-0 divide-y divide-[#0A66C2]/10">
            {embeds.map((src, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/6">
                  <span className="text-[10px] font-semibold text-[#0A66C2]/70">Post #{i + 1}</span>
                </div>
                <iframe src={src} className="w-full border-0 block" style={{ height: 460 }}
                  allowFullScreen title={`LinkedIn post ${i + 1}`} />
              </div>
            ))}
          </div>
        ) : collegeInfo.linkedin_url ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-extrabold">in</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-1">LinkedIn Profile</p>
              <p className="text-xs text-muted-foreground">No posts embedded yet. Visit the profile to see latest updates.</p>
            </div>
            <a href={collegeInfo.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0A66C2] px-5 py-2.5 rounded-full hover:bg-[#0A66C2]/90 transition-colors">
              Open LinkedIn <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-muted-foreground">No LinkedIn content configured.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Feed list animation variants ──────────────────────────────────────────────
const feedVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// ── Main Feed Page ────────────────────────────────────────────────────────────
export default function FeedPage() {
  const { user } = useAuthStore()
  const [posts,          setPosts]          = useState<Post[]>([])
  const [loading,        setLoading]        = useState(true)
  const [filter,         setFilter]         = useState("all")
  const [page,           setPage]           = useState(1)
  const [totalPages,     setTotalPages]     = useState(1)
  const [postReactions,  setPostReactions]  = useState<Map<number, Reaction>>(new Map())
  const [collegeInfo,    setCollegeInfo]    = useState<CollegeInfo | null>(null)
  const [igPosts,        setIgPosts]        = useState<IgPost[]>([])
  const [socialsLoading, setSocialsLoading] = useState(false)

  const fetchPosts = useCallback((p: number, type: string) => {
    setLoading(true)
    const params: Record<string, string | number> = { page: p }
    if (type !== "all") params.type = type
    api.get("/feed/posts", { params })
      .then(res => { setPosts(res.data.posts); setTotalPages(res.data.pages) })
      .catch(() => toast.error("Failed to load feed"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPosts(page, filter) }, [page, filter, fetchPosts])

  useEffect(() => {
    api.get("/student/college-info").then(res => setCollegeInfo(res.data)).catch(() => {})
    setSocialsLoading(true)
    api.get("/student/college-social-posts")
      .then(res => { setIgPosts(res.data.instagram ?? []) })
      .catch(() => {})
      .finally(() => setSocialsLoading(false))
  }, [])

  const handleLike = async (postId: number, reactionId: ReactionId) => {
    try {
      const res      = await api.post(`/feed/posts/${postId}/like`)
      const liked    = res.data.liked as boolean
      const reaction = REACTIONS.find(r => r.id === reactionId)!
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, liked_by_me: liked, like_count: res.data.like_count } : p
      ))
      setPostReactions(prev => {
        const next = new Map(prev)
        if (liked) next.set(postId, reaction); else next.delete(postId)
        return next
      })
      if (liked) {
        const post = posts.find(p => p.id === postId)
        if (post && post.author.id !== user?.id)
          richToast(reaction.emoji, `You reacted ${reaction.label}`, `to ${post.author.name}'s post`)
      }
    } catch { toast.error("Failed to react") }
  }

  const handleDelete = async (postId: number) => {
    try {
      await api.delete(`/feed/posts/${postId}`)
      setPosts(prev => prev.filter(p => p.id !== postId))
      richToast("🗑️", "Post deleted", "Your post has been removed")
    } catch { toast.error("Failed to delete") }
  }

  const handleShare = (post: Post) => {
    navigator.clipboard.writeText(`${window.location.origin}/feed/post/${post.id}`)
      .then(() => richToast("🔗", "Link copied!", "Share it with your friends"))
  }

  const handleFilterChange = (val: string) => { setFilter(val); setPage(1) }

  const handleCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
  }

  // Separate admin posts and regular posts
  const adminPosts   = posts.filter(p => isAdminAuthor(p.author.role))
  const regularPosts = posts.filter(p => !isAdminAuthor(p.author.role))
  const sharedProps  = { onLike: handleLike, onDelete: handleDelete, currentUserId: user?.id as number ?? 0, reactions: postReactions, onShare: handleShare }

  const hasLinkedIn  = (collegeInfo?.linkedin_post_embeds?.length ?? 0) > 0 || !!collegeInfo?.linkedin_url
  const hasInstagram = !!collegeInfo?.instagram_url
  const hasSocials   = hasLinkedIn || hasInstagram
  const bothSocials  = hasLinkedIn && hasInstagram
  const igHeight     = bothSocials ? 420 : 600
  const linkedHeight = bothSocials ? 380 : 600

  return (
    <div className="w-full max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="flex items-center justify-between mb-5"
      >
        <div>
          <h1 className="text-2xl font-bold font-serif gradient-text">College Feed</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {collegeInfo?.name ?? "Your college"} — community &amp; updates
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center primary-glow-sm flex-shrink-0">
          <Newspaper className="h-5 w-5 text-white" />
        </div>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── LEFT: Feed ── */}
        <div className="flex-1 min-w-0 space-y-4 order-2 lg:order-1">

          {/* Trending topics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 24 }}
          >
            <TrendingTopics posts={posts} loading={loading} />
          </motion.div>

          {/* Composer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 24 }}
          >
            <CreatePostPanel user={user} onCreated={handleCreated} />
          </motion.div>

          {/* Filter tabs + page info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 24 }}
            className="flex items-center justify-between"
          >
            <AnimatedTabs value={filter} onChange={handleFilterChange} />
            {!loading && totalPages > 1 && (
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
            )}
          </motion.div>

          {/* Posts */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <GlassCard className="py-20 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold font-serif text-foreground mb-2">Nothing here yet</h3>
                <p className="text-sm text-muted-foreground">Be the first to post something!</p>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              variants={feedVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Featured admin announcements */}
              <AnimatePresence>
                {adminPosts.length > 0 && (
                  <motion.div key="announcements" className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-bold text-foreground">Announcements</span>
                      <div className="flex-1 h-px bg-border/50" />
                      <span className="text-xs text-muted-foreground">{adminPosts.length} pinned</span>
                    </div>
                    {adminPosts.map(post => (
                      <FeaturedAnnouncementCard
                        key={post.id}
                        post={post}
                        {...sharedProps}
                        collegeLogoUrl={collegeInfo?.logo_url}
                      />
                    ))}
                    {regularPosts.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <Newspaper className="h-4 w-4 text-primary/60 flex-shrink-0" />
                        <span className="text-sm font-bold text-foreground">Latest Posts</span>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Regular posts with stagger */}
              <AnimatePresence>
                {regularPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    {...sharedProps}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 pb-4 flex-wrap"
            >
              <Button variant="outline" size="sm" disabled={page === 1}
                onClick={() => setPage(p => p - 1)} className="rounded-xl border-border">
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPage(n)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-semibold transition-all",
                      n === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"
                    )}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
              <Button variant="outline" size="sm" disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)} className="rounded-xl border-border">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: Socials sidebar ── */}
        {hasSocials && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 24 }}
            className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start space-y-4"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-bold text-foreground">
                {collegeInfo?.name ?? "College"} Socials
              </span>
              <div className="flex-1 h-px bg-border/50" />
              <div className="flex items-center gap-1">
                {hasInstagram && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
                    style={{ color: "#E1306C", background: "rgba(225,48,108,0.08)", borderColor: "rgba(225,48,108,0.2)" }}>
                    ◉ IG
                  </span>
                )}
                {hasLinkedIn && (
                  <span className="text-[10px] font-bold text-[#0A66C2] bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-1.5 py-0.5 rounded-full">
                    in LI
                  </span>
                )}
              </div>
            </div>

            <div className={cn(
              "grid gap-4",
              bothSocials ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1" : "grid-cols-1"
            )}>
              {hasInstagram && (
                <InstagramPanel collegeInfo={collegeInfo!} igPosts={igPosts} loading={socialsLoading} height={igHeight} />
              )}
              {hasLinkedIn && (
                <LinkedInPanel collegeInfo={collegeInfo!} height={linkedHeight} />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
