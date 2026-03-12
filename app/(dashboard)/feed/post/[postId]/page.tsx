"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft, Heart, MessageCircle, Clock, BookOpen,
  PenLine, Send, Loader2, Trash2, CornerDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

interface Author { id: number; name: string; branch: string | null }

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

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Comment Item ─────────────────────────────────────────────────────────────
function CommentItem({ comment, currentUserId, depth = 0, onDelete, onLike, onReply }: {
  comment: Comment; currentUserId: number; depth?: number
  onDelete: (id: number) => void
  onLike: (id: number) => void
  onReply: (parentId: number, content: string) => Promise<void>
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState("")
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
    <div className={cn(depth > 0 && "ml-10 border-l border-border/40 pl-4")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 border border-border flex-shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
            {initials(comment.author.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Bubble */}
          <div className="bg-secondary/50 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{comment.author.name}</span>
                {comment.author.branch && (
                  <span className="text-xs text-muted-foreground">{comment.author.branch}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-4 mt-1.5 ml-1">
            <button
              className={cn(
                "flex items-center gap-1 text-xs font-medium transition-colors",
                comment.liked_by_me ? "text-red-400" : "text-muted-foreground hover:text-red-400"
              )}
              onClick={() => onLike(comment.id)}
            >
              <Heart className={cn("h-3.5 w-3.5", comment.liked_by_me && "fill-red-400")} />
              {comment.like_count > 0 && <span>{comment.like_count}</span>}
            </button>

            {depth === 0 && (
              <button
                className="text-xs text-muted-foreground hover:text-primary font-medium transition-colors"
                onClick={() => setShowReply(!showReply)}
              >
                Reply
              </button>
            )}

            {comment.author.id === currentUserId && (
              <button
                className="text-xs text-muted-foreground hover:text-red-400 transition-colors ml-auto"
                onClick={() => onDelete(comment.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReply && (
            <div className="flex gap-2 mt-3">
              <Textarea
                placeholder={`Reply to ${comment.author.name}...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={2}
                className="bg-secondary/50 border-border text-foreground resize-none text-sm"
                autoFocus
              />
              <div className="flex flex-col gap-1 self-end">
                <Button
                  size="sm"
                  disabled={submitting || !replyText.trim()}
                  onClick={submitReply}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReply(false)}
                  className="text-muted-foreground text-xs"
                >
                  Cancel
                </Button>
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

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    api.get(`/feed/posts/${postId}`)
      .then(res => setPost(res.data))
      .catch(() => toast.error("Post not found"))
      .finally(() => setLoading(false))
  }, [postId])

  const handleLikePost = async () => {
    if (!post) return
    try {
      const res = await api.post(`/feed/posts/${post.id}/like`)
      setPost(p => p ? { ...p, liked_by_me: res.data.liked, like_count: res.data.like_count } : p)
    } catch { toast.error("Failed to like") }
  }

  const handleLikeComment = async (commentId: number) => {
    try {
      const res = await api.post(`/feed/comments/${commentId}/like`)
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
      toast.success("Comment deleted")
    } catch { toast.error("Failed") }
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || !post) return
    setSubmitting(true)
    try {
      const res = await api.post(`/feed/posts/${post.id}/comments`, { content: commentText.trim() })
      setPost(p => p ? { ...p, comments: [...p.comments, res.data], comment_count: p.comment_count + 1 } : p)
      setCommentText("")
    } catch { toast.error("Failed to comment") }
    finally { setSubmitting(false) }
  }

  const handleReply = async (parentId: number, content: string) => {
    try {
      const res = await api.post(`/feed/comments/${parentId}/reply`, { content })
      const addReply = (list: Comment[]): Comment[] =>
        list.map(c => c.id === parentId
          ? { ...c, replies: [...c.replies, res.data] }
          : { ...c, replies: addReply(c.replies) }
        )
      setPost(p => p ? { ...p, comments: addReply(p.comments) } : p)
    } catch { toast.error("Failed to reply") }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-9 w-36" />
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </GlassCard>
    </div>
  )

  if (!post) return (
    <div className="max-w-2xl mx-auto">
      <GlassCard className="text-center py-16">
        <p className="text-muted-foreground mb-4">Post not found</p>
        <Button onClick={() => router.back()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Go Back
        </Button>
      </GlassCard>
    </div>
  )

  const isBlog = post.type === "blog"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feed
      </Button>

      {/* Post card */}
      <GlassCard className="relative overflow-hidden">
        {/* Top accent line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-0.5",
          isBlog ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-primary to-accent"
        )} />

        {/* Cover image */}
        {isBlog && post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title ?? ""}
            className="w-full h-56 object-cover rounded-xl mb-6 mt-2"
          />
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {initials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.author.branch ?? "Student"} · {timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isBlog && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {post.reading_time} min read
              </span>
            )}
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1",
                isBlog
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
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

        {/* Content */}
        <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap mb-5">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction bar */}
        <div className="flex items-center gap-6 pt-4 border-t border-border/60">
          <button
            onClick={handleLikePost}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg",
              post.liked_by_me
                ? "text-red-400 bg-red-400/10"
                : "text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
            )}
          >
            <Heart className={cn("h-4 w-4 transition-all", post.liked_by_me && "fill-red-400 scale-110")} />
            {post.like_count} {post.like_count === 1 ? "Like" : "Likes"}
          </button>

          <button
            onClick={() => commentInputRef.current?.focus()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comment_count} {post.comment_count === 1 ? "Comment" : "Comments"}
          </button>
        </div>
      </GlassCard>

      {/* Add comment */}
      <GlassCard>
        <h3 className="font-semibold font-serif text-foreground mb-4">
          Leave a comment
        </h3>
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 border border-border flex-shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {initials(user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              ref={commentInputRef}
              placeholder="Write a thoughtful comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
              onKeyDown={e => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAddComment()
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Ctrl+Enter to submit</p>
              <Button
                disabled={submitting || !commentText.trim()}
                onClick={handleAddComment}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Send className="h-4 w-4 mr-1.5" /> Comment</>
                }
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Comments section */}
      {post.comments.length > 0 && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">
              Comments
              <span className="ml-2 text-sm font-normal text-muted-foreground">({post.comment_count})</span>
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
    </div>
  )
}
