"use client"

import { useState, useEffect, useRef, type MouseEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/user-avatar"
import {
  ArrowLeft, MessageCircle, Clock, BookOpen,
  PenLine, Send, Loader2, Trash2, Globe, Share2,
  ShieldCheck, Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Author { id: number; name: string; role: string; branch: string | null; avatar?: string | null; points?: number }
interface Comment {
  id: number; content: string; like_count: number; liked_by_me: boolean
  parent_id: number | null; replies: Comment[]; author: Author; created_at: string
}
interface Post {
  id: number; type: "post" | "blog"; title: string | null; content: string
  cover_image_url: string | null; reading_time: number; tags: string[]
  like_count: number; comment_count: number; liked_by_me: boolean
  author: Author; comments: Comment[]; created_at: string
}

// ── Reactions ─────────────────────────────────────────────────────────────────
const REACTIONS = [
  { id: "like",       emoji: "👍", label: "Like",       color: "#8B5CF6" },
  { id: "love",       emoji: "❤️", label: "Love",       color: "#EF4444" },
  { id: "celebrate",  emoji: "🎉", label: "Celebrate",  color: "#F59E0B" },
  { id: "insightful", emoji: "💡", label: "Insightful", color: "#06B6D4" },
  { id: "support",    emoji: "🤝", label: "Support",    color: "#10B981" },
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
function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Rich notification toast ───────────────────────────────────────────────────
function richToast(emoji: string, title: string, sub: string) {
  toast.custom(() => (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-popover shadow-2xl min-w-[290px] animate-slide-up-toast">
      <div className="text-2xl leading-none flex-shrink-0">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
        {sub && <p className="text-xs text-muted-foreground truncate mt-0.5">{sub}</p>}
      </div>
    </div>
  ), { duration: 3000 })
}

// ── Reaction Picker Button ────────────────────────────────────────────────────
function ReactionPickerButton({
  liked, likeCount, activeReaction, onReact, large = false,
}: {
  liked: boolean
  likeCount: number
  activeReaction: Reaction | null
  onReact: (rid: ReactionId) => void
  large?: boolean
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [ripple,     setRipple]     = useState(false)
  const openTimer  = useRef<ReturnType<typeof setTimeout>>()
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()

  const openPicker = () => {
    clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => setShowPicker(true), 450)
  }
  const closePicker = () => {
    clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => setShowPicker(false), 220)
  }

  const fireRipple = () => { setRipple(true); setTimeout(() => setRipple(false), 550) }

  const handleClick = () => {
    if (showPicker) return
    fireRipple()
    onReact(activeReaction?.id ?? "like")
  }

  const handlePickerSelect = (e: MouseEvent, rid: ReactionId) => {
    e.stopPropagation()
    setShowPicker(false)
    fireRipple()
    onReact(rid)
  }

  const display = activeReaction ?? REACTIONS[0]

  return (
    <div className="relative" onMouseEnter={openPicker} onMouseLeave={closePicker}>
      {/* Floating picker */}
      {showPicker && (
        <div
          className="absolute bottom-full left-0 mb-2 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl bg-popover border border-border shadow-2xl z-50 animate-reaction-pop"
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          onMouseLeave={closePicker}
        >
          {REACTIONS.map(r => (
            <button
              key={r.id}
              className="reaction-emoji relative p-1.5 text-xl rounded-xl hover:bg-secondary/60 group transition-transform"
              onClick={e => handlePickerSelect(e, r.id as ReactionId)}
            >
              {r.emoji}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-foreground text-background px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {r.label}
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleClick}
        className={cn(
          "relative flex items-center gap-2 font-semibold transition-all duration-200 rounded-xl select-none overflow-hidden",
          large ? "px-5 py-2.5 text-base" : "px-3 py-1.5 text-sm",
          liked ? "" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
        )}
        style={liked ? {
          color: activeReaction?.color ?? "var(--primary)",
          backgroundColor: `${activeReaction?.color ?? "var(--primary)"}18`,
        } : {}}
      >
        {ripple && (
          <span
            className="absolute inset-0 rounded-xl animate-ripple-out opacity-20"
            style={{ backgroundColor: activeReaction?.color ?? "var(--primary)" }}
          />
        )}
        <span className={cn("leading-none transition-transform duration-200", large ? "text-xl" : "text-base", ripple && "scale-125")}>
          {liked ? display.emoji : "👍"}
        </span>
        <span>{likeCount > 0 ? likeCount : "Like"}</span>
      </button>
    </div>
  )
}

// ── Comment Item (Instagram-style) ───────────────────────────────────────────
function CommentItem({ comment, currentUserId, depth = 0, onDelete, onLike, onReply }: {
  comment: Comment; currentUserId: number; depth?: number
  onDelete: (id: number) => void
  onLike:   (id: number) => void
  onReply:  (parentId: number, content: string) => Promise<void>
}) {
  const [showReply,  setShowReply]  = useState(false)
  const [replyText,  setReplyText]  = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submitReply = async () => {
    if (!replyText.trim()) return
    setSubmitting(true)
    await onReply(comment.id, replyText.trim())
    setReplyText("")
    setShowReply(false)
    setSubmitting(false)
  }

  return (
    <div className={cn(depth > 0 && "ml-11 border-l-2 border-border/30 pl-4")}>
      <div className="flex gap-3">
        <UserAvatar
          name={comment.author.name}
          photoUrl={comment.author.avatar}
          size="sm"
          points={comment.author.points}
        />

        <div className="flex-1 min-w-0">
          {/* Bubble */}
          <div className="bg-secondary/50 border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3 hover:border-border/70 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span className="text-sm font-bold text-foreground">{comment.author.name}</span>
                {comment.author.branch && (
                  <span className="text-xs text-muted-foreground ml-2">{comment.author.branch}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">{comment.content}</p>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-4 mt-1.5 ml-1">
            <button
              className={cn(
                "flex items-center gap-1 text-xs font-semibold transition-colors",
                comment.liked_by_me ? "text-danger" : "text-muted-foreground hover:text-danger"
              )}
              onClick={() => onLike(comment.id)}
            >
              <span className={cn("text-sm transition-transform duration-200", comment.liked_by_me && "scale-110")}>
                {comment.liked_by_me ? "❤️" : "🤍"}
              </span>
              {comment.like_count > 0
                ? <span>{comment.like_count}</span>
                : <span>Like</span>
              }
            </button>

            {depth === 0 && (
              <button
                className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowReply(!showReply)}
              >
                Reply
              </button>
            )}

            {comment.author.id === currentUserId && (
              <button
                className="text-xs text-muted-foreground hover:text-danger transition-colors ml-auto"
                onClick={() => onDelete(comment.id)}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Inline reply input */}
          {showReply && (
            <div className="flex items-center gap-2 mt-3">
              <UserAvatar name="Me" size="xs" />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Reply to ${comment.author.name}…`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply() }
                    if (e.key === "Escape") setShowReply(false)
                  }}
                  className="w-full px-4 py-2 pr-10 text-sm bg-secondary/50 border border-border rounded-full text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                  autoFocus
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary disabled:text-muted-foreground/40 transition-all hover:scale-110"
                  disabled={!replyText.trim() || submitting}
                  onClick={submitReply}
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const router     = useRouter()
  const { user }   = useAuthStore()
  const [post,          setPost]          = useState<Post | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [commentText,   setCommentText]   = useState("")
  const [submitting,    setSubmitting]    = useState(false)
  const [activeReaction, setActiveReaction] = useState<Reaction | null>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get(`/feed/posts/${postId}`)
      .then(res => {
        setPost(res.data)
        if (res.data.liked_by_me) setActiveReaction(REACTIONS[0])
      })
      .catch(() => toast.error("Post not found"))
      .finally(() => setLoading(false))
  }, [postId])

  const handleLikePost = async (reactionId: ReactionId) => {
    if (!post) return
    try {
      const res      = await api.post(`/feed/posts/${post.id}/like`)
      const liked    = res.data.liked as boolean
      const reaction = REACTIONS.find(r => r.id === reactionId)!
      setPost(p => p ? { ...p, liked_by_me: liked, like_count: res.data.like_count } : p)
      setActiveReaction(liked ? reaction : null)
      if (liked && post.author.id !== user?.id) {
        richToast(
          reaction.emoji,
          `You reacted ${reaction.label}`,
          `to "${post.title ?? post.content.slice(0, 40)}…"`
        )
      }
    } catch { toast.error("Failed to react") }
  }

  const handleLikeComment = async (commentId: number) => {
    try {
      const res    = await api.post(`/feed/comments/${commentId}/like`)
      const update = (list: Comment[]): Comment[] =>
        list.map(c => c.id === commentId
          ? { ...c, liked_by_me: res.data.liked, like_count: res.data.like_count }
          : { ...c, replies: update(c.replies) }
        )
      setPost(p => p ? { ...p, comments: update(p.comments) } : p)
    } catch { toast.error("Failed") }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/feed/comments/${commentId}`)
      const remove = (list: Comment[]): Comment[] =>
        list.filter(c => c.id !== commentId).map(c => ({ ...c, replies: remove(c.replies) }))
      setPost(p => p ? { ...p, comments: remove(p.comments), comment_count: p.comment_count - 1 } : p)
      richToast("🗑️", "Comment deleted", "")
    } catch { toast.error("Failed to delete") }
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || !post) return
    setSubmitting(true)
    try {
      const res = await api.post(`/feed/posts/${post.id}/comments`, { content: commentText.trim() })
      setPost(p => p ? { ...p, comments: [...p.comments, res.data], comment_count: p.comment_count + 1 } : p)
      setCommentText("")
      if (post.author.id !== user?.id) {
        richToast("💬", "Comment posted!", `on "${post.title ?? post.content.slice(0, 40)}…"`)
      }
    } catch { toast.error("Failed to comment") }
    finally { setSubmitting(false) }
  }

  const handleReply = async (parentId: number, content: string) => {
    try {
      const res      = await api.post(`/feed/comments/${parentId}/reply`, { content })
      const addReply = (list: Comment[]): Comment[] =>
        list.map(c => c.id === parentId
          ? { ...c, replies: [...c.replies, res.data] }
          : { ...c, replies: addReply(c.replies) }
        )
      setPost(p => p ? { ...p, comments: addReply(p.comments) } : p)
    } catch { toast.error("Failed to reply") }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      richToast("🔗", "Link copied!", "Share it with your friends")
    })
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-9 w-36 rounded-xl" />
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="flex gap-3 pt-4 border-t border-border/40">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl ml-auto" />
        </div>
      </GlassCard>
    </div>
  )

  if (!post) return (
    <div className="max-w-2xl mx-auto">
      <GlassCard className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-muted-foreground mb-4">Post not found</p>
        <Button onClick={() => router.back()} className="bg-primary hover:bg-primary/90 rounded-xl">Go Back</Button>
      </GlassCard>
    </div>
  )

  const isBlog = post.type === "blog"

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold -ml-1"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </button>

      {/* ── Post card ── */}
      {(() => {
        const isOfficial = post.author.role === "college_admin" || post.author.role === "branch_admin"
        const adminLabel = post.author.role === "branch_admin" ? "Branch Admin" : "College Admin"
        return (
      <GlassCard className={cn(
        "relative overflow-hidden",
        isOfficial
          ? "border-warning/40 shadow-[0_0_32px_rgba(245,158,11,0.09)]"
          : "border-border/60"
      )}>
        {/* Accent bar / announcement banner */}
        {isOfficial ? (
          <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-warning/20 via-warning/15 to-warning/20 border-b border-warning/25">
            <Megaphone className="h-3 w-3 text-warning flex-shrink-0" />
            <span className="text-[11px] font-semibold text-warning tracking-wide uppercase">Official Announcement</span>
          </div>
        ) : (
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1",
            isBlog
              ? "bg-gradient-to-r from-coding via-coral to-coding"
              : "bg-gradient-to-r from-primary via-accent to-primary"
          )} />
        )}

        <div className={cn(isOfficial && "mt-7")}>

        {/* Cover image */}
        {/* {isBlog && post.cover_image_url && (
          <div className="relative -mx-5 -mt-1 mb-5 h-56 overflow-hidden" style={{ width: "calc(100% + 2.5rem)", marginLeft: "-1.25rem" }}>
            <img src={post.cover_image_url} alt={post.title ?? ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        )} */}

        {/* Author row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <UserAvatar
                name={post.author.name}
                photoUrl={post.author.avatar}
                size="lg"
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
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-bold text-foreground">{post.author.name}</p>
                {isOfficial && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-warning/15 border border-warning/30 text-warning">
                    {adminLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {!isOfficial && <><span>{post.author.branch ?? "Student"}</span><span className="opacity-40">·</span></>}
                <span>{timeAgo(post.created_at)}</span>
                <span className="opacity-40">·</span>
                <Globe className="h-2.5 w-2.5 opacity-60" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isBlog && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {post.reading_time}m read
              </span>
            )}
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 rounded-full",
                isBlog
                  ? "bg-coding/10 border-coding/30 text-coding"
                  : "bg-primary/10 border-primary/30 text-primary"
              )}
            >
              {isBlog ? <BookOpen className="h-3 w-3" /> : <PenLine className="h-3 w-3" />}
              {isBlog ? "Blog" : "Post"}
            </Badge>
          </div>
        </div>

        {/* Title */}
        {post.title && (
          <h1 className="text-2xl font-bold font-serif text-foreground mb-4 leading-snug">
            {post.title}
          </h1>
        )}

        {/* Body */}
        <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap mb-5">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-primary/80 bg-primary/10 border border-primary/15 px-3 py-1 rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction/comment stats */}
        {(post.like_count > 0 || post.comment_count > 0) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-3 mb-3 border-b border-border/40">
            {post.like_count > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="flex -space-x-0.5">
                  {REACTIONS.slice(0, 3).map(r => (
                    <span key={r.id} className="text-sm leading-none">{r.emoji}</span>
                  ))}
                </span>
                <span>{post.like_count} reactions</span>
              </div>
            ) : <div />}
            {post.comment_count > 0 && (
              <button
                className="hover:text-primary transition-colors font-medium"
                onClick={() => commentInputRef.current?.focus()}
              >
                {post.comment_count} comment{post.comment_count !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1">
          <ReactionPickerButton
            liked={post.liked_by_me}
            likeCount={post.like_count}
            activeReaction={activeReaction}
            onReact={handleLikePost}
            large
          />

          <button
            onClick={() => commentInputRef.current?.focus()}
            className="flex items-center gap-2 text-base font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all px-5 py-2.5 rounded-xl"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-base font-semibold text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all px-5 py-2.5 rounded-xl ml-auto"
          >
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
        </div>{/* close isOfficial mt-wrapper */}
      </GlassCard>
        )
      })()}

      {/* ── Comments section ── */}
      {post.comments.length > 0 && (
        <GlassCard className="border-border/60">
          <div className="flex items-center gap-2 mb-5">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-foreground text-sm font-serif">
              Comments
              <span className="ml-2 font-normal text-muted-foreground">({post.comment_count})</span>
            </h3>
          </div>

          <div className="space-y-5">
            {post.comments
              .filter(c => c.parent_id === null)
              .map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  depth={0}
                  currentUserId={user?.id as number ?? 0}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                  onReply={handleReply}
                />
              ))}
          </div>
        </GlassCard>
      )}

      {/* ── Sticky comment input bar (Instagram-style) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <UserAvatar
            name={user?.name ?? "U"}
            photoUrl={user?.avatar}
            size="sm"
            points={user?.points}
          />

          <div className="flex-1 relative">
            <input
              ref={commentInputRef}
              type="text"
              placeholder="Write a comment…"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment() }
              }}
              className="w-full px-4 py-2.5 pr-12 text-sm bg-secondary/50 border border-border rounded-full text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-secondary/70 transition-all"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary disabled:text-muted-foreground/40 transition-all hover:scale-110 disabled:scale-100"
              disabled={!commentText.trim() || submitting}
              onClick={handleAddComment}
            >
              {submitting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
